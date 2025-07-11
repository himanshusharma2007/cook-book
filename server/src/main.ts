console.log('=== STARTING BOOTSTRAP ===');

import { NestFactory } from '@nestjs/core';
console.log('=== NESTJS IMPORTED ===');

import { AppModule } from './app.module';
console.log('=== APP MODULE IMPORTED ===');

async function bootstrap() {
  console.log('=== BOOTSTRAP FUNCTION CALLED ===');
  
  try {
    console.log('=== CREATING NEST APP ===');
    const app = await NestFactory.create(AppModule);
    console.log('=== NEST APP CREATED ===');
    
    await app.listen(3000);
    console.log('=== SERVER STARTED ON PORT 3000 ===');
  } catch (error) {
    console.error('=== BOOTSTRAP ERROR ===', error);
    process.exit(1);
  }
}

console.log('=== CALLING BOOTSTRAP ===');
bootstrap().catch(error => {
  console.error('=== BOOTSTRAP CATCH ===', error);
  process.exit(1);
});