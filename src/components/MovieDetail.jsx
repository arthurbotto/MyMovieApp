import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CastCard from './CastCard';

const API_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    },
};

const MovieDetail = () => {
  const { id } = useParams(); //destructuring that returned object to extract just the id.
  //useParams is a hook that returns an object of key/value pairs of URL parameters.
  // in this case the route is path="/movie/:id" in AppRoutes.jsx
  // so the useParams() will return { id: "5001" } if the URL is /movie/5001
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const navigate = useNavigate(); //useNavigate is a hook that returns a function that lets you navigate to a different route.
  const trailer = movie?.videos?.results?.find((vid) => vid.type === 'Trailer' && vid.site === 'YouTube');
  
  const fetchDetails = async(id) => {
    try{
        const endpoint = `${API_URL}/movie/${id}?append_to_response=credits,videos`;
        const response = await fetch(endpoint, API_OPTIONS);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        if (data.Response === "False") {
            setMovie(null);
            return;
        }
        setMovie(data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  }

  const fetchCast = async(id) => {
    try{
        const endpoint = `${API_URL}/movie/${id}/credits`;
        const response = await fetch(endpoint, API_OPTIONS);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data_cast = await response.json();
        console.log(data_cast);
        if (!data_cast.cast || data_cast.cast.length === 0) {
            setCast([]);
            return;
        }
        setCast(data_cast.cast);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setCast([]);
    }
  }



  useEffect(() => {
    fetchDetails(id)}, [id]);
   //useEffect is a hook that runs a function when the component mounts or when the id changes.
   useEffect (() => {
    fetchCast(id)}, [id]);

  if (!movie) return <p className="text-white">Loading...</p>;
  //if movie is null, show loading message

  


  return (
    <div className="text-white p-5">
        <div className="mt-4">
            <button
                onClick={() => navigate('/')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >← Back to Home
            </button>
            {/* Movie info cointainer */}
            <div className="mt-8 flex flex-col lg:flex-row gap-8">
                <div className="flex-shrink-0 w-full lg:w-[300px]">
                    <img
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/no-movie.png'}
                        alt={movie.title}
                        className="mt-4 w-[300px] rounded"
                        />
                </div>

                {/* Movie details section */}
                <div className="flex flex-col space-y-4">
                    <h1 className="text-3xl font-bold">
                        {movie.title}
                        <span className="text-gray-400">
                            ({movie.release_date.split("-")[0]})
                        </span>
                    </h1>
                    <div className="text-sm text-gray-300">
                        <span>{movie.adult ? '18+' : 'PG'}</span>
                        <span> • </span>
                        <span>{movie.release_date}</span>
                        <span> • </span>
                        <span className="uppercase">{movie.original_language}</span>
                        <span> • </span>
                        <span>{movie.genres?.map(g => g.name).join(', ')}</span>
                        <span> • </span>
                        <span>{movie.runtime} min</span>
                    </div>

                    <div>
                        <h2 className="text-x1 font-semibold mb-1">Overview</h2>
                        <p className="text-gray-300">{movie.overview}</p>
                    </div>

                    {movie.credits?.crew && (
                        <div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                                {movie.credits.crew
                                    .filter((person, i, arr) => arr.findIndex(p => p.name === person.name) === i)
                                    .slice(0, 4)
                                    .map((person) => (
                                        <div key={person.credit_id}>
                                            <p className="font-bold">{person.name}</p>
                                            <p className="text-sm text-gray-400">{person.job}</p>
                                        </div>                                            
                                    ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-4 w-fit">
                        {trailer ? (
                            <a
                                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 text-sm"
                                >▶ Play Trailer                      
                            </a>
                        ) : (
                            <button
                                disabled
                                className="inline-flex item-center bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed opacity-70"
                                >🚫 No Trailer Available 
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {cast.length > 0 && (
            <div className="mt-6">
                <h2 className="text-2xl font-bold mb-2">Top Cast</h2>
                <div className="relative">
                    <div className="flex overflow-x-auto gap-4 pb-2 px-1 min-w-0 max-w-full"
                    style={{ maxHeight: '320px'}}
                    >
                    {cast.slice(0, 16).map((actor) => (
                        <div className="flex-shrink-0" key={actor.cast_id}>
                            <CastCard actor={actor} />
                        </div>
                        ))}
                    </div>
                </div>
            </div>
            )}  
        </div>
    </div>
    );
}       
                

      
    

 


export default MovieDetail;



// return (
//     <div className="text-white p-5">
//         <div className="mt-4">
//         <button
//             onClick={() => navigate('/')}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//             >← Back to Home
//         </button>
//         </div>
//       <h1 className="text-3xl font-bold">{movie.title}</h1>
//       <p className="mt-2">{movie.overview}</p>
//       <p>Release Date: {movie.release_date}</p>
//       <p>Runtime: {movie.runtime} minutes</p>
//       <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="mt-4 w-[300px] rounded" />
     
//       {cast.length > 0 && (
//         <div className="mt-6">
//             <h2 className="text-2xl font-bold mb-2">Top Cast</h2>
//             <div className="relative">
//                 <div className="flex overflow-x-auto gap-4 pb-2 px-1 min-w-0 max-w-full"
//                 style={{ maxHeight: '320px'}}
//                 >
//                     {cast.slice(0, 16).map((actor) => (
//                         <div className="flex-shrink-0" key={actor.cast_id}>
//                             <CastCard actor={actor} />
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//         )}
//     </div>
//     );
// }
