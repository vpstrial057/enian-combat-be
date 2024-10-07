import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { TransformInterceptor } from './transform.interceptor';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransformInterceptor,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    interceptor = module.get<TransformInterceptor>(TransformInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  // Tambahkan tes lain sesuai kebutuhan
});
