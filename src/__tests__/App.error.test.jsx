// src/__tests__/App.error.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

vi.mock('../appwrite.js', () => ({
  updateSearchCount: vi.fn().mockResolvedValue(undefined),
  getTrendingMovies: vi.fn().mockResolvedValue([]),
}))

describe('App error handling', () => {
  let fetchMock
  beforeEach(() => {
    fetchMock = vi.spyOn(global, 'fetch')
    // first call rejects
    fetchMock.mockRejectedValueOnce(new Error('network down'))
  })
  afterEach(() => fetchMock.mockRestore())

  it('shows user-friendly error when fetch fails', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    expect(await screen.findByText(/failed to fetch movies/i)).toBeInTheDocument()
  })
})
