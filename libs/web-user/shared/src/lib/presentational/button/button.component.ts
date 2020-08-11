import { Component, Input } from '@angular/core';
import { ValidatorService } from '../../services/validator.service';

@Component({
  selector: 'web-user-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  providers: [ValidatorService],
})
export class ButtonComponent {
  private _settings;
  private _defaultValue = {
    label: 'Next',
    loaderLabel: 'Saving',
    isClickedTemplateSwitch: true,
    disableButtonIfLoading: true,
  };
  @Input() buttonClass;
  isTemplateVisible: boolean = false;
  id;

  @Input('settings') set settings(value: object) {
    this._settings = { ...this._defaultValue, ...value };
  }

  ngOnInit() {
    this.setId();
  }

  private setId() {
    this.id = `BTN${Math.random().toString(36).substring(7)}`;
  }

  get settings() {
    return { ...this._defaultValue, ...this._settings };
  }
}
