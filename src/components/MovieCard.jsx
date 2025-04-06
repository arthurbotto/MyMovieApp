import React from 'react'
import { Link } from 'react-router-dom'; //Link is like a special version of <a href="..."> but made for React apps.
// It prevents the page from reloading when you click on a link, which is important for single-page applications (SPAs) like the one we're building.
// It also helps with navigation and allows us to use the browser's back and forward buttons without losing the app's state.
// It doesn't reload the page, just changes the route and re-renders the component.

const MovieCard = ({movie:
     { id, title, vote_average, poster_path, release_date, original_language} 
}) => {
  return (
    <Link to={`/movie/${id}`} className="movie-card-link">

        <div className="movie-card">
            <img src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : '/no-movie.png'}
            alt={title} />
    
            <div className="mt-4">
                <h3>{title}</h3>
    
                <div className="content">
                    <div className="rating">
                        <img src="star.svg" alt="Star Icon" />
                        <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                    </div>
    
                    <span>•</span>
                    <p className="lang">{original_language}</p>
                    <span>•</span>
                    <p className="year">
                        {release_date ? release_date.split("-")[0] : "N/A"}
                    </p>
    
                </div>
            </div>
        </div>
    </Link>
  )
}

export default MovieCard