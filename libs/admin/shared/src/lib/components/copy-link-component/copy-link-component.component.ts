import { Component, Input, OnInit } from '@angular/core';
import { SnackBarService } from '@hospitality-bot/shared/material';

@Component({
  selector: 'hospitality-bot-copy-link',
  templateUrl: './copy-link-component.component.html',
  styleUrls: ['./copy-link-component.component.scss'],
})
export class CopyLinkComponentComponent implements OnInit {
  constructor(private snackbarService: SnackBarService) {}
  @Input() url: string;
  ngOnInit(): void {}

  handleCopyToClipboard(event) {
    event.stopPropagation();
    this.snackbarService
      .openSnackBarWithTranslate(
        {
          translateKey: 'message.success.url',
          priorityMessage: 'Url Copied.',
        },
        '',
        {
          panelClass: 'success',
        }
      )
      .subscribe();
  }
}
