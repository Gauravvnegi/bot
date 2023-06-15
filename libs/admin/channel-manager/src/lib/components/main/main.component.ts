import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RoomsData } from '../constants/bulkupdate-response';
import { RoomTypes } from '../../types/bulk-update.types';
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

  onChangeNesting(updatedObject: RoomTypes[]) {
    console.log('***Updated Object List***', updatedObject);
  }
}
