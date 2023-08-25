import { Test, TestingModule } from '@nestjs/testing';
import { GetSessionController } from './get-session.controller';

describe('GetSessionController', () => {
  let controller: GetSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetSessionController],
    }).compile();

    controller = module.get<GetSessionController>(GetSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
