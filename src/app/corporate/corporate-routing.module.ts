import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { EmailVerificationComponent } from '../home/pages/email-verification/email-verification.component'
import { AuthGaurdService } from './candidate-service/auth-gaurd.service'
import { ChangePasswordComponent } from './pages/change-password/change-password.component'
import { CorporateHomePageComponent } from './pages/corporate-home-page/corporate-home-page.component'
// import { CorporateSignupComponent } from './pages/corporate-signup/corporate-signup.component'
import { CrEmailVerificationComponent } from './pages/cr-email-verification/cr-email-verification.component'
import { CrHomeComponent } from './pages/cr-home/cr-home.component'
// import { CrLoginComponent } from './pages/cr-login/cr-login.component'
import { CrProfileComponent } from './pages/cr-profile/cr-profile.component'
import { EditCrProfileComponent } from './pages/edit-cr-profile/edit-cr-profile.component'

import { JobListingComponent } from './pages/job-listing/job-listing.component'

const routes: Routes = [
  {
    path: '',
    component: CorporateHomePageComponent,
    children: [
      { path: '', component: CrHomeComponent },
       {
        path: 'corporate-home',
        component: CrHomeComponent,
        canActivate: [AuthGaurdService]
      },
      /* {
        path: 'corporate',
        component: CorporateHomeComponent,
        canActivate: [AuthGaurdService]
      },*/
      //  { path: 'corporate-home',component:CorporateHomeComponent},
      // { path: 'corporate-sign-up', component: CorporateSignupComponent },
      {
        path: 'corporate-email-verification',
        component: CrEmailVerificationComponent,
      
      },
      // { path: 'corporate-login', component: CrLoginComponent },
      {
        path: 'corporate-profile',
        component: CrProfileComponent,
        canActivate: [AuthGaurdService]
      },
      {
        path: 'corporate-edit-profile',
        component: EditCrProfileComponent,
        canActivate: [AuthGaurdService]
      },
      {
        path: 'job-listing',
        component: JobListingComponent,
        canActivate: [AuthGaurdService]
      },
     
      { path: 'corporate-change-password', component: ChangePasswordComponent }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorporateRoutingModule {}
