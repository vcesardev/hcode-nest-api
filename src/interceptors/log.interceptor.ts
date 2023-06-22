import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const initialExecution = Date.now();

    return next.handle().pipe(
      tap(() => {
        const actualTime = Date.now();
        const requestUrl = context.switchToHttp().getRequest().url;

        console.log('Url:', requestUrl);
        console.log(`Duração da execução: ${actualTime - initialExecution} ms`);
      }),
    );
  }
}
