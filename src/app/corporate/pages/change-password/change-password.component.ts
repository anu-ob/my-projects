import { resolveSanitizationFn } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmPasswordValidator } from 'src/app/services/confirm-password.validator';
import { CorporateServiceService } from '../../candidate-service/corporate-service.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
form:FormGroup;
isSubmitted:boolean = false;
loginUser:any;
userID:any;
  constructor(private fb:FormBuilder,
    private service:CorporateServiceService,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService,
    private router: Router) { 
      
      this.loginUser = JSON.parse(sessionStorage.getItem('cr_login_user') || '{}')
    
      
      if(this.loginUser && Object.keys(this.loginUser).length > 0){
       this.userID = this.loginUser.body.result[0].user_id;
       
      }
    }

  ngOnInit(): void {
    this.form = this.fb.group({
      oldPassword: new FormControl('',Validators.required),
      newPassword: new FormControl('',Validators.required),
      confirmPassword: new FormControl('',Validators.required)
    },
    {
      validator: ConfirmPasswordValidator('newPassword', 'confirmPassword')
    })
  }
onSubmit(model:{oldPassword:any,newPassword:any}){
  model={oldPassword:this.form.get('oldPassword').value,newPassword:this.form.get('newPassword').value}
  this.isSubmitted = true

  if(this.form.invalid){
   this.toastr.error('Please fill the form correctly.')
  }
 else{
   this.spinner.show();
   this.service.changePassword(model,this.userID)
   .subscribe(res => {
     this.spinner.hide();
 
     
     if(res && res.status_code == 1){
       this.toastr.success(res.message);
       this.router.navigate(['/corporate-home'])
      }
    },err => {
 
      this.spinner.hide();
      if(err && err.error){
        if(err.error.status_code == 2){
          this.toastr.error(err.error.message)
        }
      }
    })
  }
}

}