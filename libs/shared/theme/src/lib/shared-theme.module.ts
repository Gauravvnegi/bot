import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { SidenavComponent } from './containers/sidenav/sidenav.component';
import { LayoutOneComponent } from './containers/layouts/layout-one/layout-one.component';
import { SettingsComponent } from './containers/settings/settings.component';
import { DaterangeComponent } from './containers/daterange/daterange.component';
import { SharedMaterialModule } from '../../../../shared/material/src';
import { Daterangepicker } from 'ng2-daterangepicker';

export interface CustomConfig {
  ROUTES: any;
  sidenav: {
    list_item_colour: string;
    background_colour: string;
    background_image: string;
  };
}

@NgModule({
  imports: [CommonModule, RouterModule, SharedMaterialModule, Daterangepicker],
  declarations: [
    SidenavComponent,
    LayoutOneComponent,
    SettingsComponent,
    DaterangeComponent,
  ],
  exports: [SidenavComponent],
})
export class SharedThemeModule {
  public static forRoot(config: CustomConfig): ModuleWithProviders {
    return {
      ngModule: SharedThemeModule,
      providers: [{ provide: 'THEME_CONFIG', useValue: config }, ThemeService],
    };
  }
}
