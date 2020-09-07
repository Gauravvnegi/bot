import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Regex } from '../../../../../../../libs/shared/constants/regex';
import { SpecialAmenitiesService } from '../../services/special-amenities.service';

@Component({
  selector: 'hospitality-bot-special-amenities',
  templateUrl: './special-amenities.component.html',
  styleUrls: ['./special-amenities.component.scss']
})
export class SpecialAmenitiesComponent implements OnInit {

  file: File;
  amenityForm: FormGroup;
  fileSize: number = 3145728;
  fileType = ['png', 'jpg'];
  hotelPackage;

  constructor(
    private _fb: FormBuilder,
    private _amenitiesService: SpecialAmenitiesService
  ) {
    this.initAddAmenityForm();
   }

  ngOnInit(): void {
    this.getPackage();
  }

  initAddAmenityForm(){
    this.amenityForm = this._fb.group({
      packageName: ['', [Validators.required]],
      packageCode: ['', [Validators.required]],
      description: ['', [Validators.required]],
      type: ['', [Validators.required]],
      amount: ['',[Validators.required,Validators.pattern(Regex.NUMBER_REGEX)]],
      quantity: ['',[Validators.required]],
      status: []
    })
  }

  getPackage(){
    this._amenitiesService.getPackage('ad429112-a10f-47d6-989d-c83a1a5f0415').subscribe(response =>{
      console.log(response);
    })
  }

  uploadFile(event){
    console.log(event);
  }

  addAmenity(){
    console.log(this.amenityForm.getRawValue());
  }

}
