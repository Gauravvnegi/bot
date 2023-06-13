import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { AdminChannelMangerRoutingModule } from './admin-channel-manager.routing.module';
import { PanelModule } from 'primeng/panel';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { NestedCheckboxTreeComponent } from './components/nested-checkbox-tree/nested-checkbox-tree.component';
import { NestedPanelComponent } from './components/nested-checkbox-tree/nested-panel/nested-panel.component';

@NgModule({
  imports: [
    CommonModule,
    PanelModule,
    AdminSharedModule,
    AdminChannelMangerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    MainComponent,
    NestedCheckboxTreeComponent,
    NestedPanelComponent,
  ],
})
export class AdminChannelManagerModule {}
