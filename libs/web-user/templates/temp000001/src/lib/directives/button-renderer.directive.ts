import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { ButtonComponent } from 'libs/web-user/shared/src/lib/presentational/button/button.component';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';

@Directive({ selector: '[button-renderer]' })
export class ButtonDirective {
  @Input() config;
  @Input() context;

  constructor(
    private _resolver: ComponentFactoryResolver,
    private _container: ViewContainerRef,
    private _renderer: Renderer2,
    private _buttonService: ButtonService
  ) {}

  ngOnInit() {
    this.initButtonConfig();
    this.registerListeners();
  }

  private initButtonConfig() {
    this.config.forEach((config) => {
      const buttonFactoryComponent = this._resolver.resolveComponentFactory(
        ButtonComponent
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

  private addButtonProps(host: ButtonComponent, config: any) {
    host.settings = config.settings;
    host.buttonClass = config.buttonClass;
  }

  private listenForButtonLoader(
    config: any,
    buttonComponentObj: ComponentRef<ButtonComponent>,
    host: ButtonComponent
  ) {
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

  private listenForContextFunction(
    config: any,
    buttonComponentObj: ComponentRef<ButtonComponent>,
    host: ButtonComponent
  ) {
    if (config.click && config.click.fn_name) {
      if (typeof this.context[config.click.fn_name] != 'function') {
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

  private registerListeners() {
    this.listenForButtonLoading();
  }

  private listenForButtonLoading() {
    this._buttonService.buttonLoading$.subscribe((buttonComponent) => {
      buttonComponent['isTemplateVisible'] = false;
    });
  }
}
