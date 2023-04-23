import { Component, Input, OnInit } from '@angular/core';
import { RoomStatsImgUrls, sharedConfig } from '../../constants';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { DateService } from '@hospitality-bot/shared/utils';

@Component({
  selector: 'hospitality-bot-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss'],
})
export class StatsCardComponent implements OnInit{

  adminSharedConfig = sharedConfig;

  title: string;
  label: string;
  score: string;
  additionalData: string;
  comparisonPercent: number;
  dateDiff: string;
  imageUrls = RoomStatsImgUrls;
  tooltip: string;
  selectedInterval: string;
  globalQueries = [];

  @Input() set stats(value) {
    this.title = value?.label;
    this.label = value?.label?.replace(/([A-Z])/g, ' $1').trim();
    this.score = value?.score;
    this.comparisonPercent = value?.comparisonPercent || '';
    this.additionalData = value?.additionalData || '';
    this.tooltip = value?.tooltip;
  }

  constructor(
    private _globalFilterService: GlobalFilterService,
    private dateService: DateService,
  ) {}

  ngOnInit(): void {
    this.calcDate();
  }

  calcDate(){
    this._globalFilterService.globalFilter$.subscribe((data)=>{    
      let fromDate = new Date(data['dateRange'].queryValue[1].fromDate);
      let toDate = new Date(data['dateRange'].queryValue[0].toDate);

      let intervalDuration = toDate.getTime() - fromDate.getTime();
      const day = 86400000;

      let previousToDate = new Date(toDate.getTime() - intervalDuration - day);
      let previousFromDate = new Date(fromDate.getTime() - intervalDuration);

      const formatDate = (date) => {
        return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
      };

      this.dateDiff = `Compared To ${formatDate(previousFromDate)} - ${formatDate(previousToDate)}`;
    })
  }

}
