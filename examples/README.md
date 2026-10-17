# Runtime samples

The project rule is that every skill ships samples for four runtimes.

| Runtime | File | What it shows |
|---|---|---|
| Python | `python/rewrite_directions.py` | Standard-library port of the lexicon, rewriter, and Overpass query builder with the same guards as `lib/` |
| n8n | `n8n/landmark-lookup-workflow.json` | Webhook, validated Overpass query, allowlisted HTTP node, Code node for sanitising and scoring, JSON response with a one-step card |
| Codex / OpenAI | `codex/rewrite-directions.md` | Function calling with `dist/openai/functions.json`, deterministic subprocess for the transformation |
| Ollama | `ollama/rewrite-directions-prompt.md` | Local-model prose pass over a deterministic card, checked afterwards with the CLI |

Every sample treats pasted directions as data. None of them lets the model introduce a direction word unchecked.
