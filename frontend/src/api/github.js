import client from './client'

// type: 'all' | 'users' | 'repositories'
export const searchGithub = (query, type = 'all', page = 1, perPage = 12) =>
  client
    .get('/github/search', { params: { q: query, type, page, perPage } })
    .then((r) => r.data)

export const getGithubUser = (username) =>
  client.get(`/github/users/${username}`).then((r) => r.data)

export const getGithubRepo = (owner, repo) =>
  client.get(`/github/repos/${owner}/${repo}`).then((r) => r.data)
