import { Directive } from '@angular/core';
import { ButtonDirective as BaseButtonDirective } from 'libs/web-user/templates/temp000001/src/lib/directives/button-renderer.directive';

@Directive({ selector: '[button-renderer]' })
export class ButtonDirective extends BaseButtonDirective {}
