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
    this.sites = this.hotelDetailService.hotelDetails.sites.map((item, idx) => {
      return {
        label: item.name,
        value: item.id,
        command: () => {
          this.handleSite(idx);
        },
      };
    });

    this.hotelDetailService.siteId.subscribe((siteId) => {
      const currSite = this.sites?.find((site) => site.value === siteId);
      this.selectedSite = currSite?.label ?? 'Choose site';
      this.selectedSiteId = currSite?.value;
    });
  }

  handleSite = (index: number) => {
    const selectedSite = this.sites[index];
    const siteId = selectedSite.value;

    if (siteId !== this.selectedSiteId)
      this.cookiesSettingService.initPlatformChangeV2(siteId);
  };
}
