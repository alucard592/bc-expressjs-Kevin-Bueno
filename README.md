# Semana 7: Autenticación con JWT - Banco de Sangre API

API REST construida con Express.js, TypeScript, Mongoose y Zod para la gestión de autenticación de usuarios (Access + Refresh Tokens con cookies HttpOnly) y el mantenimiento del registro de donantes del **Banco de Sangre**.

---

## 🚀 Requisitos y Configuración

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar el archivo `.env`:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/banco_sangre_semana7
   JWT_ACCESS_SECRET=semana7_banco_sangre_jwt_access_secret_key_849204829048
   JWT_REFRESH_SECRET=semana7_banco_sangre_jwt_refresh_secret_key_193850193850
   ```

3. Iniciar en modo desarrollo:
   ```bash
   npm run dev
   ```

---

## 📌 Endpoints de la API

### Autenticación (`/api/v1/auth`)

| Método | Ruta | Descripción | Acceso |
| :---: | :--- | :--- | :---: |
| `POST` | `/api/v1/auth/register` | Registro de usuario | Público |
| `POST` | `/api/v1/auth/login` | Inicio de sesión (genera cookies HttpOnly) | Público |
| `GET` | `/api/v1/auth/me` | Obtener perfil del usuario autenticado | Privado (JWT) |
| `POST` | `/api/v1/auth/refresh` | Renovar Access Token con Refresh Token | Privado (Cookie) |
| `POST` | `/api/v1/auth/logout` | Cerrar sesión y limpiar cookies | Privado (Cookie) |

### Recurso Principal: Donantes (`/api/v1/donantes`)

Todas las rutas del recurso **Donantes** requieren autenticación previa mediante JWT token en cookie (`accessToken`).

| Método | Ruta | Descripción | Acceso |
| :---: | :--- | :--- | :---: |
| `GET` | `/api/v1/donantes` | Listar todos los donantes | Autenticado |
| `GET` | `/api/v1/donantes/:id` | Obtener donante por ID | Autenticado |
| `POST` | `/api/v1/donantes` | Registrar nuevo donante (Validación Zod) | Autenticado |
| `PATCH` | `/api/v1/donantes/:id` | Actualización parcial del donante | Autenticado |
| `DELETE` | `/api/v1/donantes/:id` | Eliminar registro de donante | Autenticado |

---

## 🧪 Ejemplo de Payload para Crear Donante (`POST /api/v1/donantes`)

```json
{
  "fullName": "Carlos Mendoza",
  "bloodType": "O+",
  "age": 28,
  "phone": "+57 3001234567",
  "email": "carlos.mendoza@email.com",
  "isEligible": true
}
```
