import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';

@Component({
  selector: 'hospitality-bot-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss'],
})
export class AddRoomComponent implements OnInit {
  useForm: FormGroup;
  useFormArray: FormArray;
  fields: IteratorField[] = [
    {
      label: 'Room No.',
      name: 'roomNo',
      type: 'input',
    },
    {
      label: 'Floor',
      name: 'floorNo',
      type: 'dropdown',
    },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.useFormArray = this.fb.array([
      this.fb.group({ roomNo: '', floorNo: '' }),
    ]);

    this.useForm = this.fb.group({
      type: [''],
      rooms: this.useFormArray,
    });
  }

  handleSubmit() {
    console.log(this.useForm.getRawValue(), 'formControl save');
  }
}
