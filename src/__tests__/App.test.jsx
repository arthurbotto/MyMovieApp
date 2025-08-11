// src/__tests__/App.test.jsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

// mock Appwrite helpers used by App.jsx
vi.mock('../appwrite.js', () => {
  return {
    updateSearchCount: vi.fn().mockResolvedValue(undefined),
    getTrendingMovies: vi.fn().mockResolvedValue([
      { $id: 't1', movie_id: 101, poster_url: 'https://img/t1.jpg' },
      { $id: 't2', movie_id: 102, poster_url: 'https://img/t2.jpg' },
    ]),
  }
})

const page1 = {
  results: [
    {
      id: 1,
      title: 'Inception',
      vote_average: 8.7,
      poster_path: '/poster1.jpg',
      release_date: '2010-07-16',
      original_language: 'en',
    },
  ],
}
const page2 = {
  results: [
    {
      id: 2,
      title: 'Interstellar',
      vote_average: 8.5,
      poster_path: '/poster2.jpg',
      release_date: '2014-11-07',
      original_language: 'en',
    },
  ],
}

let fetchMock

beforeEach(() => {
  fetchMock = vi.spyOn(global, 'fetch')
  // First call: initial discover/search page1
  fetchMock.mockResolvedValueOnce(
    new Response(JSON.stringify(page1), { status: 200, headers: { 'Content-Type': 'application/json' } })
  )
})

afterEach(() => {
  fetchMock.mockRestore()
  vi.clearAllMocks()
})

describe('App', () => {
  it('renders list, trending, and loads more', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    // initial spinner while first fetch in progress (your Spinner uses role="status")
    expect(screen.getByRole('status')).toBeInTheDocument()

    // after fetch resolves, first movie appears
    expect(await screen.findByRole('heading', { name: /inception/i })).toBeInTheDocument()

    // trending area appears (from mocked Appwrite)
    expect(screen.getByText(/what's trending/i)).toBeInTheDocument()
    const trendingHeading = screen.getByRole('heading', { name: /what's trending/i })
    const trendingSection = trendingHeading.closest('section')
    const images = within(trendingSection).getAllByRole('img')
    expect(images.length).toBeGreaterThanOrEqual(2)

    // queue second page for "Load More"
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(page2), { status: 200, headers: { 'Content-Type': 'application/json' } })
    )

    await userEvent.click(screen.getByRole('button', { name: /load more/i }))

    // both movies should be present now
    expect(await screen.findByRole('heading', { name: /interstellar/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /inception/i })).toBeInTheDocument()
  })

  it('shows empty state when no results', async () => {
    fetchMock.mockReset()
    fetchMock.mockResolvedValueOnce(
    new Response(JSON.stringify({ results: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  )

  const { getTrendingMovies } = await import('../appwrite.js')
  getTrendingMovies.mockResolvedValueOnce([])

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    expect(await screen.findByText(/no movies found/i, {}, { timeout: 1500 }))
    .toBeInTheDocument()
  })
})
