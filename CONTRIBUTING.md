# Contributing

Contributions are welcome! Here's how to get started.

## Development Setup

```bash
git clone https://github.com/justice8096/dyslexia-support-skill.git
cd dyslexia-support-skill
cd tooling
npm install
```

## Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-change`)
3. Make your changes in `source/` (the single source of truth)
4. Build all formats: `npm run build`
5. Run tests: `npm test`
6. Run type check: `npx tsc --noEmit`
7. Run security audit: `npm run audit`
8. Commit and push your branch
9. Open a Pull Request

## Source Structure

All content lives in `source/`. The build system (`tooling/build.ts`, run from the `tooling/` directory so the plugin root carries no package.json) generates 6 output formats from this single source. Never edit files in `dist/` directly — they are overwritten on every build.

- `source/manifest.json` — Central definition of skills and commands
- `source/skills/*.md` — Skill content (one file per skill)
- `source/commands/*.md` — Command content (one file per command)
- `source/templates/*.md` — Document templates

## Testing

The test suite (`tooling/test-build.ts`) runs 42 tests across 7 suites covering all build formats. Tests must pass before merging.

```bash
npm test              # Run all tests
npx tsx test-build.ts --verbose          # Verbose output
npx tsx test-build.ts --format openai    # Test a single format
```

## Areas Where Help Is Needed

- State-specific dyslexia mandate data
- Additional evidence-based program profiles
- Translations and multilingual support
- Validation studies for gap-analysis measures
- Integration examples with EdTech platforms

## Code of Conduct

Be respectful and constructive. This project serves educators and students with learning differences — keep that mission in mind.
