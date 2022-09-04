import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CandidateService } from 'src/app/candidate/candidate-services/candidate.service';
import { SearchModel } from 'src/app/core/models/search-model';
import { CorporateServiceService } from 'src/app/corporate/candidate-service/corporate-service.service';
import { AdminService } from '../admin-service/admin.service';  
import * as XLSX from 'xlsx'; 


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  list=[];
  totalCorporate:number;
  totalStudent:number;
  totalJobCount:number
  @ViewChild('corporateList') corporateList:any;  
  title = 'Excel';  
 
  model: SearchModel = new SearchModel()
 
 
 
  constructor(private service:AdminService,
    private candidate:CandidateService) { }

  ngOnInit(): void {
  this.getCorporateList(this.model);
  this.getUserList(this.model);
  this.getJobListing()
  }
  studentList=[]
  getUserList(model:SearchModel){
    this.service.userList(this.model)
    .subscribe(res=>{
     
      this.studentList=res.result[0].users
    
      this.studentList=this.studentList.slice(0,6)
      this.totalStudent=res.result[0].usersCount

  
    })
  }
  getCorporateList(model:SearchModel){
    this.service.getCorporateList(this.model)
    .subscribe(res => {
    this.list=res.result[0].users
    this.list=this.list.slice(0,6)
    this.totalCorporate=res.result[0].usersCount
    })
  }
  getJobListing(){
    
    this.candidate.getJobsForOpenListing(this.model)
      .subscribe(data=>{
   
        
        
        this.totalJobCount = data.result[0].total_jobs_count;
      
      },err=>{
        // console.log(err)
      })
}

ExportTOExcel() {  
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.corporateList.any);  
  const wb: XLSX.WorkBook = XLSX.utils.book_new();  
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
  XLSX.writeFile(wb, 'ScoreSheet.xlsx');  
}
}
