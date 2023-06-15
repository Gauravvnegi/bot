import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RoomsData } from '../constants/bulkupdate-response';
import { RoomTypes } from '../../types/bulk-update.types';

@Component({
  selector: 'hospitality-bot-bulk-update',
  templateUrl: './bulk-update.component.html',
  styleUrls: ['./bulk-update.component.scss'],
})
export class BulkUpdateComponent implements OnInit {
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
