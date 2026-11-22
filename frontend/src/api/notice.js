import client from './client'
export const explainNotice = payload => client.post('/notice/explain', payload)
