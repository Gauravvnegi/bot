import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Regex } from '@hospitality-bot/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { ContactList, IContact } from '../../data-models/listing.model';
import { ListingService } from '../../services/listing.service';

@Component({
  selector: 'hospitality-bot-import-contact',
  templateUrl: './import-contact.component.html',
  styleUrls: ['./import-contact.component.scss'],
})
export class ImportContactComponent implements OnInit {
  @Output() onImportClosed = new EventEmitter();
  @Input() hotelId: string;
  fileUploadData = {
    fileSize: 3145728,
    fileType: ['csv'],
  };
  contacts: IContact[];
  fileName = '';
  $subscription = new Subscription();
  constructor(
    private _fb: FormBuilder,
    private _listingService: ListingService,
    private _snackbarService: SnackBarService
  ) {
    this.createFA();
  }

  contactFA: FormArray;
  salutationList = [
    { name: 'Mr.', value: 'Mr.' },
    { name: 'Mrs.', value: 'Mrs.' },
    { name: 'Miss', value: 'Miss' },
  ];

  ngOnInit(): void {
    this.generateContactField();
    this.contactFA.controls.forEach((control) => control.disable());
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
    this.onImportClosed.emit({ status: false });
  }

  importContact(event) {
    let formData = new FormData();
    formData.append('file', event.file);
    this.$subscription.add(
      this._listingService.importContact(this.hotelId, formData).subscribe(
        (response) => {
          this.fileName = event.file.name;
          this.contacts = new ContactList().deserialize(response).records;
          this.contacts.forEach((contact, index) => {
            this.contactFA.controls[index].patchValue(contact);
            if (index < this.contacts.length - 1) {
              this.contactFA.push(this.createContactFG());
            }
          });
          this.contactFA.controls.forEach((control) => control.disable());
        },
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  save() {
    this.onImportClosed.emit({
      status: true,
      data: this.contactFA.getRawValue(),
    });
  }

  enableField(event) {
    if (event.target.checked)
      this.contactFA.controls.forEach((control) => control.enable());
    else this.contactFA.controls.forEach((control) => control.disable());
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
