import {
  Compiler,
  ComponentRef,
  Directive,
  Injector,
  Input,
  NgModuleFactory,
  OnChanges,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';

const templates = {
  temp000001: {
    module: 'Temp000001Module',
    component: 'Temp000001Component',
    modulePath: async () =>
      import('../../../../templates/temp000001/src/lib/temp000001.module'),
    componentPath: async () =>
      import(
        '../../../../templates/temp000001/src/lib/containers/temp000001/temp000001.component'
      ),
  },
  tempCovid000001: {
    module: 'TempCovid000001Module',
    component: 'TempCovid000001Component',
    modulePath: async () =>
      import(
        '../../../../templates/temp-covid000001/src/lib/temp-covid000001.module'
      ),
    componentPath: async () =>
      import(
        '../../../../templates/temp-covid000001/src/lib/containers/temp-covid000001/temp-covid000001.component'
      ),
  },
};

@Directive({ selector: '[template-renderer]' })
export class TemplateRendererDirective implements OnChanges, OnInit {
  @Input() templateId: string;
  @Input() templateData;
  @Input() config;
  @Input() paymentStatus;
  private _templateObj: ComponentRef<any>;

  constructor(
    private _compiler: Compiler,
    private _injector: Injector,
    protected _container: ViewContainerRef,
    private _templateLoadingService: TemplateLoaderService
  ) {}

  ngOnChanges() {
    if (this.templateId) {
      this.asyncLoadComponent();
    }
  }

  ngOnInit() {
    this.registerListeners();
  }

  private registerListeners() {
    this._templateLoadingService.isTemplateLoading$.subscribe((isLoading) => {
      if (isLoading === false) {
        this._templateObj.instance.visibilityHidden = false;
      }
    });
  }

  private async asyncLoadComponent() {
    const module = await templates[this.templateId].modulePath();

    const component = await templates[this.templateId].componentPath();

    const moduleFactory = await this.loadModuleFactory(
      module[templates[this.templateId].module]
    );
    const moduleRef = moduleFactory.create(this._injector);

    const factory = moduleRef.componentFactoryResolver.resolveComponentFactory(
      component[templates[this.templateId].component]
    );

    this._templateObj = this._container.createComponent(
      factory
    ) as ComponentRef<any>;

    this.passTemplateprops();
  }

  private passTemplateprops() {
    this._templateObj.instance.templateData = this.templateData;
    this._templateObj.instance.config = this.config;
    // if (this.paymentStatus) {
      this._templateObj.instance.paymentStatus = this.paymentStatus;
    // }
  }

  private async loadModuleFactory(t: any) {
    if (t instanceof NgModuleFactory) {
      return t;
    } else {
      return await this._compiler.compileModuleAsync(t);
    }
  }
}
