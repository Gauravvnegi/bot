import { ENTER, COMMA, TAB } from '@angular/cdk/keycodes';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { trim } from 'lodash';
import { Subscription } from 'rxjs';
import { campaignConfig } from '../../constant/campaign';
import {
  ReceiversSearch,
  ReceiversSearchItem,
} from '../../data-model/email.model';
import { CampaignService } from '../../services/campaign.service';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'hospitality-bot-to-receiver-field',
  templateUrl: './receiver-field.component.html',
  styleUrls: ['./receiver-field.component.scss'],
})
export class ReceiverFieldComponent implements OnInit, OnDestroy {
  @ViewChild('receiverField') receiverField;
  @Input() chipList = [];
  @Input() name: string;
  @Input() entityId: string;
  @Input() disableInput = false;
  @Input() disabled = false;
  @Output() updateChipSet = new EventEmitter();
  searchList: ReceiversSearchItem[];
  enableDropdown = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, TAB];
  $subscription = new Subscription();
  search = false;
  constructor(
    private _emailService: EmailService,
    private _campaignService: CampaignService
  ) {}

  ngOnInit(): void {
    this.listenForEnableDropdown();
  }

  ngOnChanges() {
    if (this.disableInput) {
      this.removeField(null);
      this.disableInput = false;
    }
  }

  /**
   * @function listenForEnableDropdown function to listen for dropdown enable.
   */
  listenForEnableDropdown() {
    this.$subscription.add(
      this._emailService.$enableDropdown[this.name].subscribe((response) => {
        this.enableDropdown = response;
        if (!response) {
          this.removeField(null);
        }
      })
    );
  }

  /**
   * @function removeChip function to remove chip.
   * @param index particular chip index value.
   * @param event event object to stop propagation.
   */
  removeChip(index, event) {
    event.stopPropagation();
    this.updateChipSet.emit({
      action: 'remove',
      value: index,
    });
    if (!this.chipList.length) this.enableTextField();
  }

  /**
   * @function removeField function to remove the form field.
   * @param event event for the same.
   */
  removeField(event) {
    if (
      !trim(this.receiverField?.nativeElement.value).length &&
      this.chipList.length
    ) {
      this.receiverField?.nativeElement.setAttribute(
        'style',
        'display: none !important;'
      );
    }
  }

  /**
   * @function addChip function to add chip set.
   * @param event event to stop propagation.
   */
  addChip(event) {
    event.stopPropagation();
    if (this.separatorKeysCodes.includes(event.which)) {
      this.updateChipSet.emit({
        value: {
          data: { name: this.receiverField.nativeElement.value },
          type: 'email',
        },
        action: 'add',
      });
      this.receiverField.nativeElement.value = '';
      this.search = false;
      this.enableReceiverField();
    }
  }

  /**
   * @function searchKey function to search on the basis of key.
   * @param event event object to stop propagation.
   */
  searchKey(event) {
    event.stopPropagation();
    const key = trim(this.receiverField.nativeElement.value);
    if (!this.separatorKeysCodes.includes(event.which) && key.length > 0) {
      this.$subscription.add(
        this._campaignService
          .searchReceivers(this.entityId, key)
          .subscribe((response) => {
            this.search = true;
            this.searchList = new ReceiversSearch().deserialize(
              response
            ).records;
          })
      );
    } else {
      this.search = false;
      this.searchList = new ReceiversSearch().deserialize({}).records;
    }
  }

  /**
   * @function enableReceiverField function to enable receiver field.
   * @param event event object to stop propagation.
   */
  enableReceiverField(event?) {
    event?.stopPropagation();
    this.enableTextField();
    this.enableDropdownItems();
    this.receiverField.nativeElement.focus();
  }

  /**
   * @function enableDropdownItems function to enable dropdown items.
   */
  enableDropdownItems() {
    this._emailService.$enableDropdown[this.name].next(true);
    Object.keys(this._emailService.$enableDropdown).forEach((key) => {
      if (key !== this.name)
        this._emailService.$enableDropdown[key].next(false);
    });
  }

  /**
   * @function disableDropdownItems function to disable dropdown items.
   * @param event event object to stop propagation.
   */
  disableDropdownItems(event) {
    event.stopPropagation();
    this._emailService.$enableDropdown[this.name].next(false);
  }

  /**
   * @function addItemFromDropdown function to add item from dropdown.
   * @param event event object to store value.
   */
  addItemFromDropdown(event) {
    this.updateChipSet.emit({
      value: event,
      action: campaignConfig.add,
    });
    this.receiverField.nativeElement.value = '';
    this.search = false;
    this.enableTextField();
  }

  /**
   * @function enableTextField function to enable text field.
   */
  enableTextField() {
    this.receiverField.nativeElement.setAttribute(
      'style',
      'display: block !important;'
    );
  }

  /**
   * @function ngOnDestroy unsubscribe subscription
   */
  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
