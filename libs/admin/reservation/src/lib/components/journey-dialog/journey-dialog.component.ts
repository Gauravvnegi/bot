import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'hospitality-bot-journey-dialog',
  templateUrl: './journey-dialog.component.html',
  styleUrls: ['./journey-dialog.component.scss'],
})
export class JourneyDialogComponent implements OnInit {
  private _defaultValue = {
    title: '',
    description: '',
    question: 'Are you sure you want to continue?',
    buttons: {
      cancel: {
        label: 'Cancel',
        context: '',
      },
      accept: {
        label: 'Accept',
        context: '',
      },
    },
  };

  private _config;

  @Input('config') set config(value) {
    this._config = { ...this._defaultValue, ...value };
  }

  get config() {
    if (this._config !== undefined) {
      return { ...this._defaultValue, ...this._config };
    } else {
      return this._defaultValue;
    }
  }

  @Output() onDetailsClose = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onAccept() {
    const { accept: acceptButtonConfig } = this.config.buttons;

    if (acceptButtonConfig.context && acceptButtonConfig.handler) {
      acceptButtonConfig.context[
        acceptButtonConfig.handler.fn_name
      ].apply(acceptButtonConfig.context, [...acceptButtonConfig.handler.args]);
    }

    this.onDetailsClose.next(true);
  }

  onCancel() {
    const { cancel: cancelButtonConfig } = this.config.buttons;

    if (cancelButtonConfig.context && cancelButtonConfig.handler) {
      cancelButtonConfig.context[
        cancelButtonConfig.handler.fn_name
      ].apply(cancelButtonConfig.context, [...cancelButtonConfig.handler.args]);
    }
    this.onDetailsClose.next(true);
  }
}
