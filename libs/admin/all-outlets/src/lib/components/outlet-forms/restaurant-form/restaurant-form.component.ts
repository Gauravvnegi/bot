import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { outletRoutes } from '../../../constants/routes';
@Component({
  selector: 'hospitality-bot-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss'],
})
export class RestaurantFormComponent implements OnInit {
  routes = outletRoutes;
  
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