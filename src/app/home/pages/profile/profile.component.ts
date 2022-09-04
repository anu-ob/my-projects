import { HttpResponse } from '@angular/common/http'
import { Route } from '@angular/compiler/src/core'
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { IDropdownSettings } from 'ng-multiselect-dropdown'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { UserService } from '../../home-services/user.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
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
  skillsList: [] = []
  skillID: any
  educationName: any
  maritalStatus: any
  socialLogin: any
  fbLogin: any
  dropdownSettings:IDropdownSettings={};
  selectedSkill:any
  constructor (
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private service: UserService,
    private router: Router
  ) {
    this.loginUser = JSON.parse(sessionStorage.getItem('login_user'))
    this.socialLogin = JSON.parse(sessionStorage.getItem('userConsent'))
    this.fbLogin = JSON.parse(sessionStorage.getItem('userData'))

    if (this.loginUser && Object.keys(this.loginUser).length > 0) {
      this.isLoggedIn = true
      this.userID = this.loginUser.body.result[0].user_id
    } else if (this.socialLogin && Object.keys(this.socialLogin).length > 0) {
      this.isLoggedIn = true
      this.userID = this.socialLogin.result[0].user_id
    } else {
      this.userID = this.fbLogin.result[0].user_id
    }
  }
   

  ngOnInit (): void {
    this.getSkills()
  
   

    this.profileForm = new FormGroup({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      profile_summary: new FormControl('', Validators.required),
      countryCode: new FormControl('', Validators.required),
      residential_address: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      education: new FormControl(null, Validators.required),
      experience: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      marital_status: new FormControl(null, Validators.required),
      agreement_terms_conditions: new FormControl(null, Validators.required),
      skills: new FormControl(null, Validators.required),
      profile_pic: new FormControl('', Validators.required),
      resume_file: new FormControl('', Validators.required),
      languages: new FormControl('', Validators.required)
    })
  }
  onSubmit (formData: FormData) {
    var terms: any =
      this.profileForm.get('agreement_terms_conditions').value == true ? 1 : 0
    formData = new FormData()
    formData.append('first_name', this.profileForm.get('first_name').value)
    formData.append('last_name', this.profileForm.get('last_name').value)
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
    formData.append('education', this.educationName)
    formData.append('experience', this.profileForm.get('experience').value)
    formData.append('languages', this.profileForm.get('languages').value)
    formData.append('gender', this.profileForm.get('gender').value)
    formData.append('dob', this.profileForm.get('dob').value)
    formData.append('marital_status', this.maritalStatus)
    formData.append('agreement_terms_conditions', terms)
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
          this.spinner.hide()
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
      if (response.status_code == 1) {
        this.skillsList = response.result
     }
      else this.toastr.error(response.message)
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
      const file = event.target.files[0]
      const reader = new FileReader()
      //reader.onload = e => this.imgURL = reader.result;
      reader.readAsDataURL(file)
    }
  }
  selectResume (event: any) {
    this.resume = event.target.files[0]
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const reader = new FileReader()
      // reader.onload = e => this.imgURL = reader.result;
      reader.readAsDataURL(file)
    }
  }
  backToDashboard(){
    
  }
}
