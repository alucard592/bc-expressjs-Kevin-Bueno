# Bootcamp Express.js & MongoDB - Banco de Sangre API

Bienvenido al repositorio del proyecto final del Bootcamp Express.js. Este repositorio contiene el desarrollo completo de la API REST para el **Banco de Sangre**, estructurado en ramas independientes por cada semana de aprendizaje.

---

## 📂 Estructura de Ramas

El proyecto está organizado según el flujo de trabajo del bootcamp:

| Rama | Tema principal | Descripción |
| :--- | :--- | :--- |
| [`main`](https://github.com/tu-usuario/bc-expressjs) | Documentación Principal | Portada e índice general del proyecto. |
| `semana-7` | Autenticación JWT | Implementación de Registro/Login, Access & Refresh Tokens con Cookies HttpOnly y CRUD de Donantes. |
| `semana-8` | RBAC & Seguridad | Control de acceso basado en roles (`user`, `admin`), Helmet, CORS, Rate Limiting y Sanitización NoSQL. |

---

## 💉 Dominio Asignado: Banco de Sangre

- **Recurso Principal**: Donantes (`donantes`)
- **Propiedades del Recurso**:
  - `fullName` (string): Nombre completo del donante.
  - `bloodType` (string): Tipo de sangre (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`).
  - `age` (number): Edad del donante (mínimo 18 años).
  - `phone` (string): Teléfono de contacto.
  - `email` (string): Correo electrónico del donante.
  - `lastDonationDate` (date): Fecha de la última donación.
  - `isEligible` (boolean): Estado de elegibilidad para donar.
  - `createdBy` (ObjectId): ID del usuario que registró al donante.

---

## 🛠️ Tecnologías Utilizadas

- **Node.js** & **Express.js** (v5)
- **TypeScript** (Modo estricto)
- **MongoDB** & **Mongoose**
- **Zod** (Validación de esquemas DTO)
- **JWT (JsonWebToken)** & **bcrypt**
- **Helmet**, **CORS**, **express-rate-limit**, **express-mongo-sanitize**

---

## 🚀 Cómo ejecutar cualquier rama localmente

1. Cambiar a la rama deseada:
   ```bash
   git checkout semana-7  # o git checkout semana-8
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno (`.env`):
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/banco_sangre
   JWT_ACCESS_SECRET=tu_secret_access_key
   JWT_REFRESH_SECRET=tu_secret_refresh_key
   ```

4. Iniciar en modo desarrollo:
   ```bash
   npm run dev
   ```
