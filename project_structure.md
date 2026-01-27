# 📁 findaly - Project Structure

*Generated on: 27/01/2026, 15:30:43*

## 📋 Quick Overview

| Metric | Value |
|--------|-------|
| 📄 Total Files | 120 |
| 📁 Total Folders | 72 |
| 🌳 Max Depth | 5 levels |
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

- ⚛️ **.tsx** (React TypeScript files): 53 files (44.2%)
- 🔷 **.ts** (TypeScript files): 35 files (29.2%)
- 🎨 **.svg** (SVG images): 5 files (4.2%)
- ⚙️ **.json** (JSON files): 4 files (3.3%)
- 📄 **.sql** (Other files): 4 files (3.3%)
- 🖼️ **.jpg** (JPEG images): 4 files (3.3%)
- 📄 **.mjs** (Other files): 3 files (2.5%)
- 📖 **.md** (Markdown files): 2 files (1.7%)
- 🚫 **.gitignore** (Git ignore): 1 files (0.8%)
- 📄 **.txt** (Text files): 1 files (0.8%)
- 🖼️ **.ico** (Icon files): 1 files (0.8%)
- 🎨 **.css** (Stylesheets): 1 files (0.8%)
- ⚙️ **.yaml** (YAML files): 1 files (0.8%)
- ⚙️ **.toml** (TOML files): 1 files (0.8%)
- 📄 **.prisma** (Other files): 1 files (0.8%)
- 🖼️ **.png** (PNG images): 1 files (0.8%)
- 📄 **.patch** (Other files): 1 files (0.8%)
- 📄 **.tsbuildinfo** (Other files): 1 files (0.8%)

### By Category

- **React**: 53 files (44.2%)
- **TypeScript**: 35 files (29.2%)
- **Assets**: 11 files (9.2%)
- **Other**: 10 files (8.3%)
- **Config**: 6 files (5.0%)
- **Docs**: 3 files (2.5%)
- **DevOps**: 1 files (0.8%)
- **Styles**: 1 files (0.8%)

### 📁 Largest Directories

- **root**: 120 files
- **app**: 60 files
- **app/add-listing**: 21 files
- **app/add-listing/_components**: 17 files
- **app/api**: 15 files

## 🌳 Directory Structure

