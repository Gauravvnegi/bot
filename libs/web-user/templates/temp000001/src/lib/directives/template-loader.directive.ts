import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  OnInit,
  ViewContainerRef,
  ChangeDetectorRef,
} from '@angular/core';
import { TempLoader000001Component } from '../containers/temp-loader000001/temp-loader000001.component';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';

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
    private _templateLoadingService: TemplateLoaderService,
    private _changeDetectorRef: ChangeDetectorRef
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
        if (isLoading === false) {
          this._loaderCompObj.destroy();
          this._changeDetectorRef.detectChanges();
        }
      }
    );
  }
}
