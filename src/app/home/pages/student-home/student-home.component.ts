import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CandidateService } from 'src/app/candidate/candidate-services/candidate.service';
import { SearchModel } from 'src/app/core/models/search-model';
import { CorporateServiceService } from 'src/app/corporate/candidate-service/corporate-service.service';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent implements OnInit {
  jobSearchForm: FormGroup
  jobTypeList = []
  selectedJob: any
  crUserLogin: any
  userID: any
  isLoggedIn: boolean = false
  loginUser: any
  isLoadingResult:boolean = false;
  data:any
  constructor(private service: CandidateService,
    private crService: CorporateServiceService,
    private router: Router,
    private toastr: ToastrService,) {
    this.crUserLogin = JSON.parse(
      sessionStorage.getItem('cr_login_user')
    )
    this.loginUser = JSON.parse(sessionStorage.getItem('login_user'))

    if (this.crUserLogin && Object.keys(this.crUserLogin).length > 0) {
      this.userID = this.crUserLogin.body.result[0].user_id

    } else if (this.loginUser && Object.keys(this.loginUser).length > 0) {
      this.userID = this.loginUser.body.result[0].user_id
    }
   }
   
   model: SearchModel = new SearchModel()
   keyword = 'Search city, province, or region'
  ngOnInit(): void {
    this.getJobType()
    this.jobSearchForm = new FormGroup({
      keyword: new FormControl(''),
      location: new FormControl(''),
      jobType: new FormControl(null)
    })
  }
  getJobType () {
    this.crService.getJobtype().subscribe(res => {
      this.jobTypeList = res.result

    })
  }
  getServerResponse (event: any) {
    if (event && event.length) {
      this.isLoadingResult = true
      this.service.getLoactionBasedOnKeyword(event).subscribe(
        data => {
          if (data && data.status_code == 1) {
            this.data = data.result
            this.isLoadingResult = false
          }
        },
        err => {
          if (err && err.error) {
            if (err.error.status_code == 2) {
              this.isLoadingResult = false
            }
          }
        }
      )
    }
  }
  onJobChange (e: any) {
    this.selectedJob = e.target.value
  }
  searchCleared () {
    this.data = []
  }
  onSearch () {
    this.model.jobType =
      this.selectedJob == 'null' || !this.selectedJob ? '' : this.selectedJob
    this.model.keyword = this.jobSearchForm.get('keyword').value
    this.model.location = this.jobSearchForm.get('location').value
    if (!this.model.jobType && !this.model.keyword && !this.model.location) {
      this.toastr.info('Please choose any option to search')
    } else {
      sessionStorage.setItem(
        'searchFilters',
        JSON.stringify(this.jobSearchForm.value)
      )
      this.router.navigate(['/job-search'])
    }
  }
}
