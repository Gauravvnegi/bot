import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsService } from './settings.service';
import { ROUTES } from './sidebar-routes.config';

@Component({
  selector: 'admin-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit, AfterViewInit, OnDestroy {
  public color: string;
  public menuItems: object;
  public activeFontColor: string;
  public normalFontColor: string;
  public dividerBgColor: string;
  isExpanded=true;
  status:boolean=false
  constructor(public settingsService: SettingsService) {
    this.menuItems = ROUTES;
    this.activeFontColor = 'rgba(0,0,0,.6)';
    this.normalFontColor = 'rgba(255,255,255,.8)';
    this.dividerBgColor = 'rgba(255, 255, 255, 0.5)';
  }

  ngOnInit() {
    this.color = this.settingsService.getSidebarFilter();
    this.settingsService.sidebarFilterUpdate.subscribe((filter: string) => {
      this.color = filter;
      if (filter === '#fff') {
        this.activeFontColor = 'rgba(0,0,0,.6)';
      } else {
        this.activeFontColor = 'rgba(255,255,255,.8)';
      }
    });
    this.settingsService.sidebarColorUpdate.subscribe((color: string) => {
      if (color === '#fff') {
        this.normalFontColor = 'rgba(0,0,0,.6)';
        this.dividerBgColor = 'rgba(0,0,0,.1)';
      } else {
        this.normalFontColor = 'rgba(255,255,255,.8)';
        this.dividerBgColor = 'rgba(255, 255, 255, 0.5)';
      }
    });
  }
  ngOnDestroy() {
    this.settingsService.sidebarFilterUpdate.unsubscribe();
    this.settingsService.sidebarColorUpdate.unsubscribe();
  }

  toggleMenuButton(){
    this.status=!this.status;
    this.isExpanded=!this.isExpanded
 }

  ngAfterViewInit() {}
}
