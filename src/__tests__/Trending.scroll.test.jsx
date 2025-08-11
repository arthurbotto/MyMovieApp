// src/__tests__/Trending.scroll.test.jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import App from '../App'

vi.mock('../appwrite.js', () => ({
  updateSearchCount: vi.fn(),
  getTrendingMovies: vi.fn().mockResolvedValue([
    { $id: 't1', movie_id: 1, poster_url: 'x' },
    { $id: 't2', movie_id: 2, poster_url: 'y' },
  ]),
}))

describe('Trending arrows', () => {
  let fetchMock
  beforeEach(() => {
    fetchMock = vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ results: [] }), { status: 200 })
    )
  })
  afterEach(() => fetchMock.mockRestore())

  it('left/right buttons call scrollBy', async () => {
    // stub scrollBy to detect calls
    Element.prototype.scrollBy = vi.fn()

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    // wait for trending to render
    expect(await screen.findByText(/what's trending/i)).toBeInTheDocument()

    await (await import('@testing-library/user-event')).default.click(
      screen.getByRole('button', { name: '◀' })
    )
    await (await import('@testing-library/user-event')).default.click(
      screen.getByRole('button', { name: '▶' })
    )

    expect(Element.prototype.scrollBy).toHaveBeenCalled()
  })
})
