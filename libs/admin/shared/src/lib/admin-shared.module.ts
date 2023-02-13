import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { CKEditorModule } from 'ckeditor4-angular';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { ButtonModule } from 'primeng/button/';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { ButtonComponent } from './components/button/button.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { CustomHeaderComponent } from './components/custom-header/custom-header.component';
import { CustomSizeInputComponent } from './components/custom-size-input/custom-size-input.component';
import { DashboardErrorComponent } from './components/dashboard-error/dashboard-error.component';
import { DatatableComponent } from './components/datatable/datatable.component';
import { ExportListComponent } from './components/datatable/export-list/export-list.component';
import { FilterChipsComponent } from './components/datatable/filter-chips/filter-chips.component';
import { EmailChipListComponent } from './components/email-chip-list/email-chip-list.component';
import { InputComponent } from './components/form-component/input/input.component';
import { SelectComponent } from './components/form-component/select/select.component';
import { IteratorComponent } from './components/iterator/iterator.component';
import { MentionDirective, MentionListComponent } from './components/mention';
import { ModalComponent } from './components/modal/modal.component';
import { MultipleDropdownComponent } from './components/multiple-dropdown/multiple-dropdown.component';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { TabGroupComponent } from './components/tab-group/tab-group.component';
import { TemplateEditorComponent } from './components/template-editor/template-editor.component';
import { ToggleDropdownComponent } from './components/toggle-dropdown/toggle-dropdown.component';
import { TopicDropdownComponent } from './components/topic-dropdown/topic-dropdown.component';
import { UnsubscribeFeatureComponent } from './components/unsubscribe-feature/unsubscribe-feature.component';
import { UnsubscribeViewComponent } from './components/unsubscribe-view/unsubscribe-view.component';
import { UploadCsvComponent } from './components/upload-csv/upload-csv.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { UploadVideoComponent } from './components/upload-video/upload-video.component';
import { ClickableDirective } from './directives/clickable.directive';
import { FeatureDirective } from './directives/feature.directive';
import { InternalSubscriptionDirective } from './directives/internal-subscription.directive';
import { NumberDirective } from './directives/number.directive';
import { ClickStopPropagation } from './directives/stoppropagation.directive';
import { SubscriptionDirective } from './directives/subscription.directive';
import { LinkDetector } from './pipes/linkDetector.pipe';
import { NumberFormatterPipe } from './pipes/number-formatter.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SafeUrlPipe } from './pipes/safe-url-pipe';
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
    SplitButtonModule,
    InputTextModule,
    DropdownModule,
    MatChipsModule,
    MatAutocompleteModule,
    CKEditorModule,
    DialogModule,
  ],
  declarations: [
    DatatableComponent,
    TabGroupComponent,
    UploadFileComponent,
    ComingSoonComponent,
    NumberDirective,
    MultipleDropdownComponent,
    SubscriptionDirective,
    InternalSubscriptionDirective,
    FeatureDirective,
    ClickableDirective,
    ClickStopPropagation,
    UploadCsvComponent,
    UploadVideoComponent,
    TopicDropdownComponent,
    TemplateEditorComponent,
    SafeHtmlPipe,
    EmailChipListComponent,
    DashboardErrorComponent,
    UnsubscribeViewComponent,
    UnsubscribeFeatureComponent,
    NumberFormatterPipe,
    LinkDetector,
    MentionListComponent,
    MentionDirective,
    CustomSizeInputComponent,
    SafeUrlPipe,
    StatsCardComponent,
    FilterChipsComponent,
    ExportListComponent,
    ButtonComponent,
    ToggleDropdownComponent,
    IteratorComponent,
    InputComponent,
    SelectComponent,
    CustomHeaderComponent,
    ModalComponent,
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
    SplitButtonModule,
    InputTextModule,
    DropdownModule,
    CKEditorModule,
    NumberDirective,
    MultipleDropdownComponent,
    UploadCsvComponent,
    SubscriptionDirective,
    InternalSubscriptionDirective,
    FeatureDirective,
    ClickableDirective,
    UploadVideoComponent,
    TopicDropdownComponent,
    TemplateEditorComponent,
    ClickStopPropagation,
    EmailChipListComponent,
    NumberFormatterPipe,
    LinkDetector,
    MentionListComponent,
    MentionDirective,
    CustomSizeInputComponent,
    UnsubscribeViewComponent,
    UnsubscribeFeatureComponent,
    SafeHtmlPipe,
    SafeUrlPipe,
    StatsCardComponent,
    FilterChipsComponent,
    ExportListComponent,
    ButtonComponent,
    ToggleDropdownComponent,
    IteratorComponent,
    InputComponent,
    SelectComponent,
    CustomHeaderComponent,
    ModalComponent,
  ],
})
export class AdminSharedModule {}
