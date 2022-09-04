import { DatePipe } from '@angular/common'
import { HttpResponse } from '@angular/common/http'
import { Route } from '@angular/compiler/src/core'
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { UserService } from 'src/app/home/home-services/user.service'
import { CandidateService } from '../../candidate-services/candidate.service'
import { environment } from 'src/environments/environment.prod'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup
  isSubmitted: boolean = false
  profile_pic: any
  imgURL: any
  resume: any
  loggedIn: boolean = false
  loginUser: any
  isLoggedIn: boolean = false
  userID: any
  userProfile: any
  skillsList: any = []
  skillID: any
  educationName: any
  maritalStatus: any
  socialLogin: any
  fbLogin: any
  selectedSkill: any = []
  profile_path_url: any
  showImage: boolean = false
  resume_path_url: any
  obj: any = []
  newArray: any
  constructor (
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private service: UserService,
    private router: Router,
    private candidateService: CandidateService,
    private datePipe: DatePipe
  ) {
    this.loginUser = JSON.parse(sessionStorage.getItem('login_user'))

    this.socialLogin = JSON.parse(sessionStorage.getItem('userConsent'))
    this.fbLogin = JSON.parse(sessionStorage.getItem('userData'))

    if (this.loginUser) {
      this.isLoggedIn = true
      this.userID = this.loginUser.body.result[0].user_id
    } else if (this.socialLogin) {
      this.isLoggedIn = true
      this.userID = this.socialLogin.result[0].user_id
    } else {
      this.userID = this.fbLogin.result[0].user_id
    }
  }

  ngOnInit (): void {
    this.getSkills()
    this.getProfileDetails(this.userID)
  }
  userDetails: any = []
  dateOfBirth: any
  getProfileDetails (userId: any) {
    this.spinner.show()
    this.candidateService.getUserbyId(this.userID).subscribe(
      response => {
        this.spinner.hide()
        this.userDetails = response.result[0]
        if (this.userDetails.skills) {
         this.selectedSkill = this.userDetails.skills.toString().split(',')
        }
        if (this.userDetails.profile_pic)
          this.profile_path_url =
            environment.imageUrl + this.userDetails.profile_pic
        if (this.userDetails.resume_file)

           this.resume_path_url =
            environment.imageUrl + this.userDetails.resume_file

        this.dateOfBirth = this.datePipe.transform(
          this.userDetails.dob,
          'YYYY-MM-dd'
        )
        this.profileForm = new FormGroup({
          first_name: new FormControl(
            this.userDetails.first_name,
            Validators.required
          ),
          last_name: new FormControl(
            this.userDetails.last_name,
            Validators.required
          ),
          languages: new FormControl(
            this.userDetails.languages,
            Validators.required
          ),
          profile_summary: new FormControl(
            this.userDetails.profile_summary,
            Validators.required
          ),
          countryCode: new FormControl(
            this.userDetails.countryCode,
            Validators.required
          ),
          residential_address: new FormControl(
            this.userDetails.residential_address,
            Validators.required
          ),
          description: new FormControl(
            this.userDetails.description,
            Validators.required
          ),
          /*education: new FormControl(
            this.userDetails.education,
            Validators.required
          ),*/
          experience: new FormControl(
            this.userDetails.experience,
            Validators.required
          ),
          gender: new FormControl(this.userDetails.gender, Validators.required),
          dob: new FormControl(this.dateOfBirth, Validators.required),
          marital_status: new FormControl(
            this.userDetails.marital_status,
            Validators.required
          ),
          agreement_terms_conditions: new FormControl(Validators.required),
          skills: new FormControl(this.selectedSkill, Validators.required),
          profile_pic: new FormControl(''),
          //   profile_path_url:new FormControl(this.profile_path_url),
          resume_file: new FormControl()
        })
      },
      err => {
        this.spinner.hide()
      }
    )
  }

  onSubmit (formData: FormData) {
    var terms: any =
      this.profileForm.get('agreement_terms_conditions').value == true ? 1 : 0
    formData = new FormData()
    formData.append('first_name', this.profileForm.get('first_name').value)
    formData.append('last_name', this.profileForm.get('last_name').value)
    formData.append('languages', this.profileForm.get('languages').value)
    formData.append(
      'profile_summary',
      this.profileForm.get('profile_summary').value
    )
    formData.append('countryCode', this.profileForm.get('countryCode').value)
    formData.append(
      'residential_address',
      this.profileForm.get('residential_address').value
    )
    formData.append('description', this.profileForm.get('description').value)
    //  formData.append('education', this.educationName)
    formData.append('experience', this.profileForm.get('experience').value)
    formData.append('gender', this.profileForm.get('gender').value)
    formData.append('dob', this.profileForm.get('dob').value)
    formData.append(
      'marital_status',
      this.maritalStatus || this.profileForm.get('marital_status').value
    )
    //  formData.append('agreement_terms_conditions', terms)
    formData.append('skills', this.profileForm.get('skills').value)
    formData.append('profile_pic', this.profile_pic)
    formData.append('resume_file', this.resume)

    this.isSubmitted = true
    if (this.profileForm.invalid) {
      this.toastr.error('Please fill the form correctly.')
    } else {
      this.spinner.show()
    
      this.service.updateProfile(this.userID, formData).subscribe(
        response => {
          this.spinner.hide()

          this.userProfile = response

          if (response && response.status_code == 1) {
            this.toastr.success(response.message)
            this.router.navigate(['/user'])
            //  sessionStorage.setItem('profileDetail',this.userProfile.body.result);
          }
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
  }
  getSkills () {
    this.service.getSkills().subscribe(response => {
      this.obj = response.result
      this.obj.filter(x => this.skillsList.push(x.skillName))
  
    })
  }
  addCustomUser = (term) => ({skillID: term, skillName: term});
  onSkillChange (e: any) {
    this.skillID = e.target.value
  }
  onChangeEducation (e: any) {
    this.educationName = e.target.value
  }
  onChangeMaritalStatus (e: any) {
    this.maritalStatus = e.target.value
  }
  selectProfile (event: any) {
    this.profile_pic = event.target.files[0]
    if (event.target.files && event.target.files[0]) {
      this.showImage = true
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = e => (this.profile_path_url = reader.result)
      reader.readAsDataURL(file)
    }
  }
  selectResume (event: any) {
    this.resume = event.target.files[0]

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = e => (this.resume_path_url = reader.result)
      reader.readAsDataURL(file)
    }
  

  }
  backToDashboard () {
    this.router.navigate(['/user'])
  }
}
