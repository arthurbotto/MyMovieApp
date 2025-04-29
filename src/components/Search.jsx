import React from 'react'

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
        <div>
            <img src="./search.svg" alt="search" />

            <input
                type="text"
                placeholder="Search for movies, TV shows, and more..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        {/* <div className="text-white text-3xl">{searchTerm}</div> */}
        {/* this was just a test to see how react works */}
    </div>
  )
}

export default Search