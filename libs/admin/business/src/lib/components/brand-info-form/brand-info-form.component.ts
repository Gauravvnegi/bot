import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'hospitality-bot-brand-info-form',
  templateUrl: './brand-info-form.component.html',
  styleUrls: ['./brand-info-form.component.scss'],
})
export class BrandInfoFormComponent implements OnInit {
  brandId;
  constructor(private route: ActivatedRoute) {
    this.brandId = this.route.snapshot.paramMap.get('brandId');
  }

  ngOnInit(): void {}
}
