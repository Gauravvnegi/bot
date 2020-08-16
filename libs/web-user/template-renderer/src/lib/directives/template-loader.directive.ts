import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { TemplateLoaderService } from '../../../../shared/src/lib/services/template-loader.service';
import { TempLoader000001Component } from '../template-loaders/temp-loader000001/temp-loader000001.component';

const componentMapping = {
  temp000001: TempLoader000001Component,
};

@Directive({ selector: '[template-loader]' })
export class TemplateLoaderDirective implements OnChanges {
  @Input() templateId: string;

  private _loaderCompObj: ComponentRef<any>;

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
}
