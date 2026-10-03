# SaharaTyre Agent Configuration

## Overview

This project uses specialized agent skills located in `agents/skills/`. Each skill is a focused expert for specific domains. Any AI assistant working on this project should load the relevant skill when the task matches its domain.

## Available Skills

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| `performance-engineer.md` | System-wide performance analysis and optimization | "Why is this slow" questions, load testing, capacity planning |
| `seo-engineer.md` | Technical SEO, structured data, AEO/GEO optimization | SEO audits, schema markup, sitemap configuration, AI answer engine optimization |
| `seo-keyword-research-implementation.skill.md` | On-page keyword research, intent mapping & content optimization | Keyword targeting, topic clustering, title/meta/heading optimization |
| `ui-ux-engineer.md` | Visual and interaction design direction | "How should this look/flow" questions, design system decisions |
| `frontend-engineer.md` | Client-side HTML/CSS/JS implementation & DOM performance | UI building, component structure, responsive layout, font loading |

## Mandatory Pre-Change Protocol: Use ALL Skills

> **CRITICAL DIRECTIVE:** Before proposing or executing **ANY** code, content, layout, styling, SEO, or configuration changes in this repository, the AI assistant **MUST ALWAYS read and evaluate against ALL 5 specialized skills**.

### Required Skill Pre-Flight Checklist
Before modifying any file, consult and verify against each domain:
1. `Read agents/skills/performance-engineer.md` — Verify no performance regressions, bundle bloat, or blocking assets.
2. `Read agents/skills/seo-engineer.md` — Protect structured data (JSON-LD), crawlability, Core Web Vitals, and meta tags.
3. `Read agents/skills/Seo-keyword-research-implementation.skill.md` — Maintain search intent, keyword mapping, NAP consistency, and avoid cannibalization.
4. `Read agents/skills/ui-ux-engineer.md` — Ensure visual hierarchy, mobile-first design, trust signals, and clear CTA flows.
5. `Read agents/skills/frontend-engineer.md` — Ensure semantic HTML5, zero CLS, responsive styling, and accessibility (WCAG AA).

```
Read agents/skills/performance-engineer.md
Read agents/skills/seo-engineer.md
Read agents/skills/Seo-keyword-research-implementation.skill.md
Read agents/skills/ui-ux-engineer.md
Read agents/skills/frontend-engineer.md
```

## Skill Activation Rules

**performance-engineer** activates for:
- Cross-component performance diagnosis
- Load testing and capacity planning
- Performance target-setting
- Bottleneck identification across multiple layers

**seo-engineer** activates for:
- Technical SEO audits
- Structured data/schema markup implementation
- Sitemap/robots.txt configuration
- Core Web Vitals ranking factor optimization
- AEO/GEO content structure optimization

**seo-keyword-research-implementation** activates for:
- Keyword research and search intent mapping
- Meta title, description, and heading hierarchy tuning
- High-intent FAQ and content gap filling
- Preventing keyword cannibalization

**frontend-engineer** activates for:
- HTML/CSS layout stability and semantic markup
- Font loading and layout shift (CLS) fixes
- Interactive element behavior (WhatsApp forms, modals)
- Asset delivery and bundle performance

**ui-ux-engineer** activates for:
- Design direction requests ("how should this look")
- New UI design from scratch
- Design review of implemented UI
- Design system decisions
- Interaction flow design

## Skill Boundaries

Each skill has clear ownership boundaries:

| Skill Owns | Does NOT Own |
|------------|--------------|
| **performance-engineer**: Cross-stack performance diagnosis, load testing, capacity planning | Single-component optimization (delegated to owning skill) |
| **seo-engineer**: Technical SEO, structured data, crawlability, AEO/GEO | Render performance UX (→ frontend-engineer), content writing |
| **ui-ux-engineer**: Visual/interaction design, information architecture, design systems | Component implementation code (→ frontend-engineer), accessibility auditing |

## Inter-Skill Coordination

Skills hand off work to each other with specific evidence:

- **performance-engineer** → **backend-engineer**: API/business-logic bottlenecks with profiling evidence
- **performance-engineer** → **database-engineer**: Query/index bottlenecks with EXPLAIN ANALYZE evidence
- **seo-engineer** → **frontend-engineer**: Core Web Vitals ranking-relevant underperformance
- **ui-ux-engineer** → **frontend-engineer**: Design implementation with specific states/spacing/behavior

## Project Conventions

### Code Style
- Follow existing patterns in the codebase
- Use established libraries and utilities already in use
- Maintain consistency with neighboring files

### Security
- Never commit secrets or keys
- Follow security best practices
- Scope credentials appropriately

### Testing
- Verify changes with tests when available
- Run lint/typecheck commands if provided
- Check README for testing approach

### Git
- Only commit when explicitly requested
- Inspect status and diff before committing
- Stage only intended files

## Skill File Structure

Each skill file follows this structure:
1. **Purpose**: Why this skill exists
2. **Scope**: What it owns and doesn't own
3. **When This Skill Activates**: Trigger conditions
4. **Core Responsibilities**: Primary duties
5. **Engineering Principles**: Guiding philosophy
6. **Technical Knowledge**: Domain expertise
7. **Decision-Making Framework**: How to make choices
8. **Workflow**: Step-by-step process
9. **Implementation Guidelines**: Practical rules
10. **Interaction With Other Skills**: Coordination patterns
11. **Expected Output**: What this skill delivers
12. **Examples**: Concrete use cases

## Project Configuration Files

| File | Purpose |
|------|---------|
| `opencode.jsonc` | OpenCode configuration (provider, agents, skills, context) |
| `gemini.md` | Google Gemini context file |
| `context.md` | Full project context for AI assistants |
| `llms.txt` | Authoritative knowledge graph (1,013 lines) for LLM consumption |
| `llms-full.txt` | Comprehensive technical specification (1,050 lines) with wear diagnostic matrix |
| `ai.txt` | Crawl policy and direct grounding protocols for AI crawlers |
| `humans.txt` | Team credentials, developer attribution, and tech stack disclosures |
| `openapi.json` | OpenAPI 3.1.0 machine specification for AI discovery and knowledge extraction |
| `AGENTS.md` | This file - agent skill configuration |


## Adding New Skills

To add a new skill:
1. Create a new `.md` file in `agents/skills/`
2. Follow the existing structure (see any skill file for template)
3. Add YAML frontmatter with `name` and `description`
4. Update this AGENTS.md file with the new skill entry

## Troubleshooting

If a skill doesn't activate when expected:
1. Check if the task matches the skill's activation conditions
2. Verify the skill file exists and is properly formatted
3. Ensure the skill's scope covers the requested work
4. Check for conflicts with other skills' ownership boundaries