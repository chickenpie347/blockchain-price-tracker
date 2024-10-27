import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';
import { ScheduleModule } from '@nestjs/schedule';

// Importing modules
import { PriceModule } from './price/price.module';
import { AlertModule } from './alert/alert.module';
import { SwapModule } from './swap/swap.module';


// Define the data source configuration
export const AppDataSource = new DataSource({
  type: 'postgres', // Change to your preferred DB type
  host: 'db',
  port: 5432,
  username: 'postgres', // Replace with your DB credentials
  password: 'postgrespassword', // Replace with your DB password
  database: 'price_tracker', // Replace with your database name
  entities: [__dirname + '/**/*.entity{.ts,.js}'], // Adjust path as needed
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'], // Path to your migration files
  synchronize: true, // Disable synchronize in production
});

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(AppDataSource.options), // Use data source options
    PriceModule,
    AlertModule,
    SwapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  /**  Optionally initialize the data source here
  static async initialize() {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();  //Automatically run migrations on startup 
  }*/
}
