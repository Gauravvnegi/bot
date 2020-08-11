import {
  Directive,
  OnChanges,
  OnInit,
  Input,
  ViewContainerRef,
  ComponentRef,
  ComponentFactoryResolver,
} from '@angular/core';

import { TempLoader000001Component } from '../template-loaders/temp-loader000001/temp-loader000001.component';
import { TemplateLoaderService } from '../../../../shared/src/lib/services/template-loader.service';

const componentMapping = {
  temp000001: TempLoader000001Component,
};

@Directive({ selector: '[template-loader]' })
export class TemplateLoaderDirective implements OnChanges, OnInit {
  @Input() templateId: string;

  _loaderCompObj: ComponentRef<any>;

  constructor(
    protected _container: ViewContainerRef,
    private _resolver: ComponentFactoryResolver,
    private _templateLoadingService: TemplateLoaderService
  ) {}

  ngOnChanges() {
    if (this.templateId && componentMapping[this.templateId]) {
      this.renderLoader();
    }
  }

  renderLoader() {
    const loaderFactoryComp = this._resolver.resolveComponentFactory(
      componentMapping[this.templateId]
    );

    this._loaderCompObj = this._container.createComponent(loaderFactoryComp);

    this.listenForLoadingComplete();
  }

  listenForLoadingComplete() {
    this._templateLoadingService.isTemplateLoading$.subscribe(
      (isLoading: boolean) => {
        isLoading === false && this._loaderCompObj.destroy();
      }
    );
  }

  ngOnInit() {}
}
