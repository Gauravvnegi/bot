import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavRouteOptions, Option } from '@hospitality-bot/admin/shared';
import { outletRoutes } from '../../constants/route';

@Component({
  selector: 'hospitality-bot-add-menu-item',
  templateUrl: './add-menu-item.component.html',
  styleUrls: ['./add-menu-item.component.scss'],
})
export class AddMenuItemComponent implements OnInit {
  useForm: FormGroup;
  pageTitle: string;
  navRoutes: NavRouteOptions;
  packageCode: string = '# will be auto generated';

  mealPreferences: Option[] = [
    {label: 'Veg', value: 'VEG'},
    {label: 'Non-Veg', value: 'NONVEG'}
  ]

  types: Option[] = [
    {label: 'Rice', value: 'RICE'},
    {label: 'Bread', value: 'BREAD'},
    {label: 'Pizza', value: 'PIZZA'},
  ]

  categories: Option[] = [
    {label: 'Appetizers', value: 'Appetizers'},
    {label: 'Deserts', value: 'DESERTS'},
    {label: 'Specials', value: 'SPECIALS'},
    {label: 'Beverages', value: 'BEVERAGES'}
  ]

  constructor(private fb: FormBuilder) {
    const { navRoutes, title } = outletRoutes['addMenuItem'];
    this.pageTitle = title;
    this.navRoutes = navRoutes;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.useForm = this.fb.group({
      active: [true],
      name: ['', Validators.required],
      mealPreference: ['', Validators.required],
      category: ['', Validators.required],
      type: ['', Validators.required],
      preparationTime: ['', Validators.required],
      unit: ['', Validators.required],
      dineInPrice: ['', Validators.required],
      hsnCode: ['', Validators.required],
      notes: ['', Validators.required]
    })
  }

  handleReset(){

  }

  handleSubmit(){
    
  }
}
