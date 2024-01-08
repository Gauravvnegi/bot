import {
  ComponentFactoryResolver,
  Injectable,
  ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { manageMaskZIndex } from 'libs/admin/shared/src/index';
import { SidebarComponents } from 'libs/admin/global-shared/src/lib/constants/common-components';
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

  constructor(private resolver: ComponentFactoryResolver) {}

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
      elements.forEach((element) => {
        condition
          ? elements[elements?.length - 1].setAttribute(
              'style',
              `z-index: ${zIndex};`
            )
          : elements[elements?.length - 1].setAttribute(
              'style',
              `z-index: unset ;`
            );
      });
    }, 100);
  }

  openSidebar(sidebarProps: SidebarProps) {
    let isSidebarKey = sidebarProps.isSidebarKey ?? 'isSidebar';
    let onCloseKey = sidebarProps.onCloseKey ?? 'onCloseSidebar';
    sidebarProps.onOpen();
    sidebarProps?.manageMask && manageMaskZIndex();
    const factory = this.resolver.resolveComponentFactory(
      SidebarComponents[sidebarProps.componentName]
    );
    sidebarProps.containerRef.clear();
    const componentRef = sidebarProps.containerRef.createComponent(factory);
    componentRef.instance[isSidebarKey] = true;

    componentRef.instance[onCloseKey].subscribe((res) => {
      sidebarProps.onClose(res);
      sidebarProps.containerRef.clear();
      componentRef.destroy();
    });
  }
}

export type SidebarProps = {
  componentName: string;
  onOpen?: () => void;
  containerRef: ViewContainerRef;
  onCloseKey?: string;
  isSidebarKey?: string;
  onClose?: (res: any) => void; // Callback function for onClose event
  manageMask?: boolean;
};
