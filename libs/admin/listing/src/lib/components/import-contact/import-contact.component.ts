import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'hospitality-bot-import-contact',
  templateUrl: './import-contact.component.html',
  styleUrls: ['./import-contact.component.scss'],
})
export class ImportContactComponent implements OnInit {
  @Output() onImportClosed = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  close() {
    this.onImportClosed.emit({ status: true });
  }
}
