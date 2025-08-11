// src/__tests__/MovieCard.test.jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MovieCard from '../components/MovieCard'

it('renders title, year, language, rating and link', () => {
  const movie = {
    id: 5,
    title: 'The Dark Knight',
    vote_average: 9.0,
    poster_path: '/dk.jpg',
    release_date: '2008-07-18',
    original_language: 'en',
  }
  render(
    <MemoryRouter>
      <MovieCard movie={movie} />
    </MemoryRouter>
  )
  expect(screen.getByRole('heading', { name: /the dark knight/i })).toBeInTheDocument()
  expect(screen.getByText('2008')).toBeInTheDocument()
  expect(screen.getByText('en')).toBeInTheDocument()
  expect(screen.getByText('9.0')).toBeInTheDocument()
  expect(screen.getByRole('link')).toHaveAttribute('href', '/movie/5')
})
