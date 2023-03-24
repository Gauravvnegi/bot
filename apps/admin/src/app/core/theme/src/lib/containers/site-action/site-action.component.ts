import { Component, OnInit } from '@angular/core';
import { ManageSiteStatus } from '../../../../../../../../../../libs/admin/manage-sites/src/lib/constant/manage-site';
import { CookiesSettingsService } from '../../../../../../../../../../libs/admin/shared/src/index';
import { GlobalFilterService } from '../../services/global-filters.service';

@Component({
  selector: 'admin-site-action',
  templateUrl: './site-action.component.html',
  styleUrls: ['./site-action.component.scss'],
})
export class SiteActionComponent implements OnInit {
  sites: { label: string; value: string; command: () => void }[];
  selectedSite = '';

  constructor(
    private cookiesSettingService: CookiesSettingsService,
    private globalFilterService: GlobalFilterService
  ) {}

  ngOnInit(): void {
    this.sites = this.cookiesSettingService.hotelAccessData?.map(
      (item, idx) => {
        return {
          label: item.siteName,
          value: item.id,
          command: () => {
            this.handleSite(idx);
          },
        };
      }
    );

    const currSite = this.sites?.find(
      (site) => site.value === this.globalFilterService.hotelId
    );

    this.selectedSite = currSite?.label ?? 'Choose site';
  }

  handleSite = (index: number) => {
    const hotelId = this.sites[index].value;
    this.cookiesSettingService.initPlatformChange(hotelId);
  };
}
