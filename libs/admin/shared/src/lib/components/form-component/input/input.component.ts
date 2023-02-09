import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  @Input() isLoading = false;
  @Input() isSearch = false;

  @Input() controlName: string;

  constructor(public controlContainer: ControlContainer) {}

  ngOnInit(): void {}
}
