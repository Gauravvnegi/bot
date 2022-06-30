import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { Temp000001ButtonComponent } from 'libs/web-user/templates/temp000001/src/lib/presentational/temp000001-button/temp000001-button.component';

@Directive({ selector: '[button-renderer]' })
export class ButtonDirective {
  @Input() config;
  @Input() context;
  protected buttonComponent = Temp000001ButtonComponent;

  constructor(
    protected _resolver: ComponentFactoryResolver,
    protected _container: ViewContainerRef,
    protected _renderer: Renderer2,
    protected _buttonService: ButtonService
  ) {}

  ngOnInit(): void {
    this.initButtonConfig();
    this.registerListeners();
  }

  protected initButtonConfig(): void {
    this.config.forEach((config) => {
      const buttonFactoryComponent = this._resolver.resolveComponentFactory(
        this.buttonComponent
      );

      const buttonComponentObj = this._container.createComponent(
        buttonFactoryComponent
      );

      const host = buttonComponentObj.instance;

      this.addButtonProps(host, config);
      this.listenForContextFunction(config, buttonComponentObj, host);
      // this.listenForButtonLoader(config, buttonComponentObj, host);
    });
  }

  protected addButtonProps(host, config: any): void {
    host.settings = config.settings;
    host.buttonClass = config.buttonClass;
  }

  protected listenForButtonLoader(
    config: any,
    buttonComponentObj: ComponentRef<any>,
    host
  ): void {
    config.settings &&
      config.settings.isClickedTemplateSwitch &&
      this._renderer.listen(
        buttonComponentObj.location.nativeElement,
        'click',
        () => {
          host.settings['isClickedTemplateSwitch'] &&
            (host.isTemplateVisible = true);
        }
      );
  }

  protected listenForContextFunction(
    config: any,
    buttonComponentObj: ComponentRef<any>,
    host
  ): void {
    if (config.click && config.click.fn_name) {
      if (typeof this.context[config.click.fn_name] !== 'function') {
        console.error('No function exists in context');
      } else {
        this._renderer.listen(
          buttonComponentObj.location.nativeElement,
          'click',
          () => {
            if (!host.isTemplateVisible) {
              config.settings &&
                config.settings.isClickedTemplateSwitch &&
                host.settings['isClickedTemplateSwitch'] &&
                (host.isTemplateVisible = true);

              this.context.buttonRefs[`${config.name}Button`] = host;
              this.context[config.click.fn_name]();
            }
          }
        );
      }
    }
  }

  protected registerListeners(): void {
    this.listenForButtonLoading();
  }

  protected listenForButtonLoading(): void {
    this._buttonService.buttonLoading$.subscribe((buttonComponent) => {
      buttonComponent['isTemplateVisible'] = false;
    });
  }
}
