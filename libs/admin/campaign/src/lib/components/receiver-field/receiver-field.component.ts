import { ENTER, COMMA, TAB } from '@angular/cdk/keycodes';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { trim } from 'lodash';
import { Subscription } from 'rxjs';
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
export class ReceiverFieldComponent implements OnInit {
  @ViewChild('receiverField') receiverField;
  @Input() chipList = [];
  @Input() name: string;
  @Input() hotelId: string;
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

  listenForEnableDropdown() {
    this.$subscription.add(
      this._emailService.$enableDropdown[this.name].subscribe((response) => {
        this.enableDropdown = response;
      })
    );
  }

  removeChip(chip, event) {
    event.stopPropagation();
    this.updateChipSet.emit({
      action: 'remove',
      value: this.chipList.filter(
        (item) => item.data.name === chip.data.name
      )[0],
    });
    this.chipList = this.chipList.filter(
      (item) => item.data.name !== chip.data.name
    );
    if (!this.chipList.length) this.enableTextField();
  }

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

  addChip(event) {
    event.stopPropagation();
    if (this.separatorKeysCodes.includes(event.which)) {
      this.chipList.push({
        data: { name: this.receiverField.nativeElement.value },
        type: 'email',
      });
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

  searchKey(event) {
    event.stopPropagation();
    const key = trim(this.receiverField.nativeElement.value);
    if (!this.separatorKeysCodes.includes(event.which) && key.length > 0) {
      this.$subscription.add(
        this._campaignService
          .searchReceivers(this.hotelId, key)
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

  enableReceiverField(event?) {
    event?.stopPropagation();
    this.enableTextField();
    this.enableDropdownItems();
    this.receiverField.nativeElement.focus();
  }

  enableDropdownItems() {
    this._emailService.$enableDropdown[this.name].next(true);
    Object.keys(this._emailService.$enableDropdown).forEach((key) => {
      if (key != this.name) this._emailService.$enableDropdown[key].next(false);
    });
  }

  addItemFromDropdown(event) {
    this.chipList.push(event);
    this.updateChipSet.emit({
      value: event,
      action: 'add',
    });
    this.enableTextField();
  }

  enableTextField() {
    this.receiverField.nativeElement.setAttribute(
      'style',
      'display: block !important;'
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
