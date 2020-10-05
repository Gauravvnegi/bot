import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-admin-package-details',
  templateUrl: './admin-package-details.component.html',
  styleUrls: ['./admin-package-details.component.scss']
})
export class AdminPackageDetailsComponent implements OnInit {

  @Input() guestDetails;
  @Input() parentForm;
  
  constructor(
    private _fb: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  initPackageDetailsForm(){
    return this._fb.group({
    })
  }
}
