import { DataSource } from 'typeorm';
import { AppConfig } from '../app.config.provider';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';

export const dataProvider = {
  provide: 'DATA_SOURCE',
  useFactory: async (config: AppConfig): Promise<DataSource> => {
    const dataSource = new DataSource({
      type: 'postgres',
      host: config.database.host,
      port: Number(config.database.port),
      username: config.database.user,
      password: config.database.password,
      database: config.database.name,
      entities: [Film, Schedule],
      synchronize: false, 
    });

    try {
      await dataSource.initialize();
      console.log('Data Source has been initialized!');
      return dataSource;
    } catch (error) {
      console.error('Error during Data Source initialization:', error);
      throw error;
    }
  },
  inject: ['CONFIG'],
};
