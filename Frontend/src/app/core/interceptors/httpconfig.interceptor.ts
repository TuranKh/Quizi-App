import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';;
import { EMPTY, Observable, OperatorFunction, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';



@Injectable()
export class HttpconfigInterceptor implements HttpInterceptor {

  constructor(private router: Router, private snackBar: SnackbarService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request);
  }

  catchRequestError(): OperatorFunction<HttpEvent<any>, HttpEvent<any>> {
    return catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Unauthorized) {
        this.router.navigateByUrl('/login');
        return EMPTY;
      } else {
        this.snackBar.openFailureSnackBar()
        return throwError(() => error);
      }
    });
  }
}
