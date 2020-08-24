import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BreakfastConfigI } from 'libs/web-user/shared/src/lib/data-models/breakfastConfig.model';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';
import { BreakfastService } from 'libs/web-user/shared/src/lib/services/breakfast.service';

@Component({
  selector: 'hospitality-bot-breakfast',
  templateUrl: './breakfast.component.html',
  styleUrls: ['./breakfast.component.scss']
})
export class BreakfastComponent implements OnInit {

  breakfastForm: FormGroup;
  breakfastConfig: BreakfastConfigI;

  constructor(
    private _fb: FormBuilder,
    private _airportService: BreakfastService,
    private _paidService: PaidService
  ) { 
    this.initBreakfastForm();
  }

  ngOnInit(): void {
    this.breakfastConfig = this.setFieldConfiguration();
  }

  initBreakfastForm() {
    this.breakfastForm = this._fb.group({
      personCount: ['', [Validators.required]],
      foodPackage: ['', [Validators.required]],
    });
  }

  setFieldConfiguration() {
    return this._airportService.setFieldConfigForBreakfastDetails();
  }

  resetBreakfastData(){
    this.breakfastForm.reset();
  }

  submit(){
    console.log(this.breakfastForm.getRawValue());
    //this._paidService.isServiceAdded$.next(true);
  }

}
