import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomePageComponent } from '../home/pages/home-page/home-page.component'
import { HomeComponent } from '../home/pages/home/home.component'
import { AuthGaurd } from '../services/auth-gaurd.services'
import { DigitalResumeComponent } from './pages/digital-resume/digital-resume.component'
import { PaymentFailComponent } from './pages/payment-fail/payment-fail.component'
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component'
import { PaymentComponent } from './pages/payment/payment.component'
import { UserHomePageComponent } from './pages/user-home-page/user-home-page.component'
import { UserHomeComponent } from './pages/user-home/user-home.component'
import { UserProfileComponent } from './pages/user-profile/user-profile.component'

const routes: Routes = [
  {
    path: '',
    component: UserHomePageComponent,
    children: [
      { path: '', component: UserHomeComponent },
      { path: 'user', component: UserHomeComponent, canActivate: [AuthGaurd] },
      { path: 'digital-resume', component: DigitalResumeComponent },
      {
        path: 'user-profile',
        component: UserProfileComponent,
        canActivate: [AuthGaurd]
      },
      {
        path: 'payment',
        component: PaymentComponent,
        canActivate: [AuthGaurd]
      },
      {
        path: 'payment-success',
        component: PaymentSuccessComponent,
        canActivate: [AuthGaurd]
      },
      {
        path: 'payment-fail',
        component: PaymentFailComponent,
        canActivate: [AuthGaurd]
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateRoutingModule {}
