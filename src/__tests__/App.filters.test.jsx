// src/__tests__/App.filters.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi, it, expect } from 'vitest'
import App from '../App'

vi.mock('../appwrite.js', () => ({
  updateSearchCount: vi.fn(),
  getTrendingMovies: vi.fn().mockResolvedValue([]),
}))

it('applies filters and builds correct discover URL; clear resets', async () => {
  const fetchMock = vi.spyOn(global, 'fetch')
    // initial discover
    .mockResolvedValueOnce(new Response(JSON.stringify({ results: [] }), { status: 200 }))
    // after apply
    .mockResolvedValueOnce(new Response(JSON.stringify({ results: [] }), { status: 200 }))
    // after clear
    .mockResolvedValueOnce(new Response(JSON.stringify({ results: [] }), { status: 200 }))

  const user = userEvent.setup()
  render(<MemoryRouter><App /></MemoryRouter>)

  // wait for initial render (and initial fetch)
  await screen.findByRole('heading', { name: /all titles/i })
  expect(fetchMock).toHaveBeenCalledTimes(1)

  // open filters
  await user.click(screen.getByRole('button', { name: /filters/i }))

  // choose values
  const lastYear = String(new Date().getFullYear() - 1)
  const ratingSel = screen.getByLabelText(/rating/i)
  const langSel = screen.getByLabelText(/language/i)
  const yearSel = screen.getByLabelText(/year/i)
  const genreSel = screen.getByLabelText(/genre/i)

  await user.selectOptions(ratingSel, '8')
  await user.selectOptions(langSel, 'ja')
  await user.selectOptions(yearSel, lastYear)
  await user.selectOptions(genreSel, '28')

  // ensure UI now reflects chosen values (re-render happened)
  expect(ratingSel).toHaveValue('8')
  expect(langSel).toHaveValue('ja')
  expect(yearSel).toHaveValue(lastYear)
  expect(genreSel).toHaveValue('28')

  // apply filters -> should trigger a new fetch
  await user.click(screen.getByRole('button', { name: /apply filters/i }))
  expect(fetchMock).toHaveBeenCalledTimes(2)
  const filteredUrl = String(fetchMock.mock.calls[1][0])

  expect(filteredUrl).toContain('/discover/movie?')
  expect(filteredUrl).toContain('vote_average.gte=8')
  expect(filteredUrl).toContain('vote_average.lte=8.9')
  expect(filteredUrl).toContain('with_original_language=ja')
  expect(filteredUrl).toContain(`primary_release_year=${lastYear}`)
  expect(filteredUrl).toContain('with_genres=28')

  // clear -> back to base discover page=1
  await user.click(screen.getByRole('button', { name: /^clear$/i }))
  expect(fetchMock).toHaveBeenCalledTimes(3)
  const clearedUrl = String(fetchMock.mock.calls[2][0])
  expect(clearedUrl).toContain('/discover/movie?sort_by=popularity.desc&page=1')

  fetchMock.mockRestore()
})
