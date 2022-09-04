import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CorporateServiceService } from '../../candidate-service/corporate-service.service';

@Component({
  selector: 'app-edit-cr-profile',
  templateUrl: './edit-cr-profile.component.html',
  styleUrls: ['./edit-cr-profile.component.css']
})
export class EditCrProfileComponent implements OnInit {
  profileForm:FormGroup;
  isSubmitted:boolean=false;
  companyType:[]=[]
  companyList:any;
  model:any;
  userDetails:any;
  userID:any
  user:any
  editedProfile:any;
  selectedValue;
  company_type_id;
  company_type_name;
  selectedCompany;
  updatedDetails:any;
  crDetails:any=[];
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
    this.getCorporateDetails(this.userID)
   
    
  
 
   
  }
getCorporateDetails(userID:any){
  
  this.service.getCrDetails(this.userID)
  .subscribe(res => {
    this.crDetails = res.result[0]
    this.companyList = this.crDetails.company_type_id
    this.company_type_name = this.crDetails.company_type_name
    this.profileForm = new FormGroup({
      first_name:new FormControl(this.crDetails.first_name,Validators.required),
      last_name: new FormControl(this.crDetails.last_name,Validators.required),
      company_name: new FormControl(this.crDetails.company_name,Validators.required),
      company_registration_number: new FormControl(this.crDetails.company_registration_number,Validators.required),
      company_hq: new FormControl(this.crDetails.company_hq,Validators.required),
      company_profile: new FormControl(this.crDetails.company_profile,Validators.required),
      complete_address: new FormControl(this.crDetails.complete_address,Validators.required),
      company_type_id:new FormControl(this.companyList,Validators.required),
      company_type_name:new FormControl(this.company_type_name),
      agreement_terms_conditions: new FormControl(this.crDetails.agreement_terms_conditions,Validators.required)
    })
  })
}
getCompanyType(){
  this.service.getCompanyType()
  .subscribe(res =>{

    this.companyType = res.result

  })
}
onSubmit (model:{first_name:string,
  last_name:string,
  company_name:string,
  company_registration_number:any,
  company_hq:string,
  company_profile:any,
  complete_address:any,
  company_type_id:any,
  company_type_name:any;
  agreement_terms_conditions:any}) {
    this.isSubmitted = true;
  
    model= {first_name:this.profileForm.get('first_name').value,
    last_name:this.profileForm.get('last_name').value,
    company_name:this.profileForm.get('company_name').value,
    company_registration_number:this.profileForm.get('company_registration_number').value,
    company_hq:this.profileForm.get('company_hq').value,
    company_profile:this.profileForm.get('company_profile').value,
    complete_address:this.profileForm.get('complete_address').value,
    company_type_id:this.companyList,
    company_type_name:this.company_type_name,
    agreement_terms_conditions:this.profileForm.get('agreement_terms_conditions').value}
  this.isSubmitted = true
  if (this.profileForm.invalid) {
    this.toastr.error('Please fill the form correctly.')
  } else {
    this.spinner.show()
  
    this.service.cr_profile(this.userID,model).subscribe(
      response => {
        this.spinner.hide()

        this.updatedDetails = response

        if (response && response.status_code == 1) {
          this.toastr.success(response.message)
          this.router.navigate(['/corporate-home'])
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
onCompanyChange(e:any){
 this.companyList = e.target.value
 this.selectedValue=this.companyList.split(',',2)
 if(this.companyList == '613e50779fa33893c1cf8632'){

   this.company_type_name = 'Software Development'
  }else if(this.companyList == '613e50819fa33893c1cf8634'){
  this.company_type_name = 'Software Testing'
  }

 
 

}
goToDashboard(){
  this.router.navigate(['/corporate-home'])
}

}
