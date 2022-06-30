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
import { UploadCsvComponent } from './components/upload-csv/upload-csv.component';
import { UploadVideoComponent } from './components/upload-video/upload-video.component';
import { TopicDropdownComponent } from './components/topic-dropdown/topic-dropdown.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { TemplateEditorComponent } from './components/template-editor/template-editor.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { ClickStopPropagation } from './directives/stoppropagation.directive';
import { EmailChipListComponent } from './components/email-chip-list/email-chip-list.component';
import { DashboardErrorComponent } from './components/dashboard-error/dashboard-error.component';
import { NumberFormatterPipe } from './pipes/number-formatter.pipe';
import { LinkDetector } from './pipes/linkDetector.pipe';

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
    CKEditorModule,
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
    ClickStopPropagation,
    UploadCsvComponent,
    UploadVideoComponent,
    TopicDropdownComponent,
    TemplateEditorComponent,
    SafeHtmlPipe,
    EmailChipListComponent,
    DashboardErrorComponent,
    NumberFormatterPipe,
    LinkDetector,
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
    CKEditorModule,
    NumberDirective,
    MultipleDropdownComponent,
    UploadCsvComponent,
    CardDirective,
    TableDirective,
    FeatureDirective,
    ChannelDirective,
    ClickableDirective,
    UploadVideoComponent,
    TopicDropdownComponent,
    TemplateEditorComponent,
    ClickStopPropagation,
    EmailChipListComponent,
    NumberFormatterPipe,
    LinkDetector,
  ],
})
export class AdminSharedModule {}
