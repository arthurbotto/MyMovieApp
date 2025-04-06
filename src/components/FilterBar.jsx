import React, { useState } from 'react';

const years = Array.from({ length: 200 }, (_, i) => new Date().getFullYear() - i); // 2024, 2023...
const ratings = Array.from({ length: 11 }, (_, i) => i); // 0 to 10
const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
];
const genres = [
    { id: 28, name: "Action" },
    { id: 35, name: "Comedy" },
    { id: 18, name: "Drama" },
    { id: 27, name: "Horror" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" },
  ];

const FilterBar = ({ filters, setFilters, fetchMovies, debouncedSearchTerm }) => {

  const handleApplyFilters = () => {
    fetchMovies(debouncedSearchTerm, 1);
  };

  return (
    
        <div className="filter-popup">
          <select
            className="filter-select"
            value={filters.rating}
            onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
          >
            <option value="">Rating</option>
            {ratings.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.language}
            onChange={(e) => setFilters({ ...filters, language: e.target.value })}
          >
            <option value="">Language</option>
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          >
            <option value="">Year</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          
          <select
            className="filter-select"
            value={filters.genre}
            onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
        >
            <option value="">Genre</option>
            {genres.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

          <button
            className="apply-filters-btn"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </button>

          <button
            className="clear-filters-btn"
            onClick={() => {
            setFilters({ rating: "", language: "", year: "", genre: "" });
            fetchMovies("", 1); // refresh movies with no filters
            }}
        >
            Clear
          </button>
        </div>
    );
};

export default FilterBar;
