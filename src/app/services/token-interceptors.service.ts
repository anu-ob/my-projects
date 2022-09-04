import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { CorporateServiceService } from '../corporate/candidate-service/corporate-service.service'
import { UserService } from '../home/home-services/user.service'

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  isLoggedIn: boolean = false
  constructor (
    private auth: UserService,
    private corporate: CorporateServiceService
  ) {}

  intercept (request: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken()
  
   

 

      var tokenRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      })
      
      

  
    return next.handle(tokenRequest);
  }
}
