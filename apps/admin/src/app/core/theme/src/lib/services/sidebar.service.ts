import {
  ComponentFactoryResolver,
  Injectable,
  ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { NightAuditComponent } from 'libs/admin/global-shared/src/lib/components/night-audit/night-audit.component';
import { AddGuestComponent } from 'libs/admin/guests/src/lib/components';
import { RaiseRequestComponent } from 'libs/admin/request/src/lib/components/raise-request/raise-request.component';
import { QuickReservationFormComponent } from 'libs/admin/reservation/src/lib/components/quick-reservation-form/quick-reservation-form.component';
import { SettingsMenuComponent } from 'libs/admin/settings/src/lib/components/settings-menu/settings-menu.component';
import { AddCompanyComponent } from 'libs/admin/company/src/lib/components/add-company/add-company.component';
import { AddAgentComponent } from 'libs/admin/agent/src/lib/components/add-agent/add-agent.component';
import { AddItemComponent } from 'libs/admin/request/src/lib/components/add-item/add-item.component';
import { manageMaskZIndex } from '@hospitality-bot/admin/shared';

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

export const SidebarComponents = {
  QuickReservation: QuickReservationFormComponent,
  RaiseRequest: RaiseRequestComponent,
  NightAudit: NightAuditComponent,
  AddGuest: AddGuestComponent,
  SettingsMenu: SettingsMenuComponent,
  AddCompany: AddCompanyComponent,
  AddAgent: AddAgentComponent,
  AddItem: AddItemComponent,
};
