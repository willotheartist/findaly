# 📁 findaly - Project Structure

*Generated on: 15/12/2025, 16:39:26*

## 📋 Quick Overview

| Metric | Value |
|--------|-------|
| 📄 Total Files | 71 |
| 📁 Total Folders | 41 |
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

- ⚛️ **.tsx** (React TypeScript files): 32 files (45.1%)
- 🔷 **.ts** (TypeScript files): 17 files (23.9%)
- 🎨 **.svg** (SVG images): 5 files (7.0%)
- 📄 **.sql** (Other files): 4 files (5.6%)
- 📖 **.md** (Markdown files): 2 files (2.8%)
- 📄 **.mjs** (Other files): 2 files (2.8%)
- ⚙️ **.json** (JSON files): 2 files (2.8%)
- 🚫 **.gitignore** (Git ignore): 1 files (1.4%)
- 🖼️ **.ico** (Icon files): 1 files (1.4%)
- 🎨 **.css** (Stylesheets): 1 files (1.4%)
- ⚙️ **.yaml** (YAML files): 1 files (1.4%)
- ⚙️ **.toml** (TOML files): 1 files (1.4%)
- 📄 **.prisma** (Other files): 1 files (1.4%)
- 📄 **.tsbuildinfo** (Other files): 1 files (1.4%)

### By Category

- **React**: 32 files (45.1%)
- **TypeScript**: 17 files (23.9%)
- **Other**: 8 files (11.3%)
- **Assets**: 6 files (8.5%)
- **Config**: 4 files (5.6%)
- **Docs**: 2 files (2.8%)
- **DevOps**: 1 files (1.4%)
- **Styles**: 1 files (1.4%)

### 📁 Largest Directories

- **root**: 71 files
- **app**: 29 files
- **components**: 10 files
- **prisma**: 7 files
- **app/admin**: 6 files

## 🌳 Directory Structure

```
findaly/
├── 🟡 🚫 **.gitignore**
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
│   │   ├── 📂 submissions/
│   │   │   └── 🔷 route.ts
│   │   └── 📂 submit/
│   │   │   └── 🔷 route.ts
│   ├── 📂 best/
│   │   ├── 📂 [slug]/
│   │   │   └── ⚛️ page.tsx
│   │   └── ⚛️ page.tsx
│   ├── 📂 compare/
│   │   └── 📂 [pair]/
│   │   │   └── ⚛️ page.tsx
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
│   │   └── ⚛️ page.tsx
│   └── 📂 use-cases/
│   │   ├── 📂 [slug]/
│   │   │   └── ⚛️ page.tsx
│   │   └── ⚛️ page.tsx
├── 🧩 components/
│   ├── ⚛️ AlternativesPageClient.tsx
│   ├── ⚛️ AlternativesSearch.tsx
│   ├── ⚛️ ClaimListingPanel.tsx
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
│   │   └── ⚙️ migration_lock.toml
│   ├── 📄 schema.prisma
│   └── 🔷 seed.ts
├── 🔷 prisma.config.ts
├── 📖 project_structure.md
├── 🌐 public/
│   ├── 🎨 file.svg
│   ├── 🎨 globe.svg
│   ├── 🎨 next.svg
│   ├── 🎨 vercel.svg
│   └── 🎨 window.svg
├── 🔴 📖 **README.md**
├── 🔷 tailwind.config.ts
├── 🟡 🔷 **tsconfig.json**
└── 📄 tsconfig.tsbuildinfo
```

## 📖 Legend

### File Types
- 🚫 DevOps: Git ignore
- 📖 Docs: Markdown files
- ⚛️ React: React TypeScript files
- 🔷 TypeScript: TypeScript files
- 🖼️ Assets: Icon files
- 🎨 Styles: Stylesheets
- 📄 Other: Other files
- ⚙️ Config: JSON files
- ⚙️ Config: YAML files
- ⚙️ Config: TOML files
- 🎨 Assets: SVG images

### Importance Levels
- 🔴 Critical: Essential project files
- 🟡 High: Important configuration files
- 🔵 Medium: Helpful but not essential files
