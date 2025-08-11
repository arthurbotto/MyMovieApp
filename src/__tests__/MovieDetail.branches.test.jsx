import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { vi, it, expect } from 'vitest'
import MovieDetail from '../components/MovieDetail'

const makeDetails = (overrides = {}) => ({
  id: 1, title: 'X', release_date: '2020-01-01',
  poster_path: null, overview: 'desc', original_language: 'en',
  runtime: 100, adult: false, genres: [{ id: 1, name: 'Drama' }],
  videos: { results: [] },
  credits: { crew: [{ credit_id: 'c1', name: 'A', job: 'Dir' }, { credit_id: 'c2', name: 'A', job: 'Writer' }] },
  ...overrides,
})
const credits = { id: 1, cast: [] }

it('shows PG vs 18+ and de-duplicates crew', async () => {
  const fetchMock = vi.spyOn(global, 'fetch')
    .mockResolvedValueOnce(new Response(JSON.stringify(makeDetails({ adult: true })), { status: 200 }))
    .mockResolvedValueOnce(new Response(JSON.stringify(credits), { status: 200 }))

  render(
    <MemoryRouter initialEntries={['/movie/1']}>
      <Routes><Route path="/movie/:id" element={<MovieDetail />} /></Routes>
    </MemoryRouter>
  )

  expect(await screen.findByText(/\(2020\)/)).toBeInTheDocument()
  expect(screen.getByText('18+')).toBeInTheDocument()     // adult true
  expect(screen.getAllByText(/^A$/)).toHaveLength(1)       // crew name once (deduped)

  fetchMock.mockRestore()
})