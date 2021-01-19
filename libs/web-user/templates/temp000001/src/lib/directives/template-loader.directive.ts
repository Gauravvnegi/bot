import {
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  ViewContainerRef,
} from '@angular/core';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import { TempLoader000001Component } from '../containers/temp-loader000001/temp-loader000001.component';

@Directive({ selector: '[template-loader]' })
export class TemplateLoaderDirective implements OnChanges {
  @Input() templateId: string;
  protected _loaderCompObj: ComponentRef<TempLoader000001Component>;
  protected loaderComponentName = TempLoader000001Component;

  constructor(
    protected _container: ViewContainerRef,
    protected _resolver: ComponentFactoryResolver,
    protected _templateLoadingService: TemplateLoaderService,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnChanges(): void {
    if (this.templateId) {
      this.renderLoader();
    }
  }

  protected renderLoader(): void {
    const loaderFactoryComp = this._resolver.resolveComponentFactory(
      this.loaderComponentName
    );

    this._loaderCompObj = this._container.createComponent(loaderFactoryComp);

    this.listenForLoadingComplete();
  }

  protected listenForLoadingComplete(): void {
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
