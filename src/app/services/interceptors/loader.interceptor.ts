import { Injectable } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent
} from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '../common/loader.service';
import { finalize, Observable } from 'rxjs';

// export const LoaderInterceptor: HttpInterceptorFn = (
//   req: HttpRequest<any>,
//   next: HttpHandlerFn
// ): Observable<HttpEvent<any>> => {
//   const loader = inject(LoaderService);
//   loader.showLoader();

//   return next(req).pipe(
//     finalize(() => loader.hideLoader())
//   );
// };


export const LoaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoaderService);
  loader.showLoader();
  console.log('Loader ON');

  return next(req).pipe(
    finalize(() => {
      //console.log('Loader OFF');
      loader.hideLoader();
    })
  );
};


