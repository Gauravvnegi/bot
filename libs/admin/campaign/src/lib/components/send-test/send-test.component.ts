import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

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
    private snackbarService: SnackBarService,
    protected _translateService: TranslateService,
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef
  ) {
    /**
     * @Remarks Extracting data from he dialog service
     */
    if (this.dialogConfig?.data) {
      Object.entries(this.dialogConfig.data).forEach(([key, value]) => {
        this[key] = value;
      });
    }
  }

  ngOnInit(): void {}

  /**
   * @function sendMail function to send campaign email.
   */
  sendMail() {
    if (this.parentFG.get('testEmails').value.length === 0) {
      this.snackbarService
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
    this.dialogRef.close({ status: true });
  }

  /**
   * @function close function to close send status on status false.
   */
  close() {
    this.closeSendTest.emit({ status: false });
    this.dialogRef.close({ status: false });
  }
}
