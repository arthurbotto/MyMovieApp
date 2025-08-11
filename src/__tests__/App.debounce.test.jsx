import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

// Quiet Appwrite: no trending; updateSearchCount resolves
vi.mock('../appwrite.js', () => ({
  updateSearchCount: vi.fn().mockResolvedValue(undefined),
  getTrendingMovies: vi.fn().mockResolvedValue([]),
}))

describe('App debounced search (behavior via fetch counts)', () => {
  let fetchMock

  beforeEach(() => {
    vi.useFakeTimers()
    fetchMock = vi.spyOn(global, 'fetch').mockImplementation((url) => {
      // Return empty for discover, 1 result for search
      const isSearch = String(url).includes('/search/movie')
      const body = isSearch
        ? { results: [{ id: 10, title: 'Matrix', vote_average: 8, poster_path: '/m.jpg', release_date: '1999-03-31', original_language: 'en' }] }
        : { results: [] }
      return Promise.resolve(
        new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } })
      )
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    fetchMock.mockRestore()
    vi.clearAllMocks()
  })

  it('does not fire search before 500ms, fires once after', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    // Initial discover happens on mount
    const initialCalls = fetchMock.mock.calls.length
    expect(initialCalls).toBe(1)

    // Type a query
    const input = screen.getByPlaceholderText(/search for movies/i)
    fireEvent.change(input, { target: { value: 'matrix' } })

    // Just before threshold => still only initial fetch
    act(() => { vi.advanceTimersByTime(499) })
    const callsBefore = fetchMock.mock.calls.filter(([u]) => String(u).includes('/search/movie')).length
    expect(callsBefore).toBe(0)

    // Cross threshold => exactly ONE search call
    act(() => { vi.advanceTimersByTime(1) })
    const callsAfter = fetchMock.mock.calls.filter(([u]) => String(u).includes('/search/movie')).length
    expect(callsAfter).toBe(1)
  })
})
