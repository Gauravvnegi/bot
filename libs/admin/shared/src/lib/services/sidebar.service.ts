import { Injectable, RendererStyleFlags2 } from '@angular/core';
import { Renderer2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SideBarService {
  constructor(private renderer: Renderer2) {}
  /**
   * @function setSideBarZIndex
   * @description set z-index of sidebar
   * @param zIndex
   * @param condition
   * @returns void
   * @memberof SideBarService
   * @example setSideBarZIndex(100, true);
   */
  setSideBarZIndex(zIndex: number, condition: boolean) {
    setTimeout(() => {
      const elements = document.querySelectorAll(
        '.p-component-overlay.p-sidebar-mask'
      );
      elements.forEach((element) => {
        condition
          ? element.setAttribute('style', `z-index: ${zIndex} !important;`)
          : this.renderer.removeStyle(element, 'z-index');
      });
    }, 100);
  }
}
