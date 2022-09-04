import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CorporateServiceService } from './corporate-service.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
 
  constructor(private auth:CorporateServiceService) { }
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
   


      var tokenRequest = request.clone({
        headers: request.headers.set('Authorization',`Bearer ${token}`)
      
      });
  
    return next.handle(tokenRequest);

}   
}
