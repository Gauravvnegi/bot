import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';
import { DefaultAmenityConfigI } from 'libs/web-user/shared/src/lib/data-models/defaultAmenityConfig.model';
import { DefaultAmenityService } from 'libs/web-user/shared/src/lib/services/default-amenity.service';
import { customPatternValid } from 'libs/web-user/shared/src/lib/services/validator.service';
import { Regex } from 'libs/web-user/shared/src/lib/data-models/regexConstant';

@Component({
  selector: 'hospitality-bot-default-amenity',
  templateUrl: './default-amenity.component.html',
  styleUrls: ['./default-amenity.component.scss']
})
export class DefaultAmenityComponent implements OnInit {

  @Input() uniqueData;
  @Input() amenityData;
  @Input() subPackageForm;

  defaultForm: FormGroup;
  defaultAmenityConfig: DefaultAmenityConfigI;

  constructor(
    private _fb: FormBuilder,
    private _paidService: PaidService,
    private _defaultService: DefaultAmenityService
  ) {
      this.initDefaultForm();
   }

  ngOnInit(): void {
    this.defaultAmenityConfig = this.setFieldConfiguration();
    this.addForm();
    this.populateFormData();
  }

  initDefaultForm() {
    this.defaultForm = this._fb.group({
      quantity:['',
      [
        Validators.required,
        customPatternValid({
          pattern: Regex.NUMBER_REGEX,
          msg: 'Please enter valid Quantity',
        }),
      ],],
      remarks:['']
    });
  }

  addForm(){
    this._paidService.uniqueData = this.uniqueData;
  }

  populateFormData(){
    this._defaultService.initDefaultDetailDS(this.amenityData);
    this.defaultForm.patchValue(
        this._defaultService.defaultDetails.defaultDetail);
    this._paidService.amenityForm = this.defaultForm;
    this._paidService.isComponentRendered$.next(true);
  }

  setFieldConfiguration() {
    return this._defaultService.setFieldConfigForDefaultAmenityDetails();
  }

}
