# 🍎 Web Apple Office

Monorepo del sistema **Apple Office** — simulador de ventas y panel de administración con galería de imágenes.

## Estructura del proyecto

```
web-apple-office/
├── apple-office-api/     # Backend — API REST con Node.js, Express, Prisma y MySQL
└── apple-office-sim/     # Frontend — Landing page + simulador (React + Vite + TailwindCSS)
```

---

## 🚀 apple-office-api (Backend)

### Requisitos
- Node.js 18+
- MySQL

### Setup
```bash
cd apple-office-api
npm install
cp .env.example .env   # Completar con tus credenciales de DB
npx prisma migrate dev
node seed.js
npm run dev
```

---

## 🎨 apple-office-sim (Frontend)

### Requisitos
- Node.js 18+

### Setup
```bash
cd apple-office-sim
npm install
npm run dev
```

---

## Tecnologías

| Capa | Stack |
|------|-------|
| Frontend | React, Vite, TypeScript, TailwindCSS |
| Backend | Node.js, Express, TypeScript, Prisma ORM |
| Base de datos | MySQL |

---

Desarrollado por **APX Software** 🚀
