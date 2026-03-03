# 📁 findaly - Project Structure

*Generated on: 03/03/2026, 15:48:07*

## 📋 Quick Overview

| Metric | Value |
|--------|-------|
| 📄 Total Files | 279 |
| 📁 Total Folders | 196 |
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

- ⚛️ **.tsx** (React TypeScript files): 163 files (58.4%)
- 🔷 **.ts** (TypeScript files): 54 files (19.4%)
- 🖼️ **.jpg** (JPEG images): 17 files (6.1%)
- 📄 **.sql** (Other files): 11 files (3.9%)
- 🖼️ **.png** (PNG images): 11 files (3.9%)
- 🎨 **.svg** (SVG images): 5 files (1.8%)
- ⚙️ **.json** (JSON files): 4 files (1.4%)
- 📄 **.mjs** (Other files): 3 files (1.1%)
- 📖 **.md** (Markdown files): 2 files (0.7%)
- 🚫 **.gitignore** (Git ignore): 1 files (0.4%)
- 📄 **.txt** (Text files): 1 files (0.4%)
- 🖼️ **.ico** (Icon files): 1 files (0.4%)
- 🎨 **.css** (Stylesheets): 1 files (0.4%)
- ⚙️ **.yaml** (YAML files): 1 files (0.4%)
- ⚙️ **.toml** (TOML files): 1 files (0.4%)
- 📄 **.prisma** (Other files): 1 files (0.4%)
- 📄 **.patch** (Other files): 1 files (0.4%)
- 📄 **.tsbuildinfo** (Other files): 1 files (0.4%)

### By Category

- **React**: 163 files (58.4%)
- **TypeScript**: 54 files (19.4%)
- **Assets**: 34 files (12.2%)
- **Other**: 17 files (6.1%)
- **Config**: 6 files (2.2%)
- **Docs**: 3 files (1.1%)
- **DevOps**: 1 files (0.4%)
- **Styles**: 1 files (0.4%)

### 📁 Largest Directories

