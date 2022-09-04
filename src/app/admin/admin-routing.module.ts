import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteConfigLoadEnd, RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobsListingComponent } from './sidebar-components/jobs-listing/jobs-listing.component';
import { StudentsListingComponent } from './sidebar-components/students-listing/students-listing.component';
import { CorporateListingComponent } from './sidebar-components/corporate-listing/corporate-listing.component';


const routes:Routes = [
  {
    path:'',
    component:MainComponent,
    children:[
      {
        path:'',
        component: DashboardComponent
      },
    
      {
        path:'dashboard',
        component: DashboardComponent
      },
      {
        path:'jobs-listing',
        component: JobsListingComponent
      },
      {
        path:'students-listing',
        component: StudentsListingComponent
      },
      {
        path:'corporate-listing',
        component: CorporateListingComponent
      },
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class AdminRoutingModule { }
