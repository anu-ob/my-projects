import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators
} from '@angular/forms'
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { CandidateService } from 'src/app/candidate/candidate-services/candidate.service'
import { SearchModel } from 'src/app/core/models/search-model'
import { TimeDiffCalcService } from 'src/app/services/data.service'
import { CorporateServiceService } from '../../candidate-service/corporate-service.service'
import { environment } from 'src/environments/environment.prod'

@Component({
  selector: 'app-cr-home',
  templateUrl: './cr-home.component.html',
  styleUrls: ['./cr-home.component.css']
})
export class CrHomeComponent implements OnInit {
  addjobForm: FormGroup
  isSubmitted: boolean = false
  jobList: [] = []
  jobID: any
  loginUser: any
  userID: any
  jobsPosted = []
  companyName: string
  companyLocation: string
  listingTypeValue: any
  editJobDetails: any
  editJobDetailsId: any
  details: any
  editJobForm: boolean = false
  editedJobDetails: any
  user: any
  usersApplied: any = [{}]
  usersAppliedCount: any
  usersCount: any
  isUserAppliedShow: boolean = false
  keyword: string = ''
  crDetails: any = []
  data:any
  isLoadingResult:boolean=false;
  userDetails:any=[]
  job_type_id;
  job_type_name;
  selectedJobType;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective
  constructor (
    private service: CorporateServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private timeDiffCalc: TimeDiffCalcService,
    private candidateSr:CandidateService
    ) {
      this.loginUser = JSON.parse(sessionStorage.getItem('cr_login_user') || '{}')
      
      if (this.loginUser) {
        this.user = this.loginUser.body.result[0]
        
        if (this.user) {
          this.userID = this.user.user_id
          
          this.companyLocation = this.user.complete_address
          this.companyName = this.user.company_name
        }
    }
    if(this.userID){
      this.getCrDetails()
      
    }
  }
  model: SearchModel = new SearchModel()
  items:any=[];
  Jobkeyword = 'Enter Location'
  ngOnInit (): void {
  
    document.getElementById('defaultOpen').click()
    
    
    this.getJob()
    this.getJobPostedbyCr(this.model)
    
    this.addjobForm = new FormGroup({
      listing_type: new FormControl(null, Validators.required),
      job_type_id: new FormControl(null, Validators.required),
      job_type_name: new FormControl(null),
      job_name: new FormControl('', Validators.required),
      job_description: new FormControl('', Validators.required),
      job_location: new FormControl('', Validators.required),
      company_name: new FormControl('', Validators.required),
      posted_by: new FormControl(''),
      skills:new FormControl('',Validators.required),
      terms: new FormControl('', Validators.required)
    })
    if (this.editJobDetails && this.editJobDetailsId) {
      this.onEditJobDetails()
    }
    var userpostJobRedirect = sessionStorage.getItem('post-job')
    if (userpostJobRedirect) {
      sessionStorage.removeItem('post-job')
      this.openListing(
        'Jobs',
        document.getElementById('post-new-job'),
        '#f3642c',
        '#fff'
      )
    }
  }
addJob(){
  
}
  onEditJobDetails () {
    if (this.editJobDetails && this.editJobDetailsId) {
      this.editJobForm = true
      this.addjobForm.patchValue({
        listing_type: this.editJobDetails.listing_type,
        skills:this.editJobDetails.skills,
        job_type_id: this.editJobDetails.job_type_id,
        job_name: this.editJobDetails.job_name,
        job_description: this.editJobDetails.job_description,
        job_location: this.editJobDetails.job_location,
        company_name: this.editJobDetails.company_name,
        posted_by: this.editJobDetails.posted_by,
        terms: this.addjobForm.get('terms').valid
        
      })
    }
  }
  onSubmit (model: {
    job_type_id: any
    job_name: any
    job_description: any
    job_location: any
    company_name: any
    posted_by: any
    listing_type: any
    skills:any
  }) {
    this.isSubmitted = true
    model = {
      job_type_id: this.jobID,
      job_name: this.addjobForm.get('job_name').value,
      job_description: this.addjobForm.get('job_description').value,
      job_location: this.addjobForm.get('job_location').value,
      company_name: this.addjobForm.get('company_name').value,
      posted_by: this.userID,
      listing_type: this.listingTypeValue,
      skills:this.addjobForm.get('skills').value
    }
  
    if (this.addjobForm.invalid) {
      this.addjobForm.get('listing_type').setValidators(Validators.required)
      this.addjobForm.get('skills').setValidators(Validators.required)
      this.addjobForm.get('company_name').setValidators(Validators.required)
      this.addjobForm.get('job_location').setValidators(Validators.required)
      this.addjobForm.get('job_description').setValidators(Validators.required)
      this.addjobForm.get('job_name').setValidators(Validators.required)
      this.addjobForm.get('job_type_id').setValidators(Validators.required)
      this.addjobForm.get('terms').setValidators(Validators.required)
      this.toastr.error('Please fill the form correctly')
    } else if (this.editJobDetailsId) {
      this.spinner.show()
      this.service
        .updateAddJob(this.editJobDetailsId, this.addjobForm.value)
        .subscribe(
          res => {
            this.spinner.hide()
            var response = res
            this.editedJobDetails = res
            if (res && res.status_code == 1) {
              this.toastr.success(res.message)
              this.resetForm()
              this.formGroupDirective.resetForm()
              this.getJobPostedbyCr(this.model)
              document.getElementById('btnJobList').click()
              
            }
          },
          err => {
            this.spinner.hide()
            if (err && err.error) {
              if (err.error.status_code == 2) {
                this.toastr.error(err.error.message)
                this.spinner.hide()
              }
            }
          },
          () => {
            this.spinner.hide()
          }
        )
    } else {
      this.spinner.show()
      this.service.addJob(model).subscribe(
        res => {
          this.spinner.hide()
          var res = res
          if (res && res.status_code == 1) {
            this.toastr.success(res.message)
            this.resetForm()
            this.formGroupDirective.resetForm()
            this.getJobPostedbyCr(this.model)
           document.getElementById('btnJobList').click()
          }
        },
        err => {
          this.spinner.hide()
          if (err && err.error) {
            if (err.error.status_code == 2) {
              this.toastr.error(err.error.message)
              this.spinner.hide()
            }
          }
        },
        () => {
          this.spinner.hide()
        }
        )
    }
  }
  getCrDetails(){
    this.service.getCrDetails(this.userID)
    .subscribe(res => {
    this.crDetails = res.result[0];
    })
  }

