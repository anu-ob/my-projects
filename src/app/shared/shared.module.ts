import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavHeaderComponent } from './components/nav-header/nav-header.component';
import { NavFooterComponent } from './components/nav-footer/nav-footer.component';
import { RouterModule } from '@angular/router';
//import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [NavHeaderComponent,NavFooterComponent],
  imports: [
    RouterModule,
  CommonModule
  ],
  exports:[NavHeaderComponent,CommonModule,NavFooterComponent,RouterModule]
})
export class SharedModule { }
