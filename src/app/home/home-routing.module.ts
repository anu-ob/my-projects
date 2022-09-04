import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGaurdService } from '../corporate/candidate-service/auth-gaurd.service'
import { AuthGaurd } from '../services/auth-gaurd.services'
import { AboutUsComponent } from './pages/about-us/about-us.component'
import { AdminLoginComponent } from './pages/admin-login/admin-login.component'
import { ChangePasswordComponent } from './pages/change-password/change-password.component'
import { ContactComponent } from './pages/contact/contact.component'
import { CorporateHomeComponent } from './pages/corporate-home/corporate-home.component'

import { CorporateSignupComponent } from './pages/corporate-signup/corporate-signup.component'
import { CrLoginComponent } from './pages/cr-login/cr-login.component'
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component'
import { HomePageComponent } from './pages/home-page/home-page.component'
import { HomeComponent } from './pages/home/home.component'
import { JobSearchComponent } from './pages/job-search/job-search.component'
import { LoginComponent } from './pages/login/login.component'
import { ProfileComponent } from './pages/profile/profile.component'
import { RegisterComponent } from './pages/register/register.component'
import { StudentHomeComponent } from './pages/student-home/student-home.component'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      //  { path: 'home', component: HomePageComponent },
      { path: '', component: StudentHomeComponent },
      { path: 'admin-login', component: AdminLoginComponent},
      { path: 'login', component: LoginComponent },
      { path: 'corporate-login', component: CrLoginComponent },
      { path: 'sign-up', component: RegisterComponent },
      { path: 'corporate-sign-up', component: CorporateSignupComponent },
      { path: 'email-verification', component: EmailVerificationComponent },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGaurd]
      },
      { path: 'job-search', component: JobSearchComponent },
      { path: 'contact-us', component: ContactComponent },
      { path: 'corporate', component: CorporateHomeComponent },
      { path: 'about-us',component:AboutUsComponent},

      {
        path: 'change-password',
        component: ChangePasswordComponent,canActivate: [AuthGaurd]
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
