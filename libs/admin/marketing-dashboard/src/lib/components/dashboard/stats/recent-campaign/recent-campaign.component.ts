import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Option, StatCard } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-recent-campaign',
  templateUrl: './recent-campaign.component.html',
  styleUrls: ['./recent-campaign.component.scss'],
})
export class RecentCampaignComponent implements OnInit {
  campaignForm: FormGroup;
  campaignList: Option[] = [
    {
      label: 'Campaign 1',
      value: '1',
    },
  ];

  constructor(private fb: FormBuilder) {}

  title: string = 'Recent WhatsApp Campaign';

  ngOnInit(): void {
    this.campaignForm = this.fb.group({
      campaign: [''],
    });
  }

  labelList = [
    {
      label: 'Delivered',
      count: 25,
      colorCode: '#FF9F40',
    },
    {
      label: 'Read',
      count: 25,
      colorCode: '#4BC0C0',
    },
    {
      label: 'Failed',
      count: 34,
      colorCode: '#FF6384',
    },
  ];

  statCard: StatCard[] = [
    {
      label: 'Total Sent',
      key: 'Agent',
    },
    {
      label: 'Total Read',
      key: 'Agent',
    },
    {
      label: 'Total Delivered',
      key: 'Agent',
    },
    {
      label: 'Delivered Rate',
      key: 'Agent',
    },
  ];

  data = {
    labels: ['A', 'B', 'C'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };
}
