import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalAction, ModalContent } from '../../types/fields.type';

@Component({
  selector: 'hospitality-bot-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  heading: string = 'Notification';
  descriptions: string[] = ['Are you sure?'];

  defaultAction: ModalAction = {
    label: 'Okay',
    onClick: () => {
      this.close();
    },
    variant: 'contained',
  };

  @Input() actions: ModalAction[];

  @Input() set content(value: ModalContent) {
    if (value) {
      this.heading = value.heading;
      this.descriptions = value.description;
    }
  }

  @Output() onClose = new EventEmitter();

  constructor() {}

  close() {
    this.onClose.emit();
  }
}
