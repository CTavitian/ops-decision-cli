# ops-decision-cli

Score candidate automation jobs for regulated field-service work. Pure TypeScript. No model calls.

## What it scores

Each job gets an `automation_fit` number and a band:

- **pilot** — worth a careful trial
- **defer** — draft-only until data or process improves
- **reject** — keep humans on the critical path

Axes: compliance risk, data quality, human-in-the-loop need, irreversibility, and a statutory flag.

## Use it as a lead

1. List the ideas your team wants to automate in YAML
2. Run the scorer
3. Start with `pilot` rows that have clear oversight notes
4. Treat `reject` as a hard stop, not a debate starter

```bash
npm install
npm test
npm run score -- --fixtures fixtures/candidates.yaml
```

## Licence

MIT
