import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RoomsData } from '../constants/bulkupdate-response';
@Component({
  selector: 'hospitality-bot-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  checkbox: FormGroup;
  roomsData = RoomsData;
  useForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.checkbox = this.fb.group({
      luxury1: [],
      luxury2: [],
    });

    this.useForm = this.fb.group({
      update: ['RATE'], // RATE, AVAILABILITY,
      fromDate: [''],
      toDate: [''],
      roomType: [''],
      selectedDays: [[]],
    });
  }

  getFromGroup() {
    return this.fb.group({});
  }
}
