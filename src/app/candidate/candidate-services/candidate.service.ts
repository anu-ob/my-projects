import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { URI } from 'src/app/common/url'
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  
  constructor (private http: HttpClient) {}

  getUserbyId (id: any): Observable<any> {
    return this.http.get<any>(URI.getUserbyId + id)
  }
  addCertification (model: any): Observable<any> {
    return this.http.post<any>(URI.addUserCertification, model)
  }
  addProject (model: any): Observable<any> {
    return this.http.post<any>(URI.addProject, model)
  }
  addEmployment (model: any): Observable<any> {
    return this.http.post<any>(URI.addUserEmployment, model)
  }

  updateCertification (model: any, id: any): Observable<any> {
    return this.http.post(URI.UpdateUserCertification + id, model)
  }
  updateProject (model: any, id: any): Observable<any> {
    return this.http.post(URI.UpdateUserProject + id, model)
  }
  updateEmployment (model: any, id: any): Observable<any> {
    return this.http.post(URI.UpdateUserEmployment + id, model)
  }

  deleteCertification (id: any): Observable<any> {
    return this.http.delete(URI.DeleteUserCertification + id)
  }
  deleteProject (id: any): Observable<any> {
    return this.http.delete(URI.DeleteUserProject + id)
  }
  deleteEmployment (id: any): Observable<any> {
    return this.http.delete(URI.DeleteUserEmployment + id)
  }
  applyForJob (model: any): Observable<any> {
    return this.http.post(URI.ApplyJob, model)
  }

  getUserCertification (id: any): Observable<any> {
    return this.http.get<any>(URI.getUserCertification + id)
  }
  getUserProject (id: any): Observable<any> {
    return this.http.get<any>(URI.getUserProject + id)
  }
  getEmploymentDetailsByUserId (id: any): Observable<any> {
    return this.http.get<any>(URI.getEmploymentDetailsByUserId + id)
  }
  getUserRecomendedJobs (model: any) {
    return this.http.post<any>(URI.GetActiveJobListingPagedList, model)
  }
  getUserWorkshopList () {
    return this.http.get<any>(URI.GetActiveJobWorkshopPagedList)
  }
  getUserInternshipList () {
    return this.http.get<any>(URI.GetActiveJobInternshipPagedList)
  }
  getJobsForOpenListing (model: any) {
    return this.http.post<any>(URI.getJobsForOpenListing, model)
  }
  GetUserApplicationsByUserId (id: any,model):Observable<any> {
    return this.http.get<any>(URI.GetUserApplicationsByUserId + id,model)
  }
  getJobListingById (id: any) {
    return this.http.get<any>(URI.getJobListingById + id)
  }

  getLoactionBasedOnKeyword (keyword: any) {
    return this.http.get<any>(URI.GetJobLocationSuggestions + keyword)
  }
  addEducation (model: any): Observable<any> {
    return this.http.post(URI.addEducation, model)
  }
  getEducationById (): Observable<any> {
    return this.http.get(URI.getEducationById)
  }
  editUserEducation (id: any, model: any): Observable<any> {
    return this.http.post(URI.edituserEducation + id, model)
  }
  deleteUserEducation (id: any): Observable<any> {
    return this.http.delete(URI.deleteUserEducation + id)
  }
  getRecommendedJobForUser(model:any):Observable<any>{
    return this.http.post(URI.getRecommendedJobsForUser, model)
  }
 
}
