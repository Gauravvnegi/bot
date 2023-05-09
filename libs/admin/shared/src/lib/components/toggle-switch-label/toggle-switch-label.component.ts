import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'hospitality-bot-toggle-switch-with-label',
  templateUrl: './toggle-switch-label.component.html',
  styleUrls: ['./toggle-switch-label.component.scss'],
})
export class ToggleSwitchComponentLabel implements OnInit {
  @Input() isToggleOn: boolean = false;
  @Output() onToggleSwitch = new EventEmitter<boolean>();
  toggleOnLabel: string = 'Accept';
  toggleOffLabel: string = 'Reject';
  toggleOnColor: string = '#2196F3';
  toggleOffColor: string = '#ccc';

  @Input() set config(value) {
    for (let key in value) {
      if (this.hasOwnProperty(key)) this[key] = value[key];
    }
  }

  ngOnInit(): void {}

  toggleSwitch() {
    this.isToggleOn = !this.isToggleOn;
    this.onToggleSwitch.emit(this.isToggleOn);
  }
}
