import { HttpResponse } from '@angular/common/http'
import { Component, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { RecaptchaErrorParameters } from 'ng-recaptcha'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { CorporateServiceService } from 'src/app/corporate/candidate-service/corporate-service.service'

@Component({
  selector: 'app-cr-login',
  templateUrl: './cr-login.component.html',
  styleUrls: ['./cr-login.component.css']
})
export class CrLoginComponent implements OnInit {
  isSubmitted: boolean = false
  loginForm: FormGroup
  captchaResponse: any
  loginResponse: any
  forgetPasswordForm: any
  isEmailSubmit: boolean = false
  @ViewChild('closebutton') closebutton: any

  constructor (
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private service: CorporateServiceService,
    private router: Router
  ) {}

  ngOnInit (): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      reCaptcha: new FormControl('', Validators.required)
    })

    this.forgetPasswordForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')
      ])
    })
  }
  onSubmit (model: { email: string; password: string }) {
    this.isSubmitted = true
    model = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value
    }

    if (this.loginForm.invalid) {
      this.toastr.error('Please fill all the mandotry fields.')
    } else {
      if (this.captchaResponse) {
        this.spinner.show()
        sessionStorage.setItem('userEmail', JSON.stringify(model.email))
        this.service.login(model).subscribe(
          (res: HttpResponse<any>) => {
            this.spinner.hide()

            this.isSubmitted = false

            this.loginResponse = res
            if (this.loginResponse != undefined) {
              sessionStorage.setItem('cr_login_user', JSON.stringify(res))
              var result = JSON.parse(sessionStorage.getItem('cr_login_user'))
            }
            if (res && res.body.status_code == 1) {
              if (result.body.result[0].is_profile_complete == true) {
                this.toastr.success(res.body.message)

                this.router.navigate(['/corporate-home'])
              } else {
                this.toastr.success(res.body.message)

                this.router.navigate(['/corporate-profile'])
              }
            }
          },
          err => {
            this.spinner.hide()
            if (err && err.error) {
              if (err.error.status_code == 3 || err.error.status_code == 2) {
                this.toastr.error(err.error.message)
                if (err.error.status_code == 3) {
                  this.router.navigate(['/corporate-email-verification'])
                }
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
  forgetPassword (model: { email: any }) {
    this.isEmailSubmit = true

    if (this.forgetPasswordForm.invalid) {
      this.toastr.error('Please enter the email.')
    } else {
      this.spinner.show()
      this.service.crForgotPassword(model).subscribe(
        res => {
          this.spinner.hide()
          if (res && res.status_code == 1) {
            this.toastr.success(res.message)

            this.closebutton.nativeElement.click()
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
  
  resolved (captchaResponse: string) {
    this.captchaResponse = captchaResponse
  }
  public onError (errorDetails: RecaptchaErrorParameters): void {
    //   console.log(`reCAPTCHA error encountered; details:`, errorDetails);
  }
}
