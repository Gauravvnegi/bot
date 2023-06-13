import { Component, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-spa-form',
  templateUrl: './spa-form.component.html',
  styleUrls: ['./spa-form.component.scss'],
})
export class SpaFormComponent implements OnInit {
  preOptions = [
    { label: 'Saunday', value: 'sunday' },
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednesday', value: 'wednesday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },
  ];

  constructor(public controlContainer: ControlContainer) {}

  ngOnInit(): void {}
}
