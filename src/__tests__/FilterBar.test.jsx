// src/__tests__/FilterBar.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import FilterBar from '../components/FilterBar'

describe('FilterBar', () => {
  it('applies and clears filters', async () => {
    const user = userEvent.setup()
    const setFilters = vi.fn()
    const fetchMovies = vi.fn()
    const filters = { rating: '', language: '', year: '', genre: '' }

    render(
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        fetchMovies={fetchMovies}
        debouncedSearchTerm="batman"
      />
    )

    // pick a rating
    const ratingSelect = screen.getByLabelText(/rating/i)   // ← use label instead of role+name
    await user.selectOptions(ratingSelect, '8')
    expect(setFilters).toHaveBeenCalledWith({ rating: '8', language: '', year: '', genre: '' })

    // apply => fetchMovies('batman', 1)
    await user.click(screen.getByRole('button', { name: /apply filters/i }))
    expect(fetchMovies).toHaveBeenCalledWith('batman', 1)

    // clear => reset + fetchMovies('', 1)
    await user.click(screen.getByRole('button', { name: /clear/i }))
    expect(setFilters).toHaveBeenCalledWith({ rating: '', language: '', year: '', genre: '' })
    expect(fetchMovies).toHaveBeenCalledWith('', 1)
  })
})
