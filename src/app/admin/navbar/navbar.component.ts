import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
logout(){
  sessionStorage.removeItem('admin_login')
  sessionStorage.removeItem('userEmail')
  sessionStorage.removeItem('currentUser')
  sessionStorage.removeItem('adminEmail')
  

  this.router.navigate(['/admin-login'])
}
}