```
findaly/
├── 🟡 🚫 **.gitignore**
├── 📂 .vercel/
│   ├── ⚙️ project.json
│   └── 📄 README.txt
├── 🚀 app/
│   ├── 📂 add-listing/
│   │   ├── 📂 _components/
│   │   │   ├── 📂 fields/
│   │   │   │   ├── ⚛️ CheckboxGroup.tsx
│   │   │   │   ├── ⚛️ Input.tsx
│   │   │   │   ├── ⚛️ PhotoUploader.tsx
│   │   │   │   ├── ⚛️ Select.tsx
│   │   │   │   └── ⚛️ TextArea.tsx
│   │   │   ├── ⚛️ FormSection.tsx
│   │   │   ├── ⚛️ StepIndicator.tsx
│   │   │   ├── 📂 steps/
│   │   │   │   ├── ⚛️ Step1TypeSelection.tsx
│   │   │   │   ├── ⚛️ Step2Category.tsx
│   │   │   │   ├── ⚛️ Step3Details.tsx
│   │   │   │   ├── ⚛️ Step4Features.tsx
│   │   │   │   ├── ⚛️ Step5Location.tsx
│   │   │   │   ├── ⚛️ Step6Photos.tsx
│   │   │   │   ├── ⚛️ Step7Description.tsx
│   │   │   │   ├── ⚛️ Step8Seller.tsx
│   │   │   │   └── ⚛️ StepReview.tsx
│   │   │   └── ⚛️ SuccessModal.tsx
│   │   ├── 📂 _data/
│   │   │   └── 🔷 options.ts
│   │   ├── 📂 _types/
│   │   │   └── 🔷 listing.ts
│   │   ├── ⚛️ ListingWizard.tsx
│   │   └── ⚛️ page.tsx
│   ├── 🔌 api/
│   │   ├── 📂 auth/
│   │   │   ├── 📂 login/
│   │   │   │   └── 🔷 route.ts
│   │   │   ├── 📂 logout/
│   │   │   │   └── 🔷 route.ts
│   │   │   └── 📂 signup/
│   │   │   │   └── 🔷 route.ts
│   │   ├── 📂 listings/
│   │   │   ├── 📂 [id]/
│   │   │   │   └── 🔷 route.ts
│   │   │   └── 🔷 route.ts
│   │   ├── 📂 logo/
│   │   │   └── 🔷 route.ts
│   │   ├── 📂 messages/
│   │   │   ├── 📂 [id]/
│   │   │   │   └── 🔷 route.ts
│   │   │   ├── 🔷 route.ts
│   │   │   └── 📂 send/
│   │   │   │   └── 🔷 route.ts
│   │   ├── 📂 profile/
│   │   │   ├── 📂 media/
│   │   │   │   └── 🔷 route.ts
│   │   │   └── 📂 update/
│   │   │   │   └── 🔷 route.ts
│   │   ├── 📂 searches/
│   │   │   ├── 📂 [id]/
│   │   │   │   └── 🔷 route.ts
│   │   │   └── 🔷 route.ts
│   │   ├── 📂 stack/
│   │   ├── 📂 upload/
│   │   │   └── 🔷 route.ts
│   │   └── 📂 uploads/
│   │   │   └── 🔷 route.ts
│   ├── 📂 buy/
│   │   ├── 📂 [slug]/
│   │   │   ├── ⚛️ ListingPageClient.tsx
│   │   │   └── ⚛️ page.tsx
│   │   ├── ⚛️ BuyPageClient.tsx
│   │   └── ⚛️ page.tsx
│   ├── 🖼️ favicon.ico
│   ├── 🎨 globals.css
│   ├── ⚛️ layout.tsx
│   ├── 📂 listings/
│   ├── 📂 login/
│   │   ├── ⚛️ LoginClient.tsx
│   │   └── ⚛️ page.tsx
│   ├── 📂 logout/
│   │   └── 🔷 route.ts
│   ├── 📂 messages/
│   │   ├── ⚛️ MessagesClient.tsx
│   │   └── ⚛️ page.tsx
│   ├── 📂 my-listings/
│   │   ├── 📂 [id]/
│   │   │   └── 📂 edit/
│   │   │   │   ├── ⚛️ EditListingClient.tsx
│   │   │   │   └── ⚛️ page.tsx
│   │   ├── ⚛️ MyListingsClient.tsx
│   │   └── ⚛️ page.tsx
│   ├── ⚛️ page.tsx
│   ├── 📂 profile/
│   │   └── 📂 [slug]/
│   │   │   ├── ⚛️ page.tsx
│   │   │   └── ⚛️ ProfilePageClient.tsx
│   ├── 📂 searches/
│   │   └── ⚛️ page.tsx
│   ├── 📂 settings/
│   │   ├── 📂 _components/
│   │   │   └── ⚛️ SettingsClient.tsx
│   │   └── ⚛️ page.tsx
│   ├── 📂 signup/
│   │   └── ⚛️ page.tsx
│   ├── 📂 upgrade/
│   │   └── ⚛️ page.tsx
│   └── 📂 use-cases/
├── 🧩 components/
│   ├── ⚛️ Footer.tsx
│   ├── ⚛️ Header.tsx
│   ├── ⚛️ HeaderDropdownClient.tsx
│   ├── 📂 listing/
│   │   └── ⚛️ SellerCard.tsx
│   └── 📂 stack/
│   │   ├── ⚛️ StackBuilderClient.tsx
│   │   ├── ⚛️ StackLoading.tsx
│   │   └── ⚛️ StackResults.tsx
├── 📂 data/
│   ├── 🔷 mockTools.ts
│   └── 📂 stack/
│   │   └── 🔷 questions.ts
├── 🔵 🔍 **eslint.config.mjs**
├── 📂 eyb-sell-your-boat/
│   ├── 🚀 app/
│   │   ├── 📂 add-listing/
│   │   │   └── 📂 _components/
│   │   │   │   ├── 📂 fields/
│   │   │   │   │   ├── ⚛️ CheckboxGroup.tsx
│   │   │   │   │   ├── ⚛️ Input.tsx
│   │   │   │   │   ├── ⚛️ Select.tsx
│   │   │   │   │   └── ⚛️ TextArea.tsx
│   │   │   │   └── ⚛️ FormSection.tsx
│   │   └── ⚛️ layout.tsx
│   ├── 📄 postcss.config.mjs
│   └── 🔷 tailwind.config.ts
├── 📂 generated/
├── 📚 lib/
│   ├── 📂 admin/
│   │   └── 🔷 session.ts
│   ├── 📂 auth/
│   │   ├── 🔷 profile.ts
│   │   └── 🔷 session.ts
│   └── 🔷 db.ts
├── 🔷 middleware.ts
├── 🔷 next-env.d.ts
├── 🟡 ▲ **next.config.ts**
├── 🔴 📦 **package.json**
├── ⚙️ pnpm-lock.yaml
├── 📄 postcss.config.mjs
├── 📂 prisma/
│   ├── 📂 migrations/
│   │   ├── 📂 20260123094902_init_marketplace/
│   │   │   └── 📄 migration.sql
│   │   ├── 📂 20260123105414_add_saved_searches/
│   │   │   └── 📄 migration.sql
│   │   ├── 📂 20260124152715_add_listing_details/
│   │   │   └── 📄 migration.sql
│   │   ├── 📂 20260125165402_add_profile_media_urls/
│   │   │   └── 📄 migration.sql
│   │   └── ⚙️ migration_lock.toml
│   ├── 📄 schema.prisma
│   └── ⚙️ tools.seed.json
├── 🔷 prisma.config.ts
├── 📖 project_structure.md
├── 🌐 public/
│   ├── 🎨 file.svg
│   ├── 📂 fonts/
│   │   └── 📂 inter-tight/
│   ├── 🎨 globe.svg
│   ├── 🎨 next.svg
│   ├── 📂 uploads/
│   │   ├── 🖼️ 3cf4a8bd-377b-4dcb-b66b-1bf4da243d90.jpg
│   │   ├── 🖼️ 926df4ff-3967-40ba-998c-87c0f27af596.png
│   │   ├── 🖼️ 9eca7f55-4b8e-4345-917a-558e7b18324b.jpg
│   │   ├── 🖼️ dc7cdfa4-1c5f-4613-9d53-848b31484d02.jpg
│   │   └── 🖼️ e13834c7-5fb1-4015-8f47-96867b62c3c2.jpg
│   ├── 🎨 vercel.svg
│   └── 🎨 window.svg
├── 🔴 📖 **README.md**
├── 📂 scripts/
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
- 🖼️ Assets: JPEG images
- 🖼️ Assets: PNG images

### Importance Levels
- 🔴 Critical: Essential project files
- 🟡 High: Important configuration files
- 🔵 Medium: Helpful but not essential files
