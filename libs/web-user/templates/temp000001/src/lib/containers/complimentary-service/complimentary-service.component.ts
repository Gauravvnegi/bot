import { Component, OnInit } from '@angular/core';
import { ComplimentaryService } from 'libs/web-user/shared/src/lib/services/complimentary.service';

@Component({
  selector: 'hospitality-bot-complimentary-service',
  templateUrl: './complimentary-service.component.html',
  styleUrls: ['./complimentary-service.component.scss']
})
export class ComplimentaryServiceComponent implements OnInit {

  constructor(
    private _complimentaryService: ComplimentaryService
  ) { }

  ngOnInit(): void {
  }

   get hotelComplimentaryAmenities(){
    return this._complimentaryService.complimentaryAmenities && 
    this._complimentaryService.complimentaryAmenities.complimentaryService;
  }
}
