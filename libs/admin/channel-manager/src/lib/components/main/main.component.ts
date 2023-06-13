import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  checkbox: FormGroup;

  inventoryList = [
    {
      label: 'luxury',
      controlName: 'luxury',
      value: 'luxury',
      list: [
        {
          label: 'category1',
          controlName: 'category1',
          value: 'category1',
          list: [
            {
              label: 'subcategory1',
              controlName: 'subcategory1',
              value: 'subcategory1',
              list: [
                {
                  label: 'channel1',
                  controlName: 'channel1',
                  value: 'channel1',
                },
              ],
            },
          ],
        },
      ],
    },

    {
      label: 'luxury2',
      controlName: 'luxury2',
      value: 'luxury2',
      list: [
        {
          label: 'category1',
          controlName: 'category1',
          value: 'category1',
          list: [
            {
              label: 'subcategory1',
              controlName: 'subcategory1',
              value: 'subcategory1',
              list: [
                {
                  label: 'channel1',
                  controlName: 'channel1',
                  value: 'channel1',
                },
              ],
            },
          ],
        },
      ],
    },
  ];

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
      details: this.fb.array([]),
    });
  }

  getFromGroup() {
    return this.fb.group({});
  }
}

type roomTypes = {
  name: string;
  id: string;
  isSelected: boolean;
  variants: {
    id: string;
    name: string;
    isSelected: boolean;
    channels: {
      id: string;
      name: string;
      isSelected: boolean;
    }[];
  }[];
}[];
