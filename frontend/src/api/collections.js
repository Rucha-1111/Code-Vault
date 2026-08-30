import client from './client'

export const fetchCollections = () => client.get('/collections').then((r) => r.data)

export const createCollection = (name, icon) =>
  client.post('/collections', { name, icon }).then((r) => r.data)

export const renameCollection = (id, name, icon) =>
  client.put(`/collections/${id}`, { name, icon }).then((r) => r.data)

export const deleteCollection = (id) => client.delete(`/collections/${id}`)

export const fetchCollectionItems = (id) =>
  client.get(`/collections/${id}/items`).then((r) => r.data)

export const addItemToCollection = (collectionId, item) =>
  client.post(`/collections/${collectionId}/items`, item).then((r) => r.data)

export const removeItemFromCollection = (collectionId, itemId) =>
  client.delete(`/collections/${collectionId}/items/${itemId}`)

export const fetchRecentlySaved = () => client.get('/collections/recent').then((r) => r.data)
