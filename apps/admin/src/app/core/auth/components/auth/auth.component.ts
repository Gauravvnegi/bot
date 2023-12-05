import { Component, OnInit } from '@angular/core';
import { DateService } from '@hospitality-bot/shared/utils';
import { authConstants } from '../../constants/auth';
import { ManagingOption } from '../../types/auth.type';
import { Slick } from 'ngx-slickjs';
import { LoadingService } from '../../../theme/src/lib/services/loader.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'admin-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  authConstants = authConstants;

  config: Slick.Config = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    autoplay: true,
    autoplaySpeed: 1000,
  };

  constructor(
    private loadingService: LoadingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.loadingService.overlayCompRef) this.loadingService?.close();
    this.getProductList();
  }

  /**
   * @function trackById To track managing options by id.
   * @param index The current index of option.
   * @param managingOptions The current managing option.
   * @returns The id to track ech option uniquely.
   */
  trackById(index: number, managingOptions: ManagingOption): number {
    return managingOptions.id;
  }

  productList: any[] = [];

  getProductList() {
    this.authService.getProductList().subscribe((res) => {
      this.productList = res.map((data) => {
        return {
          name: data.name,
          label: data.label,
          icon: data.icon,
        };
      });
    });
  }

  /**
   * @function currentDate To get the current year.
   * @returns The current year.
   */
  get currentDate(): string {
    return DateService.getCurrentDateWithFormat('YYYY');
  }

  getArray(count: number) {
    return new Array(count);
  }
}
