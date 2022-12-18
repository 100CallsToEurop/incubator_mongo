import { Controller, Delete, HttpCode } from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator';
import { TestingQueryRepository } from './queryRepository/testing.repository';

@Controller('testing')
export class TestingController {
  constructor(
    private readonly testingQueryRepository: TestingQueryRepository,
  ) {}

  @Public()
  @HttpCode(204)
  @Delete('all-data')
  async deleteAllData() {
    await this.testingQueryRepository.deleteAll();
  }
}
