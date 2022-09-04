import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-corporate-home',
  templateUrl: './corporate-home.component.html',
  styleUrls: ['./corporate-home.component.css']
})
export class CorporateHomeComponent implements OnInit {
  
  crUserLogin: any
  userID: any
  isLoggedIn: boolean = false
  loginUser: any
  isLoadingResult:boolean = false;
  data:any
  constructor(private router:Router) {
    this.crUserLogin = JSON.parse(
      sessionStorage.getItem('cr_login_user')
    )
    this.loginUser = JSON.parse(sessionStorage.getItem('login_user'))

    if (this.crUserLogin && Object.keys(this.crUserLogin).length > 0) {
      this.userID = this.crUserLogin.body.result[0].user_id

    } else if (this.loginUser && Object.keys(this.loginUser).length > 0) {
      this.userID = this.loginUser.body.result[0].user_id
    }
   }

  ngOnInit(): void {
  }
  postJob () {
    if (!(this.crUserLogin && this.userID)) {
      this.router.navigate(['/corporate-login'])
    } else if (this.crUserLogin && this.userID) {
      sessionStorage.setItem('post-job', '1')
      this.router.navigate(['/corporate-home'])
    }
  }
}
