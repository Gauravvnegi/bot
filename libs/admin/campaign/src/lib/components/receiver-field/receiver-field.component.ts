import { ENTER, COMMA } from '@angular/cdk/keycodes';
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
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'hospitality-bot-receiver-field',
  templateUrl: './receiver-field.component.html',
  styleUrls: ['./receiver-field.component.scss'],
})
export class ReceiverFieldComponent implements OnInit {
  @ViewChild('receiverField') receiverField;
  @Input() chipList = [];
  @Input() name: string;
  @Input() hotelId: string;
  @Output() updateChipSet = new EventEmitter();
  enableDropdown = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  $subscription = new Subscription();
  constructor(private _emailService: EmailService) {}

  ngOnInit(): void {
    this.listenForEnableDropdown();
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
      !trim(this.receiverField.nativeElement.value).length &&
      this.chipList.length
    ) {
      this.receiverField.nativeElement.setAttribute(
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
          text: this.receiverField.nativeElement.value,
          type: 'email',
        },
        action: 'add',
      });
      this.receiverField.nativeElement.value = '';
    } else {
      console.log(this.receiverField.nativeElement.value);
    }
  }

  enableReceiverField(event) {
    event.stopPropagation();
    this.enableTextField();
    this.enableDropdownItems();
    this.receiverField.nativeElement.focus();
  }

  handleBubbling(event) {
    event.stopPropagation();
  }

  enableDropdownItems() {
    this._emailService.$enableDropdown[this.name].next(true);
    Object.keys(this._emailService.$enableDropdown).forEach((key) => {
      if (key != this.name) this._emailService.$enableDropdown[key].next(false);
    });
  }

  addItemFromDropdown(event) {
    this.chipList.push(event);
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
