
export class JobsListingModel{
    JobsListing:{
   job_name:string,
   company_name:string,

   creation_date:any
    }
    constructor(public job_name:string,public company_name:string,public creation_date:any){
     this.JobsListing.job_name = job_name,
     this.JobsListing.company_name = company_name
     this.JobsListing.creation_date = creation_date
    }
}