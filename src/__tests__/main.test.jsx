import { describe, it, expect, vi } from 'vitest'

// Mock react-dom/client BEFORE importing main.jsx
vi.mock('react-dom/client', async () => {
  const mod = await vi.importActual('react-dom/client') // <-- no <any>
  return {
    ...mod,
    createRoot: vi.fn(() => ({ render: vi.fn() })),
  }
})

describe('main.jsx boot', () => {
  it('boots the app without crashing', async () => {
    // fresh module graph so main.jsx runs when we import it
    vi.resetModules()

    // provide root element
    document.body.innerHTML = '<div id="root"></div>'

    // get the mocked createRoot
    const { createRoot } = await import('react-dom/client')

    // importing main should call createRoot(...).render(...)
    await import('../main')

    expect(createRoot).toHaveBeenCalledTimes(1)

    // read the return value of the first call to createRoot
    const instance = createRoot.mock.results[0].value
    expect(instance.render).toHaveBeenCalledTimes(1)
  })
})