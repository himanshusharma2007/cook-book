import { Logger } from '@nestjs/common';

export function LogExecution(): MethodDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
     
    descriptor: TypedPropertyDescriptor<any> 
  ): any => { 
    const originalMethod = descriptor.value;

    if (!originalMethod) return;

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      const logger = new Logger((target as Record<string, unknown>).constructor?.name ?? 'Unknown');
      const start = Date.now();

      const result: unknown = await originalMethod.apply(this, args);

      const duration = Date.now() - start;
      logger.log(`${String(propertyKey)} executed in ${duration}ms`);

      return result;
    };

    return descriptor;
  };
}