- **root**: 279 files
- **app**: 154 files
- **public**: 33 files
- **components**: 32 files
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
│   ├── 📂 alerts/
│   │   ├── ⚛️ AlertsClient.tsx
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
│   │   │   ├── 📂 enquire/
│   │   │   │   └── 🔷 route.ts
│   │   │   ├── 🔷 route.ts
│   │   │   └── 📂 send/
│   │   │   │   └── 🔷 route.ts
│   │   ├── 📂 profile/
│   │   │   ├── 📂 media/
│   │   │   │   └── 🔷 route.ts
│   │   │   └── 📂 update/
│   │   │   │   └── 🔷 route.ts
│   │   ├── 📂 saved/
│   │   │   └── 🔷 route.ts
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
│   ├── 📂 blog/
│   │   └── ⚛️ page.tsx
│   ├── 📂 brands/
│   │   ├── ⚛️ BrandsClient.tsx
│   │   └── ⚛️ page.tsx
│   ├── 📂 brokers/
│   │   ├── 📂 dashboard/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 faq/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 join/
│   │   │   └── ⚛️ page.tsx
│   │   ├── ⚛️ page.tsx
│   │   └── 📂 pricing/
│   │   │   └── ⚛️ page.tsx
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
│   ├── 📂 careers/
│   │   └── ⚛️ page.tsx
│   ├── 📂 charter/
│   │   └── ⚛️ page.tsx
│   ├── 📂 contact/
│   │   └── ⚛️ page.tsx
│   ├── 📂 cookies/
│   │   └── ⚛️ page.tsx
│   ├── 📂 crew-jobs/
│   │   └── ⚛️ page.tsx
│   ├── 📂 destinations/
│   │   ├── 📂 [slug]/
│   │   │   ├── 🔷 _data.ts
│   │   │   ├── ⚛️ page.tsx
│   │   │   └── 📂 things-to-do/
│   │   │   │   └── ⚛️ page.tsx
│   │   └── ⚛️ page.tsx
│   ├── 📂 disclaimer/
│   │   └── ⚛️ page.tsx
│   ├── 📂 faq/
│   │   └── ⚛️ page.tsx
│   ├── 🖼️ favicon.ico
│   ├── 📂 finance/
│   │   └── ⚛️ page.tsx
│   ├── 🎨 globals.css
│   ├── 📂 guides/
│   │   ├── 🔷 _data.ts
│   │   ├── 📂 astrea-42-buying-guide/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 beneteau-oceanis-vs-first/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 beneteau-price-guide/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 beneteau-swift-trawler-buying-guide/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 buying-a-beneteau/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 buying-a-yacht/
│   │   ├── 📂 catamaran-buying-guide/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 charter-guide/
│   │   ├── 📂 finance/
│   │   ├── 📂 fountaine-pajot-catamaran-buying-guide/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 isla-40-buying-guide/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 lagoon-40-buying-guide/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 lagoon-42-buying-guide/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 lagoon-catamaran-buying-guide/
│   │   │   └── ⚛️ page.tsx
│   │   ├── ⚛️ layout.tsx
│   │   ├── 📂 motor-yacht-buying-guide/
│   │   │   └── ⚛️ page.tsx
│   │   ├── ⚛️ page.tsx
│   │   ├── 📂 selling-a-yacht/
│   │   ├── 📂 survey-inspection/
│   │   ├── 📂 used-beneteau-checklist/
│   │   │   └── ⚛️ page.tsx
│   │   └── 📂 yacht-types-explained/
│   │   │   └── ⚛️ page.tsx
│   ├── 📂 instagram/
│   │   └── ⚛️ page.tsx
│   ├── ⚛️ layout.tsx
│   ├── 📂 linkedin/
│   │   └── ⚛️ page.tsx
│   ├── 📂 login/
│   │   ├── ⚛️ LoginClient.tsx
│   │   └── ⚛️ page.tsx
│   ├── 📂 logout/
│   │   ├── ⚛️ LogoutClient.tsx
│   │   └── ⚛️ page.tsx
│   ├── 📂 messages/
│   │   ├── ⚛️ layout.tsx
│   │   ├── ⚛️ MessagesClient.tsx
│   │   └── ⚛️ page.tsx
│   ├── 📂 my-listings/
│   │   ├── 📂 [id]/
│   │   │   └── 📂 edit/
│   │   │   │   ├── ⚛️ EditListingClient.tsx
│   │   │   │   └── ⚛️ page.tsx
│   │   ├── ⚛️ MyListingsClient.tsx
│   │   └── ⚛️ page.tsx
│   ├── 📂 news/
│   │   └── ⚛️ page.tsx
│   ├── ⚛️ page.tsx
│   ├── 📂 parts/
│   │   └── ⚛️ page.tsx
│   ├── 📂 pricing/
│   │   └── ⚛️ page.tsx
│   ├── 📂 privacy/
│   │   └── ⚛️ page.tsx
│   ├── 📂 profile/
│   │   └── 📂 [slug]/
│   │   │   ├── ⚛️ page.tsx
│   │   │   └── ⚛️ ProfilePageClient.tsx
│   ├── 📂 report/
│   │   └── ⚛️ page.tsx
│   ├── 📂 reports/
│   │   └── ⚛️ page.tsx
│   ├── 🔷 robots.ts
│   ├── 📂 safety/
│   ├── 📂 saved/
│   │   ├── ⚛️ page.tsx
│   │   └── ⚛️ SavedClient.tsx
│   ├── 📂 saved-searches/
│   │   └── ⚛️ page.tsx
│   ├── 📂 scams/
│   ├── 📂 search/
│   │   ├── ⚛️ page.tsx
│   │   └── ⚛️ SearchClient.tsx
│   ├── 📂 searches/
│   │   └── ⚛️ page.tsx
│   ├── 📂 sell/
│   │   ├── 🔷 content.ts
│   │   ├── ⚛️ page.tsx
│   │   └── ⚛️ SellPageClient.tsx
│   ├── 📂 services/
│   │   ├── 📂 marine-insurance/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 marine-lawyers/
│   │   │   └── ⚛️ page.tsx
│   │   ├── ⚛️ page.tsx
│   │   ├── ⚛️ ServicesPageClient.tsx
│   │   ├── 📂 yacht-finance/
│   │   │   └── ⚛️ page.tsx
│   │   └── 📂 yacht-surveyors/
│   │   │   └── ⚛️ page.tsx
│   ├── 📂 settings/
│   │   ├── 📂 _components/
│   │   │   └── ⚛️ SettingsClient.tsx
│   │   └── ⚛️ page.tsx
│   ├── 📂 shipyards/
│   │   └── ⚛️ page.tsx
│   ├── 📂 signup/
│   │   └── ⚛️ page.tsx
│   ├── 🔷 sitemap.ts
│   ├── 📂 support/
│   │   ├── ⚛️ page.tsx
│   │   └── ⚛️ SupportClient.tsx
│   ├── 📂 terms/
│   │   └── ⚛️ page.tsx
│   ├── 📂 trust/
│   │   └── ⚛️ page.tsx
│   ├── 📂 upgrade/
│   │   └── ⚛️ page.tsx
│   ├── 📂 use-cases/
│   └── 📂 verification/
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
│   ├── ⚛️ GoogleAnalytics.tsx
│   ├── ⚛️ Header.tsx
│   ├── ⚛️ HeaderDropdownClient.tsx
│   ├── 📂 home/
│   │   ├── ⚛️ BoatsForSaleSection.tsx
│   │   ├── ⚛️ GuidesRowSection.tsx
│   │   ├── ⚛️ HomeHero.tsx
│   │   ├── ⚛️ HomeSplitCtas.tsx
│   │   └── ⚛️ ThingsToDo.tsx
│   ├── 📂 kompipay/
│   │   └── ⚛️ CheckoutButton.tsx
│   ├── 📂 listing/
│   │   ├── ⚛️ SaveListingButtonClient.tsx
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
│   │   ├── 📂 20260221080138_add_saved_listings/
│   │   │   └── 📄 migration.sql
│   │   ├── 📂 20260223104736_add_message_read_at/
│   │   │   └── 📄 migration.sql
│   │   ├── 📂 20260223110100_add_message_read_at/
│   │   │   └── 📄 migration.sql
│   │   ├── 📂 20260224090323_add_service_tags/
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
│   ├── 📂 guides/
│   │   ├── 🖼️ lagoon-catamaran.jpg
│   │   ├── 🖼️ motor-yacht.jpg
│   │   ├── 🖼️ swift-trawler.jpg
│   │   └── 🖼️ yacht-types.jpg
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
│   ├── 📂 eyb/
│   │   ├── 🔷 backfill-eyb.ts
│   │   ├── 🔷 debug-one.ts
│   │   └── 🔷 enrich-eyb.ts
│   ├── 📂 findaly/
│   │   ├── 📂 enrich/
│   │   │   ├── 🔷 discover.ts
│   │   │   ├── 🔷 extract.ts
│   │   │   └── 🔷 http.ts
│   │   └── 📂 rating/
│   │   │   ├── 🔷 checklists.ts
│   │   │   └── 🔷 score.ts
│   ├── 📂 fix/
│   │   ├── 🔷 backfill-brand-model-from-title.ts
│   │   └── 🔷 backfill-brand-model.ts
│   └── 🔷 fix-services-kind.ts
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
