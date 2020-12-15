import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-nps-across-departments',
  templateUrl: './nps-across-departments.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './nps-across-departments.component.scss'
  ]
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

  // slideConfig = {
  //   slidesToShow: 5,
  //   arrows:true,
  //   slidesToScroll: 1,
  //   infinite: false,
  //   speed: 100,
  //   autoplay: false,
  //   responsive: [
  //     {
  //       breakpoint: 500,
  //       settings: {
  //         slidesToShow: 1,
  //       },
  //     },
  //   ],
  // };

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
        positive: 40,
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
    {
      title: 'Reservation',
      progress: {
        negative: 90,
        positive: 20,
      }
    },
    {
      title: 'Reservation',
      progress: {
        negative: 90,
        positive: 20,
      }
    },
    {
      title: 'Reservation',
      progress: {
        negative: 90,
        positive: 20,
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
