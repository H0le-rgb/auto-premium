# Auto Premium websites

The original Garage showcase remains at the repository root. The monorepo also provides an independent garage/ app and one independent Vite app per business under sites/. Each workspace has its own entry point, data, local CSS, Vite configuration, build output, SEO metadata, favicon, and Netlify configuration.

## Build and run

Run an app from the repository root with npm workspace commands:

```sh
npm run dev --workspace=@auto-premium/mobishin22
npm run build --workspace=@auto-premium/mobishin22
npm run dev --workspace=@auto-premium/garage
npm run build --workspace=@auto-premium/garage
npm run build:all-sites
npm run verify:sites
```

Replace mobishin22 with any workspace below. Each build writes only to its own dist/. The root npm run build continues to build the legacy showcase independently.

## Independent Netlify deployment

Create one Netlify site per workspace. Choose the detected app folder, or set Package directory to sites/mobishin22 and leave Base directory unset so npm runs from the repository root. Netlify then reads that package's netlify.toml, runs only its workspace build, and publishes sites/mobishin22/dist. Use package directory garage for Garage. After deploy, add the owned domain in that site's Domain management. Demo apps ship with noindex, nofollow in HTML and response headers; remove those only after the owner approves publication.

## Sites

- sites/mobishin22 - Мобишин22
- sites/shinny-servis - Шинный сервис
- sites/park-koles - Парк Колес
- sites/mikano - Микано
- sites/k22powerteam - K22PowerTeam
- sites/kardannye-valy - Отдел ремонта карданных валов
- sites/detailing - Детейлинг-центр
- sites/genstart - ГенСтарт
- sites/jg - JG
- sites/avtoelektrik - Автоэлектрик
- sites/racetech - Raceтех
- sites/ekogorod - ЭкоГород
- sites/u-dorogi - У дороги
- sites/shinomontazh-1 - Шиномонтажная мастерская
- sites/altai-shinka - Алтай шинка
- sites/lemaks - Лемакс
- sites/shinomontazh-2 - Шиномонтажная мастерская №2
- sites/remont-avto22 - Ремонт Авто22
- sites/shinomontazh-3 - Шиномонтажная мастерская №3
- sites/shinomontazh-4 - Шиномонтажная мастерская №4
- sites/avtoservis - Автосервис
- sites/shinomontazh-sto - Шиномонтажная мастерская и СТО
- sites/sibirskiy-krokodil - Сибирский крокодил
- sites/avtomagnat - Автомагнат
- sites/shinomontazh-5 - Шиномонтажная мастерская №5
- sites/gruzovaya-avtomoyka - Грузовая автомойка и грузовой/легковой шиномонтаж
- sites/shinomontazh-6 - Шиномонтажная мастерская №6
