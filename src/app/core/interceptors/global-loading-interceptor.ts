import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { GlobalLoadingService } from '../services/global-loading-service';

export const globalLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const globalLoadingService = inject(GlobalLoadingService);
  
  // Increment the active requests counter
  globalLoadingService.incrementActiveRequests();
  
  // Show loading if this is the first active request
  if (globalLoadingService.getActiveRequestsCount() === 1) {
    globalLoadingService.setIsLoading(true);
  }
  
  return next(req).pipe(
    finalize(() => {
      // Decrement the active requests counter
      globalLoadingService.decrementActiveRequests();
      
      // Hide loading if no more active requests
      if (globalLoadingService.getActiveRequestsCount() === 0) {
        globalLoadingService.setIsLoading(false);
      }
    })
  );
};
