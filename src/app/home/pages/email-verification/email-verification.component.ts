import { HttpResponse } from '@angular/common/http'
import { identifierModuleUrl } from '@angular/compiler'
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { UserService } from '../../home-services/user.service'

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {
  registeredUser: any
  email: any
  verifyForm: any
  isSubmitted: boolean = false
  result: any
  userEmail:any;

  constructor (
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private service: UserService,
    private router: Router
  ) {
    this.registeredUser = JSON.parse(
      sessionStorage.getItem('registeredUser') || '{}'
      )
    
    this.userEmail =sessionStorage.getItem('userEmail')
  
    
    if (this.registeredUser && Object.keys(this.registeredUser).length > 0) {
      this.email = this.registeredUser.email
    }
    else if(this.userEmail && Object.keys(this.userEmail).length > 0){
    this.email=this.userEmail
    
    }
    else {
      this.router.navigate(['/login'])
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
      this.service.verifyEmail(model).subscribe(
        response => {
          this.spinner.hide()
          this.result = response
          if (response && response.status_code == 1) {
            this.toastr.success(this.result.message)
            this.router.navigate(['/login'])
          }
        },
        err => {
    
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
    this.spinner.show()
    this.service.resendOtp(model).subscribe(response => {
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
