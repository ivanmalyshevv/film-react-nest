import { Module } from '@nestjs/common';
import { configProvider } from '../app.config.provider';
import { dataProvider } from './data.provider';

@Module({
  providers: [configProvider, dataProvider],
  exports: [dataProvider],
})
export class DataModule {}