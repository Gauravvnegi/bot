import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { SidenavComponent } from './containers/sidenav/sidenav.component';
import { LayoutOneComponent } from './containers/layouts/layout-one/layout-one.component';
import { SettingsComponent } from './containers/settings/settings.component';

export interface CustomConfig {
  ROUTES: any;
}

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [SidenavComponent, LayoutOneComponent, SettingsComponent],
  exports: [SidenavComponent],
})
export class SharedThemeModule {
  public static forRoot(config: CustomConfig): ModuleWithProviders {
    // User config get logged here
    return {
      ngModule: SharedThemeModule,
      providers: [{ provide: 'THEME_CONFIG', useValue: config }, ThemeService],
    };
  }
}
