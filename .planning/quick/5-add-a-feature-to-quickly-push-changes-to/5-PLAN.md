---
phase: quick-5
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
autonomous: true
requirements: [QUICK-5]
must_haves:
  truths:
    - "Running `npm run deploy` triggers a Vercel preview deployment from the working directory"
    - "Running `npm run deploy:prod` triggers a Vercel production deployment from the working directory"
    - "Both commands build locally via Vite then deploy the output — no git push required"
  artifacts:
    - path: "package.json"
      provides: "deploy and deploy:prod npm scripts"
      contains: "deploy"
  key_links:
    - from: "package.json deploy script"
      to: "Vercel CLI"
      via: "vercel --yes / vercel --prod --yes"
      pattern: "vercel"
---

<objective>
Add npm scripts for quick Vercel deployments directly from the dev environment using the Vercel CLI.

Purpose: Eliminate the multi-step manual process of deploying — a single `npm run deploy` or `npm run deploy:prod` command handles everything.
Output: Updated package.json with two new scripts.
</objective>

<execution_context>
@C:/Users/Jack/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/Jack/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@package.json
@.vercel/project.json
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add Vercel deploy scripts to package.json</name>
  <files>package.json</files>
  <action>
Add two new scripts to the `scripts` section of package.json:

1. `"deploy": "vercel --yes"` — Deploys a preview build. The `--yes` flag skips the confirmation prompt, accepting defaults from the existing `.vercel/project.json` link (project: jack-engineering-portfolio). Vercel CLI handles the build internally using the project's configured build settings.

2. `"deploy:prod": "vercel --prod --yes"` — Deploys to production. Same as above but targets the production domain.

Place these after the existing `preview` script for logical grouping. The final scripts section should be:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "deploy": "vercel --yes",
  "deploy:prod": "vercel --prod --yes"
}
```

No new dependencies needed — Vercel CLI is already installed globally.
  </action>
  <verify>
    <automated>cd "C:/Claude code projects/GSD Projects/Jack_Engineering_Portfolio" && node -e "const p = require('./package.json'); if (!p.scripts.deploy || !p.scripts['deploy:prod']) { process.exit(1); } console.log('deploy:', p.scripts.deploy); console.log('deploy:prod:', p.scripts['deploy:prod']);"</automated>
  </verify>
  <done>package.json contains `deploy` and `deploy:prod` scripts that invoke the Vercel CLI with correct flags. Running `npm run deploy` outputs the Vercel CLI help/deploy flow, and `npm run deploy:prod` targets production.</done>
</task>

</tasks>

<verification>
- `npm run deploy --help` does not error (script exists)
- `npm run deploy:prod --help` does not error (script exists)
- package.json parses as valid JSON
</verification>

<success_criteria>
- package.json has `deploy` script set to `vercel --yes`
- package.json has `deploy:prod` script set to `vercel --prod --yes`
- No other scripts were removed or modified
- JSON is valid and well-formatted
</success_criteria>

<output>
After completion, create `.planning/quick/5-add-a-feature-to-quickly-push-changes-to/5-SUMMARY.md`
</output>
