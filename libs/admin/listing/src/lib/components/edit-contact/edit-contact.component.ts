import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseDatatableComponent, Regex } from '@hospitality-bot/admin/shared';
import { contactConfig } from '../../constants/contact';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ListingService } from '../../services/listing.service';
import { Contact, ContactList } from '../../data-models/listing.model';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';

@Component({
  selector: 'hospitality-bot-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: [
    './edit-contact.component.scss',
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
  ],
})
export class EditContactComponent extends BaseDatatableComponent
  implements OnInit {
  @Input() listId: string;
  @Input() contacts = [];
  @Output() onContactClosed = new EventEmitter();
  @Input() add: boolean;
  @Input() entityId: string;
  contactFA: FormArray;
  isSelectable: boolean = false;
  isSearchable: boolean = false;
  tableName: string = 'Add Contact';
  fileName: string = '';
  contactList: Contact[];
  isContactImported: boolean = false;

  $subscription = new Subscription();

  readonly salutationList = contactConfig.datatable.salutationList;
  readonly cols = contactConfig.datatable.cols;

  constructor(
    public fb: FormBuilder,
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private listingService: ListingService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService
  ) {
    super(fb);

    /**
     * @Remarks Extracting data from he dialog service
     */
    if (this.dialogConfig?.data) {
      Object.entries(this.dialogConfig.data).forEach(([key, value]) => {
        this[key] = value;
      });
    }
    this.createFA();
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    if (this.contactList?.length) {
      this.contactFA.controls = this.contactList.map((item) => {
        return this.createContactFG(item);
      });
    } else {
      this.generateContactField();
      this.generateContactField();
      this.generateContactField();
    }
  }

  createFA(): void {
    this.contactFA = this.fb.array([]);
  }

  createContactFG(data?: Contact): FormGroup {
    const emailPattern = Validators.pattern(Regex.EMAIL_REGEX);
    const namePattern = Validators.pattern(Regex.NAME);
    const numberPattern = Validators.pattern(Regex.NUMBER_REGEX);

    return this.fb.group({
      id: [data?.id || null],
      email: [data?.email || '', [Validators.required, emailPattern]],
      salutation: [data?.salutation || 'Mr', [Validators.required]],
      firstName: [data?.firstName || '', [Validators.required, namePattern]],
      lastName: [data?.lastName || '', [Validators.required, namePattern]],
      companyName: [data?.companyName || ''],
      mobile: [data?.mobile || '', [Validators.required, numberPattern]],
    });
  }

  importContact(event) {
    const formData = new FormData();
    formData.append('file', event.file);
    this.$subscription.add(
      this.listingService.importContact(this.entityId, formData).subscribe(
        (response) => {
          this.snackbarService.openSnackBarAsText(
            'Contact Imported successfully',
            '',
            { panelClass: 'success' }
          );

          this.fileName = event.file.name;
          this.contacts = new ContactList().deserialize(response).records;
          this.createFA();
          this.contactFA.controls = this.contacts.map((item) => {
            return this.createContactFG(item);
          });

          this.isContactImported = true;
        },
        ({ error }) => {}
      )
    );
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
  removeContactField(formGroup: FormGroup) {
    if (this.contactFA.controls.length === 1) {
      formGroup.reset();
      return;
    }
    this.contactFA.controls = this.contactFA.controls.filter(
      (data) => data !== formGroup
    );
    this.contactFA.updateValueAndValidity();
  }

  /**
   * @function close To close add contact page.
   */
  close() {
    this.onContactClosed.emit({ status: false }); // remove it
    this.dialogRef.close({ status: false });
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
    }); // need to remove
    this.dialogRef.close({
      status: true,
      data: this.contactFA.getRawValue(),
    });
  }

  get isEditContact() {
    return this.contactList?.length;
  }
}
