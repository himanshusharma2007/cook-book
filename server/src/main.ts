import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  try {
    console.log('🚀 Starting server...');

    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.use(cookieParser());
    app.enableCors({
      origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://cookbook-topaz.vercel.app',
      ],
      credentials: true,
    });

    const port = process.env.PORT || 5000;
    await app.listen(port);
    console.log(`✅ Server is running on port ${port}`);
  } catch (error: any) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('❌ Bootstrap failed:', error);
  process.exit(1);
});
