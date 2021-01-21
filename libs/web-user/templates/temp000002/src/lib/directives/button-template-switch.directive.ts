import { Directive, HostListener } from '@angular/core';
import { ButtonTemplateSwitchDirective as BaseButtonTemplateSwitchDirective } from 'libs/web-user/shared/src/lib/directives/button-template-switch.directive';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { Temp000002ButtonComponent } from '../presentational/temp000002-button/temp000002-button.component';

@Directive({ selector: '[buttonTemplateSwitchh]' })
export class ButtonTemplateSwitchDirective extends BaseButtonTemplateSwitchDirective {
  constructor(
    protected _host: Temp000002ButtonComponent,
    protected _buttonService: ButtonService
  ) {
    super(_host, _buttonService);
  }
}
