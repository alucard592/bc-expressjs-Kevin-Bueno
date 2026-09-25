import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test_access_secret_key_semana_8_1234567890';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_key_semana_8_1234567890';

import { app } from '../app';
import { UserModel } from '../models/user.model';
import { DonanteModel } from '../models/donante.model';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await UserModel.deleteMany({});
  await DonanteModel.deleteMany({});
});

describe('Pruebas Integrales Semana 8: RBAC & Capas de Seguridad', () => {
  const normalUser = {
    name: 'Usuario Regular',
    email: 'user@bancodesangre.org',
    password: 'Password123',
  };

  const testDonante = {
    fullName: 'Ana Ramirez',
    bloodType: 'A+',
    age: 32,
    phone: '+57 3201112233',
    email: 'ana.ramirez@email.com',
    isEligible: true,
  };

  it('1. Debe responder correctamente el endpoint de Health Check (GET /api/v1/health)', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });

  it('2. Debe incluir cabeceras de seguridad HTTP inyectables por Helmet', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.headers['x-dns-prefetch-control']).toBe('off');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(res.headers['strict-transport-security']).toBeDefined();
  });

  it('3. Debe permitir crear y consultar donantes a un usuario normal con rol "user"', async () => {
    await request(app).post('/api/v1/auth/register').send(normalUser);
    
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: normalUser.email, password: normalUser.password });
    const userCookies = loginRes.headers['set-cookie'] || [];

    const createRes = await request(app)
      .post('/api/v1/donantes')
      .set('Cookie', userCookies)
      .send(testDonante);

    expect(createRes.status).toBe(201);
    expect(createRes.body.data.fullName).toBe(testDonante.fullName);

    const listRes = await request(app)
      .get('/api/v1/donantes')
      .set('Cookie', userCookies);

    expect(listRes.status).toBe(200);
    expect(listRes.body.data.length).toBe(1);
  });

  it('4. RBAC: Debe BLOQUEAR (403 Forbidden) la eliminación de donantes por un usuario con rol "user"', async () => {
    await request(app).post('/api/v1/auth/register').send(normalUser);
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: normalUser.email, password: normalUser.password });
    const userCookies = loginRes.headers['set-cookie'] || [];

    const createRes = await request(app)
      .post('/api/v1/donantes')
      .set('Cookie', userCookies)
      .send(testDonante);
    const donanteId = createRes.body.data._id;

    // Intentar eliminar siendo rol 'user' -> Debe retornar 403 Access Denied
    const deleteRes = await request(app)
      .delete(`/api/v1/donantes/${donanteId}`)
      .set('Cookie', userCookies);

    expect(deleteRes.status).toBe(403);
    expect(deleteRes.body.error).toContain('Access denied');
  });

  it('5. RBAC: Debe PERMITIR (204 No Content) la eliminación de donantes por un usuario con rol "admin"', async () => {
    // 1. Registrar y crear donante con usuario normal
    await request(app).post('/api/v1/auth/register').send(normalUser);
    const userLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: normalUser.email, password: normalUser.password });
    const userCookies = userLogin.headers['set-cookie'] || [];

    const createRes = await request(app)
      .post('/api/v1/donantes')
      .set('Cookie', userCookies)
      .send(testDonante);
    const donanteId = createRes.body.data._id;

    // 2. Registrar usuario Admin con contraseña
    const adminAccount = {
      name: 'Administrador Banco de Sangre',
      email: 'admin@bancodesangre.org',
      password: 'AdminPassword123',
    };

    const adminReg = await request(app)
      .post('/api/v1/auth/register')
      .send(adminAccount);
    
    // Promocionar a rol 'admin' en la BD
    await UserModel.findByIdAndUpdate(adminReg.body.id, { role: 'admin' });

    // Login del usuario Admin
    const adminLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: adminAccount.email, password: adminAccount.password });

    const adminCookies = adminLogin.headers['set-cookie'] || [];

    // 3. Admin elimina donante -> 204 No Content
    const deleteRes = await request(app)
      .delete(`/api/v1/donantes/${donanteId}`)
      .set('Cookie', adminCookies);

    expect(deleteRes.status).toBe(204);

    // 4. Verificar que fue eliminado de la BD
    const getRes = await request(app)
      .get(`/api/v1/donantes/${donanteId}`)
      .set('Cookie', userCookies);

    expect(getRes.status).toBe(404);
  });
});
