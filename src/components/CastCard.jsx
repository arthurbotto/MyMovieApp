
import React from 'react';

const CastCard = ({ actor:
    { name, character, profile_path }
}) => {
   return (
    <div className="cast-card">
      <img
        src={profile_path ? `https://image.tmdb.org/t/p/w185${profile_path}` : '/no-pic.png'}
        alt={name}
        className="w-[100px] h-[150px] sm:w-[130px] sm:h-[195px] md:w-[150px] md:h-[225px] rounded object-cover"
      />
      <div className="mt-2 text-sm text-center w-[100px] sm:w-[130px] md:w-[150px]">
        <p className="font-semibold truncate">{name}</p>
        <p className="text-xs text-gray-400 truncate">as {character}</p>
      </div>
    </div>
  );
};

export default CastCard;