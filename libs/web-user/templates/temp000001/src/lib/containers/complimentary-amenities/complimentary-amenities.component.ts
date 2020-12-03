import { Component, OnInit } from '@angular/core';
import { ComplimentaryService } from 'libs/web-user/shared/src/lib/services/complimentary.service';

@Component({
  selector: 'hospitality-bot-complimentary-amenities',
  templateUrl: './complimentary-amenities.component.html',
  styleUrls: ['./complimentary-amenities.component.scss']
})
export class ComplimentaryAmenitiesComponent implements OnInit {

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
