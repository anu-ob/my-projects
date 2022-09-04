import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URI } from 'src/app/common/url';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http:HttpClient) { }

  getCorporateList(model):Observable<any>{
   return this.http.post(URI.getCorporateList,model)
  }
  userList(model:any):Observable<any>{
    return this.http.post(URI.getUsersList,model)
  }
}
