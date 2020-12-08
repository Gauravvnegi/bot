import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-nps-across-departments',
  templateUrl: './nps-across-departments.component.html',
  styleUrls: ['./nps-across-departments.component.scss']
})
export class NpsAcrossDepartmentsComponent implements OnInit {

  npsFG: FormGroup;
  documentTypes = [
    { label: 'CSV', value: 'csv' },
    // { label: 'EXCEL', value: 'excel' },
    // { label: 'PDF', value: 'pdf' },
  ];

  documentActionTypes = [
    {
      label: 'Export All',
      value: 'exportAll',
      type: '',
      defaultLabel: 'Export All',
    },
    {
      label: `Export`,
      value: 'export',
      type: 'countType',
      defaultLabel: 'Export',
    },
  ];

  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    speed: 100,
    autoplay: true,
    responsive: [
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  progressValues = [
    {
      title: 'Reservation',
      progress: {
        negative: 90,
        positive: 20,
      }
    },
    {
      title: 'Front Office',
      progress: {
        negative: 50,
        positive: 25,
      }
    },
    {
      title: 'Housekeeping',
      progress: {
        negative: 25,
        positive: 60,
      }
    },
    {
      title: 'Maintenance',
      progress: {
        negative: 75,
        positive: 85,
      }
    },
    {
      title: 'Food & Beverage',
      progress: {
        negative: 50,
        positive: 60,
      }
    },
    // {
    //   title: 'Spa & Salon',
    //   progress: {
    //     negative: 50,
    //     positive: 60,
    //   }
    // }
  ]

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initFG();
  }

  initFG(): void {
    this.npsFG = this.fb.group({
      documentType: ['csv'],
      documentActionType: ['Export All']
    })
  }

}
