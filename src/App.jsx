import React from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import FilterBar from './components/FilterBar'
import {useDebounce} from 'react-use'
import { useState, useEffect, useRef } from 'react'
import {updateSearchCount, getTrendingMovies} from './appwrite.js'
import { Link } from 'react-router-dom'

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    },
};

const App = () => {
    const [filters, setFilters] = useState({rating: "", language: "", year: "", genre: ""});
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [movieList, setMovieList] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([])
    const [loading, setLoading] = useState(false);
    const [debouncedSearchTerm, setdebouncedSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const trendingRef = useRef(null);
    const loadMoreRef = useRef(null);
    

    // useDebounce is a custom hook that delays the execution of a function until after a specified delay
    // Debounce the search term to avoid making too many API calls
    // by waiting for the user to stop typing for 500ms before updating the state
    // This is useful for improving performance and reducing the number of API calls made
    useDebounce(() =>
        setdebouncedSearchTerm(searchTerm), 500, [searchTerm])


    const fetchMovies = async (query = "", page = 1) => {
        setLoading(true);
        setErrorMessage("");
        try {
            let endpoint = query
            ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
            : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;
            
            
            if(!query) {
                if (filters.rating !== "") {
                    const rating = Number(filters.rating);
                    if (!isNaN(rating)) {
                        endpoint += `&vote_average.gte=${rating}&vote_average.lte=${rating + 0.9}`;
                    }
                }
                if (filters.language) endpoint += `&with_original_language=${filters.language}`;
                if (filters.year) endpoint += `&primary_release_year=${filters.year}`;
                if (filters.genre) endpoint += `&with_genres=${filters.genre}`;
            }
            console.log("Fetching from:", endpoint);

            const response = await fetch(endpoint, API_OPTIONS);
        

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            
            if (data.Response === "False") {
                setErrorMessage(data.Error || "An error occurred while fetching movies.");
                setMovieList([]);
                return;
            }
            setMovieList(prev =>
                page === 1 ? data.results : [...prev, ...data.results]
            );

            

            //console.log(data.results);

            if(query && data.results.length > 0 && page === 1) {
                await updateSearchCount(query, data.results[0]);
            }

            


        } catch (error) {
            console.error("Error fetching movies:", error);
            setErrorMessage("Failed to fetch movies. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const loadTrendingMovies = async () => {
        try {
            const movies = await getTrendingMovies();
            setTrendingMovies(movies);

        } catch (error) {
            console.error("Error fetching trending movies:", error);
        }
    }

    useEffect( () => {
        setPage(1);
        fetchMovies(debouncedSearchTerm, 1);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        loadTrendingMovies();
    }, []);
    
    return (
        <main>
            <div className="" />
        
            <div className="wrapper">
                <header>
                    <img src="./my-hero-bg.png" alt="Hero Banner" />
                    <h1> Discover <span className="text-gradient">Stories</span> Worth Your Popcorn 🍿</h1>

                    <div className="search-wrapper">
                        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                        <button
                          onClick={() => setShowFilters((prev) => !prev)}
                          className="toggle-filters-btn"
                        >
                          {showFilters ? "Hide" : "Filters"}
                        </button>
                    </div>

                    {showFilters && (
                      <FilterBar 
                        filters={filters}
                        setFilters={setFilters}
                        fetchMovies={fetchMovies}
                        debouncedSearchTerm={debouncedSearchTerm}
                      />
                    )}  
                </header>

                {trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2 className="text-white mb-4">What's Trending 👀</h2>

                        <div className="trending-scroll-wrapper">
                            <button
                                className="scroll-arrow left"
                                onClick={() => trendingRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                                >◀
                            </button>       
                        
                        
                        <ul ref={trendingRef}>
                            {trendingMovies.map((movie, index) => (
                                <li key={`trending-${movie.$id}`}>
                                    <p>{index + 1}</p>
                                    <Link to={`/movie/${movie.movie_id}`}>
                                    <img src={movie.poster_url} alt={movie.title} />
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <button
                            className="scroll-arrow right"
                            onClick={() => trendingRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                            >▶
                        </button>
                    </div>
                    </section>
                )}
        
                <section className="all-movies">
                    <h2> All Titles 🎥</h2>
        
                    {loading ? (
                        <Spinner />
                    ) : errorMessage ? ( 
                        <p className="text-red-500">{errorMessage}</p>
                    ) : ( movieList.length === 0 ? (
                        <p className="no-movies-message">No movies found. Please try a different search term.</p>
                    ) : (
                        <>
                        <ul>
                            {movieList.map((movie, index) => (
                                <MovieCard key={`search-${movie.id}-${index}`} movie={movie} />
                            ))}
                        </ul>

                        {!loading && movieList.length > 0 && (
                                <div className="load-more-wrapper" ref={loadMoreRef}>
                                    <button
                                        className="load-more"
                                        onClick={() => {
                                            const nextPage = page + 1;
                                            setPage(nextPage);
                                            fetchMovies(debouncedSearchTerm, nextPage).then(() => {
                                                loadMoreRef.current?.scrollIntoView({
                                                    behavior: 'smooth',
                                                    block: 'start',
                                                });
                                            }   
                                            );
                                        }}
                                    >Load More
                                    </button>
                                </div>
                        )}
                    </>
                    ))}
                </section>
        

            </div>
        </main>
    )}

export default App