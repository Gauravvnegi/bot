import { ENTER, COMMA, TAB } from '@angular/cdk/keycodes';
import { DOCUMENT } from '@angular/common';

import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ReceiversSearchItem } from '../../data-model/email.model';
import { EmailService } from '../../services/email.service';
import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';
import {
  CampaignForm,
  ListType,
  RecipientType,
} from '../../types/campaign.type';
import { Option } from '@hospitality-bot/admin/shared';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'hospitality-bot-to-receiver-field',
  templateUrl: './receiver-field.component.html',
  styleUrls: ['./receiver-field.component.scss'],
})
export class ReceiverFieldComponent
  implements OnInit, AfterViewInit, OnDestroy {
  parentFG: FormGroup;
  @Input() controlName: string;
  chipList = [];
  recipients: Option[] = [];
  entityId: string;
  disableInput = false;
  disabled = false;

  @Input() set recieverProps(value: RecieverProps) {
    Object.entries(value)?.forEach(([key, value]) => {
      this[key] = value;
    });
  }

  searchList: ReceiversSearchItem[];
  enableDropdown = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, TAB];
  $subscription = new Subscription();
  search = false;

  constructor(
    private _emailService: EmailService,
    private controlContainer: ControlContainer,
    private _campaignService: CampaignService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.parentFG = this.controlContainer.control as FormGroup;
    this.listenForEnableDropdown();
  }

  ngAfterViewInit() {
    this.document?.addEventListener(
      'click',
      this.handleClickOutside.bind(this)
    );
  }
  handleClickOutside(event: MouseEvent) {
    const dropdown = document.getElementById('reciever-field');
    if (
      dropdown &&
      !dropdown.contains(event.target as Node) &&
      this._emailService?.$enableDropdown?.[this.controlName].value
    ) {
      this._emailService?.$enableDropdown?.[this.controlName]?.next(false);
    }
  }

  /**
   * @function listenForEnableDropdown function to listen for dropdown enable.
   */
  listenForEnableDropdown() {
    this.$subscription.add(
      this._emailService.$enableDropdown[this.controlName].subscribe(
        (response) => {
          this.enableDropdown = response;
        }
      )
    );
  }

  /**
   * @function enableReceiverField function to enable receiver field.
   * @param event event object to stop propagation.
   */
  enableReceiverField(event?) {
    event?.stopPropagation();
    this.enableDropdownItems();
  }

  /**
   * @function enableDropdownItems function to enable dropdown items.
   */
  enableDropdownItems() {
    this._emailService.$enableDropdown[this.controlName].next(true);
    Object.keys(this._emailService.$enableDropdown).forEach((key) => {
      if (key !== this.controlName)
        this._emailService.$enableDropdown[key].next(false);
    });
  }

  /**
   * @function disableDropdownItems function to disable dropdown items.
   * @param event event object to stop propagation.
   */
  disableDropdownItems(event) {
    event.stopPropagation();
    this._emailService.$enableDropdown[this.controlName].next(false);
  }

  /**
   * @function addItemFromDropdown function to add item from dropdown.
   * @param event event object to store value.
   */
  addItemFromDropdown<TType extends RecipientType>(event: {
    type: TType;
    data: ListType<TType>;
  }) {
    let recipientLabels = [...this.inputControls.to.value, event.data.name];
    if (event.data.id) {
      // Check if a recipient with the same ID already exists
      const recipientWithSameId = this.recipients.find(
        (recipient) => recipient.value === event.data.id
      );

      if (!recipientWithSameId) {
        this.recipients.push({ label: event.data.name, value: event.data.id });
      }
    }
    if (event.data.id)
      this.inputControls.recipients.patchValue(this.recipients);
    this.inputControls.to.patchValue([...new Set(recipientLabels)]);
  }

  onRemoveChip(value: string) {
    const removedRecipient = this.recipients.find(
      (recipient) => recipient.label === value
    );
    const removedRecipientId = removedRecipient ? removedRecipient.value : null;

    this.recipients = this.recipients.filter(
      (recipient) => recipient.label !== value
    );

    this.inputControls.recipients.patchValue(this.recipients);

    const selectedIds = this._campaignService.selectedRecipient.value;
    const updatedSelectedIds = selectedIds.filter(
      (id) => id !== removedRecipientId
    );
    this._campaignService.selectedRecipient.next(updatedSelectedIds);
  }

  get inputControls() {
    return this.parentFG.controls as Record<
      keyof CampaignForm,
      AbstractControl
    >;
  }

  /**
   * @function ngOnDestroy unsubscribe subscription
   */
  ngOnDestroy() {
    this.document?.removeEventListener(
      'click',
      this.handleClickOutside.bind(this)
    );
    this.$subscription.unsubscribe();
  }
}

type RecieverProps = {
  entityId: string;
  chipList: string[];
  disableInput: boolean;
  disabled: boolean;
};
