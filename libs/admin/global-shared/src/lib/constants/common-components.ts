import { AddAgentComponent } from 'libs/admin/agent/src/lib/components/add-agent/add-agent.component';
import { AddCompanyComponent } from 'libs/admin/company/src/lib/components/add-company/add-company.component';
import { NightAuditComponent } from 'libs/admin/global-shared/src/lib/components/night-audit/night-audit.component';
import { AddGuestComponent } from 'libs/admin/guests/src/lib/components';
import { AddItemComponent } from 'libs/admin/request/src/lib/components/add-item/add-item.component';
import { RaiseRequestComponent } from 'libs/admin/request/src/lib/components/raise-request/raise-request.component';
import { QuickReservationFormComponent } from 'libs/admin/reservation/src/lib/components/quick-reservation-form/quick-reservation-form.component';
import { SettingsMenuComponent } from 'libs/admin/settings/src/lib/components/settings-menu/settings-menu.component';

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
