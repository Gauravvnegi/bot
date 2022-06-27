import { ClipboardModule } from '@angular/cdk/clipboard';
import { LayoutModule } from '@angular/cdk/layout';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { ModalService } from './services/modal.service';
import { SnackBarService } from './services/snackbar.service';

@NgModule({
  imports: [
    FlexLayoutModule,
    MatInputModule,
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatMenuModule,
    MatTableModule,
    MatSelectModule,
    MatCheckboxModule,
    MatStepperModule,
    MatDatepickerModule,
    MatRadioModule,
    MatNativeDateModule,
    MatMomentDateModule,
    LayoutModule,
    MatSnackBarModule,
    CdkStepperModule,
    MatDialogModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatTabsModule,
    ClipboardModule,
    TranslateModule,
    MatAutocompleteModule,
    OverlayModule,
  ],
  exports: [
    FlexLayoutModule,
    MatInputModule,
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatMenuModule,
    MatTableModule,
    MatSelectModule,
    MatCheckboxModule,
    MatStepperModule,
    MatDatepickerModule,
    MatRadioModule,
    MatNativeDateModule,
    MatMomentDateModule,
    LayoutModule,
    MatSnackBarModule,
    CdkStepperModule,
    MatDialogModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatTabsModule,
    ClipboardModule,
    OverlayModule,
    MatAutocompleteModule,
  ],
  providers: [SnackBarService, ModalService],
})
export class SharedMaterialModule {}
