# Adhikar Setu Frontend

React 18 + Vite. UI text lives in `src/i18n/en.json`, `hi.json`, `te.json` (same keys in all three). To add a language: copy `en.json`, translate, register it in `src/context/LanguageContext.jsx` and add its speech code in `src/hooks/useSpeech.js`.

```
npm install
cp .env.example .env   # VITE_API_BASE_URL=http://localhost:8080/api
npm run dev
```
