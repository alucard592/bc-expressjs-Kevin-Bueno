# Semana 8: Autorización RBAC y Seguridad - Banco de Sangre API

API REST profesional y segura construida con Express.js, TypeScript, Mongoose, Zod y control de acceso basado en roles (RBAC), incluyendo múltiples capas de seguridad de producción.

---

## 🔒 Capas de Seguridad Implementadas

1. **RBAC (Role-Based Access Control)**:
   - Control de acceso mediante roles (`user`, `admin`).
   - Middleware `requireRole('admin')` para endpoints sensibles (como eliminar registros de donantes).

2. **Protección de Cabeceras HTTP (Helmet)**:
   - Configuración de cabeceras HTTP seguras para prevenir ataques XSS, Clickjacking, MIME-sniffing, etc.

3. **CORS (Cross-Origin Resource Sharing)**:
   - Restricción de orígenes permitidos con soporte para credenciales (`cookies HttpOnly`).

4. **Rate Limiting (Protección Anti-DDoS y Fuerza Bruta)**:
   - `globalLimiter`: 100 peticiones / 15 min en todas las rutas.
   - `authLimiter`: 5 intentos / 15 min en rutas de autenticación (`/register`, `/login`).

5. **Sanitización NoSQL (OWASP Injection Protection)**:
   - Middleware `express-mongo-sanitize` para eliminar inyecciones de operadores de MongoDB (`$gt`, `$where`, etc.).

---

## 📌 Endpoints de la API

### Health Check

| Método | Ruta | Descripción | Acceso |
| :---: | :--- | :--- | :---: |
| `GET` | `/api/v1/health` | Estado del servicio y timestamp | Público |

### Autenticación (`/api/v1/auth`)

| Método | Ruta | Descripción | Acceso / Rate Limit |
| :---: | :--- | :--- | :---: |
| `POST` | `/api/v1/auth/register` | Registro de usuario (Rol `user` por defecto) | Público (5 req / 15m) |
| `POST` | `/api/v1/auth/login` | Inicio de sesión | Público (5 req / 15m) |
| `GET` | `/api/v1/auth/me` | Obtener perfil actual | Autenticado |
| `POST` | `/api/v1/auth/refresh` | Renovar Access Token con Refresh Token | Cookie |
| `POST` | `/api/v1/auth/logout` | Cerrar sesión e invalidar tokens | Autenticado |

### Recurso Principal: Donantes (`/api/v1/donantes`)

| Método | Ruta | Descripción | Roles Permitidos |
| :---: | :--- | :--- | :---: |
| `GET` | `/api/v1/donantes` | Obtener listado de donantes | `user`, `admin` |
| `GET` | `/api/v1/donantes/:id` | Obtener donante por ID | `user`, `admin` |
| `POST` | `/api/v1/donantes` | Registrar nuevo donante | `user`, `admin` |
| `PATCH` | `/api/v1/donantes/:id` | Actualización parcial del donante | `user`, `admin` |
| `DELETE` | `/api/v1/donantes/:id` | Eliminar registro de donante | **Solo `admin`** |

---

## 🧪 Variables de Entorno (`.env`)

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/banco_sangre_semana8
JWT_ACCESS_SECRET=semana8_banco_sangre_jwt_access_secret_key_928374928374
JWT_REFRESH_SECRET=semana8_banco_sangre_jwt_refresh_secret_key_192837192837
```
