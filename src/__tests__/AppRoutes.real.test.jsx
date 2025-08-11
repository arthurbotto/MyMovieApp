import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import AppRoutes from '../AppRoutes'

// mock external calls so the components don't hit real APIs
vi.mock('../appwrite.js', () => ({
  updateSearchCount: vi.fn().mockResolvedValue(undefined),
  getTrendingMovies: vi.fn().mockResolvedValue([]),
}))

describe('AppRoutes with real components', () => {
  it('renders Home (/) with All Titles heading', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ results: [] }), { status: 200 })
    )

    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    )

    // "All Titles 🎥" is from your real App.jsx
    expect(await screen.findByRole('heading', { name: /all titles/i })).toBeInTheDocument()
  })

  it('renders MovieDetail (/movie/:id) with Back button', async () => {
    const fetchMock = vi.spyOn(global, 'fetch')
    // details call
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          id: 123, title: 'Blade Runner', release_date: '1982-06-25',
          poster_path: null, overview: '', original_language: 'en',
          runtime: 117, adult: false, genres: [], videos: { results: [] }, credits: { crew: [] }
        }),
        { status: 200 }
      )
    )
    // credits call
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 123, cast: [] }), { status: 200 })
    )

    render(
      <MemoryRouter initialEntries={['/movie/123']}>
        <AppRoutes />
      </MemoryRouter>
    )

    // this button exists in your real MovieDetail.jsx
    expect(await screen.findByRole('button', { name: /back to home/i })).toBeInTheDocument()

    fetchMock.mockRestore()
  })
})