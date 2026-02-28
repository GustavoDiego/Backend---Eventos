import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('API (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    it('POST /api/auth/login — deve retornar token com credenciais válidas', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'admin@eventos.com', password: 'senha123' })
        .expect(200);

      expect(res.body.data).toHaveProperty('token');
      token = res.body.data.token;
    });

    it('POST /api/auth/login — deve retornar 401 com credenciais inválidas', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'admin@eventos.com', password: 'errada' })
        .expect(401);
    });

    it('GET /api/auth/profile — deve retornar perfil com token válido', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.data).toHaveProperty('email', 'admin@eventos.com');
    });
  });

  describe('Eventos', () => {
    it('GET /api/eventos — deve listar eventos autenticado', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/eventos')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.data).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('meta');
    });

    it('GET /api/eventos — deve rejeitar sem token', async () => {
      await request(app.getHttpServer()).get('/api/eventos').expect(401);
    });
  });

  describe('Dashboard', () => {
    it('GET /api/dashboard — deve retornar resumo', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.data).toHaveProperty('totalEventos');
      expect(res.body.data).toHaveProperty('totalParticipantes');
    });
  });
});
