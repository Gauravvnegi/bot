import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-upgrade-room-type',
  templateUrl: './upgrade-room-type.component.html',
  styleUrls: ['./upgrade-room-type.component.scss'],
})
export class UpgradeRoomTypeComponent implements OnInit {
  useForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.useForm = this.fb.group({
      roomType: [''],
      roomNumber: [''],
      ratePlan: [''],
      remarks: [''],
      amount: [''],
      chargeable: [false],
    });
  }
}
