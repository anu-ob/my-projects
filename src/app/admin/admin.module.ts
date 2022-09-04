import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AdminRoutingModule } from './admin-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { JobsListingComponent } from './sidebar-components/jobs-listing/jobs-listing.component';
import { StudentsListingComponent } from './sidebar-components/students-listing/students-listing.component';
import { CorporateListingComponent } from './sidebar-components/corporate-listing/corporate-listing.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CorporateModalComponent } from './corporate-modal/corporate-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPrintModule } from 'ngx-print';
import { NgxPrintElementModule } from 'ngx-print-element';






@NgModule({
  declarations: [
    MainComponent,
    DashboardComponent,
    SidebarComponent,
    NavbarComponent,
    JobsListingComponent,
    StudentsListingComponent,
    CorporateListingComponent,
    CorporateModalComponent,
    
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    NgxPrintModule,
    NgxPrintElementModule,
  
  
  
  ],

})
export class AdminModule { }
