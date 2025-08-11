// src/__tests__/appwrite.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the Appwrite SDK BEFORE importing your helpers
vi.mock('appwrite', () => {
  // define spies first
  const listDocuments = vi.fn()
  const updateDocument = vi.fn()
  const createDocument = vi.fn()

  const Databases = vi.fn().mockImplementation(() => ({
    listDocuments,
    updateDocument,
    createDocument,
  }))

  const Client = vi.fn().mockImplementation(() => ({
    setEndpoint() { return this },
    setProject() { return this },
  }))

  const ID = { unique: vi.fn(() => 'new-id') }
  const Query = {
    equal: vi.fn(() => 'EQ'),
    limit: vi.fn(() => 'LIMIT'),
    orderDesc: vi.fn(() => 'ORDERDESC'),
  }

  return {
    Databases, Client, ID, Query,
    // expose spies so tests can assert on them
    __mocks: { listDocuments, updateDocument, createDocument },
  }
})

// now import the module under test
import { updateSearchCount, getTrendingMovies } from '../appwrite'
import { __mocks } from 'appwrite'

beforeEach(() => {
  __mocks.listDocuments.mockReset()
  __mocks.updateDocument.mockReset()
  __mocks.createDocument.mockReset()
})

describe('appwrite helpers', () => {
  it('updateSearchCount increments when term exists', async () => {
    __mocks.listDocuments.mockResolvedValueOnce({ documents: [{ $id: 'doc1', count: 2 }] })

    await updateSearchCount('matrix', { id: 10, poster_path: '/p.jpg' })

    const call = __mocks.updateDocument.mock.calls[0]
    expect(call[2]).toBe('doc1')                 // document id
    expect(call[3]).toEqual({ count: 3 })        // payload
    expect(__mocks.createDocument).not.toHaveBeenCalled()
  })

  it('updateSearchCount creates when term missing', async () => {
    __mocks.listDocuments.mockResolvedValueOnce({ documents: [] })

    await updateSearchCount('matrix', { id: 10, poster_path: '/p.jpg' })

    const call = __mocks.createDocument.mock.calls[0]
    expect(call[2]).toBe('new-id') // ID.unique()
    expect(call[3]).toEqual(
      expect.objectContaining({
        searchTerm: 'matrix',
        count: 1,
        movie_id: 10,
        poster_url: expect.stringContaining('/p.jpg'),
      })
    )
    expect(__mocks.updateDocument).not.toHaveBeenCalled()
  })

  it('getTrendingMovies returns ordered docs', async () => {
    __mocks.listDocuments.mockResolvedValueOnce({ documents: [{ $id: 'a' }] })
    const docs = await getTrendingMovies()
    expect(docs).toEqual([{ $id: 'a' }])
    expect(__mocks.listDocuments).toHaveBeenCalled()
  })
})
