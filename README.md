# Hana Beauty — корей косметикасының интернет-дүкені

Next.js 16 (App Router) + SQLite (`node:sqlite`). Сыртқы базаны орнату қажет емес, бәрі `data/` бумасында сақталады.

## Талаптар

- Node.js **22.5+** (ұсынылады: 24 немесе 26) — `node:sqlite` модулі үшін.

## Іске қосу

```bash
npm install
cp .env.example .env.local   # ADMIN_PASSWORD және SESSION_SECRET мәндерін толтырыңыз
npm run dev                  # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

## Админ-панель

- Мекенжайы: `/admin`
- Құпиясөз `ADMIN_PASSWORD` айнымалысынан алынады. Production режимінде ол берілмесе, кіру мүлдем өшірулі болады.
- Бөлімдер: шолу, тауарлар (қосу/өңдеу, фото жүктеу), санаттар, тапсырыстар, көтерме өтінімдері.

## Деректер

- `data/store.db` — SQLite базасы (тауарлар, санаттар, тапсырыстар, өтінімдер).
- `data/uploads/` — жүктелген фотолар, `/media/<файл>` арқылы беріледі.
- Сервер қайта іске қосылғанда да сақталуы үшін `data/` бумасы тұрақты дискіде болуы керек (`DATA_DIR` арқылы басқа жолды көрсетуге болады).
- Бірінші іске қосылғанда демо-тауарлар қосылады. Мұны өшіру үшін `SEED=false` қойыңыз.

## Хостинг туралы

- Тұрақты диск және ұзақ жұмыс істейтін Node процесі қажет (VPS, Docker, Railway, Render т.б.). Serverless (Vercel) SQLite файлын сақтамайды.
- Сайт HTTPS-сіз ашылса, `COOKIE_SECURE=false` қойыңыз, әйтпесе админ-сессия cookie-і жұмыс істемейді.
- Байланыс деректері (телефон, WhatsApp, Instagram) `.env` арқылы өзгереді: `STORE_PHONE`, `STORE_WHATSAPP`, `STORE_INSTAGRAM`, `STORE_EMAIL`.
