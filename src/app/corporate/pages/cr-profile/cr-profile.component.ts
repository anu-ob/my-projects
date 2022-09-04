import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CorporateServiceService } from '../../candidate-service/corporate-service.service';

@Component({
  selector: 'app-cr-profile',
  templateUrl: './cr-profile.component.html',
  styleUrls: ['./cr-profile.component.css']
})
export class CrProfileComponent implements OnInit {
  profileForm:FormGroup;
  isSubmitted:boolean=false;
  companyType:[]=[]
  companyList;
  model:any;
  userDetails:any;
  userID:any
  user:any
  editedProfile:any;
  selectedValue;
  company_type_id;
  company_type_name;
  constructor(private service:CorporateServiceService,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService,
    private router:Router) {
  this.userDetails = JSON.parse(sessionStorage.getItem('cr_login_user') || '{}')

  if(this.userDetails){
    this.userID = this.userDetails.body.result[0].user_id;

   this.user = this.userDetails.body.result[0]
  }
   }

  ngOnInit(): void {
   
  this.getCompanyType();
    this.profileForm = new FormGroup({
      first_name: new FormControl('',Validators.required),
      last_name: new FormControl('',Validators.required),
      company_name: new FormControl('',Validators.required),
      company_registration_number: new FormControl('',Validators.required),
      company_hq: new FormControl('',Validators.required),
      company_profile: new FormControl('',Validators.required),
      complete_address: new FormControl('',Validators.required),
      company_type_id: new FormControl(null,Validators.required),
      agreement_terms_conditions: new FormControl('',Validators.required)
    })
  }
  
  onSubmit(model:{first_name:string,
    last_name:string,
    company_name:string,
    company_registration_number:any,
    company_hq:string,
    company_profile:any,
    complete_address:any,
    company_type_id:any,
    company_type_name:any;
    agreement_terms_conditions:any}){
  this.isSubmitted = true;
  
  model= {first_name:this.profileForm.get('first_name').value,
  last_name:this.profileForm.get('last_name').value,
  company_name:this.profileForm.get('company_name').value,
  company_registration_number:this.profileForm.get('company_registration_number').value,
  company_hq:this.profileForm.get('company_hq').value,
  company_profile:this.profileForm.get('company_profile').value,
  complete_address:this.profileForm.get('complete_address').value,
  company_type_id:this.company_type_id,
  company_type_name:this.company_type_name,
  agreement_terms_conditions:this.profileForm.get('agreement_terms_conditions').value}
  
  if (this.profileForm.invalid) {
    this.toastr.error('Please fill the form correctly.')
  } else{
    this.spinner.show();
    this.service.cr_profile(this.userID,model)
    .subscribe(res => {
      this.spinner.hide();
  
      this.editedProfile =res
      
      if(res && res.status_code == 1){
        this.toastr.success(res.message);
        this.router.navigate(['/corporate-home'])
      }
      else{
        
      }
    },err => {
      this.spinner.hide();
      if (err && err.error) {
        if (err.error.status_code == 2) {
          this.toastr.error(err.error.message)
          this.spinner.hide()
        }
      }
    },() => {
      this.spinner.hide()
    })
  }
}
  
getCompanyType(){
  this.service.getCompanyType()
  .subscribe(res =>{

    this.companyType = res.result

  })
}
onCompanyChange(e){
 this.companyList=e.target.value
 this.selectedValue=this.companyList.split(',',2)
 this.company_type_id=this.selectedValue[0]
 this.company_type_name =this.selectedValue[1]

}

}
