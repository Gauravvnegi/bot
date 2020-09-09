import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Regex } from '../../../../../../shared/constants/regex';
import { SpecialAmenitiesService } from '../../services/special-amenities.service';

@Component({
  selector: 'hospitality-bot-edit-special-amenities',
  templateUrl: './edit-special-amenities.component.html',
  styleUrls: ['./edit-special-amenities.component.scss']
})
export class EditSpecialAmenitiesComponent implements OnInit {

  file: File;
  amenityForm: FormGroup;
  fileSize: number = 3145728;
  fileType = ['png', 'jpg'];
  uploadStatus;
  hotelPackage;

  constructor(
    private _fb: FormBuilder,
    private _amenitiesService: SpecialAmenitiesService
  ) {
    this.initAddAmenityForm();
   }

  ngOnInit(): void {
    this.prePopulateData();
  }

  initAddAmenityForm(){
    this.amenityForm = this._fb.group({
      packageName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      type: ['', [Validators.required]],
      amount: ['',[Validators.required,Validators.pattern(Regex.NUMBER_REGEX)]],
      image:[],
      status: [false]
    })
  }

  getAmenityData(){
    // get amenity details using package code
  }

  prePopulateData(){
    // Patch package data to form
  }

  uploadFile(event){
    let formData = new FormData();
    this.uploadStatus =   true;
    formData.append('file', event.file);
    this._amenitiesService.uploadAmenityImage('ad429112-a10f-47d6-989d-c83a1a5f0415','SPA', formData)
    .subscribe(response =>{
      this.amenityForm.get('image').patchValue(response.fileDownloadUri);
      this.uploadStatus =   false;
    },(error)=>{
      this.uploadStatus =   false;
    })
  }

  updateAmenity(){
    if(!this.amenityForm.valid){
      return;
    }
  }

}
