import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';

import authRouter from './routes/auth.routes';
import donanteRouter from './routes/donante.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { globalLimiter, corsOptions } from './config/security';

export const app = express();

// Security layers — order matters
app.use(helmet({ contentSecurityPolicy: false }));
app.use(globalLimiter);
app.use(cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sanitize inputs AFTER parsing, BEFORE routes (OWASP Injection Protection compatible with Express 5)
app.use((req, _res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  next();
});

// Interfaz interactiva de prueba en el navegador (GET /)
app.get('/', (_req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Banco de Sangre - API Interactive Panel</title>
  <style>
    :root { --primary: #d90429; --dark: #1d3557; --light: #f8f9fa; --border: #e0e0e0; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #edf2f4; color: #2b2d42; margin: 0; padding: 24px; }
    .container { max-width: 920px; margin: 0 auto; background: #ffffff; padding: 28px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    h1 { color: var(--primary); font-size: 1.8rem; margin-top: 0; display: flex; align-items: center; gap: 10px; }
    .badge { font-size: 0.8rem; background: var(--dark); color: #fff; padding: 4px 10px; border-radius: 6px; font-weight: 600; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
    @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
    .card { border: 1px solid var(--border); border-radius: 8px; padding: 18px; background: #fafafa; }
    .card h2 { font-size: 1.1rem; margin-top: 0; color: var(--dark); border-bottom: 2px solid var(--primary); padding-bottom: 6px; }
    label { display: block; font-size: 0.85rem; font-weight: 600; margin: 10px 0 4px; }
    input, select { width: 100%; padding: 8px 12px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 6px; font-size: 0.9rem; }
    button { margin-top: 12px; width: 100%; background: var(--primary); color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
    button:hover { background: #b8001f; }
    button.sec { background: var(--dark); }
    button.sec:hover { background: #14213d; }
    pre { background: #1e1e1e; color: #4ec9b0; padding: 14px; border-radius: 6px; overflow-x: auto; font-size: 0.85rem; max-height: 250px; }
    .donante-item { background: white; border: 1px solid #ddd; padding: 12px; border-radius: 6px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
    .btn-sm { padding: 6px 12px; font-size: 0.75rem; width: auto; margin: 0; background: #d90429; }
    .status-box { padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; margin-bottom: 12px; display: none; }
    .status-box.active { display: block; background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🩸 Banco de Sangre <span class="badge">API Dashboard v1</span></h1>
    <p>Interfaz interactiva web para enviar peticiones a los endpoints REST de Autenticación y Donantes.</p>

    <div id="sessionStatus" class="status-box"></div>

    <div class="grid">
      <div class="card">
        <h2>1. Autenticación (JWT)</h2>
        <form onsubmit="return false;">
          <label>Nombre:</label>
          <input type="text" id="authName" value="Kevin Admin">
          <label>Correo Electrónico:</label>
          <input type="email" id="authEmail" value="kevin@bancodesangre.org">
          <label>Contraseña:</label>
          <input type="password" id="authPassword" value="Password123">
          
          <div style="display: flex; gap: 8px;">
            <button type="button" onclick="registerUser()">Registrar</button>
            <button type="button" class="sec" onclick="loginUser()">Iniciar Sesión</button>
          </div>
          <button type="button" class="sec" style="background:#4a5568;" onclick="getMe()">Ver Perfil (/auth/me)</button>
        </form>
      </div>

      <div class="card">
        <h2>2. Registrar Donante</h2>
        <form onsubmit="return false;">
          <label>Nombre Completo:</label>
          <input type="text" id="dName" value="Ana María López">
          <label>Tipo de Sangre:</label>
          <select id="dType">
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
          <label>Edad:</label>
          <input type="number" id="dAge" value="29">
          <label>Teléfono:</label>
          <input type="text" id="dPhone" value="+57 3001234567">
          <label>Email:</label>
          <input type="email" id="dEmail" value="ana.lopez@email.com">
          
          <button type="button" onclick="createDonante()">Guardar Donante</button>
          <button type="button" class="sec" onclick="listDonantes()">Listar Donantes</button>
        </form>
      </div>
    </div>

    <div style="margin-top: 24px;">
      <h2>Respuesta JSON del Servidor</h2>
      <pre id="output">Haz clic en cualquier botón de acción para enviar una petición a la API...</pre>
    </div>

    <div style="margin-top: 24px;">
      <h2>Donantes en Base de Datos</h2>
      <div id="donantesList">Presiona "Listar Donantes" para visualizar los registros.</div>
    </div>
  </div>

  <script>
    const log = (data) => document.getElementById('output').textContent = JSON.stringify(data, null, 2);

    function showSession(email) {
      const box = document.getElementById('sessionStatus');
      box.className = 'status-box active';
      box.textContent = '🔓 Sesión Activa (Cookie HttpOnly): ' + email;
    }

    async function registerUser() {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          name: document.getElementById('authName').value,
          email: document.getElementById('authEmail').value,
          password: document.getElementById('authPassword').value
        })
      });
      const data = await res.json();
      log(data);
      if (res.ok) {
        // Auto iniciar sesión tras registrarse exitosamente
        await loginUser();
      }
    }

    async function loginUser() {
      const email = document.getElementById('authEmail').value;
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          email: email,
          password: document.getElementById('authPassword').value
        })
      });
      const data = await res.json();
      log(data);
      if (res.ok) {
        showSession(email);
        listDonantes();
      }
    }

    async function getMe() {
      const res = await fetch('/api/v1/auth/me', { credentials: 'same-origin' });
      const data = await res.json();
      log(data);
      if (res.ok && data.email) {
        showSession(data.email);
      }
    }

    async function createDonante() {
      const res = await fetch('/api/v1/donantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          fullName: document.getElementById('dName').value,
          bloodType: document.getElementById('dType').value,
          age: Number(document.getElementById('dAge').value),
          phone: document.getElementById('dPhone').value,
          email: document.getElementById('dEmail').value,
          isEligible: true
        })
      });
      const data = await res.json();
      log(data);
      if (res.ok) listDonantes();
    }

    async function listDonantes() {
      const res = await fetch('/api/v1/donantes', { credentials: 'same-origin' });
      const data = await res.json();
      log(data);
      const container = document.getElementById('donantesList');
      if (data.data && Array.isArray(data.data)) {
        if (data.data.length === 0) {
          container.innerHTML = '<p style="color:#777;">No hay donantes registrados aún.</p>';
          return;
        }
        container.innerHTML = data.data.map(d => \`
          <div class="donante-item">
            <div>
              <strong>\${d.fullName}</strong> (\${d.bloodType}) - \${d.age} años<br>
              <small>\${d.email} | \${d.phone}</small>
            </div>
            <div>
              <button class="btn-sm" onclick="deleteDonante('\${d._id}')">Eliminar</button>
            </div>
          </div>
        \`).join('');
      }
    }

    async function deleteDonante(id) {
      const res = await fetch('/api/v1/donantes/' + id, {
        method: 'DELETE',
        credentials: 'same-origin'
      });
      if (res.status === 204) {
        log({ message: 'Donante eliminado con éxito (204 No Content)' });
      } else {
        log(await res.json());
      }
      listDonantes();
    }
  </script>
</body>
</html>
  `);
});

// Health check endpoint
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas de autenticación
app.use('/api/v1/auth', authRouter);

// Rutas del recurso principal: Donantes (Banco de Sangre)
app.use('/api/v1/donantes', donanteRouter);

// Middlewares de errores (siempre al final)
app.use(notFound);
app.use(errorHandler);
