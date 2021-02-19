import { Directive, HostListener } from '@angular/core';
import { ButtonComponent } from '../presentational/button/button.component';
import { ButtonService } from '../services/button.service';

@Directive({ selector: '[buttonTemplateSwitch]' })
export class ButtonTemplateSwitchDirective {
  @HostListener('click', ['$event'])
  clickEvent(event) {
    !!this._host.settings['isClickedTemplateSwitch'] &&
      (this._host.isTemplateVisible = true);
  }

  constructor(
    protected _host: ButtonComponent,
    protected _buttonService: ButtonService
  ) {}

  ngOnInit() {
    this.registerListeners();
  }

  registerListeners() {
    this.listenForButtonLoading();
  }

  protected listenForButtonLoading() {
    this._buttonService.buttonLoading$.subscribe((buttonComponent) => {
      buttonComponent['id'] == this._host.id &&
        (this._host.isTemplateVisible = false);
    });
  }
}
