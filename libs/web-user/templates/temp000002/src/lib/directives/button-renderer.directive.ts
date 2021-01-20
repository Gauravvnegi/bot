import { Directive } from '@angular/core';
import { ButtonDirective as BaseButtonDirective } from 'libs/web-user/templates/temp000001/src/lib/directives/button-renderer.directive';
import { Temp000002ButtonComponent } from '../presentational/temp000002-button/temp000002-button.component';

@Directive({ selector: '[button-renderer]' })
export class ButtonDirective extends BaseButtonDirective {
    protected buttonComponent = Temp000002ButtonComponent;
}
