import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss', '../../reservation.styles.scss'],
})
export class InstructionsComponent implements OnInit {
  parentFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    public controlContainer: ControlContainer
  ) {}

  ngOnInit(): void {
    this.addFormGroup();
  }

  addFormGroup() {
    this.parentFormGroup = this.controlContainer.control as FormGroup;
    const data = {
      specialInstructions: [''],
    };
    this.parentFormGroup.addControl('instructions', this.fb.group(data));
  }
}
