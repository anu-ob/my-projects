import { NgModule } from '@angular/core'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { CandidateRoutingModule } from './candidate-routing.module'
import { SharedModule } from '../shared/shared.module'
import { CommonModule } from '@angular/common'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { UserHomeComponent } from './pages/user-home/user-home.component'
import { UserHomePageComponent } from './pages/user-home-page/user-home-page.component'
import { UserProfileComponent } from './pages/user-profile/user-profile.component'
import { AuthGaurd } from '../services/auth-gaurd.services'
import { NgSelectModule } from '@ng-select/ng-select'
import { NgxPaginationModule } from 'ngx-pagination'
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha'
import { CdkStepperModule } from '@angular/cdk/stepper'
import { NgStepperModule } from 'angular-ng-stepper';
import { DigitalResumeComponent } from './pages/digital-resume/digital-resume.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';
import { PaymentFailComponent } from './pages/payment-fail/payment-fail.component';







@NgModule({
  declarations: [
    UserHomeComponent,
    UserHomePageComponent,
    UserProfileComponent,
    DigitalResumeComponent,
    PaymentComponent,
    PaymentSuccessComponent,
    PaymentFailComponent,
 
  ],
  imports: [
    CommonModule,
    CandidateRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    NgxPaginationModule,
    SharedModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    CdkStepperModule,NgStepperModule
   
  ],
  providers: [
   AuthGaurd]
})
export class CandidateModule {}
