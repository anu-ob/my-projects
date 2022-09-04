import { Component, OnInit, ViewChild } from '@angular/core';
import { CandidateService } from 'src/app/candidate/candidate-services/candidate.service';
import { SearchModel } from 'src/app/core/models/search-model';
import { JobsListingModel } from './jobsListingModel';

@Component({
  selector: 'app-jobs-listing',
  templateUrl: './jobs-listing.component.html',
  styleUrls: ['./jobs-listing.component.css']
})
export class JobsListingComponent implements OnInit {
  searchedJobs;
  jobsListing:JobsListingModel[]=[]
  rows: any = [];
  totalJobCount:number=0;
  currPage: number = 1;
  keyword: string = '';
  isLoading: boolean = false;
  totalJobs:number;
  @ViewChild('mydatatable') table;
  
  constructor(private service:CandidateService) { }
  model: SearchModel = new SearchModel()
  ngOnInit(): void {
  this.getJobListing()
  }
getJobListing(){
  this.isLoading = true;
  this.service.getJobsForOpenListing(this.model)
    .subscribe(data=>{
      this.searchedJobs=data.result[0];
      this.jobsListing = data.result[0].searchedJobs;
      var lists:JobsListingModel[]=[];
      
      
      this.totalJobCount = data.result[0].total_jobs_count;
    
    },err=>{

    })
}

pageCallback(pageInfo: any) {
  this.isLoading = true
  this.currPage = pageInfo.page;
  this.model.pageNumber = pageInfo.page;
  // this.model.keyword = this.keyword;
  this.getJobListing();
}


}
