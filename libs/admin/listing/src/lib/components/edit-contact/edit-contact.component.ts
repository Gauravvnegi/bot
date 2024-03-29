import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseDatatableComponent, Regex } from '@hospitality-bot/admin/shared';
import { contactConfig } from '../../constants/contact';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

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

  readonly salutationList = contactConfig.datatable.salutationList;
  readonly cols = contactConfig.datatable.cols;

  constructor(
    public fb: FormBuilder,
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef
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
    this.generateContactField();
    this.generateContactField();
    this.generateContactField();
  }

  createFA(): void {
    this.contactFA = this.fb.array([]);
  }

  createContactFG(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.pattern(Regex.EMAIL_REGEX)]],
      salutation: ['Mr.', [Validators.required]],
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
}
