import React, { useState } from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useDebounce } from 'react-use'

function DebounceHarness() {
  const [raw, setRaw] = useState('')
  const [debounced, setDebounced] = useState('')
  useDebounce(() => setDebounced(raw), 500, [raw])

  return (
    <div>
      <input
        aria-label="search"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
      />
      <div aria-label="debounced">{debounced}</div>
    </div>
  )
}

describe('useDebounce timing', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('updates only after 500ms', () => {
    render(<DebounceHarness />)
    const input = screen.getByLabelText('search')
    const out = screen.getByLabelText('debounced')

    fireEvent.change(input, { target: { value: 'matrix' } })
    expect(out).toHaveTextContent('') // not yet

    act(() => {
      vi.advanceTimersByTime(499)
    })
    expect(out).toHaveTextContent('') // still not yet

    act(() => {
      vi.advanceTimersByTime(1) // finish debounce delay
    })
    expect(out).toHaveTextContent('matrix') // now updated
  })
})
