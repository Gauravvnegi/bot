import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Regex } from '@hospitality-bot/shared';
import { ListingService } from '../../services/listing.service';

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
    if (this.contacts.length) {
      this.contacts.forEach((i) => this.generateContactField());
      this.contactFA.patchValue(this.contacts);
    } else {
      this.generateContactField();
      this.generateContactField();
    }
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

  generateContactField() {
    this.contactFA.push(this.createContactFG());
  }

  removeContactField(index: number) {
    if (this.contactFA.controls.length === 1) return;
    this.contactFA.removeAt(index);
  }

  close() {
    this.onContactClosed.emit({ status: false });
  }

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
