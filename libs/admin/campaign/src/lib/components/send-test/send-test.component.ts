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
  isSending = false;
  constructor(
    private _fb: FormBuilder,
    private _snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {}

  sendMail() {
    if (this.parentFG.get('testEmails').value.length == 0) {
      this._snackbarService.openSnackBarAsText('Please enter an email.');
      return;
    }
    this.closeSendTest.emit({ status: true });
  }

  close() {
    this.closeSendTest.emit({ status: false });
  }
}
