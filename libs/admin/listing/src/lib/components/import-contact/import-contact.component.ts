import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Regex } from '@hospitality-bot/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { ContactList, IContact } from '../../data-models/listing.model';
import { ListingService } from '../../services/listing.service';
import { TranslateService } from '@ngx-translate/core';
import { contactConfig } from '../../constants/contact';

@Component({
  selector: 'hospitality-bot-import-contact',
  templateUrl: './import-contact.component.html',
  styleUrls: ['./import-contact.component.scss'],
})
export class ImportContactComponent implements OnInit {
  @Output() onImportClosed = new EventEmitter();
  @Input() hotelId: string;
  fileUploadData = contactConfig.datatable.fileUploadData;
  contacts: IContact[];
  fileName = '';
  $subscription = new Subscription();
  constructor(
    private _fb: FormBuilder,
    private _listingService: ListingService,
    protected _translateService: TranslateService,
    private _snackbarService: SnackBarService
  ) {
    this.createFA();
  }

  contactFA: FormArray;
  salutationList =contactConfig.datatable.salutationList;

  ngOnInit(): void {
    this.generateContactField();
    this.contactFA.controls.forEach((control) => control.disable());
  }

  createFA(): void {
    this.contactFA = this._fb.array([], Validators.required);
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
    this.onImportClosed.emit({ status: false });
  }

  /**
   * @function importContact imports contact into record.
   * @param event event for which import action will be done.
   */
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
        ({ error }) => {
          this._snackbarService.openSnackBarWithTranslate(
            {
              translateKey: 'message.error.contact_not_import',
              priorityMessage: error.message,
            },
            ''
          )
          .subscribe();
        }
      )
    );
  }

  /**
   * @function save save contact data into a record.
   * @return returns to perivous page contact is not imported.
   */
  save() {
    if (
      this.contactFA.controls.length === 1 &&
      this.contactFA.controls[0].value.email === ''
    ) {
      this._snackbarService.openSnackBarWithTranslate(
        {
          translateKey: 'message.error.contact_not_import',
          priorityMessage: 'Please import a contact file.',
        },
        ''
      )
      .subscribe();
      return;
    }
    this.onImportClosed.emit({
      status: true,
      data: this.contactFA.getRawValue(),
    });
  }

  /**
   * @function enableField enables contact field.
   * @param event event for which field will be enable.
   */
  enableField(event) {
    if (event.target.checked)
      this.contactFA.controls.forEach((control) => control.enable());
    else this.contactFA.controls.forEach((control) => control.disable());
  }

   /**
   * @function ngOnDestroy to unsubscribe subscription
   */
  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
