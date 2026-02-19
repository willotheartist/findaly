# 📁 findaly - Project Structure

*Generated on: 19/02/2026, 14:40:13*

## 📋 Quick Overview

| Metric | Value |
|--------|-------|
| 📄 Total Files | 207 |
| 📁 Total Folders | 137 |
| 🌳 Max Depth | 10 levels |
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

- ⚛️ **.tsx** (React TypeScript files): 109 files (52.7%)
- 🔷 **.ts** (TypeScript files): 44 files (21.3%)
- 🖼️ **.jpg** (JPEG images): 13 files (6.3%)
- 🖼️ **.png** (PNG images): 11 files (5.3%)
- 📄 **.sql** (Other files): 7 files (3.4%)
- 🎨 **.svg** (SVG images): 5 files (2.4%)
- ⚙️ **.json** (JSON files): 4 files (1.9%)
- 📄 **.mjs** (Other files): 3 files (1.4%)
- 📖 **.md** (Markdown files): 2 files (1.0%)
- 🚫 **.gitignore** (Git ignore): 1 files (0.5%)
- 📄 **.txt** (Text files): 1 files (0.5%)
- 🖼️ **.ico** (Icon files): 1 files (0.5%)
- 🎨 **.css** (Stylesheets): 1 files (0.5%)
- ⚙️ **.yaml** (YAML files): 1 files (0.5%)
- ⚙️ **.toml** (TOML files): 1 files (0.5%)
- 📄 **.prisma** (Other files): 1 files (0.5%)
- 📄 **.patch** (Other files): 1 files (0.5%)
- 📄 **.tsbuildinfo** (Other files): 1 files (0.5%)

### By Category

- **React**: 109 files (52.7%)
- **TypeScript**: 44 files (21.3%)
- **Assets**: 30 files (14.5%)
- **Other**: 13 files (6.3%)
- **Config**: 6 files (2.9%)
- **Docs**: 3 files (1.4%)
- **DevOps**: 1 files (0.5%)
- **Styles**: 1 files (0.5%)

### 📁 Largest Directories

