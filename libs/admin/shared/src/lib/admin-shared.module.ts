import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MenuModule } from 'primeng/menu';
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
import { InputNumberModule } from 'primeng/inputnumber';
import { TabMenuModule } from 'primeng/tabmenu';
import { AccordionModule } from 'primeng/accordion';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ContextMenuModule } from 'primeng/contextmenu';

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
import { StatusDropdownToggleComponent } from './components/status-dropdown-toggle/status-dropdown-toggle.component';
import { TopicDropdownComponent } from './components/topic-dropdown/topic-dropdown.component';
import { UnsubscribeFeatureComponent } from './components/unsubscribe-feature/unsubscribe-feature.component';
import { UnsubscribeViewComponent } from './components/unsubscribe-view/unsubscribe-view.component';
import { UploadCsvComponent } from './components/upload-csv/upload-csv.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { UploadVideoComponent } from './components/upload-video/upload-video.component';
import { ClickableDirective } from './directives/clickable.directive';
import { ImageDirective } from './directives/image.directive';
import { NumberDirective } from './directives/number.directive';
import { StatusCellDirective } from './directives/status-cell.directive';
import { ClickStopPropagation } from './directives/stoppropagation.directive';
import { LinkDetector } from './pipes/linkDetector.pipe';
import { MathPipe } from './pipes/math.pipe';
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
import { InputSwitchComponent } from './components/form-component/input-switch/input-switch.component';
import { MenuComponent } from './components/menu/menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { SkeletonShapeComponent } from './components/skeleton/skeleton-shape/skeleton-shape.component';
import { SkeletonDirective } from './directives/skeleton.directive';
import { LoaderBounceComponent } from './components/loader-bounce/loader-bounce.component';
import { PhoneNumberComponent } from './view/phone-number/phone-number.component';
import { EmptyTableComponent } from './components/datatable/empty-table/empty-table.component';
import { EmptyViewDirective } from './directives/empty-view.directive';
import { CreateWithViewComponent } from './view/create-with-view/create-with-view.component';
import { ToggleSwitchComponentLabel } from './components/toggle-switch-label/toggle-switch-label.component';
import { RoomTypeDirective } from './directives/room-type.directive';
import { CopyLinkComponentComponent } from './components/copy-link-component/copy-link-component.component';
import { InputNumberComponent } from './components/form-component/input-number/input-number.component';
import { AddAttachmentComponent } from './components/form-component/add-attachment/add-attachment.component';
import { ModalHeaderComponent } from './components/datatable/modal-header/modal-header.component';
import { ImageHandlingComponent } from './components/image-handling/image-handling.component';
import { SharedImageCropperModule } from 'libs/shared/image-cropper/src/lib/shared-image-cropper.module';
import { AddressComponent } from './components/address/address-component.component';
import { SocialMediaComponent } from './components/social-media/social-media.component';
import { DiscountFormComponent } from './components/discount-form/discount-form.component';
import { TimePickerComponent } from './components/form-component/time-picker/time-picker.component';
import { CheckboxSelectorComponent } from './components/form-component/checkbox-selector/checkbox-selector.component';
import { MenuButtonComponent } from './components/menu-button/menu-button.component';
// import { MenuModule } from 'primeng/menu';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TabHeaderComponent } from './components/tab-header/tab-header.component';
import { ImportServiceContainerComponent } from './components/import-service-container/import-service-container.component';
import { CountdownDirective } from './directives/countdown.directive';
import { GlobalSearchComponent } from './components/search/global-search.component';
import { QrCodeModalComponent } from './components/qr-code-modal/qr-code-modal.component';
import { QRCodeModule } from 'angularx-qrcode';
import { MultiplePrefixInputComponent } from './components/form-component/multiple-prefix-input/multiple-prefix-input.component';
import { FormActionComponent } from './components/form-component/form-action/form-action.component';
import { LoaderDirective } from './directives/loader.directive';
import { StepperComponent } from './components/stepper/stepper.component';
import { StepsModule } from 'primeng/steps';
import { FromToDateComponent } from './components/from-to-date/from-to-date.component';
import { TimerComponent } from './components/timer/timer.component';
import { SidebarModule } from 'primeng/sidebar';
import { InteractiveGridComponent } from './components/interactive-grid/interactive-grid.component';
import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';
import { PositionedMenuComponent } from './components/positioned-menu/positioned-menu.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { TooltipModule } from 'primeng/tooltip';

