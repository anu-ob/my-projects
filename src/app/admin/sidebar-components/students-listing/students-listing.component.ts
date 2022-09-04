import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SearchModel } from 'src/app/core/models/search-model'
import { AdminService } from '../../admin-service/admin.service';
@Component({
  selector: 'app-students-listing',
  templateUrl: './students-listing.component.html',
  styleUrls: ['./students-listing.component.css']
})
export class StudentsListingComponent implements OnInit {
  studentList=[]
  list=[]
  pageSizes = [5, 10, 20, 50, 100]
  currPage:number=1;
  totalCount:number;
  constructor(private service:AdminService) { }
  model: SearchModel = new SearchModel()
  ngOnInit(): void {
   this.getUserList(this.model)
   this.getUserList(this.model)
  }

  handlePageSizeChange (event: any): void {
    this.model.recordsPerPage = event.target.value
    this.model.pageNumber = 0
    this.getUserList(this.model)
  }
  handlePageChange (event: number): void {
    this.model.pageNumber = event > 0 ? event - 1 : event
    this.getUserList(this.model)
  }
  pageCallback(pageInfo: any) {
    this.currPage = pageInfo.page;
    //this.model.searchValue = this.search;
    this.model.pageNumber = pageInfo.page;
    this.getUserList(this.model);
  }
 getUserList(model:SearchModel){
   this.service.userList(this.model)
   .subscribe(res=>{
     this.studentList=res.result[0].users
     this.totalCount=res.result[0].usersCount
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
