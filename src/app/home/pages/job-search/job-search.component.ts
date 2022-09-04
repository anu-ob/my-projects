import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'

import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { CandidateService } from 'src/app/candidate/candidate-services/candidate.service'
import { SearchModel } from 'src/app/core/models/search-model'
import { CorporateServiceService } from 'src/app/corporate/candidate-service/corporate-service.service'
import { TimeDiffCalcService } from 'src/app/services/data.service'
import { environment } from 'src/environments/environment.prod'

@Component({
  selector: 'app-job-search',
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.css']
})
export class JobSearchComponent implements OnInit, OnDestroy {
  loginUser: any
  socialUser: any
  fbLogin: any
  isLoggedIn: boolean = false
  userID: any
  selectedJobType: any
  jobKeyword: string = ''
  location: string = ''
  jobSearchForm: FormGroup
  jobTypeList = []
  singleJob: any
  userDetails: any
  profile_image_path: any
  resume_file_path: any
  userCertifications: any
  projectDetails: any
  userEmploymentDetails: any
  searchFromHome: any
  jobType: any
  constructor (
    private service: CandidateService,
    private crService: CorporateServiceService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private renderer: Renderer2,
    private timeDiffCalc: TimeDiffCalcService,
    private router: Router
    ) {
    this.renderer.addClass(document.body, 'jobsearch')
    
    this.loginUser = JSON.parse(sessionStorage.getItem('login_user') || '{}')
    this.socialUser = JSON.parse(sessionStorage.getItem('userConsent') || '{}')
    this.fbLogin = JSON.parse(sessionStorage.getItem('userData') || '{}')
    if (this.loginUser && Object.keys(this.loginUser).length > 0) {
      this.isLoggedIn = true
      this.userID = this.loginUser.body.result[0].user_id
    } else if (this.socialUser && Object.keys(this.socialUser).length > 0) {
      this.isLoggedIn = true
      this.userID = this.socialUser.result[0].user_id
    } else if (this.fbLogin && Object.keys(this.fbLogin).length > 0) {
      this.isLoggedIn = true
      this.userID = this.fbLogin.result[0].user_id
    } else {
      this.isLoggedIn = false
    }
  }
  recommendedJobs: [] = []
  model: SearchModel = new SearchModel()
  pageSizes = [5, 10, 20, 50, 100]
  
  keyword = 'Search city, province, or region';
  jobKeywords= 'Job title, keywords, or company' 
  data: any
  isLoadingResult: boolean

  ngOnInit (): void {
    this.getJobType()

    this.searchFromHome = JSON.parse(sessionStorage.getItem('searchFilters'))
    if (this.searchFromHome) {
      sessionStorage.removeItem('searchFilters')
      this.selectedJobType = this.searchFromHome.jobType
      this.createJobsForm()
      this.searchFilter()
    } else {
      this.createJobsForm()
      this.getJobsList(this.model)
    }
    document.getElementById('default').click()
  }
  createJobsForm () {
    this.jobSearchForm = new FormGroup({
      keyword: new FormControl(
        !this.searchFromHome ? '' : this.searchFromHome.keyword
      ),
      location: new FormControl(
        !this.searchFromHome ? '' : this.searchFromHome.location
      ),
      jobType: new FormControl(
        !this.searchFromHome ? '' : this.searchFromHome.jobType
      )
    })
  }
  ngOnDestroy () {
    this.renderer.removeClass(document.body, 'jobsearch')
  }
  totalJobs: number = 0
  getJobsList (model: SearchModel) {
    this.spinner.show()
    
    this.service.getJobsForOpenListing(model).subscribe(
      data => {
        this.spinner.hide()
        
        if (data && data.status_code == 1) {
          this.recommendedJobs = data.result[0].searchedJobs

          this.singleJob = data.result[0].searchedJobs[0]

          this.totalJobs = data.result[0].total_jobs_count
        }
      },
      err => {

       this.spinner.hide()
        if (err && err.error) {
          if (err.error.status_code == 3 || err.error.status_code == 2) {
            this.toaster.error(err.error.message)
            this.spinner.hide()
          }
        }
      },
      () => {
        this.spinner.hide()
      }
    )
  }

  getTimeDiff (postedDate: any) {
    return this.timeDiffCalc.timeDiffCalc(new Date(), new Date(postedDate))
  }

  handlePageChange (event: number): void {
    this.model.pageNumber = event > 0 ? event - 1 : event
    this.getJobsList(this.model)
  }

  handlePageSizeChange (event: any): void {
    this.model.recordsPerPage = event.target.value
    this.model.pageNumber = 0
    this.getJobsList(this.model)
  }
  searchFilter () {
    this.model.jobType =
      this.selectedJobType == 'null' || !this.selectedJobType
        ? ''
        : this.selectedJobType
    this.model.keyword = this.jobSearchForm.get('keyword').value
    this.model.location = this.jobSearchForm.get('location').value
    this.getJobsList(this.model)
  }
  selectJobType (e: any) {
    this.selectedJobType = e.target.value
  }
  /*applyNow(){
    if(!this.userID){
      this.isLoggedIn = false
      console.log(this.isLoggedIn)
     this.router.navigate(['/login'])
    }
    else{
      this.isLoggedIn = true;
      this.router.navigate(['/user'])
    }
  }*/
  getJobType () {
    this.crService.getJobtype().subscribe(res => {
      this.jobTypeList = res.result
    })
  }
  clearAll () {
    this.jobSearchForm.reset()
    this.model.jobType = ''
    this.model.keyword = ''
    this.model.location = ''
    this.getJobsList(this.model)
  }
  openListing (listName, elmnt, color, tcolor, jobs: any = null) {
    var i, tabcontent, tablinks
    tabcontent = document.getElementsByClassName('tabcontent')
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none'
    }
    tablinks = document.getElementsByClassName('tablink')
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].style.backgroundColor = ''
      tablinks[i].style.color = ''
    }
    document.getElementById(listName).style.display = 'block'
    elmnt.currentTarget.style.background = color
    elmnt.currentTarget.style.color = tcolor
    if (listName == 'job-detail') {
      this.singleJob = jobs
    }
  }
  getUser () {
    this.service.getUserbyId(this.userID).subscribe(response => {
      this.userDetails = response.result[0]

      if (this.userDetails) {
        if (this.userDetails.profile_pic) {
          this.profile_image_path =
            environment.imageUrl + this.userDetails.profile_pic
        } else {
          this.profile_image_path = '/assets/images/person.png'
        }
        if (this.userDetails.resume_file) {
          this.resume_file_path =
            environment.imageUrl + this.userDetails.resume_file
        }

        this.userCertifications = this.userDetails.user_certifications
        this.projectDetails = this.userDetails.user_projects
        this.userEmploymentDetails = this.userDetails.user_employments
      }
    })
  }
  applyNow (job_id: any) {
    if (!this.userID) {
      sessionStorage.removeItem('job_id')
      this.isLoggedIn = false
      this.router.navigate(['/login'])
    } else {
      if (job_id) {
        sessionStorage.setItem('job_id', job_id)
        this.router.navigate(['/user'])
      }
    }
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
  searchCleared () {
    this.data = []
  }
}
