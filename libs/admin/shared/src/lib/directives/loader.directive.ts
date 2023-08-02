import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
  ComponentFactoryResolver,
  ViewContainerRef,
  Input,
} from '@angular/core';
import { map } from 'lodash';
import { LoaderProps } from '../types/response';
@Directive({
  selector: '[loader]',
})
export class LoaderDirective implements OnInit {
  loading = false;
  @Input() set isVisible(value: boolean) {
    this.loading = value;
    this.initView();
  }

  showLoader = true;
  top = '5%';
  left = '25%';
  viewHeight = null;
  parentElementStyle = {
    position: 'relative',
    height: this.viewHeight,
    overflow: 'hidden',
  };

  loaderStyle = {
    border: '4px solid #f3f3f3',
    'border-top': '4px solid #3498db',
    'border-radius': '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 2s linear infinite',
    position: 'relative',
    top: this.top,
    left: this.left,
  };

  loaderParentStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    'background-color': 'rgba(187, 188, 189, 0.4)',
    height: this.viewHeight,
  };

  parentElement: any;
  loaderParentElement: any;

  @Input() set props(values: LoaderProps) {
    map(values, (val, key) => {
      this[key] = val;
    });
    this.initView();
  }

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    // this.initView();
  }

  initView() {
    if (this.loading) {
      const parentElement = this.elementRef.nativeElement.parentNode;
      this.parentElement = parentElement;
      for (const property in this.parentElementStyle) {
        this.parentElementStyle.hasOwnProperty(property) &&
          this.renderer.setStyle(
            parentElement,
            property,
            this.parentElementStyle[property]
          );
      }

      const loaderParent = this.renderer.createElement('div');
      const loader = this.renderer.createElement('div');
      this.renderer.addClass(loaderParent, 'loader-parent');
      this.showLoader && this.renderer.addClass(loader, 'loader');

      this.showLoader && this.renderer.appendChild(loaderParent, loader);
      this.renderer.appendChild(parentElement, loaderParent);

      for (const property in this.loaderParentStyle) {
        this.loaderParentStyle.hasOwnProperty(property) &&
          this.renderer.setStyle(
            loaderParent,
            property,
            this.loaderParentStyle[property]
          );
      }

      if (this.showLoader) {
        for (const property in this.loaderStyle) {
          this.loaderStyle.hasOwnProperty(property) &&
            this.renderer.setStyle(
              loader,
              property,
              this.loaderStyle[property]
            );
        }
      }
      this.loaderParentElement = loaderParent;
    } else if (this.loaderParentElement && this.parentElement) {
      this.renderer.removeChild(
        this.loaderParentElement.parentNode,
        this.loaderParentElement
      );
      for (const property in this.parentElementStyle) {
        if (this.parentElementStyle.hasOwnProperty(property)) {
          this.renderer.removeStyle(
            this.parentElement,
            property,
            this.loaderParentStyle[property]
          );
        }
      }
      this.loaderParentElement = null;
    }
  }
}
