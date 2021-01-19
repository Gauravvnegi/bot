import { Directive, ComponentRef } from '@angular/core';
import { TemplateLoaderDirective as BaseTemplateLoaderDirective } from 'libs/web-user/templates/temp000001/src/lib/directives/template-loader.directive';
import { TempLoader000002Component } from '../containers/temp-loader000002/temp-loader000002.component';

@Directive({ selector: '[template-loader]' })
export class TemplateLoaderDirective extends BaseTemplateLoaderDirective {
  protected _loaderCompObj: ComponentRef<TempLoader000002Component>;
  protected loaderComponentName = TempLoader000002Component;
}
