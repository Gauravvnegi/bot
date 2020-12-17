import {
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  ViewContainerRef,
} from '@angular/core';
import { TemplateCode } from 'libs/web-user/shared/src/lib/constants/template';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import { TempLoader000001Component } from '../containers/temp-loader000001/temp-loader000001.component';

interface ITemplateLoader {
  [key: string]: any;
}
const componentMapping: ITemplateLoader = {
  [TemplateCode.temp000001]: TempLoader000001Component,
};

@Directive({ selector: '[template-loader]' })
export class TemplateLoaderDirective implements OnChanges {
  @Input() templateId: string;

  private _loaderCompObj: ComponentRef<any>;

  constructor(
    private _container: ViewContainerRef,
    private _resolver: ComponentFactoryResolver,
    private _templateLoadingService: TemplateLoaderService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnChanges(): void {
    if (this.templateId && componentMapping[this.templateId]) {
      this.renderLoader();
    }
  }

  renderLoader(): void {
    const loaderFactoryComp = this._resolver.resolveComponentFactory(
      componentMapping[this.templateId]
    );

    this._loaderCompObj = this._container.createComponent(loaderFactoryComp);

    this.listenForLoadingComplete();
  }

  listenForLoadingComplete(): void {
    this._templateLoadingService.isTemplateLoading$.subscribe(
      (isLoading: boolean) => {
        if (isLoading === false) {
          this._loaderCompObj.destroy();
          this._changeDetectorRef.detectChanges();
        }
      }
    );
  }
}
