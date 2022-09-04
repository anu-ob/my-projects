import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { UserService } from 'src/app/home/home-services/user.service'

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  loginUser: any;
  paymentModel:any;
  amount:any;
  constructor (
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private service:UserService
  ) {
    this.loginUser = JSON.parse(sessionStorage.getItem('login_user'))
    this.paymentModel=JSON.parse(sessionStorage.getItem('paymentModel'))
    this.amount=this.paymentModel.price
    
  }

  ngOnInit (): void {
    this.route.queryParams.subscribe(params => {
    
      var session = params['session_id']
      if (session) {
        var userId = this.loginUser.body.result[0].user_id
        // var planId = 'price_1KTYXjA5SY6LLtq2Nn2Fo16e'
        let model = { user_id: userId, plan_id:this.paymentModel.plan_id, session_id: session }
      
        this.spinner.show()
        this.service.paymentSuccess(model)
        .subscribe(res => {
              var respponse: any = res
            
              this.spinner.hide()
            },
            err => {
              this.spinner.hide();
        
            }
          )
      }
        
        /*this.http
          .post(
            'http://localhost:3002/api/payments/quazi-payment-success',
            model
          )
          .subscribe(
            res => {
              var respponse: any = res
              this.spinner.hide()
            },
            err => {}
          )
      }*/
    })
  }
}
