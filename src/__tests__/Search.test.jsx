import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Search from '../components/Search'

describe('Search', () => {
  it('calls setSearchTerm on change', async () => {
    const setSearchTerm = vi.fn()
    render(<Search searchTerm="" setSearchTerm={setSearchTerm} />)

    const input = screen.getByPlaceholderText(/search for movies/i)
    await userEvent.type(input, 'matrix')
    expect(setSearchTerm).toHaveBeenCalled()
  })
})