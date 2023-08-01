import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../services/loader.service';
import { Location } from '@angular/common';

@Component({
  selector: 'admin-layout-two',
  templateUrl: './layout-two.component.html',
  styleUrls: ['./layout-two.component.scss'],
})
export class LayoutTwoComponent implements OnInit {
  constructor(
    private loadingService: LoadingService,
    private location: Location
  ) {}

  ngOnInit() {
    this.loadingService.close();
  }

  back() {
    this.location.back();
  }
}
