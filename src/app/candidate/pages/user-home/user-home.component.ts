import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ToastrService } from 'ngx-toastr'
import { UserService } from 'src/app/home/home-services/user.service'
import { CandidateService } from '../../candidate-services/candidate.service'
import { certificationModel } from './certification-model'
import { projectModel } from './project-model'
import { environment } from 'src/environments/environment.prod'
import { ActivatedRoute, Router } from '@angular/router'
import { DatePipe } from '@angular/common'
import { NgxSpinnerService } from 'ngx-spinner'
import { TimeDiffCalcService } from 'src/app/services/data.service'
import { SearchModel } from 'src/app/core/models/search-model'
import { CorporateServiceService } from 'src/app/corporate/candidate-service/corporate-service.service'
import Swal from 'sweetalert2'
import jsPDF from 'jspdf';  

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  loginUser: any
  isLoggedIn: boolean = false
  userID: any
  userDetails: any = []
  certificationForm: FormGroup
  projectForm: FormGroup
  certificationResponse: any
  projectResponse: any
  socialUser: any
  fbLogin: any
  userCertifications: any = []
  userEducation: any = []
  projectDetails: any = []
  profile_image_path: string
  resume_file_path: string
  isProfileEdit: boolean = false
  job_id: string
  model: SearchModel = new SearchModel()
  pageSizes = [5, 10, 20, 50, 100]
  totalJobs: number = 0
  appliedJobsCount:number=0
  page:number = 1
  keyword: string = ''
  location:string = ''
  educationForm: FormGroup
  courseTypeValue: any
  isEducationFormSubmit: boolean = false
  recommendedJobsForUser:any = [];
  course = ['Full Time', 'Part Time', 'Correspondence/Distance-Education']
  @ViewChild('content') content:ElementRef; 
  @ViewChild('pdfContent') pdfContent:ElementRef; 

  constructor (
    private service: UserService,
    private candidateService: CandidateService,
    private crService: CorporateServiceService,
    private toaster: ToastrService,
    private router: Router,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private timeDiffCalc: TimeDiffCalcService,
    private route: ActivatedRoute
  ) {
    this.loginUser = JSON.parse(sessionStorage.getItem('login_user'))
    this.socialUser = JSON.parse(sessionStorage.getItem('userConsent'))
    this.fbLogin = JSON.parse(sessionStorage.getItem('userData'))

    if (this.loginUser && Object.keys(this.loginUser).length > 0) {
      this.isLoggedIn = true
      this.userID = this.loginUser.body.result[0].user_id
    } else if (this.socialUser && Object.keys(this.socialUser).length > 0) {
      this.isLoggedIn = true
      this.userID = this.socialUser.result[0].user_id
    } else if(this.fbLogin && Object.keys(this.fbLogin).length > 0){
      this.userID = this.fbLogin.result[0].user_id
    }
    if (this.userID) {
      this.getUser()
    }
    this.getJobType()
  }

  ngOnInit (): void {
    document.getElementById('default-user-tab').click()
    this.job_id = sessionStorage.getItem('job_id')
    
    if (this.job_id) {
      this.getJobListingById(this.job_id)
      sessionStorage.removeItem('job_id')
    }
  }
  handlePageChange (event: number): void {
    this.model.jobType = this.model.jobType = undefined
      ? ''
      : this.model.jobType
    this.model.pageNumber = event > 0 ? event - 1 : event
    this.getRecommendedJobsForUser(this.model)
  }
  handlePageChangeAppliedJob (event: number): void {
    this.model.jobType = this.model.jobType = undefined
      ? ''
      : this.model.jobType
    this.model.pageNumber = event > 0 ? event - 1 : event
    this.getUserAppliedJobs(this.model)
  }

  handlePageSizeChange (event: any): void {
    this.model.jobType = this.model.jobType = undefined
      ? ''
      : this.model.jobType
    this.model.recordsPerPage = event.target.value
    this.model.pageNumber = 0
    this.getRecommendedJobsForUser(this.model)
  }
  
  handlePageSizeChangeAppliedJob(event: any): void {
    this.model.jobType = this.model.jobType = undefined
      ? ''
      : this.model.jobType
    this.model.recordsPerPage = event.target.value
    this.model.pageNumber = 0
    this.getUserAppliedJobs(this.model)
  }
  
  searchJobs () {
   this.model.jobType = this.model.jobType = undefined
      ? ''
      : this.model.jobType
    
    this.model.keyword = this.keyword
    this.model.pageNumber = 0
    this.getRecommendedJobsForUser(this.model)
  }
  searchJobsAppliedJobs () {
    this.model.jobType = this.model.jobType = undefined
       ? ''
       : this.model.jobType
     
     this.model.keyword = this.keyword
     this.model.pageNumber = 0
     this.getUserAppliedJobs(this.model)
   }

  selectJobType (e: any) {
    this.model.jobType =
      e.target.value == 'null' || !e.target.value ? '' : e.target.value
    this.model.pageNumber = 0
    this.getRecommendedJobsForUser(this.model)
  }
  selectJobTypeAppliedJobs (e: any) {
    this.model.jobType =
      e.target.value == 'null' || !e.target.value ? '' : e.target.value
    this.model.pageNumber = 0
    this.getUserAppliedJobs(this.model)
  }

  userJobListing: any = []
  recomendedJobsCount: number = 0
