import { render, screen, cleanup } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import { MemoryRouter } from 'react-router-dom'
import { vi, it, expect } from 'vitest'

vi.mock('../App', () => ({ default: () => <div>Home Page</div> }))
vi.mock('../components/MovieDetail', () => ({ default: () => <div>Detail Page</div> }))

import AppRoutes from '../AppRoutes'

it('routes / -> App and /movie/:id -> MovieDetail', () => {
  // render home
  const { container, unmount } = render(
    <MemoryRouter initialEntries={['/']}>
      <AppRoutes />
    </MemoryRouter>
  )

  // print the current DOM tree (uses process.stdout)
  process.stdout.write(prettyDOM(container) + '\n')

  expect(screen.getByText(/home page/i)).toBeInTheDocument()

  // fresh render for detail page
  unmount()
  const result = render(
    <MemoryRouter initialEntries={['/movie/123']}>
      <AppRoutes />
    </MemoryRouter>
  )

  // print again after routing
  process.stdout.write(prettyDOM(result.container) + '\n')

  expect(screen.getByText(/detail page/i)).toBeInTheDocument()
})
