import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { SnackBarService } from '@hospitality-bot/shared/material';

@Component({
  selector: 'hospitality-bot-send-test',
  templateUrl: './send-test.component.html',
  styleUrls: ['./send-test.component.scss'],
})
export class SendTestComponent implements OnInit {
  @Input() parentFG: FormGroup;
  @Output() closeSendTest = new EventEmitter();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  isSending = false;
  constructor(
    private _fb: FormBuilder,
    private _snackbarService: SnackBarService
  ) {
    this.initFG();
  }

  ngOnInit(): void {}

  initFG() {
    this.parentFG = this._fb.group({
      email: this._fb.array([], Validators.required),
    });
  }

  addEmail(event: MatChipInputEvent, control): void {
    let input = event.input;
    let value = event.value;

    // Add our keyword
    if ((value || '').trim()) {
      if (!this.isValidEmail(value)) {
        this._snackbarService.openSnackBarAsText('Invalid email format');
        return;
      } else {
        const controlValues = control.value.filter((cValue) => cValue == value);
        if (!controlValues.length) {
          control.push(this._fb.control(value.trim()));
        }
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeEmail(keyword: any, control: FormArray): void {
    let index = control.value.indexOf(keyword);

    if (index >= 0) {
      control.removeAt(index);
    }
  }

  isValidEmail(email): RegExpMatchArray {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return !!email && typeof email === 'string' && email.match(emailRegex);
  }

  sendMail() {
    this.closeSendTest.emit({
      email: this.parentFG.getRawValue().email,
      status: true,
    });
  }

  close() {
    this.closeSendTest.emit({ status: false });
  }
}
