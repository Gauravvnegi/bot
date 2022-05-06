import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'hospitality-bot-create-content',
  templateUrl: './create-content.component.html',
  styleUrls: ['./create-content.component.scss'],
})
export class CreateContentComponent implements OnInit {
  @Output() changeStep = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  goBack() {
    this.changeStep.emit({ step: 'previous' });
  }

  openTemplateList(type) {
    this.changeStep.emit({ step: 'next', templateType: type });
  }
}
