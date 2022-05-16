import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Regex } from '@hospitality-bot/shared';
import { contactConfig } from '../../constants/contact';

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
  salutationList = contactConfig.datatable.salutationList;
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
   * @function generateContactField To generates new add contact fields.
   */
  generateContactField() {
    this.contactFA.push(this.createContactFG());
  }

  /**
   * @function removeContactField To removes add contact field.
   * @param index The index number for which remove contact action will be done.
   * @returns Return true if there is only one contact field.
   */
  removeContactField(index: number) {
    if (this.contactFA.controls.length === 1) return;
    this.contactFA.removeAt(index);
  }

  /**
   * @function close To close add contact page.
   */
  close() {
    this.onContactClosed.emit({ status: false });
  }

  /**
   * @function submitContact To add contact in a record.
   * @returns Returns back to previous page if contact is invalid.
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
