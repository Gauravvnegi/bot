import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
  ComponentFactoryResolver,
  ViewContainerRef,
  Input,
} from '@angular/core';
import { ButtonComponent } from '@hospitality-bot/admin/shared'; // Import your button component

@Directive({
  selector: '[hospitalityBotBackdrop]',
})
export class BackdropDirective implements OnInit {
  @Input() config = {
    isVisible: true,
    label: 'Create and Continue',
    link: '#',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  };
  // CSS style for backdrop
  backdropStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    'background-color': this.config.backgroundColor,
    'backdrop-filter': 'blur(1px)',
  };

  // CSS style for button
  buttonStyle = {
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center',
    height: '100%',
  };

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
    if (this.config.isVisible) {
      const parentElement = this.elementRef.nativeElement.parentNode;
      this.renderer.setStyle(parentElement, 'position', 'relative');

      const backdrop = this.renderer.createElement('div');
      this.renderer.addClass(backdrop, 'backdrop');

      const buttonContainer = this.renderer.createElement('div');
      this.renderer.addClass(buttonContainer, 'button-container');

      this.renderer.appendChild(backdrop, buttonContainer);
      this.renderer.appendChild(parentElement, backdrop);

      const buttonFactory = this.componentFactoryResolver.resolveComponentFactory(
        ButtonComponent
      );
      const buttonComponentRef = this.viewContainerRef.createComponent(
        buttonFactory
      );
      const buttonComponent = buttonComponentRef.instance;
      buttonComponent.label = this.config.label;
      buttonComponent.link = this.config.link;

      const buttonElement = buttonComponentRef.location.nativeElement;

      this.renderer.appendChild(buttonContainer, buttonElement);

      for (const property in this.backdropStyle) {
        this.backdropStyle.hasOwnProperty(property) &&
          this.renderer.setStyle(
            backdrop,
            property,
            this.backdropStyle[property]
          );
      }

      for (const property in this.buttonStyle) {
        this.buttonStyle.hasOwnProperty(property) &&
          this.renderer.setStyle(
            buttonContainer,
            property,
            this.buttonStyle[property]
          );
      }
    }
  }
}
