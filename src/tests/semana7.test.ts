import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test_access_secret_key_semana_7_1234567890';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_key_semana_7_1234567890';

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

describe('Pruebas Integrales Semana 7: Autenticación JWT & Donantes', () => {
  const testUser = {
    name: 'Carlos Donante',
    email: 'carlos@bancodesangre.org',
    password: 'Password123',
  };

  const testDonante = {
    fullName: 'Maria Gomez',
    bloodType: 'O+',
    age: 29,
    phone: '+57 3119876543',
    email: 'maria.gomez@email.com',
    isEligible: true,
  };

  it('1. Debe registrar un nuevo usuario exitosamente (POST /api/v1/auth/register)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(testUser.email.toLowerCase());
    expect(res.body.name).toBe(testUser.name);
    expect(res.body.password).toBeUndefined(); // no expone password
  });

  it('2. Debe iniciar sesión y establecer cookies HttpOnly (POST /api/v1/auth/login)', async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Login exitoso');
    expect(res.headers['set-cookie']).toBeDefined();
    
    const cookies = res.headers['set-cookie'].join(';');
    expect(cookies).toContain('accessToken');
    expect(cookies).toContain('refreshToken');
  });

  it('3. Debe denegar el acceso al perfil sin autenticación (GET /api/v1/auth/me)', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });

  it('4. Debe obtener el perfil del usuario autenticado vía cookie (GET /api/v1/auth/me)', async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    const cookies = loginRes.headers['set-cookie'];

    const meRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Cookie', cookies);

    expect(meRes.status).toBe(200);
    expect(meRes.body.email).toBe(testUser.email.toLowerCase());
    expect(meRes.body.name).toBe(testUser.name);
  });

  it('5. Debe rechazar la creación de donante sin autenticación (POST /api/v1/donantes)', async () => {
    const res = await request(app)
      .post('/api/v1/donantes')
      .send(testDonante);

    expect(res.status).toBe(401);
  });

  it('6. Debe crear un donante autenticado (POST /api/v1/donantes)', async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    const cookies = loginRes.headers['set-cookie'];

    const res = await request(app)
      .post('/api/v1/donantes')
      .set('Cookie', cookies)
      .send(testDonante);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.fullName).toBe(testDonante.fullName);
    expect(res.body.data.bloodType).toBe('O+');
    expect(res.body.data.createdBy).toBeDefined();
  });

  it('7. Debe listar donantes y consultar por ID (GET /api/v1/donantes & GET /api/v1/donantes/:id)', async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    const cookies = loginRes.headers['set-cookie'];

    const createRes = await request(app)
      .post('/api/v1/donantes')
      .set('Cookie', cookies)
      .send(testDonante);

    const createdId = createRes.body.data._id;

    // Listar todos
    const listRes = await request(app)
      .get('/api/v1/donantes')
      .set('Cookie', cookies);

    expect(listRes.status).toBe(200);
    expect(listRes.body.data.length).toBe(1);

    // Obtener por ID
    const getByIdRes = await request(app)
      .get(`/api/v1/donantes/${createdId}`)
      .set('Cookie', cookies);

    expect(getByIdRes.status).toBe(200);
    expect(getByIdRes.body.data.fullName).toBe(testDonante.fullName);
  });

  it('8. Debe actualizar parcialmente un donante (PATCH /api/v1/donantes/:id)', async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    const cookies = loginRes.headers['set-cookie'];

    const createRes = await request(app)
      .post('/api/v1/donantes')
      .set('Cookie', cookies)
      .send(testDonante);

    const createdId = createRes.body.data._id;

    const patchRes = await request(app)
      .patch(`/api/v1/donantes/${createdId}`)
      .set('Cookie', cookies)
      .send({ isEligible: false, phone: '+57 3000000000' });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.data.isEligible).toBe(false);
    expect(patchRes.body.data.phone).toBe('+57 3000000000');
  });

  it('9. Debe eliminar un donante (DELETE /api/v1/donantes/:id)', async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    const cookies = loginRes.headers['set-cookie'];

    const createRes = await request(app)
      .post('/api/v1/donantes')
      .set('Cookie', cookies)
      .send(testDonante);

    const createdId = createRes.body.data._id;

    const delRes = await request(app)
      .delete(`/api/v1/donantes/${createdId}`)
      .set('Cookie', cookies);

    expect(delRes.status).toBe(204);

    const getRes = await request(app)
      .get(`/api/v1/donantes/${createdId}`)
      .set('Cookie', cookies);

    expect(getRes.status).toBe(404);
  });
});
