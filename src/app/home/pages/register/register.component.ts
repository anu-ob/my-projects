import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { RecaptchaErrorParameters } from 'ng-recaptcha'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { ConfirmPasswordValidator } from 'src/app/services/confirm-password.validator'
import { UserDataSharingService } from '../../home-services/user-data-sharing.service'
import { UserService } from '../../home-services/user.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signupForm: FormGroup

  imgURL: any
  image: any
  education: string
  isSubmitted: boolean = false
  signupResponse: any
  captchaResponse: any
  formData1: FormData
  verifyEmail: any
  verifyOtp: any
  userDetails: any
  constructor (
    private service: UserService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private userDataSharingService: UserDataSharingService,
    private router: Router
  ) {
    this.userDataSharingService.getUserInfo().subscribe(res => {
      this.userDetails = res
    })
  }

  ngOnInit (): void {
    this.signupForm = this.fb.group(
      {
        user_name: new FormControl('', Validators.required),
        email: new FormControl(this.userDetails.email,[Validators.required,Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]),
        password: new FormControl('', Validators.required),
        matchPassword: new FormControl('', [Validators.required]),
        mobile_no: new FormControl('', Validators.required),
        termNconditions: new FormControl('', Validators.required),
        reCaptcha: new FormControl('', Validators.required)
      },
      {
        validator: ConfirmPasswordValidator('password', 'matchPassword')
      }
    )
  }

  onSubmit (model: { user_name: any; email: any; password: any; mobile_no }) {
    this.isSubmitted = true

    if (this.signupForm.invalid) {
      this.toastr.error('Please fill all the mandotry fields.')
    } else {
      if (this.captchaResponse) {
        this.spinner.show()
        this.service.registeration(model).subscribe(
          response => {
            this.spinner.hide()
            
            this.signupResponse = response

            if (response && response.status_code == 1) {
              this.toastr.success(this.signupResponse.message)
              sessionStorage.setItem(
                'registeredUser',
                JSON.stringify(this.signupResponse.result[0])
              )
              this.router.navigate(['/email-verification'])
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
    }
  }

  onSelectFile (event: any) {
    this.image = event.target.files[0]
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = e => (this.imgURL = reader.result)
      reader.readAsDataURL(file)
    }
  }

  selectEducation (event: any) {
    this.education = event.target.value
  }

  resolved (captchaResponse: string) {
    this.captchaResponse = captchaResponse
  }
  public onError (errorDetails: RecaptchaErrorParameters): void {
    // console.log(`reCAPTCHA error encountered; details:`, errorDetails);
  }
}