import { TieredMenuModule } from 'primeng/tieredmenu';
import { TieredMenuButtonComponent } from './components/tiered-menu-button/tiered-menu-button.component';
import { TabbedSidebarComponent } from './components/tabbed-sidebar/tabbed-sidebar.component';
import { InfoPanelComponent } from './components/info-panel/info-panel.component';
import { QuickSelectComponent } from './view/quick-select/quick-select.component';
import { ToggleMenuComponent } from './components/toggle-menu/toggle-menu.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxComponent } from './components/form-component/checkbox/checkbox.component';
import { SplitButtonComponent } from './components/split-button/split-button.component';
import { Dialog } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { DynamicContentComponent } from './components/dynamic-content/dynamic-content.component';
import { GuestDetailsDirective } from './directives/guest-details.directive';
import { SearchComponent } from './components/form-component/search/search.component';

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
    OverlayPanelModule,
    SplitButtonModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    CalendarModule,
    MultiSelectModule,
    AutoCompleteModule,
    CKEditorModule,
    MatTooltipModule,
    DialogModule,
    MatMenuModule,
    SharedImageCropperModule,
    MenuModule,
    ToggleButtonModule,
    InputNumberModule,
    QRCodeModule,
    StepsModule,
    AngularDraggableModule,
    TooltipModule,
    TieredMenuModule,
    ConfirmDialogModule,
    ToastModule,
    TabViewModule,
  ],
  declarations: [
    DatatableComponent,
    TabGroupComponent,
    UploadFileComponent,
    ComingSoonComponent,
    NumberDirective,
    StatusCellDirective,
    MultipleDropdownComponent,
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
    MathPipe,
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
    StatusDropdownToggleComponent,
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
    InputSwitchComponent,
    MenuComponent,
    SkeletonShapeComponent,
    SkeletonDirective,
    LoaderBounceComponent,
    PhoneNumberComponent,
    EmptyTableComponent,
    EmptyViewDirective,
    CreateWithViewComponent,
    ToggleSwitchComponentLabel,
    RoomTypeDirective,
    CopyLinkComponentComponent,
    AddAttachmentComponent,
    ModalHeaderComponent,
    ImageHandlingComponent,
    AddressComponent,
    SocialMediaComponent,
    DiscountFormComponent,
    TimePickerComponent,
    CheckboxSelectorComponent,
    MenuButtonComponent,
    TabHeaderComponent,
    CountdownDirective,
    ImportServiceContainerComponent,
    InputNumberComponent,
    GlobalSearchComponent,
    QrCodeModalComponent,
    MultiplePrefixInputComponent,
    FormActionComponent,
    LoaderDirective,
    StepperComponent,
    FromToDateComponent,
    TimerComponent,
    InteractiveGridComponent,
    CalendarViewComponent,
    PositionedMenuComponent,
    TieredMenuButtonComponent,
    TabbedSidebarComponent,
    InfoPanelComponent,
    QuickSelectComponent,
    ToggleMenuComponent,
    ConfirmDialogComponent,
    CheckboxComponent,
    SplitButtonComponent,
    DynamicContentComponent,
    GuestDetailsDirective,
    SearchComponent,
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
    MenuModule,
    AccordionModule,
    OverlayPanelModule,
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
    StatusCellDirective,
    MultipleDropdownComponent,
    UploadCsvComponent,
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
    MathPipe,
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
    StatusDropdownToggleComponent,
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
    InputSwitchComponent,
    MatMenuModule,
    MenuModule,
    MenuComponent,
    SkeletonDirective,
    SkeletonShapeComponent,
    LoaderBounceComponent,
    PhoneNumberComponent,
    EmptyTableComponent,
    EmptyViewDirective,
    CreateWithViewComponent,
    ToggleSwitchComponentLabel,
    RoomTypeDirective,
    CopyLinkComponentComponent,
    AddAttachmentComponent,
    ModalHeaderComponent,
    ImageHandlingComponent,
    AddressComponent,
    SocialMediaComponent,
    DiscountFormComponent,
    TimePickerComponent,
    CheckboxSelectorComponent,
    MenuButtonComponent,
    ToggleButtonModule,
    TabHeaderComponent,
    CountdownDirective,
    ImportServiceContainerComponent,
    InputNumberComponent,
    GlobalSearchComponent,
    MultiplePrefixInputComponent,
    FormActionComponent,
    LoaderDirective,
    StepperComponent,
    FromToDateComponent,
    TimerComponent,
    SidebarModule,
    InteractiveGridComponent,
    CalendarViewComponent,
    PositionedMenuComponent,
    AngularDraggableModule,
    TooltipModule,
    TieredMenuButtonComponent,
    TabbedSidebarComponent,
    InfoPanelComponent,
    QuickSelectComponent,
    ToggleMenuComponent,
    ConfirmDialogComponent,
    CheckboxComponent,
    SplitButtonComponent,
    ContextMenuModule,
    Dialog,
    ToastModule,
    DynamicContentComponent,
    GuestDetailsDirective,
    SearchComponent,
  ],
})
export class AdminSharedModule {}
