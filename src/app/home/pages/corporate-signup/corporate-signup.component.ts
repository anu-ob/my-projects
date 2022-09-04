import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { RecaptchaErrorParameters } from 'ng-recaptcha'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { CorporateServiceService } from 'src/app/corporate/candidate-service/corporate-service.service'
import { ConfirmPasswordValidator } from 'src/app/services/confirm-password.validator'

@Component({
  selector: 'app-corporate-signup',
  templateUrl: './corporate-signup.component.html',
  styleUrls: ['./corporate-signup.component.css']
})
export class CorporateSignupComponent implements OnInit {
  signupForm: FormGroup
  isSubmitted: boolean = false
  captchaResponse: any
  signupResponse: any
  constructor (
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private service: CorporateServiceService,
    private router: Router
  ) {}

  ngOnInit (): void {
    this.signupForm = this.fb.group(
      {
        user_name: new FormControl('', Validators.required),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')
        ]),
        password: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.required),
        mobile_no: new FormControl('', Validators.required),
        reCaptcha: new FormControl('', Validators.required),
        terms: new FormControl('', Validators.required)
      },
      {
        validator: ConfirmPasswordValidator('password', 'confirmPassword')
      }
    )
  }

  onSubmit (model: { user_name: any; email: any; password: any; mobile_no }) {
    this.isSubmitted = true

    if (this.signupForm.invalid) {
      this.toastr.error('Please fill all the mandotry fields.')
    } else {
      this.spinner.show()
      if (this.captchaResponse) {
        this.service.signUp(model).subscribe(
          response => {
            this.spinner.hide()

            this.signupResponse = response

            if (response && response.status_code == 1) {
              this.toastr.success(this.signupResponse.message)
              sessionStorage.setItem(
                'registeredCorporate',
                JSON.stringify(this.signupResponse.result[0])
              )
              this.router.navigate(['/corporate-email-verification'])
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
  }
  resolved (captchaResponse: string) {
    this.captchaResponse = captchaResponse
  }
  public onError (errorDetails: RecaptchaErrorParameters): void {
    // console.log(`reCAPTCHA error encountered; details:`, errorDetails);
  }
}
