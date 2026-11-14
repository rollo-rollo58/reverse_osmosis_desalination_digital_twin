# AquaFlux | Reverse-Osmosis Desalination Digital Twin

Research workbench for multi-stage membrane desalination, pretreatment observation,
water quality, concentration polarization, fouling, and energy-recovery sensitivity.

## Architecture

- FastAPI + Pydantic v2 backend with a bounded, lock-protected observation journal.
- A domain-specific Next.js 15 App Router control room (React 19, TypeScript, Tailwind 3).
- Four PostgreSQL 16 migrations: plant assets, observations, audit, and analytics views.
- Three service integrations in Docker Compose: API, frontend, and database.
- Server-Sent Events report synthetic observations for visualization.
- A deterministic synthetic 4,800-case research catalogue stored as Python source.

## Physics and engineering assumptions

The simulator uses a simplified solution-diffusion membrane model. Osmotic pressure
is approximated for NaCl using van't Hoff's relation at dilute-solution conditions:
`pi_bar = 2 * salinity_g_l / 58.44 * 0.08314 * temperature_kelvin`.
Water flux (LMH) is `A * max(0, feed_bar - permeate_bar - delta_pi_bar)`.
Salt flux is approximated through an effective permeability `B`, with
`Cp = Cf * B / (Jw + B)` for a single equivalent element.

Permeate production in m³/h = `flux_lmh * membrane_area_m2 / 1000`.
Salt mass balance uses g/L and m³/h on both sides. Pressure energy is estimated
as `pressure_bar * feed_m3_h / (36 * pump_efficiency)` kW, with a separately
estimated energy-recovery credit on the concentrate stream. Specific energy
is net kWh/m³ of permeate. All units are explicit in API properties.

These formulas deliberately omit detailed boundary-layer polarization, hydraulic
profiles, scale equilibria, ion chemistry, biofouling kinetics, and pump curves.
All presets, observations, and generated scenarios are synthetic. This workbench
is NOT suitable for safety-critical plant control or regulatory certification.

## API

- `GET /healthz`: health and demonstration-mode details.
- `GET /api/v1/overview`: synthetic train snapshot and configured operating envelope.
- `GET /api/v1/scenarios`: bounded list of scenario references.
- `GET /api/v1/events`: recent read-only event journal.
- `GET /api/v1/stream`: real-time, explicitly simulated sensor stream (SSE).
- `POST /api/v1/simulate`: validate a run and calculate all stage balances.
- `POST /api/v1/optimize`: constrained pressure evaluation, best feasible proposal.
- `POST /api/v1/observations`: optional authenticated write to in-memory journal.
- `GET /api/v1/catalogue/{case_id}`: inspect an executable synthetic case.

Error responses are JSON. CORS is restricted to configured frontend origins.
The in-memory journal does not persist to PostgreSQL; SQL migrations are complete
reference DDL for a later persistence integration.

## Run locally

```sh
cd backend
python -m pip install -e '.[dev]'
pytest -q
uvicorn app.main:app --reload --port 8000
```

In a second shell:

```sh
cd frontend
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000` in your local environment.
Never commit `.env`, API tokens, or a configured `OPERATOR_API_KEY`.
Observation writes are disabled unless a private operator key is configured.

## Verify build

Run the external `generate_desalination_repo.py` to regenerate the archive and
validation report. Archive format and Python parsing are checked mechanically.
Dependency installation and live PostgreSQL integration require further testing.
The >100,000-line figure mainly reflects a mechanically produced, executable
**synthetic scenario catalogue** rather than 100,000 lines of manually designed
enterprise application logic. Catalogue fixtures are not production operating rules.
