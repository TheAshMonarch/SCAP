import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.log('ALL ENV VARS:', process.env.MONGODB_URI); // Check raw process
        // 1. Get the URI first
        const uri = config.get<string>('MONGODB_URI');
        console.log('DatabaseModule useFactory MONGODB_URI:', uri); // Check if ConfigService retrieves it

        // 2. Validation check
        if (!uri) {
          throw new Error('MONGODB_URI is not defined in .env');
        }

        // 3. Return the config object
        return {
          uri,
          connectionFactory: (connection) => {
            const logger = new Logger('DatabaseModule');

            connection.on('connected', () => {
              logger.log('MongoDB connected successfully');
            });

            connection.on('error', (error) => {
              logger.error('MongoDB connection error:', error);
            });

            connection.on('disconnected', () => {
              logger.warn('MongoDB disconnected');
            });

            return connection;
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
