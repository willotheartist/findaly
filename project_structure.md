# 📁 findaly - Project Structure

*Generated on: 16/12/2025, 22:54:25*

## 📋 Quick Overview

| Metric | Value |
|--------|-------|
| 📄 Total Files | 90 |
| 📁 Total Folders | 53 |
| 🌳 Max Depth | 4 levels |
| 🛠️ Tech Stack | React, Next.js, TypeScript, CSS, Node.js |

## ⭐ Important Files

- 🟡 🚫 **.gitignore** - Git ignore rules
- 🔴 📖 **README.md** - Project documentation
- 🔵 🔍 **eslint.config.mjs** - ESLint config
- 🟡 ▲ **next.config.ts** - Next.js config
- 🔴 📦 **package.json** - Package configuration
- 🟡 🔷 **tsconfig.json** - TypeScript config

## 📊 File Statistics

### By File Type

- ⚛️ **.tsx** (React TypeScript files): 34 files (37.8%)
- 🔷 **.ts** (TypeScript files): 27 files (30.0%)
- 📄 **.sql** (Other files): 7 files (7.8%)
- 🎨 **.svg** (SVG images): 5 files (5.6%)
- ⚙️ **.json** (JSON files): 4 files (4.4%)
- 📖 **.md** (Markdown files): 2 files (2.2%)
- 📄 **.mjs** (Other files): 2 files (2.2%)
- 🚫 **.gitignore** (Git ignore): 1 files (1.1%)
- 📄 **.txt** (Text files): 1 files (1.1%)
- 🖼️ **.ico** (Icon files): 1 files (1.1%)
- 🎨 **.css** (Stylesheets): 1 files (1.1%)
- ⚙️ **.yaml** (YAML files): 1 files (1.1%)
- ⚙️ **.toml** (TOML files): 1 files (1.1%)
- 📄 **.prisma** (Other files): 1 files (1.1%)
- 📄 **.patch** (Other files): 1 files (1.1%)
- 📄 **.tsbuildinfo** (Other files): 1 files (1.1%)

### By Category

- **React**: 34 files (37.8%)
- **TypeScript**: 27 files (30.0%)
- **Other**: 12 files (13.3%)
- **Config**: 6 files (6.7%)
- **Assets**: 6 files (6.7%)
- **Docs**: 3 files (3.3%)
- **DevOps**: 1 files (1.1%)
- **Styles**: 1 files (1.1%)

### 📁 Largest Directories

- **root**: 90 files
- **app**: 34 files
- **components**: 11 files
- **prisma**: 11 files
- **prisma/migrations**: 8 files

## 🌳 Directory Structure

