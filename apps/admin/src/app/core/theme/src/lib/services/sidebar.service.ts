import {
  ComponentFactoryResolver,
  Injectable,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { manageMaskZIndex } from 'libs/admin/shared/src/index';
import {
  SidebarComponents,
  SidebarInstanceProps,
} from 'libs/admin/global-shared/src/lib/constants/common-components';
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
  sidebarSlide: ViewContainerRef;

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

  openSidebar<T extends SidebarInstanceProps>(sidebarProps: SidebarProps<T>) {
    let isSidebarKey = sidebarProps.isSidebarKey ?? 'isSidebar';
    let onCloseKey = sidebarProps.onCloseKey ?? 'onCloseSidebar';
    sidebarProps.onOpen();
    sidebarProps?.manageMask && manageMaskZIndex();
    this.sidebarSlide.clear();
    sidebarProps?.containerRef && sidebarProps.containerRef.clear();
    if (!!sidebarProps?.componentName) {
      //for component
      const factory = this.resolver.resolveComponentFactory(
        SidebarComponents[sidebarProps.componentName]
      );
      const componentRef = sidebarProps.containerRef
        ? sidebarProps.containerRef.createComponent(factory)
        : this.sidebarSlide.createComponent(factory);

      componentRef.instance[isSidebarKey] = true;
      Object.assign(componentRef.instance, sidebarProps.data);
      componentRef.instance[onCloseKey].subscribe((res) => {
        sidebarProps.onClose(res);
        sidebarProps.containerRef.clear();
        componentRef.destroy();
      });
    } else {
      //for template ref
      this.sidebarSlide.createEmbeddedView(sidebarProps.templateRef);
    }
  }
}

export type SidebarProps<T extends SidebarInstanceProps> = {
  componentName?: string;
  onOpen?: () => void;
  containerRef?: ViewContainerRef;
  templateRef?: TemplateRef<any>;
  onCloseKey?: string;
  isSidebarKey?: string;
  onClose?: (res: any) => void; // Callback function for onClose event
  manageMask?: boolean;
  data?: Partial<T>;
};
