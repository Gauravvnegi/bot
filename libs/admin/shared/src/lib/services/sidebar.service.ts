import { Injectable, RendererStyleFlags2 } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// export type SideBarConfig<TData extends Record<string,any>> = {
//   type?: 'RAISE_REQUEST' | 'ADD_GUEST';
//   open: boolean;
//   data?: TData;
// }

export type SideBarConfig<TData extends Record<string, any> = {}> = {
  type?: 'RAISE_REQUEST' | 'ADD_GUEST' | 'URL';
  open: boolean;
  data?: TData extends { type: 'RAISE_REQUEST' }
    ? { firstName?: string; lastName?: string; roomNo?: string }
    : TData extends { type: 'ADD_GUEST' }
    ? { guestName: string }
    : TData;
  url?: string;
};

@Injectable({ providedIn: 'root' })
export class SideBarService {
  private _sideBarConfiguration = new BehaviorSubject<SideBarConfig>({
    open: false,
  });

  constructor() {}

  openSideBar(data: SideBarConfig) {
    return this._sideBarConfiguration.next(data);
  }

  sideBarSubscription(): BehaviorSubject<SideBarConfig<{}>> {
    return this._sideBarConfiguration;
  }

  /**
   * Set z-index of sidebar
   */
  setSideBarZIndex(zIndex: number, condition: boolean) {
    setTimeout(() => {
      const elements = document.querySelectorAll(
        '.p-component-overlay.p-sidebar-mask'
      );
      condition
        ? elements[elements?.length - 1].setAttribute(
            'style',
            `z-index: ${zIndex};`
          )
        : elements[elements?.length - 1].setAttribute(
            'style',
            `z-index: unset ;`
          );
    }, 100);
  }
}
