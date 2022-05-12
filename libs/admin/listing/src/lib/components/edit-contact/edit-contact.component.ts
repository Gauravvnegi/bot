import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Regex } from '@hospitality-bot/shared';

@Component({
  selector: 'hospitality-bot-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss'],
})
export class EditContactComponent implements OnInit {
  @Input() listId: string;
  @Input() contacts = [];
  @Output() onContactClosed = new EventEmitter();
  @Input() add: boolean;
  @Input() hotelId: string;
  contactFA: FormArray;
  salutationList = [
    { name: 'Mr.', value: 'Mr.' },
    { name: 'Mrs.', value: 'Mrs.' },
    { name: 'Miss', value: 'Miss' },
  ];
  constructor(private _fb: FormBuilder) {
    this.createFA();
  }

  ngOnInit(): void {
    this.generateContactField();
    this.generateContactField();
    this.generateContactField();
  }

  createFA(): void {
    this.contactFA = this._fb.array([]);
  }

  createContactFG(): FormGroup {
    return this._fb.group({
      email: ['', [Validators.required, Validators.pattern(Regex.EMAIL_REGEX)]],
      salutation: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.pattern(Regex.NAME)]],
      lastName: ['', [Validators.required, Validators.pattern(Regex.NAME)]],
      companyName: [''],
      mobile: [
        '',
        [Validators.required, , Validators.pattern(Regex.NUMBER_REGEX)],
      ],
    });
  }

  /**
   * @function generateContactField generates add contact fields.
   */
  generateContactField() {
    this.contactFA.push(this.createContactFG());
  }

  /**
   * @function removeContactField removes add contact field.
   * @param index the index number for which remove contact action will be done.
   * @returns return true if there is only one contact field.
   */
  removeContactField(index: number) {
    if (this.contactFA.controls.length === 1) return;
    this.contactFA.removeAt(index);
  }

  /**
   * @function close closes contact page.
   */
  close() {
    this.onContactClosed.emit({ status: false });
  }

  /**
   * @function submitContact adds contact in a record.
   * @returns returns back to previous page if contact is invalid.
   */
  submitContact() {
    if (this.contactFA.invalid) {
      this.contactFA.markAllAsTouched();
      return;
    }
    this.onContactClosed.emit({
      status: true,
      data: this.contactFA.getRawValue(),
    });
  }
}
