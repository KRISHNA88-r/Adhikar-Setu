# Adhikar Setu Backend

## Requirements
- Java 17
- Maven 3.9+
- PostgreSQL 14+

## Local setup
1. Create a PostgreSQL database named `adhikar_setu` using pgAdmin 4 or psql.
2. Copy `.env.example` values into your IDE run configuration or shell environment. Do not commit secrets.
3. Set `APP_JWT_SECRET` to a random string of at least 32 bytes.
4. Run `mvn spring-boot:run`.
5. API base URL: `http://localhost:8080/api`.

On Windows PowerShell, set environment values for the current terminal with `$env:NAME="value"` before starting Maven.

## Render
Deploy this backend folder/repository using the included Dockerfile. Add the Render PostgreSQL connection values as environment variables. Render's internal database URL may use `postgres://`; convert it to JDBC form `jdbc:postgresql://host:port/database` for `DATABASE_URL`, and set the database username/password separately. Use the internal database host for a Render-hosted backend.

Set `CORS_ALLOWED_ORIGINS` to the exact Vercel frontend origin, e.g. `https://your-project.vercel.app`.

## Scheme data
`src/main/resources/data/schemes.json` is the source of truth and is loaded into PostgreSQL on every start (matched by `slug`). See `../docs/VERIFY_CHECKLIST.md`.

## Rules engine
`rules/RuleEngine.java` and `rules/ScamShield.java` are plain Java with no Spring dependency, covered by unit tests.
