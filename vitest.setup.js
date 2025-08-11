import { expect, vi } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'
import 'whatwg-fetch'

expect.extend(matchers)

// (optional) silence logs
vi.spyOn(console, 'log').mockImplementation(() => {})
vi.spyOn(console, 'error').mockImplementation(() => {})

Element.prototype.scrollIntoView = vi.fn()
Element.prototype.scrollBy = vi.fn()

window.matchMedia = window.matchMedia || function () {
  return { matches: false, addListener: () => {}, removeListener: () => {} }
}