  handlePageChange (event: number): void {
    this.model.jobType = this.model.jobType = undefined
      ? ''
      : this.model.jobType
    this.model.pageNumber = event > 0 ? event - 1 : event
    this.getJobPostedbyCr(this.model)
  }

  handlePageSizeChange (event: any): void {
    this.model.jobType = this.model.jobType = undefined
    ? ''
    : this.model.jobType
    this.model.recordsPerPage = event.target.value
    this.model.pageNumber = 0
    this.getJobPostedbyCr(this.model)
  }

  searchJobs () {
    this.model.jobType = this.model.jobType = undefined
      ? ''
      : this.model.jobType
    this.model.keyword = this.keyword
    this.model.pageNumber = 0
    this.getJobPostedbyCr(this.model)
  }

  selectJobType (e: any) {
    this.model.jobType =
      e.target.value == 'null' || !e.target.value ? '' : e.target.value
    this.model.pageNumber = 0
    this.getJobPostedbyCr(this.model)
  }
  getServerResponse (event: any) {
    if (event && event.length) {
      this.isLoadingResult = true
      this.candidateSr.getLoactionBasedOnKeyword(event).subscribe(
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
  singleJob: any = []
  totalJobs: number = 0
  pageSizes = [5, 10, 20, 50, 100]
  singleJobSkill=[]
  getJobPostedbyCr (model: SearchModel) {
    this.spinner.show()
    this.service.getJobPostedbyCr(model, this.userID).subscribe(
      res => {
        this.spinner.hide()
       
        if (res && res.status_code == 1) {
          this.jobsPosted = res.result[0].jobDetails
          this.singleJob = res.result[0].jobDetails[0]
          this.singleJobSkill = this.singleJob.skills
          this.totalJobs = res.result[0].total_jobs_count
        } else {
          this.toastr.error(res.message)
          this.jobsPosted = res.result[0].jobDetails
          this.singleJob = res.result[0].jobDetails[0]
          this.totalJobs = res.result[0].total_jobs_count
        }
      },
      err => {
        
        if (err && err.error) {
          if (err.error.status_code == 2) {
            this.toastr.error(err.error.message)
            this.spinner.hide()
          }
        }
      },
      () => {
        this.spinner.hide()
      }
    )
  }
  onEdit (listName, elmnt, color, tcolor, singleJob: any = null) {
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
    if (listName == 'Jobs') {
      this.details = this.jobsPosted.filter(x => x._id == singleJob._id)[0]
      
      this.editJobDetails = this.details

      this.editJobDetailsId = this.editJobDetails._id
      this.onEditJobDetails()
    }
   
  }
  openListing (listName, elmnt, color, tcolor, job: any = null) {
    document.getElementById('defaultOpen').click()
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
    if (elmnt) {
      elmnt.currentTarget.style.background = color
      elmnt.currentTarget.style.color = tcolor
    }
    if (listName == 'job-detail') {
      this.singleJob = job

      this.usersApplied = this.singleJob.users

      if (this.usersApplied && Object.keys(this.usersApplied[0]).length > 0) {
        this.isUserAppliedShow = true
      } else {
        this.isUserAppliedShow = false
      }
      if (this.usersApplied == null) {
      }
      this.usersAppliedCount = this.usersApplied.length
    }
  
   if ( listName == 'User-Details'){
     
   }
  }
  goToJobDetails(){
    this.openListing('job-detail',
    document.getElementById('job-detail'),'#f3642c','#fff',this.singleJob)
  }
  userEmploymentDetails: any = []
  userCertifications: any = []
  projectDetails: any = [] 
  profile_image_path:any;
  resume_file_path:any;
  userDetail (listName, elmnt, color, tcolor, id: any = null) {
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
    if (elmnt) {
      elmnt.currentTarget.style.background = color
      elmnt.currentTarget.style.color = tcolor
    }
   
   if ( listName == 'User-Details'){
     this.candidateSr.getUserbyId(id)
     .subscribe(res => {
       this.userDetails = res.result[0]
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
     })
  
       this.candidateSr
         .getEmploymentDetailsByUserId(id)
         .subscribe(res => {
          this.userEmploymentDetails = res.result
         })
        
          this.candidateSr.getUserCertification(id).subscribe(res => {
            this.userCertifications = res.result
          })
      
            this.candidateSr.getUserProject(id).subscribe(
              res => {
                if (res && res.status_code == 1) 
                this.projectDetails = res.result
                else this.toastr.error(res.message)
              },
              err => {
                if (err && err.error) this.toastr.error(err.error.message)
              }
            )
          }
     }
   
  
 
  
  getJob () {
    this.spinner.show()
    this.service.getJobtype().subscribe(
      response => {
        this.spinner.hide()
        this.jobList = response.result
      },
      err => {
        if (err && err.error) {
          if (err.error.status_code == 2) {
            this.toastr.error(err.error.message)
            this.spinner.hide()
          }
        }
      }
    )
  }
  onJobChange (e: any) {
     this.jobID = e.target.value
  //  this.selectedJobType = this.jobID.split(',',2)
    //this.job_type_id = this.selectedJobType[0]
    //this.job_type_name = this.selectedJobType[1]
  
  }
  onChangeListingType (e: any) {
    this.listingTypeValue = e.target.value
  }
  changePassword () {
    this.router.navigate(['/corporate-change-password'])
  }
  resetForm () {
    this.addjobForm.reset()
    this.addjobForm.get('listing_type').clearValidators()
    this.addjobForm.get('skills').clearValidators()
    this.addjobForm.get('company_name').clearValidators()
    this.addjobForm.get('job_location').clearValidators()
    this.addjobForm.get('job_description').clearValidators()
    this.addjobForm.get('job_name').clearValidators()
    this.addjobForm.get('job_type_id').clearValidators()
    this.addjobForm.get('terms').clearValidators()
   
  }
  editProfile () {
    this.router.navigate(['/corporate-edit-profile'])
  }

  getTimeDiff (postedDate: any) {
    return this.timeDiffCalc.timeDiffCalc(new Date(), new Date(postedDate))
  }
  onSelect(e:any) {
    e.target.value
}
setStatus(jobID,userID:any,statusID){
 let model={job_id:jobID,user_id:userID,status_id:this.status_id}

 this.service.setApplicationStatus(model)
  .subscribe(res=>{
    
  },err => {
  })

}
applicationStatus=[]
status_id:any = '61670e764cabeb192bacd579';
getStatus(){
  this.service.getApplicationStatus()
  .subscribe(res => {
    
    this.applicationStatus = res.result[0]
    
  })
}
changeStatus(e:any){
  this.status_id=e.target.value

}
}
