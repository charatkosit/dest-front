import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OfficerService } from 'src/app/services/officer.service';
import { VisitorService } from 'src/app/services/visitor.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  
  officerCount!:number 
  visitorCount!:number


  constructor(
    private router: Router,
    private officerService: OfficerService,
    private visitorService: VisitorService) { }

  ngOnInit(): void {
    this.visitorService.getCount().subscribe(data => {
      this.visitorCount = data;
      console.log(data)
    })

    this.officerService.getOfficerCount().subscribe(data => {
      this.officerCount = data;
      console.log(data)

    })


  }

  onClickToVisitors(){
    this.router.navigate(['/visitors/visitor-list']);
  }

  onClickToOfficers(){
    this.router.navigate(['/officers/officer-list']);
  }


  // updateOfficerCount() {
  //   // หารให้ได้ 8 step
  //   let step = this.officerCount / 100
  //   if (this.currentOfficerCount < this.officerCount) {
  //     this.currentOfficerCount = this.currentOfficerCount + step;
  //   } else {
  //     this.currentOfficerCount = this.officerCount
  //   };

  // }

}
