import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin-service/admin.service';
import { SearchModel } from 'src/app/core/models/search-model'

import { CorporateModalComponent } from '../../corporate-modal/corporate-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-corporate-listing',
  templateUrl: './corporate-listing.component.html',
  styleUrls: ['./corporate-listing.component.css']
})
export class CorporateListingComponent implements OnInit {
  list=[]
  pageSizes = [5, 10, 20, 50, 100]
  constructor(private service:AdminService,private modal:NgbModal) { }
  model: SearchModel = new SearchModel()
  totalCount:number=0;
  currPage:number=1
  
  ngOnInit(): void {
    this.getCorporateList(this.model)
    this.getUserList(this.model)
   
  }
  getCorporateList(model:SearchModel){
    this.service.getCorporateList(this.model)
    .subscribe(res => {
    this.list=res.result[0].users
    this.totalCount=res.result[0].usersCount
    })
  }
  handlePageSizeChange (event: any): void {
    this.model.recordsPerPage = event.target.value
    this.model.pageNumber = 0
    this.getCorporateList(this.model)
  }
  handlePageChange (event: number): void {
    this.model.pageNumber = event > 0 ? event - 1 : event
    this.getCorporateList(this.model)
  }
  pageCallback(pageInfo: any) {
    this.currPage = pageInfo.page;
    //this.model.searchValue = this.search;
    this.model.pageNumber = pageInfo.page;
    this.getCorporateList(this.model);
  }
corpList:any
 getUserList(model:SearchModel){
   this.service.userList(this.model)
   .subscribe(res=>{
     this.corpList=res
   })
  }
modalForm:FormGroup;
 modalData:any
 openModal(row:any){

   this.modalData=row
   this.modalForm = new FormGroup({
    username:new FormControl(this.modalData.user_name),
    email:new FormControl(this.modalData.email),
    mobile_no:new FormControl(this.modalData.mobile_no),
    isVerified:new FormControl(this.modalData.is_email_verified),
  })
  }
 
}

