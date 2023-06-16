import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { dates } from '../../constants/data';

@Component({
  selector: 'hospitality-bot-update-inventory',
  templateUrl: './update-inventory.component.html',
  styleUrls: ['./update-inventory.component.scss'],
})
export class UpdateInventoryComponent implements OnInit {
  useForm: FormGroup;
  roomTypes: [
    { label: 'Luxury'; value: 'Luxury' },
    { label: 'Deluxe'; value: 'Deluxe' }
  ];

  dates = dates;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.useForm = this.fb.group({
      roomType: [''],
    });
  }
}
