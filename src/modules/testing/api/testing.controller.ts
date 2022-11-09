import { Controller, Delete, HttpCode } from '@nestjs/common';
import { TestingQueryRepository } from './queryRepository/testing.repository';

@Controller('testing')
export class TestingController {
  constructor(
    private readonly testingQueryRepository: TestingQueryRepository,
  ) {}

  @HttpCode(204)
  @Delete('all-data')
  async deleteAllData() {
    await this.testingQueryRepository.deleteAll();
  }
}