/*  getRecomendedJobListing (model: SearchModel) {
    this.spinner.show()
    this.candidateService.getUserRecomendedJobs(model).subscribe(
      res => {
        if (res && res.status_code == 1) {
          console.log(res)
          this.userJobListing = res.result[0].jobDetails
          this.recomendedJobsCount = res.result[0].total_jobs_count
          this.totalJobs = res.result[0].total_jobs_count
          this.singleJob = res.result[0].jobDetails[0]
        } else {
          this.toaster.error(res.message)
          this.userJobListing = res.result[0].jobDetails
          this.recomendedJobsCount = res.result[0].total_jobs_count
          this.totalJobs = res.result[0].total_jobs_count
          this.singleJob = res.result[0].jobDetails[0]
        }
      },
      err => {
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
  }*/
  singleJobSelected:any
  getRecommendedJobsForUser(model: SearchModel){
    this.spinner.show();
    this.candidateService.getRecommendedJobForUser(model)
    .subscribe(res =>{
      this.spinner.hide();
      this.recommendedJobsForUser=res
      this.singleJob = res.result.relevant_skills_jobs[0]
     // this.recomendedJob = res.result.relevant_skills_jobs[0]
      this.recommendedJobsForUser=res.result.relevant_skills_jobs;
      this.recomendedJobsCount = res.result.total_jobs_count
      this.totalJobs = res.result.total_jobs_count
    
  
    },err => {

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
  jobTypeList: any = []
  getJobType () {
    this.crService.getJobtype().subscribe(res => {
      this.jobTypeList = res.result
    })
  }

  getJobListingById (id: any) {
    this.spinner.show()
    this.candidateService.getJobListingById(id).subscribe(
      res => {
      
        if (res && res.status_code == 1) {
          var result = res.result[0]
          result.posted_by_user = result.company_name
          var isalreadyapplied = result.users.filter(
            x => x.user_id == this.userID
          )
          if (isalreadyapplied && isalreadyapplied.length > 0) {
            result.is_already_applied = true
          } else {
            result.is_already_applied = false
          }
          this.singleJob = result
          this.openListing(
            'job-details',
            document.getElementById('btnrecopenList'),
            '#f3642c',
            '#fff',
            this.singleJob
          )
        } else this.toaster.error(res.message)
      },
      err => {
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

  appliedJobs = []
  singleAppliedJobs:any

  getUserAppliedJobs (model: SearchModel) {
    this.spinner.show()
    this.candidateService.GetUserApplicationsByUserId(this.userID,model).subscribe(
      res => {
        if (res && res.status_code == 1) {
          this.appliedJobs = res.result
          this.appliedJobsCount = this.appliedJobs.length
          this.page = 0
          this.singleAppliedJobs = res.result[0]
        } else this.toaster.error(res.message)
      },
      err => {
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
  handlePageChangeEvent(event){
    this.page = event
  }

  getCertificatiobnbyId () {
    this.candidateService.getUserCertification(this.userID).subscribe(res => {
      this.userCertifications = res.result
    })
  }

  userEmploymentDetails: any = []
  getEmploymentDetailsByUserId () {
    this.candidateService
      .getEmploymentDetailsByUserId(this.userID)
      .subscribe(res => {
        this.userEmploymentDetails = res.result
      })
  }
  changePassword () {
    this.router.navigate(['/change-password'])
  }
  editProfile () {
    this.router.navigate(['/user-profile'])
  }
  uploadResume(){
    this.router.navigate(['/user-profile'])
  }

  editCertification (id: any) {
    this.modalTitle = 'Modify Certification Details'
    var certifate = this.userCertifications.filter(x => x._id == id)
    if (certifate) {
      this.certification = certifate[0]
      this.createCertificateForm()
    } else this.toaster.error('No details found for clicked Certification')
  }

  editProject (id: any) {
    this.modalTitle = 'Modify Project Details'
    var projectRecord = this.projectDetails.filter(x => x._id == id)
    if (projectRecord) {
      this.project = projectRecord[0]
      this.createProjectForm()
    } else this.toaster.error('No details found for clicked Project')
  }

  editEmployment (id: any) {
    this.modalTitle = 'Modify Employment Details'
    var employeeRecord = this.userEmploymentDetails.filter(x => x._id == id)
    if (this.employee) {
      this.employee = employeeRecord[0]
      this.createEmployeeForm()
    } else this.toaster.error('No details found for clicked employment')
  }

  getProjectByUserId () {
    this.candidateService.getUserProject(this.userID).subscribe(
      res => {
        if (res && res.status_code == 1) this.projectDetails = res.result
        else this.toaster.error(res.message)
      },
      err => {
        if (err && err.error) this.toaster.error(err.error.message)
      }
    )
  }
  pdfData1:any;
  pdfFile1:any;
  myFile1:any;
  fileName1: any = "resume.pdf";
  pdfData2:any;
  pdfFile2:any;
  myFile2:any;
  fileName2: any = "resumepdf.pdf";
  makePdf1(){
    let content=document.getElementById('content');  
    var doc = new jsPDF({ orientation: 'p', unit: 'px', format: 'a4' });
    const left = 10;
    var pWidth = doc.internal.pageSize.getWidth();
    const srcWidth = content.scrollWidth;
    const scale = (pWidth - left * 2) / Math.ceil(srcWidth);
    var pageHeight = doc.internal.pageSize.height;
    let y = 700
    if (y >= pageHeight) {
      doc.addPage();
      y = 0
    }

    var that = this;
    this.pdfData1 = doc.html(content, {
      x: left,
      y: 15,
      html2canvas: {
        scale: scale,
        scrollY: 50
      },
      callback: function (doc) {
        that.pdfFile1 = doc.output("blob");
        that.myFile1 = new File([that.pdfFile1], that.fileName1, { type: 'application/pdf', lastModified: Date.now() });
//that.submitDataToServer(formData);
doc.save('resume.pdf')                                                                                    


      }
    });
  }
 
  makePdf2(){
    var input: any = document.getElementById('pdfContent');
    var doc = new jsPDF({ orientation: 'p', unit: 'px', format: 'a4' });
    const left = 10;
    var pWidth = doc.internal.pageSize.getWidth();
    const srcWidth = input.scrollWidth;
    const scale = (pWidth - left * 2) / Math.ceil(srcWidth);
    var pageHeight = doc.internal.pageSize.height;
    let y = 700
    if (y >= pageHeight) {
      doc.addPage();
      y = 0
    }

    var that = this;
    this.pdfData2 = doc.html(input, {
      x: left,
      y: 15,
      html2canvas: {
        scale: scale,
        scrollY: 50
      },
      callback: function (doc) {
        that.pdfFile2 = doc.output("blob");
        that.myFile2 = new File([that.pdfFile2], that.fileName2, { type: 'application/pdf', lastModified: Date.now() });
        doc.save('resume2.pdf') 
     
      }
    });
  }
  userEmployeement:any=[]
  userCertification:any=[]
  userCertifcationCount:number;
  getUser () {
    this.candidateService.getUserbyId(this.userID).subscribe(response => {
      
      this.userDetails = response.result[0]
      this.userEmployeement=response.result[0].user_employments
      this.userCertification=response.result[0].user_certifications
      this.userCertifcationCount=this.userCertification.length
      
      this.userEducation = this.userDetails.user_education_list
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
  isResume1:boolean=true
  isResume2:boolean=false
  resume1(){
  this.isResume1=true
  this.isResume2=false
  }
  resume2(){
  this.isResume2=true
  this.isResume1=false
  }
  singleJob: any
  recomendedJob: any

  openListing (listName, elmnt, color, tcolor, job: any = null) {
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
    // elmnt.currentTarget.classList.toggle('active')
    if (listName == 'Workshop') {
      this.getRecommendedJobsForUser(this.model)
    } else if (listName == 'Job') {
      this.getUserAppliedJobs(this.model)
    } else if (listName == 'job-detail') {
      this.singleAppliedJobs = job
    } else if (listName == 'job-details') {
     // this.getRecommendedJobsForUser(this.model)
      this.singleJob = job
    } else if (listName == 'Workshop1') {
      this.getWorkshopListing()
    } else if (listName == 'Workshop2') {
      this.getInternshipListing()
    }
  }

  modalTitle: string = 'Add Employment Details'
  employeeForm: FormGroup
  employee: any = []

  createEmployeeForm () {
    this.employeeForm = new FormGroup({
      _id: new FormControl(this.employee._id),
      employer: new FormControl(this.employee.employer, Validators.required),
      designation: new FormControl(
        this.employee.designation,
        Validators.required
      ),
      start_date: new FormControl(
        this.datePipe.transform(this.employee.start_date, 'YYYY-MM-dd'),
        Validators.required
      ),
      end_date: new FormControl(
        this.datePipe.transform(this.employee.end_date, 'YYYY-MM-dd')
      ),
      user_id: new FormControl(this.userID, Validators.required)
    })
  }

  addNewEmployee () {
    this.modalTitle = 'Add New Employment'
    this.createEmployeeForm()
  }

  cancelModal () {
    this.employee = []
    this.project = []
    this.certification = []
    this.education = []
    this.educationForm.reset()
  }

  project: any = []
  createProjectForm () {
    this.projectForm = new FormGroup({
      _id: new FormControl(this.project._id),
      project_title: new FormControl(
        this.project.project_title,
        Validators.required
      ),
      client_name: new FormControl(
        this.project.client_name,
        Validators.required
      ),
      project_description: new FormControl(
        this.project.project_description,
        Validators.required
      ),
      user_id: new FormControl(this.userID, Validators.required)
    })
  }

  certification: any = []
  createCertificateForm () {
    this.certificationForm = new FormGroup({
      _id: new FormControl(this.certification._id),
      certification_name: new FormControl(
        this.certification.certification_name,
        Validators.required
      ),
      certification_from: new FormControl(
        this.certification.certification_from,
        Validators.required
      ),
      year_of_completion_date: new FormControl(
        this.certification.year_of_completion_date,
        Validators.required
      ),
      user_id: new FormControl(this.userID, Validators.required)
    })
  }
  education: any = []
  createEducationForm () {
    //console.log(this.educationForm.value)
    this.educationForm = new FormGroup({
      _id: new FormControl(this.education._id),
      name: new FormControl(this.education.name, Validators.required),
      field_of_study: new FormControl(
        this.education.field_of_study,
        Validators.required
      ),
      institute_name: new FormControl(
        this.education.institute_name,
        Validators.required
      ),
      country: new FormControl(this.education.country, Validators.required),
      year_of_passing: new FormControl(
        this.education.year_of_passing,
        Validators.required
      ),
      course_type: new FormControl(
        this.education.course_type,
        Validators.required
      ),
      user_id: new FormControl(this.userID)
    })
  }

  changeCourseType (e: any) {
    this.courseTypeValue = e.target.value
  }
  addNewProject () {
    this.modalTitle = 'Add New Project'
    this.createProjectForm()
  }

  addNewCertification () {
    this.modalTitle = 'Add New Certification'
    this.createCertificateForm()
  }
  addNewEducation () {
    this.modalTitle = 'Add New Education'
    this.createEducationForm()
  }

  onCertificationSubmit () {
    if (!this.certificationForm.valid) {
      this.toaster.error('Please check the form erros')
      return
    }
    this.spinner.show()
    if (this.certificationForm.get('_id').value) {
      this.candidateService
        .updateCertification(
          this.certificationForm.value,
          this.certificationForm.get('_id').value
        )
        .subscribe(
          response => {
            this.spinner.hide()
            this.certificationResponse = response
            if (response && response.status_code == 1) {
              this.toaster.success(response.message)
              var index = this.userCertifications.findIndex(
                x => x._id == this.certificationForm.get('_id').value
              )
              if (index >= 0) {
                
                  (this.userCertifications[
                    index
                  ] = this.certificationForm.value)
                
              }
              document.getElementById('sb_forgot_msg2').click()
            }
          },
          err => {
            if (err && err.error) {
              if (err.error.status_code == 2) {
                this.toaster.error(err.error.message)
                this.spinner.hide()
              }
            }
          }
        )
    } else {
      this.candidateService
        .addCertification(this.certificationForm.value)
        .subscribe(
          response => {
            this.certificationResponse = response
            this.spinner.hide()
            if (response && response.status_code == 1) {
              this.toaster.success(response.message)
              // this.getCertificatiobnbyId()
              this.userCertifications.push(response.result[0])
              document.getElementById('sb_forgot_msg2').click()
            }
          },
          err => {
            if (err && err.error) {
              if (err.error.status_code == 2) {
                this.toaster.error(err.error.message)
                this.spinner.hide()
              }
            }
          }
        )
    }
  }

  onProjectSubmit () {
    if (!this.projectForm.valid) {
      this.toaster.error('Please check the form erros')
      return
    }
    this.spinner.show()
    if (this.projectForm.get('_id').value) {
      this.candidateService
        .updateProject(
          this.projectForm.value,
          this.projectForm.get('_id').value
        )
        .subscribe(
          response => {
            this.projectResponse = response
            this.spinner.hide()
            if (response && response.status_code == 1) {
              this.toaster.success(response.message)
            }
            var index = this.projectDetails.findIndex(
              x => x._id == this.projectForm.get('_id').value
            )
            if (index >= 0) {
              this.projectDetails[index] = this.projectForm.value
            }
            document.getElementById('sb_forgot_msg1').click()
          },
          err => {
            if (err && err.error) {
              if (err.error.status_code == 2) {
                this.toaster.error(err.error.message)
                this.spinner.hide()
              }
            }
          }
        )
    } else {
      this.candidateService.addProject(this.projectForm.value).subscribe(
        response => {
          this.projectResponse = response
          this.spinner.hide()
          if (response && response.status_code == 1) {
            this.toaster.success(response.message)
          }
          this.projectDetails.push(response.result[0])
          document.getElementById('sb_forgot_msg1').click()
        },
        err => {
          this.spinner.hide()
        }
      )
    }
  }

  onEmploymentSubmit () {
    if (!this.employeeForm.valid) {
      this.toaster.error('Please check the form errors')
      return
    }
    this.spinner.show()
    if (this.employeeForm.get('_id').value) {
      this.candidateService
        .updateEmployment(
          this.employeeForm.value,
          this.employeeForm.get('_id').value
        )
        .subscribe(
          response => {
            // this.emplo = response
            this.spinner.hide()
            if (response && response.status_code == 1) {
              this.toaster.success(response.message)
            }
            var index = this.userEmploymentDetails.findIndex(
              x => x._id == this.employeeForm.get('_id').value
            )
            if (index >= 0) {
              this.userEmploymentDetails[index] = this.employeeForm.value
            }
            document.getElementById('sb_forgot_msg').click()
          },
          err => {
            if (err && err.error) {
              if (err.error.status_code == 2) {
                this.toaster.error(err.error.message)
                this.spinner.hide()
              }
            }
          }
        )
    } else {
      this.candidateService.addEmployment(this.employeeForm.value).subscribe(
        response => {
          // this.projectResponse = response
          this.spinner.hide()
          if (response && response.status_code == 1) {
            this.toaster.success(response.message)
          }
          this.userEmploymentDetails.push(response.result[0])
          document.getElementById('sb_forgot_msg').click()
        },
        err => {
          if (err && err.error) {
            if (err.error.status_code == 2) {
              this.toaster.error(err.error.message)
              this.spinner.hide()
            }
          }
        }
      )
    }
  }
  onEducationSubmit () {
    this.isEducationFormSubmit = true
    if (!this.educationForm.valid) {
      this.toaster.error('Please check the form errors')
      return
    }
    this.spinner.show()
    if (this.educationForm.get('_id').value) {
      var loggin = true
      this.candidateService
        .editUserEducation(
          this.educationForm.get('_id').value,
          this.educationForm.value
        )
        .subscribe(
          res => {
            this.spinner.hide()
            if (res && res.status_code == 1) {
              this.toaster.success(res.message)
            }
            var index = this.userEducation.findIndex(
              x => x._id == this.educationForm.get('_id').value
            )
            if (index >= 0) {
              this.userEducation[index] = this.educationForm.value
            }
            document.getElementById('sb_forgot_msg3').click()
          },
          err => {
            this.spinner.hide()
            if (err && err.error) {
              if (err.error.status_code == 2) {
                this.toaster.error(err.error.message)
                this.spinner.hide()
              }
            }
          }
        )
    } else {
      this.spinner.show()
      var loggin = false
      this.candidateService.addEducation(this.educationForm.value).subscribe(
        res => {
          this.spinner.hide()

          if (res && res.status_code == 1) {
            this.toaster.success(res.message)
            this.userEducation.push(res.result)
            document.getElementById('sb_forgot_msg3').click()
          }
        },
        err => {
          this.spinner.hide()
          if (err && err.error) {
            if (err.error.status_code == 2) {
              this.toaster.error(err.error.message)
              this.spinner.hide()
            }
          }
        }
      )
    }
  }

  editEducation (id: any) {
    this.modalTitle = 'Modify Education Details'
    var education = this.userEducation.filter(x => x._id == id)

    if (education) {
      this.education = education[0]
      this.createEducationForm()
    } else this.toaster.error('No details found')
  }
  deleteUserEducation (id: any) {
    if (id) {
      this.spinner.show()
      this.candidateService.deleteUserEducation(id).subscribe(res => {
        this.spinner.hide()
        if (res && res.status_code == 1) {
          this.toaster.success(res.message)
          this.projectDetails = this.projectDetails.filter(x => x._id !== id)
          document.getElementById('sb_forgot_msg3').click()
          this.getUser()
        }
      })
    }
  }
  deleteUserProject (id: any) {
    if (id) {
      this.spinner.show()
      this.candidateService.deleteProject(id).subscribe(
        res => {
          this.spinner.hide()
          if (res && res.status_code == 1) {
            this.toaster.success(res.message)
            this.userEducation = this.userEducation.filter(x => x._id !== id)
            document.getElementById('sb_forgot_msg1').click()
            this.getUser()
          }
        },
        err => {
          if (err && err.error) {
            if (err.error.status_code == 2) {
              this.toaster.error(err.error.message)
              this.spinner.hide()
            }
          }
        }
      )
    }
  }

  deleteUserEmployment (id: any) {
    if (id) {
      this.spinner.show()
      this.candidateService.deleteEmployment(id).subscribe(
        res => {
          this.spinner.hide()
          if (res && res.status_code == 1) {
            this.toaster.success(res.message)
            this.userEmploymentDetails = this.userEmploymentDetails.filter(
              x => x.id !== id
            )
            document.getElementById('sb_forgot_msg').click()
          }
        },
        err => {
          if (err && err.error) {
            if (err.error.status_code == 2) {
              this.toaster.error(err.error.message)
              this.spinner.hide()
            }
          }
        }
      )
    }
  }

  deleteUserCertification (id: any) {
    if (id) {
      this.spinner.show()
      this.candidateService.deleteCertification(id).subscribe(
        res => {
          this.spinner.hide()
          if (res && res.status_code == 1) {
            this.toaster.success(res.message)
            this.userCertifications = this.userCertifications.filter(
              x => x._id !== id
            )
            document.getElementById('sb_forgot_msg2').click()
          }
        },
        err => {
          if (err && err.error) {
            if (err.error.status_code == 2) {
              this.toaster.error(err.error.message)
              this.spinner.hide()
            }
          }
        }
      )
    }
  }

  applyJob (job_id: any, is_already_applied: any) {
  
    if (job_id && !is_already_applied) {
      this.spinner.show()
      let model = { job_id: job_id, user_id: this.userID }
      
      this.candidateService.applyForJob(model).subscribe(
        res => {
      
          this.spinner.hide()
          if (res && res.status_code == 1) {
            this.toaster.success(res.message)
            this.getUser()
            this.getRecommendedJobsForUser(this.model)
            this.recomendedJob
            document.getElementById('jobList').click()
              
            // this.getWorkshopListing()
            // this.getInternshipListing()
          }
        },
        err => {
        
          if (err && err.error) {
            if (err.error.status_code == 2) {
              this.toaster.error(err.error.message)
              this.spinner.hide()
            }
          }
        }
      )
    }
  }

  getTimeDiff (postedDate: any) {
    return this.timeDiffCalc.timeDiffCalc(new Date(), new Date(postedDate))
  }

  userWorkshopListing: any = []
  workshopJobsCount: number = 0
  getWorkshopListing () {
    this.spinner.show()
    this.candidateService.getUserWorkshopList().subscribe(
      res => {
        if (res && res.status_code == 1) {
          this.userWorkshopListing = res.result
          this.workshopJobsCount = res.result.length
          this.singleJob = res.result[0]
        } else this.toaster.error(res.message)
      },
      err => {
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

  userInternshipListing: any = []
  internshipJobsCount: number = 0
  getInternshipListing () {
    this.spinner.show()
    this.candidateService.getUserInternshipList().subscribe(
      res => {
        if (res && res.status_code == 1) {
          this.userInternshipListing = res.result
          this.internshipJobsCount = res.result.length
          this.singleJob = res.result[0]
        } else this.toaster.error(res.message)
      },
      err => {
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
 
}
