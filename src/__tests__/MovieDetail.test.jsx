// src/__tests__/MovieDetail.test.jsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import MovieDetail from '../components/MovieDetail'

let fetchMock

const details = {
  id: 123,
  title: 'Blade Runner',
  release_date: '1982-06-25',
  poster_path: '/br.jpg',
  overview: 'Replicants!',
  original_language: 'en',
  runtime: 117,
  adult: false,
  genres: [{ id: 1, name: 'Sci-Fi' }],
  videos: { results: [{ type: 'Trailer', site: 'YouTube', key: 'abcd1234' }] },
  credits: { crew: [{ credit_id: 'c1', name: 'Ridley Scott', job: 'Director' }] },
}
const credits = { id: 123, cast: [{ cast_id: 10, name: 'Harrison Ford', character: 'Deckard', profile_path: null }] }

beforeEach(() => {
  fetchMock = vi.spyOn(global, 'fetch')
})
afterEach(() => fetchMock.mockRestore())

it('renders details with trailer and cast', async () => {
  fetchMock
    .mockResolvedValueOnce(new Response(JSON.stringify(details), { status: 200 }))
    .mockResolvedValueOnce(new Response(JSON.stringify(credits), { status: 200 }))

  render(
    <MemoryRouter initialEntries={['/movie/123']}>
      <Routes>
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </MemoryRouter>
  )

  expect(await screen.findByRole('heading', { name: /blade runner/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /play trailer/i })).toHaveAttribute(
    'href',
    expect.stringContaining('youtube.com/watch')
  )
  expect(screen.getByText(/top cast/i)).toBeInTheDocument()
})

it('shows disabled trailer button when no trailer', async () => {
  const noTrailer = { ...details, videos: { results: [] } }
  fetchMock
    .mockResolvedValueOnce(new Response(JSON.stringify(noTrailer), { status: 200 }))
    .mockResolvedValueOnce(new Response(JSON.stringify(credits), { status: 200 }))

  render(
    <MemoryRouter initialEntries={['/movie/123']}>
      <Routes>
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </MemoryRouter>
  )

  expect(await screen.findByRole('button', { name: /no trailer available/i })).toBeDisabled()
})
it('handles missing poster image', async () => {
  const noPoster = { ...details, poster_path: null }
  fetchMock
    .mockResolvedValueOnce(new Response(JSON.stringify(noPoster), { status: 200 }))
    .mockResolvedValueOnce(new Response(JSON.stringify(credits), { status: 200 }))

  render(
    <MemoryRouter initialEntries={['/movie/123']}>
      <Routes>
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </MemoryRouter>
  )

  expect(await screen.findByAltText(/blade runner/i)).toHaveAttribute('src', '/no-movie.png')
})

