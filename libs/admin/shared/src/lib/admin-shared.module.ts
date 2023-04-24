import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CKEditorModule } from 'ckeditor4-angular';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { ButtonModule } from 'primeng/button/';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PaginatorModule } from 'primeng/paginator';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { AccordionModule } from 'primeng/accordion';
import { ButtonComponent } from './components/button/button.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { CustomFileUploadComponent } from './components/custom-file-upload/custom-file-upload.component';
import { CustomHeaderComponent } from './components/custom-header/custom-header.component';
import { CustomSelectComponent } from './components/custom-select/custom-select.component';
import { CustomSizeInputComponent } from './components/custom-size-input/custom-size-input.component';
import { DashboardErrorComponent } from './components/dashboard-error/dashboard-error.component';
import { DatatableComponent } from './components/datatable/datatable.component';
import { ExportListComponent } from './components/datatable/export-list/export-list.component';
import { FilterChipsComponent } from './components/datatable/filter-chips/filter-chips.component';
import { EmailChipListComponent } from './components/email-chip-list/email-chip-list.component';
import { InputComponent } from './components/form-component/input/input.component';
import { TextAreaComponent } from './components/form-component/text-area/text-area.component';
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
import { ImageDirective } from './directives/image.directive';
import { FeatureDirective } from './directives/feature.directive';
import { InternalSubscriptionDirective } from './directives/internal-subscription.directive';
import { NumberDirective } from './directives/number.directive';
import { ClickStopPropagation } from './directives/stoppropagation.directive';
import { SubscriptionDirective } from './directives/subscription.directive';
import { LinkDetector } from './pipes/linkDetector.pipe';
import { NumberFormatterPipe } from './pipes/number-formatter.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SafeUrlPipe } from './pipes/safe-url-pipe';
import { ChatCardComponent } from './components/chat-card/chat-card.component';
import { ChatHeaderComponent } from './components/chat-header/chat-header.component';
import { InfiniteScroll } from './directives/infinite-scroll.directive';
import { EmptyViewComponent } from './components/datatable/empty-view/empty-view.component';
import { CustomTooltipComponent } from './components/custom-tooltip/custom-tooltip.component';
import { MultiSelectComponent } from './components/form-component/multi-select/multi-select.component';
import { DateComponent } from './components/form-component/date/date.component';
import { PrefixFieldComponent } from './components/form-component/prefix-field/prefix-field.component';
import { SelectGroupComponent } from './components/form-component/select-group/select-group.component';
import { ViewSharedComponentsComponent } from './components/view-shared-components/view-shared-components.component';
import { ToggleSwitchComponent } from './components/form-component/toggle-switch/toggle-switch.component';
import { TableHeaderComponent } from './components/datatable/table-header/table-header.component';
import { TableSearchComponent } from './components/datatable/table-search/table-search.component';
import { NavigationHeaderComponent } from './components/navigation-header/navigation-header.component';
import { CategoryFormComponent } from './view/category-form/category-form.component';
import { AutoCompleteComponent } from './components/form-component/auto-complete/auto-complete.component';
import { ViewInputComponent } from './components/form-component/view-input/view-input.component';
import { MenuComponent } from './components/menu/menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { SkeletonShapeComponent } from './components/skeleton/skeleton-shape/skeleton-shape.component';
import { SkeletonDirective } from './directives/skeleton.directive';
import { LoaderBounceComponent } from './components/loader-bounce/loader-bounce.component';
import { PhoneNumberComponent } from './view/phone-number/phone-number.component';
import { EmptyTableComponent } from './components/datatable/empty-table/empty-table.component';
import { EmptyViewDirective } from './directives/empty-view.directive';
import { CreateWithViewComponent } from './view/create-with-view/create-with-view.component';

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
    AccordionModule,
    SplitButtonModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    CalendarModule,
    MultiSelectModule,
    AutoCompleteModule,
    MatChipsModule,
    MatAutocompleteModule,
    CKEditorModule,
    MatTooltipModule,
    DialogModule,
    MatMenuModule,
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
    ImageDirective,
    InfiniteScroll,
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
    ChatCardComponent,
    ChatHeaderComponent,
    CustomSelectComponent,
    CustomFileUploadComponent,
    StatsCardComponent,
    FilterChipsComponent,
    ExportListComponent,
    ButtonComponent,
    ToggleDropdownComponent,
    IteratorComponent,
    InputComponent,
    TextAreaComponent,
    SelectComponent,
    CustomHeaderComponent,
    ModalComponent,
    EmptyViewComponent,
    CustomTooltipComponent,
    MultiSelectComponent,
    DateComponent,
    PrefixFieldComponent,
    SelectGroupComponent,
    ViewSharedComponentsComponent,
    ToggleSwitchComponent,
    TableHeaderComponent,
    TableSearchComponent,
    NavigationHeaderComponent,
    CategoryFormComponent,
    AutoCompleteComponent,
    ViewInputComponent,
    MenuComponent,
    SkeletonShapeComponent,
    SkeletonDirective,
    LoaderBounceComponent,
    PhoneNumberComponent,
    EmptyTableComponent,
    EmptyViewDirective,
    CreateWithViewComponent,
  ],

  exports: [
    TabGroupComponent,
    UploadFileComponent,
    ComingSoonComponent,
    SharedMaterialModule,
    TableModule,
    ButtonModule,
    PaginatorModule,
    TabMenuModule,
    AccordionModule,
    SplitButtonModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    CalendarModule,
    MultiSelectModule,
    AutoCompleteModule,
    CKEditorModule,
    NumberDirective,
    MultipleDropdownComponent,
    UploadCsvComponent,
    SubscriptionDirective,
    InternalSubscriptionDirective,
    FeatureDirective,
    ClickableDirective,
    ImageDirective,
    InfiniteScroll,
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
    ChatCardComponent,
    ChatHeaderComponent,
    CustomSelectComponent,
    CustomFileUploadComponent,
    StatsCardComponent,
    FilterChipsComponent,
    ExportListComponent,
    ButtonComponent,
    ToggleDropdownComponent,
    IteratorComponent,
    InputComponent,
    TextAreaComponent,
    SelectComponent,
    CustomHeaderComponent,
    MatTooltipModule,
    ModalComponent,
    EmptyViewComponent,
    CustomTooltipComponent,
    MultiSelectComponent,
    DateComponent,
    PrefixFieldComponent,
    SelectGroupComponent,
    ViewSharedComponentsComponent,
    ToggleSwitchComponent,
    TableHeaderComponent,
    TableSearchComponent,
    NavigationHeaderComponent,
    CategoryFormComponent,
    AutoCompleteComponent,
    ViewInputComponent,
    MatMenuModule,
    MenuComponent,
    SkeletonDirective,
    SkeletonShapeComponent,
    LoaderBounceComponent,
    PhoneNumberComponent,
    EmptyTableComponent,
    EmptyViewDirective,
    CreateWithViewComponent,
  ],
})
export class AdminSharedModule {}
