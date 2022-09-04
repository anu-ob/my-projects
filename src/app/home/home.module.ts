import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BrowserModule } from '@angular/platform-browser'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha'

import { HomeRoutingModule } from './home-routing.module'
import { RegisterComponent } from './pages/register/register.component'
import { LoginComponent } from './pages/login/login.component'
import { HomePageComponent } from './pages/home-page/home-page.component'
import { HomeComponent } from './pages/home/home.component'
import { UserService } from './home-services/user.service'
import { ProfileComponent } from './pages/profile/profile.component'
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component'
import { NavHeaderComponent } from '../shared/components/nav-header/nav-header.component'
import { NavFooterComponent } from '../shared/components/nav-footer/nav-footer.component'

import { SharedModule } from '../shared/shared.module'
import { CorporateModule } from '../corporate/corporate.module'
import { CandidateModule } from '../candidate/candidate.module'
import { AuthGaurd } from '../services/auth-gaurd.services'
import { JobSearchComponent } from './pages/job-search/job-search.component'
import { ContactComponent } from './pages/contact/contact.component'
import { ChangePasswordComponent } from './pages/change-password/change-password.component'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'
import { NgSelectModule } from '@ng-select/ng-select'
import { AutocompleteLibModule } from 'angular-ng-autocomplete'
import { AdminLoginComponent } from './pages/admin-login/admin-login.component'

import { StudentHomeComponent } from './pages/student-home/student-home.component'
import { CrLoginComponent } from './pages/cr-login/cr-login.component'
import { CorporateSignupComponent } from './pages/corporate-signup/corporate-signup.component';
import { AboutUsComponent } from './pages/about-us/about-us.component'
import { CorporateHomeComponent } from './pages/corporate-home/corporate-home.component'

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    HomePageComponent,
    HomeComponent,
    ProfileComponent,
    EmailVerificationComponent,
    JobSearchComponent,
    ContactComponent,
    ChangePasswordComponent,
    AdminLoginComponent,
    CorporateHomeComponent,
    StudentHomeComponent,
    CrLoginComponent,
    CorporateSignupComponent,
    AboutUsComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    SharedModule,
    CorporateModule,
    CandidateModule,
    NgxPaginationModule,
    NgSelectModule,
    FormsModule,
    AutocompleteLibModule,
    SharedModule
  ],

  providers: [AuthGaurd]
})
export class HomeModule {}
