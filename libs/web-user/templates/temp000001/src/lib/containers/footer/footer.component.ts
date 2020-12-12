import { Component, OnInit } from '@angular/core';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
export interface IFooterConfig {
  footerLogo: string;
  social: {
    id: string;
    imageUrl: string;
    name: string;
    redirectUrl: string;
  }[];
  privacyPolicy: string;
  contactDetails: {
    contactNo: string;
    email: string;
  };
}
@Component({
  selector: 'hospitality-bot-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  footerConfig: IFooterConfig = {
    footerLogo: '',
    contactDetails: {
      contactNo: '',
      email: '',
    },
    social: [],
    privacyPolicy: '',
  };

  constructor(private _hotelService: HotelService) {}

  ngOnInit(): void {
    this.getHotelConfigData();
  }

  private getHotelConfigData(): void {
    let {
      footerLogo,
      contactDetails,
      privacyPolicyUrl,
      socialPlatforms,
    } = this._hotelService.hotelConfig;
    let { emailId, contactNumber, cc } = contactDetails;
    this.footerConfig.social = socialPlatforms;
    this.footerConfig.footerLogo = footerLogo;
    this.footerConfig.contactDetails.contactNo = cc + ' ' + contactNumber;
    this.footerConfig.contactDetails.email = emailId;
    this.footerConfig.privacyPolicy = privacyPolicyUrl;
  }
}
