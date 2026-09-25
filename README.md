# 🩸 Banco de Sangre API REST - Express.js & TypeScript

Bienvenido al repositorio del proyecto para el **Banco de Sangre**. Este repositorio está organizado de forma independiente por ramas para evaluar cada entrega del Bootcamp.

---

## 📂 Estructura de Ramas Independientes

| Rama | Contenido y Entrega | Comando para cambiar |
| :--- | :--- | :--- |
| **`main`** | **Portada y Documentación General** | `git checkout main` |
| **`semana-7`** | **Autenticación JWT, Cookies HttpOnly & CRUD de Donantes** | `git checkout semana-7` |
| **`semana-8`** | **Autorización RBAC (User vs Admin) & Capas de Seguridad (Helmet, CORS, Rate Limit, MongoSanitize)** | `git checkout semana-8` |

---

## 🛠️ Requisitos Previos e Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DE_TU_REPOSITORIO>
   cd bc-expressjs
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno (`.env`):**
   Crea un archivo `.env` en la raíz con:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/banco_sangre
   JWT_ACCESS_SECRET=clave_secreta_para_access_tokens_123
   JWT_REFRESH_SECRET=clave_secreta_para_refresh_tokens_456
   ```
   *(Nota: Si no tienes MongoDB local encendido, el servidor levantará automáticamente una base de datos MongoDB en memoria para pruebas de desarrollo).*

---

## 🚀 Cómo ejecutar el proyecto

Para iniciar el servidor en modo desarrollo con recarga automática:

```bash
npm run dev
```

Una vez iniciado, abre tu navegador en:
👉 **`http://localhost:3000/`**

Allí encontrarás un **Dashboard Interactivo Web** con botones para:
- Registrar usuarios e Iniciar Sesión con cookies `HttpOnly`.
- Cambiar de rol entre **`USER`** y **`ADMIN`** en tiempo real.
- Crear, listar y eliminar donantes del Banco de Sangre.

---

## 🧪 Ejecución de Pruebas Integrales Automatizadas (Vitest)

Cada semana cuenta con su propia suite de pruebas aislada que se ejecuta mediante:

### Pruebas de la Semana 7:
```bash
git checkout semana-7
npx vitest run
```
*(Verifica 9/9 pruebas: Registro, Login con cookies, `/auth/me` y CRUD completo de donantes).*

### Pruebas de la Semana 8:
```bash
git checkout semana-8
npx vitest run
```
*(Verifica 5/5 pruebas: Health Check, Helmet Headers, y control RBAC impidiendo DELETE a rol `user` [403] y permitiéndolo a rol `admin` [204]).*

---

## 📌 Documentación de Endpoints REST

### Health Check
| Método | Ruta | Descripción | Acceso |
| :---: | :--- | :--- | :---: |
| `GET` | `/api/v1/health` | Estado del servidor y timestamp | Público |

### Autenticación (`/api/v1/auth`)
| Método | Ruta | Descripción | Acceso |
| :---: | :--- | :--- | :---: |
| `POST` | `/api/v1/auth/register` | Registro de usuario | Público |
| `POST` | `/api/v1/auth/login` | Inicio de sesión (emite cookies `HttpOnly`) | Público |
| `GET` | `/api/v1/auth/me` | Obtener datos del perfil actual | Autenticado |
| `POST` | `/api/v1/auth/toggle-role` | Cambiar rol entre `user` y `admin` (Entorno pruebas) | Autenticado |
| `POST` | `/api/v1/auth/refresh` | Renovar Access Token con Refresh Token | Cookie |
| `POST` | `/api/v1/auth/logout` | Cerrar sesión e invalidar cookies | Autenticado |

### Recurso Principal: Donantes (`/api/v1/donantes`)
| Método | Ruta | Descripción | Rol Requerido |
| :---: | :--- | :--- | :---: |
| `GET` | `/api/v1/donantes` | Listar donantes | `user` / `admin` |
| `GET` | `/api/v1/donantes/:id` | Obtener donante por ID | `user` / `admin` |
| `POST` | `/api/v1/donantes` | Crear donante | `user` / `admin` |
| `PATCH` | `/api/v1/donantes/:id` | Actualización parcial del donante | `user` / `admin` |
| `DELETE` | `/api/v1/donantes/:id` | Eliminar registro de donante | **Solo `admin`** |

---

## 🔒 Capas de Seguridad Implementadas (Semana 8)

1. **Control de Acceso Basado en Roles (RBAC)**: Bloqueo **403 Forbidden** a usuarios no autorizados en endpoints destructivos.
2. **Helmet**: Protección de cabeceras HTTP contra ataques XSS, Clickjacking y MIME-sniffing.
3. **CORS**: Control estricto de origen con envío seguro de credenciales (`credentials: true`).
4. **Rate Limiting**: Control de frecuencia contra ataques de fuerza bruta y DDoS.
5. **Sanitización NoSQL**: Prevención de inyección NoSQL (`express-mongo-sanitize`).
