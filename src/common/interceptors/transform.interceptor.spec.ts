import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { TransformInterceptor } from './transform.interceptor';

// ─── Mock de ExecutionContext ─────────────────────────────────
const makeContext = (statusCode = 200): ExecutionContext =>
  ({
    switchToHttp: jest.fn().mockReturnValue({
      getResponse: jest.fn().mockReturnValue({ statusCode }),
    }),
  } as unknown as ExecutionContext);

// ─── Mock de CallHandler ─────────────────────────────────────
const makeHandler = (data: unknown): CallHandler => ({
  handle: jest.fn().mockReturnValue(of(data)),
});

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<unknown>;

  beforeEach(() => {
    interceptor = new TransformInterceptor();
  });

  it('deve estar definido', () => {
    expect(interceptor).toBeDefined();
  });

  it('deve envolver o dado no campo data', (done) => {
    const context = makeContext(200);
    const handler = makeHandler({ id: '1', nome: 'Teste' });

    interceptor.intercept(context, handler).subscribe((result) => {
      expect(result.data).toEqual({ id: '1', nome: 'Teste' });
      done();
    });
  });

  it('deve incluir statusCode correto da resposta HTTP', (done) => {
    const context = makeContext(201);
    const handler = makeHandler({});

    interceptor.intercept(context, handler).subscribe((result) => {
      expect(result.statusCode).toBe(201);
      done();
    });
  });

  it('deve incluir timestamp no formato ISO', (done) => {
    const context = makeContext(200);
    const handler = makeHandler({});

    interceptor.intercept(context, handler).subscribe((result) => {
      expect(typeof result.timestamp).toBe('string');
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
      done();
    });
  });

  it('deve usar statusCode 200 para GET padrão', (done) => {
    const context = makeContext(200);
    const handler = makeHandler([{ id: '1' }, { id: '2' }]);

    interceptor.intercept(context, handler).subscribe((result) => {
      expect(result.statusCode).toBe(200);
      expect(result.data).toHaveLength(2);
      done();
    });
  });

  it('deve funcionar com data sendo null', (done) => {
    const context = makeContext(200);
    const handler = makeHandler(null);

    interceptor.intercept(context, handler).subscribe((result) => {
      expect(result.data).toBeNull();
      done();
    });
  });

  it('deve funcionar com data sendo array vazio', (done) => {
    const context = makeContext(200);
    const handler = makeHandler([]);

    interceptor.intercept(context, handler).subscribe((result) => {
      expect(result.data).toEqual([]);
      done();
    });
  });

  it('deve retornar formato { statusCode, data, timestamp }', (done) => {
    const context = makeContext(200);
    const handler = makeHandler({ nome: 'Expo' });

    interceptor.intercept(context, handler).subscribe((result) => {
      const keys = Object.keys(result);
      expect(keys).toContain('statusCode');
      expect(keys).toContain('data');
      expect(keys).toContain('timestamp');
      done();
    });
  });
});
