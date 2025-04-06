import React from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import {useDebounce} from 'react-use'
import { useState, useEffect, useRef } from 'react'
import {updateSearchCount, getTrendingMovies} from './appwrite.js'

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
    const [searchTerm, setSearchTerm] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [movieList, setMovieList] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([])
    const [loading, setLoading] = useState(false);
    const [debouncedSearchTerm, setdebouncedSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const trendingRef = useRef(null);

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
            const endpoint = query
            ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
            : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;
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
            <div className="pattern" />
        
            <div className="wrapper">
                <header>
                    <img src="./hero.png" alt="Hero Banner" />
                    <h1> Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>

                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    {/* <h1 className="text-white">{searchTerm}</h1> */}
                </header>

                {trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2 className="text-white mb-4">Trending Movies</h2>

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
                                    <img src={movie.poster_url} alt={movie.title} />
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
                    <h2> All Movies</h2>
        
                    {loading ? (
                        <Spinner />
                    ) : errorMessage ? ( 
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <>
                        <ul>
                            {movieList.map((movie, index) => (
                                <MovieCard key={`search-${movie.id}-${index}`} movie={movie} />
                            ))}
                        </ul>

                        {!loading && movieList.length > 0 && (
                                <div className="load-more-wrapper">
                                <button
                                    className="load-more"
                                    onClick={() => {
                                        const nextPage = page + 1;
                                        setPage(nextPage);
                                        fetchMovies(debouncedSearchTerm, nextPage);
                                    }}
                                >Load More
                                </button>
                                </div>
                        )}
                    </>
                    )}
                </section>
        

            </div>
        </main>
    )}

export default App