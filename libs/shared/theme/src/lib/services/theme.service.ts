import { Injectable, Inject } from '@angular/core';
import { CustomConfig } from '../shared-theme.module';

@Injectable()
export class ThemeService {
  constructor(@Inject('THEME_CONFIG') public themeConfig: CustomConfig) {}
}
