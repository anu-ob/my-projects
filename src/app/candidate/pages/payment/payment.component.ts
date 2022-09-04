import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { UserService } from 'src/app/home/home-services/user.service'

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  loginUser: any;
  HighlightRow : Number;  
  
  selectedRow:any;
  plane_id:any;
  constructor (
    private http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private service:UserService
  ) {
    this.loginUser = JSON.parse(sessionStorage.getItem('login_user'))
    
  }

  ngOnInit (): void {
   this.getPlans()
  }
  clickedRow(index,data){  
    this.HighlightRow = index;  
    this.selectedRow = data
    this.plane_id=this.selectedRow.plan_id;

} 
  plansList=[]
  getPlans(){
    this.service.getPaymentPlans()
    .subscribe(res=>{
      this.plansList=res.result
    })
  }
  makePayment () {
    //get the clicked plan id
    var userId = this.loginUser.body.result[0].user_id
    var email_id = this.loginUser.body.result[0].email
    let paymentModel = { user_id: userId, email: email_id, plan_id: this.plane_id }
    sessionStorage.setItem('paymentModel',JSON.stringify(this.selectedRow))
    this.spinner.show()
    this.service.makePayment(paymentModel)
    .subscribe(
      res => {
        this.spinner.hide()
        var response: any = res
        this.spinner.hide()
        window.location.href = response.url
      },
      err => {
        if (err && err.error) {
          if (err.error.status_code == 2) {
            this.toastr.error(err.error.message)

            this.spinner.hide()
          }
        this.spinner.hide()

      }
    
    }
    )

 /*   this.http
      .post('http://localhost:3002/api/payments/quazi-payment', paymentModel)
      .subscribe(
        res => {
          var respponse: any = res
          this.spinner.hide()
          window.location.href = respponse.url
        },
        err => {}
      )*/
  }
}
