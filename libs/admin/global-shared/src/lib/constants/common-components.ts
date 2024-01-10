import { MarketingNotificationComponent } from '@hospitality-bot/admin/notification';
import { AddAgentComponent } from 'libs/admin/agent/src/lib/components/add-agent/add-agent.component';
import { AddCompanyComponent } from 'libs/admin/company/src/lib/components/add-company/add-company.component';
import { NightAuditComponent } from 'libs/admin/global-shared/src/lib/components/night-audit/night-audit.component';
import { AddGuestComponent } from 'libs/admin/guests/src/lib/components';
import { SendMessageComponent } from 'libs/admin/notification/src/lib/components/send-message/send-message.component';
import { AddItemComponent } from 'libs/admin/request/src/lib/components/add-item/add-item.component';
import { RaiseRequestComponent } from 'libs/admin/request/src/lib/components/raise-request/raise-request.component';
import { QuickReservationFormComponent } from 'libs/admin/reservation/src/lib/components/quick-reservation-form/quick-reservation-form.component';
import { SettingsMenuComponent } from 'libs/admin/settings/src/lib/components/settings-menu/settings-menu.component';

export enum SidebarComponentNames {
  QuickReservation = 'QuickReservation',
  RaiseRequest = 'RaiseRequest',
  NightAudit = 'NightAudit',
  AddGuest = 'AddGuest',
  SettingsMenu = 'SettingsMenu',
  AddCompany = 'AddCompany',
  AddAgent = 'AddAgent',
  AddItem = 'AddItem',
  MarketNotification = 'MarketNotification',
  SendMessage = 'SendMessage',
}
export const SidebarComponents = {
  [SidebarComponentNames.QuickReservation]: QuickReservationFormComponent,
  [SidebarComponentNames.RaiseRequest]: RaiseRequestComponent,
  [SidebarComponentNames.NightAudit]: NightAuditComponent,
  [SidebarComponentNames.AddGuest]: AddGuestComponent,
  [SidebarComponentNames.SettingsMenu]: SettingsMenuComponent,
  [SidebarComponentNames.AddCompany]: AddCompanyComponent,
  [SidebarComponentNames.AddAgent]: AddAgentComponent,
  [SidebarComponentNames.AddItem]: AddItemComponent,
  [SidebarComponentNames.MarketNotification]: MarketingNotificationComponent,
  [SidebarComponentNames.SendMessage]: SendMessageComponent,
};

export type SidebarInstanceProps =
  | QuickReservationFormComponent
  | RaiseRequestComponent
  | NightAuditComponent
  | AddGuestComponent
  | SettingsMenuComponent
  | AddCompanyComponent
  | AddAgentComponent
  | AddItemComponent
  | MarketingNotificationComponent
  | SendMessageComponent;
