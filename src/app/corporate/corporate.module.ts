import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BrowserModule } from '@angular/platform-browser'

import { CorporateRoutingModule } from './corporate-routing.module'
import { JobListingComponent } from './pages/job-listing/job-listing.component'
import { CorporateHomePageComponent } from './pages/corporate-home-page/corporate-home-page.component'
import { SharedModule } from '../shared/shared.module'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
// import { CorporateSignupComponent } from './pages/corporate-signup/corporate-signup.component'
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha'
import { CrEmailVerificationComponent } from './pages/cr-email-verification/cr-email-verification.component'
// import { CrLoginComponent } from './pages/cr-login/cr-login.component'

import { CrProfileComponent } from './pages/cr-profile/cr-profile.component'
import { CrHomeComponent } from './pages/cr-home/cr-home.component'
import { AuthGaurdService } from './candidate-service/auth-gaurd.service'
import { ChangePasswordComponent } from './pages/change-password/change-password.component'
import { NgxPaginationModule } from 'ngx-pagination'
import { EditCrProfileComponent } from './pages/edit-cr-profile/edit-cr-profile.component'
import { TagInputForm, TagInputModule } from 'ngx-chips'
import { AutocompleteLibModule } from 'angular-ng-autocomplete'
import { TokenInterceptorService } from './candidate-service/token-interceptor.service'
import { TokenInterceptor } from '../services/token-interceptors.service'

@NgModule({
  declarations: [
    JobListingComponent,
    CorporateHomePageComponent,
    // CorporateSignupComponent,
    CrEmailVerificationComponent,
    // CrLoginComponent,
    CrProfileComponent,
    CrHomeComponent,
    ChangePasswordComponent,
    EditCrProfileComponent
  ],
  imports: [
    CommonModule,
    CorporateRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    FormsModule,
    NgxPaginationModule,
    TagInputModule,
    AutocompleteLibModule,
    SharedModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    AuthGaurdService
  ]
})
export class CorporateModule {}
