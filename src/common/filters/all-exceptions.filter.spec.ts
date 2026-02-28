import { HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';

// ─── Mock de ArgumentsHost ───────────────────────────────────
const mockJson = jest.fn();
const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
const mockGetResponse = jest.fn().mockReturnValue({ status: mockStatus });
const mockGetRequest = jest.fn().mockReturnValue({ url: '/api/test' });
const mockSwitchToHttp = jest.fn().mockReturnValue({
  getResponse: mockGetResponse,
  getRequest: mockGetRequest,
});

const mockHost = {
  switchToHttp: mockSwitchToHttp,
} as unknown as ArgumentsHost;

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;

  beforeEach(() => {
    jest.clearAllMocks();
    filter = new AllExceptionsFilter();
  });

  it('deve estar definido', () => {
    expect(filter).toBeDefined();
  });

  describe('Exceções HttpException', () => {
    it('deve retornar statusCode correto para HttpException com resposta string', () => {
      const exception = new HttpException('Não encontrado', HttpStatus.NOT_FOUND);

      filter.catch(exception, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Não encontrado',
        }),
      );
    });

    it('deve extrair code e message de resposta objeto com campos customizados', () => {
      const exception = new HttpException(
        { message: 'Evento não existe', code: 'EVENT_NOT_FOUND', details: { id: 'x' } },
        HttpStatus.NOT_FOUND,
      );

      filter.catch(exception, mockHost);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.NOT_FOUND,
          code: 'EVENT_NOT_FOUND',
          message: 'Evento não existe',
          details: { id: 'x' },
        }),
      );
    });

    it('deve usar code padrão do status quando code not provided', () => {
      const exception = new HttpException(
        { message: 'Inválido' },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'BAD_REQUEST',
        }),
      );
    });

    it('deve tratar mensagem de array (class-validator) como erro de validação', () => {
      const validationMessages = ['nome não deve estar vazio', 'email deve ser e-mail válido'];
      const exception = new HttpException(
        { message: validationMessages, statusCode: 400 },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Erro de validação',
          details: validationMessages,
        }),
      );
    });

    it('deve mapear status 401 para code UNAUTHORIZED', () => {
      // Quando resposta é objeto sem code explícito, getCodeFromStatus é usado
      const exception = new HttpException({ message: 'Não autorizado' }, HttpStatus.UNAUTHORIZED);

      filter.catch(exception, mockHost);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({ code: 'UNAUTHORIZED' }),
      );
    });

    it('deve mapear status 403 para code FORBIDDEN', () => {
      const exception = new HttpException({ message: 'Proibido' }, HttpStatus.FORBIDDEN);

      filter.catch(exception, mockHost);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({ code: 'FORBIDDEN' }),
      );
    });

    it('deve mapear status 409 para code CONFLICT', () => {
      const exception = new HttpException({ message: 'Conflito' }, HttpStatus.CONFLICT);

      filter.catch(exception, mockHost);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({ code: 'CONFLICT' }),
      );
    });

    it('deve mapear status 429 para code TOO_MANY_REQUESTS', () => {
      const exception = new HttpException({ message: 'Limite excedido' }, HttpStatus.TOO_MANY_REQUESTS);

      filter.catch(exception, mockHost);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({ code: 'TOO_MANY_REQUESTS' }),
      );
    });
  });

  describe('Exceções genéricas (Error)', () => {
    it('deve retornar status 500 para Error genérico', () => {
      const exception = new Error('Conexão perdida');

      filter.catch(exception, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Conexão perdida',
          code: 'INTERNAL_ERROR',
        }),
      );
    });

    it('deve retornar status 500 para exceção desconhecida (non-Error)', () => {
      filter.catch('algo inesperado', mockHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          code: 'INTERNAL_ERROR',
        }),
      );
    });
  });

  describe('Formato da resposta', () => {
    it('deve incluir timestamp no formato ISO', () => {
      const exception = new HttpException('Ok', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockHost);

      const responsePayload = mockJson.mock.calls[0][0] as Record<string, unknown>;
      expect(typeof responsePayload.timestamp).toBe('string');
      expect(new Date(responsePayload.timestamp as string).toISOString()).toBe(
        responsePayload.timestamp,
      );
    });

    it('deve incluir path da requisição', () => {
      const exception = new HttpException('Erro', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockHost);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({ path: '/api/test' }),
      );
    });

    it('não deve incluir campo details quando não há detalhes', () => {
      const exception = new HttpException('Erro simples', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockHost);

      const payload = mockJson.mock.calls[0][0] as Record<string, unknown>;
      expect(payload.details).toBeUndefined();
    });
  });
});
