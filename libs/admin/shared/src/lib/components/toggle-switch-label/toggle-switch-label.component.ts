import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'hospitality-bot-toggle-switch-with-label',
  templateUrl: './toggle-switch-label.component.html',
  styleUrls: ['./toggle-switch-label.component.scss'],
})
export class ToggleSwitchComponentLabel implements OnInit {
  @Input() isToggleOn: boolean = false;
  @Output() onToggleSwitch = new EventEmitter<boolean>();
  toggleOnLabel: string = 'Active';
  toggleOffLabel: string = 'Inactive';
  toggleOnColor: string = '#65b340';
  toggleOffColor: string = '#e31717';
  disableTurnOff: boolean = false;

  @Input() set config(value: ToggleSwitchConfig) {
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

type ToggleSwitchConfig = {
  toggleOnLabel: string;
  toggleOffLabel: string;
  toggleOnColor: string;
  toggleOffColor: string;
  disableTurnOff: boolean;
};
