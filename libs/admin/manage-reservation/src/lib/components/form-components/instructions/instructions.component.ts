import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss', '../../reservation.styles.scss'],
})
export class InstructionsComponent implements OnInit {
  @Input() reservationType: string;

  constructor(public controlContainer: ControlContainer) {}

  ngOnInit(): void {}
}
