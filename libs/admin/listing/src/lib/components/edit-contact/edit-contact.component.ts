import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  BaseDatatableComponent,
  Cols,
  Regex,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { contactConfig } from '../../constants/contact';
import { Contact, ContactList } from '../../data-models/listing.model';
import { ListingService } from '../../services/listing.service';

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
  @Input() initialNumberOfRow: number = 3;

  $subscription = new Subscription();

  readonly salutationList = contactConfig.datatable.salutationList;
  cols = contactConfig.datatable.cols;

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

  // Inside your component class
  getUpdatedCols(): Cols[] {
    return this.cols.map((col) => ({
      ...col,
      isSortDisabled: true,
    }));
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    if (this.contactList?.length) {
      this.contactFA.controls = this.contactList.map((item) => {
        return this.createContactFG(item);
      });
    } else {
      for (let i = 0; i < this.initialNumberOfRow; i++) {
        this.generateContactField();
      }
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
      email: [data?.email || ''],
      salutation: [data?.salutation || 'Mr', [Validators.required]],
      firstName: [data?.firstName || '', [Validators.required, namePattern]],
      lastName: [data?.lastName || '', [Validators.required, namePattern]],
      companyName: [data?.companyName || ''],
      mobile: [data?.mobile || ''],
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