```
findaly/
├── 🟡 🚫 **.gitignore**
├── 📂 .vercel/
│   ├── ⚙️ project.json
│   └── 📄 README.txt
├── 🚀 app/
│   ├── 📂 about/
│   │   └── ⚛️ page.tsx
│   ├── 📂 admin/
│   │   ├── 📂 login/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 logout/
│   │   │   └── 🔷 route.ts
│   │   ├── ⚛️ page.tsx
│   │   ├── 📂 submissions/
│   │   │   └── ⚛️ page.tsx
│   │   └── 📂 tools/
│   │   │   ├── 📂 [slug]/
│   │   │   │   └── ⚛️ page.tsx
│   │   │   └── ⚛️ page.tsx
│   ├── 📂 alternatives/
│   │   ├── 📂 [slug]/
│   │   │   └── ⚛️ page.tsx
│   │   └── ⚛️ page.tsx
│   ├── 🔌 api/
│   │   ├── 📂 categories/
│   │   │   └── 🔷 route.ts
│   │   ├── 📂 logo/
│   │   │   └── 🔷 route.ts
│   │   ├── 📂 submissions/
│   │   │   ├── 🔷 route.ts
│   │   │   └── 📂 suggest/
│   │   │   │   └── 🔷 route.ts
│   │   └── 📂 submit/
│   │   │   └── 🔷 route.ts
│   ├── 📂 best/
│   │   ├── 📂 [slug]/
│   │   │   └── ⚛️ page.tsx
│   │   └── ⚛️ page.tsx
│   ├── 📂 compare/
│   │   ├── 📂 [pair]/
│   │   │   └── ⚛️ page.tsx
│   │   └── ⚛️ page.tsx
│   ├── 📂 contact/
│   │   └── ⚛️ page.tsx
│   ├── 🖼️ favicon.ico
│   ├── 🎨 globals.css
│   ├── ⚛️ layout.tsx
│   ├── 📂 login/
│   │   └── ⚛️ page.tsx
│   ├── ⚛️ page.tsx
│   ├── 🔷 robots.ts
│   ├── 📂 signup/
│   │   └── ⚛️ page.tsx
│   ├── 🔷 sitemap.ts
│   ├── 📂 submit/
│   │   └── ⚛️ page.tsx
│   ├── 📂 tools/
│   │   ├── 📂 [slug]/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 category/
│   │   │   └── 📂 [category]/
│   │   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 duplicate/
│   │   │   └── 🔷 route.ts
│   │   └── ⚛️ page.tsx
│   └── 📂 use-cases/
│   │   ├── 📂 [slug]/
│   │   │   └── ⚛️ page.tsx
│   │   └── ⚛️ page.tsx
├── 🧩 components/
│   ├── ⚛️ AlternativesPageClient.tsx
│   ├── ⚛️ AlternativesSearch.tsx
│   ├── ⚛️ ClaimListingPanel.tsx
│   ├── ⚛️ Footer.tsx
│   ├── ⚛️ Header.tsx
│   ├── ⚛️ HeaderDropdownClient.tsx
│   ├── ⚛️ ToolCard.tsx
│   ├── ⚛️ ToolLogo.tsx
│   ├── ⚛️ ToolsExplorer.tsx
│   ├── ⚛️ ToolsPageClient.tsx
│   └── ⚛️ UseCasesExplorer.tsx
├── 📂 data/
│   └── 🔷 mockTools.ts
├── 🔵 🔍 **eslint.config.mjs**
├── 📂 generated/
├── 📚 lib/
│   ├── 📂 admin/
│   │   └── 🔷 session.ts
│   ├── 🔷 db.ts
│   ├── 📂 decision/
│   │   └── 🔷 alternatives.ts
│   └── 📂 internalLinking/
│   │   ├── 🔷 engine.ts
│   │   └── 🔷 rules.ts
├── 🔷 middleware.ts
├── 🔷 next-env.d.ts
├── 🟡 ▲ **next.config.ts**
├── 🔴 📦 **package.json**
├── ⚙️ pnpm-lock.yaml
├── 📄 postcss.config.mjs
├── 📂 prisma/
│   ├── 📂 migrations/
│   │   ├── 📂 20251214211004_init/
│   │   │   └── 📄 migration.sql
│   │   ├── 📂 20251215004001_decision_schema/
│   │   │   └── 📄 migration.sql
│   │   ├── 📂 20251215135757_add_submissions/
│   │   │   └── 📄 migration.sql
│   │   ├── 📂 20251215160137_tool_status_enum/
│   │   │   └── 📄 migration.sql
│   │   ├── 📂 20251215234043_newmigration/
│   │   │   └── 📄 migration.sql
│   │   ├── 📂 20251216134457_add_findaly_sources_and_scores/
│   │   │   └── 📄 migration.sql
│   │   ├── 📂 20251216143735_consensus/
│   │   │   └── 📄 migration.sql
│   │   └── ⚙️ migration_lock.toml
│   ├── 📄 schema.prisma
│   ├── 🔷 seed.ts
│   └── ⚙️ tools.seed.json
├── 🔷 prisma.config.ts
├── 📖 project_structure.md
├── 🌐 public/
│   ├── 🎨 file.svg
│   ├── 🎨 globe.svg
│   ├── 🎨 next.svg
│   ├── 🎨 vercel.svg
│   └── 🎨 window.svg
├── 🔴 📖 **README.md**
├── 📂 scripts/
│   ├── 🔷 enrich.ts
│   └── 📂 findaly/
│   │   ├── 📂 enrich/
│   │   │   ├── 🔷 discover.ts
│   │   │   ├── 🔷 extract.ts
│   │   │   └── 🔷 http.ts
│   │   └── 📂 rating/
│   │   │   ├── 🔷 checklists.ts
│   │   │   └── 🔷 score.ts
├── 📄 seed-tools-batch-1.patch
├── 🔷 tailwind.config.ts
├── 🟡 🔷 **tsconfig.json**
└── 📄 tsconfig.tsbuildinfo
```

## 📖 Legend

### File Types
- 🚫 DevOps: Git ignore
- 📄 Docs: Text files
- ⚙️ Config: JSON files
- 📖 Docs: Markdown files
- ⚛️ React: React TypeScript files
- 🔷 TypeScript: TypeScript files
- 🖼️ Assets: Icon files
- 🎨 Styles: Stylesheets
- 📄 Other: Other files
- ⚙️ Config: YAML files
- ⚙️ Config: TOML files
- 🎨 Assets: SVG images

### Importance Levels
- 🔴 Critical: Essential project files
- 🟡 High: Important configuration files
- 🔵 Medium: Helpful but not essential files
