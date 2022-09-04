import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecaptchaErrorParameters } from 'ng-recaptcha';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../home-services/user.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
 isSubmitted:boolean = false;
 loginForm:FormGroup;
 captchaResponse:any;
 loginResponse:any;
 forgetPasswordForm:any;
 isEmailSubmit:boolean = false;

  constructor(private toastr:ToastrService,private spinner:NgxSpinnerService,
    private service:UserService,private router:Router) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      reCaptcha: new FormControl('', Validators.required)
    })
  }
  onSubmit(model:{ email: string; password: string }){
    this.isSubmitted = true
    model={email:this.loginForm.get('email').value,password:this.loginForm.get('password').value}

    if (this.loginForm.invalid) {
      this.toastr.error('Please fill all the mandotry fields.')
    } else {
      if (this.captchaResponse && model.email == 'admin@quazi.it' && model.password == 'adminadmin') {
        this.spinner.show()
        
        sessionStorage.setItem('adminEmail', JSON.stringify(model.email))
         this.spinner.hide()
         this.router.navigate(['/dashboard'])
        }
        else{
          this.spinner.hide();
          this.toastr.error('Incorrect email or password.')
        }
        
          
         
        
      
    }
  }
  resolved (captchaResponse: string) {
    this.captchaResponse = captchaResponse
  }
  public onError (errorDetails: RecaptchaErrorParameters): void {
    //   console.log(`reCAPTCHA error encountered; details:`, errorDetails);
  }
}
