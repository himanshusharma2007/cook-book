import { Logger } from '@nestjs/common';

export function LogExecution(): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const original = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const logger = new Logger(target.constructor.name);
      const start = Date.now();
      const result = await original.apply(this, args);
      const duration = Date.now() - start;
      logger.log(`${String(propertyKey)} executed in ${duration}ms`);
      return result;
    };
  };
}
