import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { CorporateServiceService } from '../../candidate-service/corporate-service.service'

@Component({
  selector: 'app-cr-email-verification',
  templateUrl: './cr-email-verification.component.html',
  styleUrls: ['./cr-email-verification.component.css']
})
export class CrEmailVerificationComponent implements OnInit {
  verifyForm: FormGroup
  email: any
  registeredUser: any
  isSubmitted: boolean = false
  result;
  userEmail
  constructor (
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private service: CorporateServiceService,
    private router: Router
  ) {
    this.registeredUser = JSON.parse(
      sessionStorage.getItem('registeredCorporate') || '{}'
    )
    this.userEmail =sessionStorage.getItem('userEmail')
    if (this.registeredUser && Object.keys(this.registeredUser).length > 0) {
      this.email = this.registeredUser.email
    }
    else if(this.userEmail && Object.keys(this.userEmail).length > 0){
      this.email=this.userEmail   
      } 
    else {
      this.router.navigate(['/corporate-login'])
    }
  }

  ngOnInit (): void {
    this.verifyForm = new FormGroup({
      otp: new FormControl('', Validators.required)
    })
  }
  onSubmit (model: { email: string; otp: number }) {
    model = { email: this.email, otp: +this.verifyForm.get('otp').value }

    this.isSubmitted = true

    if (this.verifyForm.invalid) {
      return this.toastr.error('Please enter the otp.')
    } else {
      this.spinner.show()
      this.service.emailVerify(model).subscribe(
        response => {
          this.spinner.hide()
          this.result = response

          if (response && response.status_code == 1) {
            this.toastr.success(this.result.message)
            this.router.navigate(['/corporate-login'])
          }
        },
        err => {
          this.spinner.hide()
          if (err && err.error) {
            if (err.error.status_code == 2) {
              this.toastr.error(err.error.message)
            }
          }
          this.spinner.hide()
        },
        () => {
          this.spinner.hide()
        }
      )
    }
  }
  resendOtp () {
    var model = { email: this.email }
    this.spinner.show();
    this.service.resendOTP(model).subscribe(response => {
      this.spinner.hide()
      var res = response
      if (res && res.status_code == 1) {
        this.toastr.success(res.message)
      } else {
        this.toastr.error(res.messsage)
      }
    },err => {
      this.spinner.hide()
    })
  }
}
