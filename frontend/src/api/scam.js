import client from './client'
export const checkScam = text => client.post('/scam/check', { text })
