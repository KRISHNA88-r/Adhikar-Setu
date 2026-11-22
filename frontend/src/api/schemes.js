import client from './client'
export const getSchemes = () => client.get('/schemes')
export const getScheme = slug => client.get(`/schemes/${encodeURIComponent(slug)}`)
export const checkEligibility = profile => client.post('/eligibility/check', profile)
