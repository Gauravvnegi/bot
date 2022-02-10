import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button/';
import { PaginatorModule } from 'primeng/paginator';
import { TabMenuModule } from 'primeng/tabmenu';
import { DropdownModule } from 'primeng/dropdown';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { DatatableComponent } from './components/datatable/datatable.component';
import { TabGroupComponent } from './components/tab-group/tab-group.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { MultipleDropdownComponent } from './components/multiple-dropdown/multiple-dropdown.component';

import { NumberDirective } from './directives/number.directive';
import { CardDirective } from './directives/card.directive';
import { TableDirective } from './directives/table.directive';
import { FeatureDirective } from './directives/feature.directive';
import { ChannelDirective } from './directives/channel.directive';
import { ClickableDirective } from './directives/clickable.directive';

@NgModule({
  imports: [
    CommonModule,
    SharedMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    PaginatorModule,
    TabMenuModule,
    DropdownModule,
    MatChipsModule,
    MatAutocompleteModule,
  ],
  declarations: [
    DatatableComponent,
    TabGroupComponent,
    UploadFileComponent,
    ComingSoonComponent,
    NumberDirective,
    MultipleDropdownComponent,
    CardDirective,
    TableDirective,
    FeatureDirective,
    ChannelDirective,
    ClickableDirective,
  ],
  exports: [
    DatatableComponent,
    TabGroupComponent,
    UploadFileComponent,
    SharedMaterialModule,
    TableModule,
    ButtonModule,
    PaginatorModule,
    TabMenuModule,
    DropdownModule,
    NumberDirective,
    MultipleDropdownComponent,
    CardDirective,
    TableDirective,
    FeatureDirective,
    ChannelDirective,
    ClickableDirective,
  ],
})
export class AdminSharedModule {}
