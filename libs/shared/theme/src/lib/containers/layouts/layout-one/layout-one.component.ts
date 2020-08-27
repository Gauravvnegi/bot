import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'hospitality-bot-layout-one',
  templateUrl: './layout-one.component.html',
  styleUrls: ['./layout-one.component.scss'],
})
export class LayoutOneComponent implements OnInit {
  public id: number;
  public backgroundColor: string;
  public background_image: string;
  constructor(
    public settingService: SettingsService,
    private _themeService: ThemeService
  ) {
    this.id = settingService.getSidebarImageIndex() + 1;
    this.backgroundColor = this._themeService.themeConfig.sidenav.background_colour;
    this.background_image = this._themeService.themeConfig.sidenav.background_image;
    this.backgroundColor =
      this.backgroundColor || settingService.getSidebarColor();
  }

  ngOnInit() {
    this.settingService.sidebarImageIndexUpdate.subscribe((id: number) => {
      this.id = id + 1;
    });
    this.settingService.sidebarColorUpdate.subscribe((color: string) => {
      this.backgroundColor = color;
    });
  }

  ngOnDestroy() {
    this.settingService.sidebarImageIndexUpdate.unsubscribe();
    this.settingService.sidebarColorUpdate.unsubscribe();
  }
}
