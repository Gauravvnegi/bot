import { Component, OnInit } from '@angular/core';
import {
  CookiesSettingsService,
  HotelDetailService,
} from '../../../../../../../../../../libs/admin/shared/src/index';

@Component({
  selector: 'admin-site-action',
  templateUrl: './site-action.component.html',
  styleUrls: ['./site-action.component.scss'],
})
export class SiteActionComponent implements OnInit {
  sites: { label: string; value: string; command: () => void }[];
  selectedSite = '';
  selectedSiteId: string;

  constructor(
    private cookiesSettingService: CookiesSettingsService,
    private hotelDetailService: HotelDetailService
  ) {}

  ngOnInit(): void {
    this.selectedSiteId = this.hotelDetailService.siteId;
    this.sites = this.hotelDetailService.sites.map((item, idx) => {
      return {
        label: item.name,
        styleClass:
          this.selectedSiteId === item.id ? 'selected' : 'un-selected',
        value: item.id,
        command: () => {
          this.handleSite(idx);
        },
      };
    });

    const currSite = this.sites?.find(
      (site) => site.value === this.selectedSiteId
    );
    this.selectedSite = currSite?.label ?? 'Choose site';
  }

  handleSite = (index: number) => {
    const selectedSite = this.sites[index];
    const siteId = selectedSite.value;

    if (siteId !== this.selectedSiteId)
      this.cookiesSettingService.initPlatformChange(siteId);
  };
}
