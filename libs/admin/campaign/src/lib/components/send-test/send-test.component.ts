import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';

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
    private _snackbarService: SnackBarService,
    protected _translateService: TranslateService
  ) {}

  ngOnInit(): void {}

  /**
   * @function sendMail function to send campaign email.
   */
  sendMail() {
    if (this.parentFG.get('testEmails').value.length == 0) {
      this._snackbarService
        .openSnackBarWithTranslate(
          {
            translateKey: 'messages.success.sendMail',
            priorityMessage: 'Please enter an email',
          },
          '',
          {
            panelClass: 'success',
          }
        )
        .subscribe();
      return;
    }
    this.closeSendTest.emit({ status: true });
  }

  /**
   * @function close function to close send status on status false.
   */
  close() {
    this.closeSendTest.emit({ status: false });
  }
}
