import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule
} from 'angularx-social-login'

import { RecaptchaModule } from 'ng-recaptcha'
import { NgxSpinnerModule } from 'ngx-spinner'
import { ToastrModule } from 'ngx-toastr'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { CoreModule } from './core/core.module'
import { HomeModule } from './home/home.module'
import { AuthGaurd } from './services/auth-gaurd.services'
import { CorporateModule } from './corporate/corporate.module'
import { CandidateModule } from './candidate/candidate.module'
import { TokenInterceptor } from './services/token-interceptors.service'
import { CommonModule, DatePipe } from '@angular/common'
import { SharedModule } from './shared/shared.module'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'
import { AdminModule } from './admin/admin.module';
import { TagInputModule } from 'ngx-chips';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'



@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HomeModule,
    CoreModule,
    CorporateModule,
    CandidateModule,
    ReactiveFormsModule,
    RecaptchaModule,
    NgxSpinnerModule,
    SocialLoginModule,
    SharedModule,
    NgxPaginationModule,
    AdminModule,
    TagInputModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      iconClasses: {
        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning'
      }
    }),
      NgbModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    AuthGaurd,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '329991838708-kf926v5e1mgnhj8nabs7erd6gjgugalu.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('354929702982066')
          }
        ]
      } as SocialAuthServiceConfig
    }
    // { provide: ErrorHandler, useClass: GlobalErrorHandlerService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
