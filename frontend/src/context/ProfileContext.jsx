import { createContext, useContext, useMemo, useState } from 'react'
const Ctx = createContext(null)
const KEY = 'adhikar_session'

/** Answers and results live in sessionStorage only (this tab, this browser). Nothing is sent to be stored. */
export function ProfileProvider({ children }) {
  const [state, setState] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(KEY)) || { profile: null, results: null, answers: null } } catch { return { profile: null, results: null, answers: null } }
  })
  const save = next => { sessionStorage.setItem(KEY, JSON.stringify(next)); setState(next) }
  const value = useMemo(() => ({
    ...state,
    saveSession: (profile, answers, results) => save({ profile, answers, results }),
    clearSession: () => { sessionStorage.removeItem(KEY); setState({ profile: null, results: null, answers: null }) }
  }), [state])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export const useProfile = () => useContext(Ctx)
