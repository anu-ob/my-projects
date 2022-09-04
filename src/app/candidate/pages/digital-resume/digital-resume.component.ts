import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-digital-resume',
  templateUrl: './digital-resume.component.html',
  styleUrls: ['./digital-resume.component.css']
})
export class DigitalResumeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    document.getElementById("defaultOpenList").click();
  }
  openListing(listName,elmnt,color,tcolor) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].style.backgroundColor = "";
      tablinks[i].style.color = "";
    }
    document.getElementById(listName).style.display = "block";
    elmnt.style.backgroundColor = color;
    elmnt.style.color = tcolor;

  }
  // Get the element with id="defaultOpen" and click on it

}
