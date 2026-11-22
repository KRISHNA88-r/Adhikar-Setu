import client from './client'
export const askAssistant = (question, language) => client.post('/assistant/ask', { question, language })
