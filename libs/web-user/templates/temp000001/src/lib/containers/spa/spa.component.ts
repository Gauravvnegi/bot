import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SpaConfigI } from 'libs/web-user/shared/src/lib/data-models/spaConfig.model';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';
import { SpaService } from 'libs/web-user/shared/src/lib/services/spa.service';

@Component({
  selector: 'hospitality-bot-spa',
  templateUrl: './spa.component.html',
  styleUrls: ['./spa.component.scss']
})
export class SpaComponent implements OnInit {

  spaForm: FormGroup;
  spaConfig: SpaConfigI;

  constructor(
    private _fb: FormBuilder,
    private _airportService: SpaService,
    private _paidService: PaidService
  ) {
    this.initSpaForm();
   }

  ngOnInit(): void {
    this.spaConfig = this.setFieldConfiguration();
  }

  initSpaForm() {
    this.spaForm = this._fb.group({
      personCount: ['', [Validators.required]],
      usageTime: ['', [Validators.required]],
    });
  }

  setFieldConfiguration() {
    return this._airportService.setFieldConfigForSpaDetails();
  }

  resetSpaData(){
    this.spaForm.reset();
  }

  submit(){
    console.log(this.spaForm.getRawValue());
    this._paidService.isServiceCompleted$.next(true);
  }
}
