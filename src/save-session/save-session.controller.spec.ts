import { Test, TestingModule } from '@nestjs/testing';
import { SaveSessionController } from './save-session.controller';

describe('SaveSessionController', () => {
  let controller: SaveSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaveSessionController],
    }).compile();

    controller = module.get<SaveSessionController>(SaveSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
