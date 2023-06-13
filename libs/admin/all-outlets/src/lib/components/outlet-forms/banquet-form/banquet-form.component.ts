import { Component, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-banquet-form',
  templateUrl: './banquet-form.component.html',
  styleUrls: ['./banquet-form.component.scss'],
})
export class BanquetFormComponent implements OnInit {
  constructor(public controlContainer: ControlContainer) {}

  ngOnInit(): void {}
}
