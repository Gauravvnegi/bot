import {
  Component,
  OnInit,
  ViewChildren,
  ViewContainerRef,
  QueryList,
  ViewChild,
} from '@angular/core';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'admin-layout-one',
  templateUrl: './layout-one.component.html',
  styleUrls: ['./layout-one.component.scss'],
})
export class LayoutOneComponent implements OnInit {
  public id: number;
  public backgroundColor: string;
  public background_image: string;

  @ViewChild('dynamicHeaderContainer', { read: ViewContainerRef })
  dynamicHeaderContainer: ViewContainerRef;

  @ViewChildren('headerListItems', { read: ViewContainerRef })
  headerListItems: ViewContainerRef;

  constructor(public settingService: SettingsService) {
    this.id = settingService.getSidebarImageIndex() + 1;
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
