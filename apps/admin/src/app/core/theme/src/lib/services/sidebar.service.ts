import { Injectable } from '@angular/core';
import { Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
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
    debugger;
    setTimeout(() => {
      const elements = document.querySelectorAll(
        '.p-component-overlay.p-sidebar-mask'
      );
      elements.forEach((element) => {
        condition
          ? this.renderer.setStyle(element, 'z-index', `${zIndex}`)
          : this.renderer.removeStyle(element, 'z-index');
      });
    }, 100);
  }
}
