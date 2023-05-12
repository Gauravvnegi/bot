import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../services/loader.service';

@Component({
  selector: 'admin-layout-two',
  templateUrl: './layout-two.component.html',
  styleUrls: ['./layout-two.component.scss'],
})
export class LayoutTwoComponent implements OnInit {
  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.close();
  }
}