- **root**: 207 files
- **app**: 99 files
- **components**: 29 files
- **public**: 29 files
- **app/add-listing**: 21 files

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
│   │   ├── 📂 kompipay/
│   │   │   └── 📂 create-session/
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
│   │   ├── 📂 uploads/
│   │   │   └── 🔷 route.ts
│   │   └── 📂 webhooks/
│   │   │   └── 📂 kompipay/
│   │   │   │   └── 🔷 route.ts
│   ├── 📂 billing/
│   │   ├── 📂 cancel/
│   │   │   └── ⚛️ page.tsx
│   │   └── 📂 success/
│   │   │   └── ⚛️ page.tsx
│   ├── 📂 brokers/
│   │   └── ⚛️ page.tsx
│   ├── 📂 buy/
│   │   ├── 📂 [slug]/
│   │   │   ├── ⚛️ ListingPageClient.tsx
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 brand/
│   │   │   └── 📂 [brand]/
│   │   │   │   ├── 📂 country/
│   │   │   │   │   └── 📂 [country]/
│   │   │   │   │   │   ├── ⚛️ page.tsx
│   │   │   │   │   │   └── 📂 year/
│   │   │   │   │   │   │   └── 📂 [year]/
│   │   │   │   │   │   │   │   └── ⚛️ page.tsx
│   │   │   │   ├── 📂 model/
│   │   │   │   │   └── 📂 [model]/
│   │   │   │   │   │   ├── 📂 country/
│   │   │   │   │   │   │   └── 📂 [country]/
│   │   │   │   │   │   │   │   ├── ⚛️ page.tsx
│   │   │   │   │   │   │   │   └── 📂 year/
│   │   │   │   │   │   │   │   │   └── 📂 [year]/
│   │   │   │   │   │   │   │   │   │   └── ⚛️ page.tsx
│   │   │   │   │   │   ├── ⚛️ page.tsx
│   │   │   │   │   │   └── 📂 year/
│   │   │   │   │   │   │   └── 📂 [year]/
│   │   │   │   │   │   │   │   └── ⚛️ page.tsx
│   │   │   │   ├── ⚛️ page.tsx
│   │   │   │   └── 📂 year/
│   │   │   │   │   └── 📂 [year]/
│   │   │   │   │   │   └── ⚛️ page.tsx
│   │   ├── ⚛️ BuyPageClient.tsx
│   │   ├── 📂 country/
│   │   │   └── 📂 [country]/
│   │   │   │   ├── ⚛️ page.tsx
│   │   │   │   └── 📂 year/
│   │   │   │   │   └── 📂 [year]/
│   │   │   │   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 model/
│   │   │   └── 📂 [model]/
│   │   │   │   ├── 📂 country/
│   │   │   │   │   └── 📂 [country]/
│   │   │   │   │   │   └── ⚛️ page.tsx
│   │   │   │   ├── ⚛️ page.tsx
│   │   │   │   └── 📂 year/
│   │   │   │   │   └── 📂 [year]/
│   │   │   │   │   │   └── ⚛️ page.tsx
│   │   ├── ⚛️ page.tsx
│   │   └── 📂 year/
│   │   │   └── 📂 [year]/
│   │   │   │   ├── 📂 brand/
│   │   │   │   │   └── 📂 [brand]/
│   │   │   │   │   │   └── ⚛️ page.tsx
│   │   │   │   ├── 📂 country/
│   │   │   │   │   └── 📂 [country]/
│   │   │   │   │   │   └── ⚛️ page.tsx
│   │   │   │   ├── 📂 model/
│   │   │   │   │   └── 📂 [model]/
│   │   │   │   │   │   └── ⚛️ page.tsx
│   │   │   │   └── ⚛️ page.tsx
│   ├── 📂 charter/
│   │   └── ⚛️ page.tsx
│   ├── 📂 contact/
│   │   └── ⚛️ page.tsx
│   ├── 📂 cookies/
│   │   └── ⚛️ page.tsx
│   ├── 📂 destinations/
│   │   ├── 📂 [slug]/
│   │   │   ├── 🔷 _data.ts
│   │   │   ├── ⚛️ page.tsx
│   │   │   └── 📂 things-to-do/
│   │   │   │   └── ⚛️ page.tsx
│   │   └── ⚛️ page.tsx
│   ├── 🖼️ favicon.ico
│   ├── 📂 finance/
│   │   └── ⚛️ page.tsx
│   ├── 🎨 globals.css
│   ├── ⚛️ layout.tsx
│   ├── 📂 login/
│   │   ├── ⚛️ LoginClient.tsx
│   │   └── ⚛️ page.tsx
│   ├── 📂 logout/
│   │   ├── ⚛️ LogoutClient.tsx
│   │   └── ⚛️ page.tsx
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
│   ├── 📂 pricing/
│   │   └── ⚛️ page.tsx
│   ├── 📂 privacy/
│   │   └── ⚛️ page.tsx
│   ├── 📂 profile/
│   │   └── 📂 [slug]/
│   │   │   ├── ⚛️ page.tsx
│   │   │   └── ⚛️ ProfilePageClient.tsx
│   ├── 🔷 robots.ts
│   ├── 📂 searches/
│   │   └── ⚛️ page.tsx
│   ├── 📂 sell/
│   │   └── ⚛️ page.tsx
│   ├── 📂 settings/
│   │   ├── 📂 _components/
│   │   │   └── ⚛️ SettingsClient.tsx
│   │   └── ⚛️ page.tsx
│   ├── 📂 signup/
│   │   └── ⚛️ page.tsx
│   ├── 🔷 sitemap.ts
│   ├── 📂 terms/
│   │   └── ⚛️ page.tsx
│   ├── 📂 trust/
│   │   └── ⚛️ page.tsx
│   ├── 📂 upgrade/
│   │   └── ⚛️ page.tsx
│   └── 📂 use-cases/
├── 🧩 components/
│   ├── 📂 destinations/
│   │   ├── ⚛️ DestinationCard.tsx
│   │   ├── ⚛️ DestinationHighlights.tsx
│   │   ├── ⚛️ DestinationLinkCard.tsx
│   │   ├── ⚛️ DestinationQuickFacts.tsx
│   │   ├── 🔷 destinations.data.ts
│   │   ├── ⚛️ DestinationSearchClient.tsx
│   │   ├── ⚛️ DestinationSection.tsx
│   │   └── ⚛️ DestinationSlugHero.tsx
│   ├── ⚛️ Footer.tsx
│   ├── ⚛️ Header.tsx
│   ├── ⚛️ HeaderDropdownClient.tsx
│   ├── 📂 home/
│   │   ├── ⚛️ BoatsForSaleSection.tsx
│   │   ├── ⚛️ HomeHero.tsx
│   │   ├── ⚛️ HomeSplitCtas.tsx
│   │   └── ⚛️ ThingsToDo.tsx
│   ├── 📂 kompipay/
│   │   └── ⚛️ CheckoutButton.tsx
│   ├── 📂 listing/
│   │   └── ⚛️ SellerCard.tsx
│   ├── ⚛️ LogoutButtonClient.tsx
│   ├── 📂 maps/
│   │   └── ⚛️ ListingMap.tsx
│   ├── 📂 seo/
│   │   ├── ⚛️ MarketOverview.tsx
│   │   ├── ⚛️ PillarRelatedSearches.tsx
│   │   ├── ⚛️ RelatedSearches.tsx
│   │   └── ⚛️ SeoLinkBlock.tsx
│   ├── ⚛️ SiteHeaderHeightClient.tsx
│   ├── ⚛️ SiteHeaderOffsetClient.tsx
│   ├── 📂 stack/
│   │   ├── ⚛️ StackBuilderClient.tsx
│   │   ├── ⚛️ StackLoading.tsx
│   │   └── ⚛️ StackResults.tsx
│   └── ⚛️ WaazaFinancing.tsx
├── 📂 data/
│   ├── 🔷 mockTools.ts
│   └── 📂 stack/
│   │   └── 🔷 questions.ts
├── 🔵 🔍 **eslint.config.mjs**
├── 📂 eyb-sell-your-boat__OLD_NESTED/
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
│   ├── 🔷 db.ts
│   ├── 📂 kompipay/
│   │   └── 🔷 products.ts
│   ├── 📂 seo/
│   │   └── 🔷 marketStats.ts
│   ├── 🔷 seoParam.ts
│   └── 🔷 site.ts
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
│   │   ├── 📂 20260218132700_add_kompipay_monetization/
│   │   │   └── 📄 migration.sql
│   │   ├── 📂 20260218134046_kompipay_monetization/
│   │   │   └── 📄 migration.sql
│   │   ├── 📂 20260218135432_kompipay_monetization_v2/
│   │   │   └── 📄 migration.sql
│   │   └── ⚙️ migration_lock.toml
│   ├── 📄 schema.prisma
│   └── ⚙️ tools.seed.json
├── 🔷 prisma.config.ts
├── 📖 project_structure.md
├── 🌐 public/
│   ├── 🖼️ brokers-hero.jpg
│   ├── 🖼️ charter-hero.jpg
│   ├── 🖼️ Charter.png
│   ├── 📂 destinations/
│   │   ├── 🖼️ Amalfi Coast.png
│   │   ├── 🖼️ Balearics.png
│   │   ├── 🖼️ Caribbean.png
│   │   ├── 🖼️ Croatia.png
│   │   ├── 🖼️ Dubai.png
│   │   ├── 🖼️ FrenchRiviera.png
│   │   ├── 🖼️ Greece.png
│   │   └── 🖼️ Turkey.png
│   ├── 🎨 file.svg
│   ├── 🖼️ finance-hero.jpg
│   ├── 📂 fonts/
│   │   └── 📂 inter-tight/
│   ├── 🎨 globe.svg
│   ├── 🖼️ hero-buy.jpg
│   ├── 🖼️ hero-charter.jpg
│   ├── 🖼️ hero-pros.jpg
│   ├── 🖼️ hero-sell.jpg
│   ├── 🖼️ Holiday.png
│   ├── 🖼️ list-boat-cta.jpg
│   ├── 🎨 next.svg
│   ├── 🖼️ sell-hero.jpg
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
- 🖼️ Assets: PNG images
- 🖼️ Assets: JPEG images
- 🎨 Assets: SVG images

### Importance Levels
- 🔴 Critical: Essential project files
- 🟡 High: Important configuration files
- 🔵 Medium: Helpful but not essential files
