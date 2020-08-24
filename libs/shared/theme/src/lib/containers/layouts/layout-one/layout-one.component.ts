import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'hospitality-bot-layout-one',
  templateUrl: './layout-one.component.html',
  styleUrls: ['./layout-one.component.scss'],
})
export class LayoutOneComponent implements OnInit {
  public id: number;
  public backgroundColor: string;
  constructor(public settingService: SettingsService) {
    this.id = settingService.getSidebarImageIndex() + 1;
    this.backgroundColor = settingService.getSidebarColor();
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
