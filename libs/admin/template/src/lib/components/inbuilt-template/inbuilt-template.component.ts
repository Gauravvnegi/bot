import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'hospitality-bot-inbuilt-template',
  templateUrl: './inbuilt-template.component.html',
  styleUrls: ['./inbuilt-template.component.scss'],
})
export class InbuiltTemplateComponent implements OnInit {
  constructor(private _location: Location) {}

  ngOnInit(): void {}

  goBack() {
    this._location.back();
  }
}
