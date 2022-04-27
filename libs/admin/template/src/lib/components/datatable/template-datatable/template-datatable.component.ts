import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'hospitality-bot-template-datatable',
  templateUrl: './template-datatable.component.html',
  styleUrls: ['./template-datatable.component.scss']
})
export class TemplateDatatableComponent implements OnInit {

  constructor(
    private _router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  openCreateTemplate(){
    this._router.navigate(['create'], { relativeTo: this.route });
  }
  openEditTemplate(){
    this._router.navigate(['edit'], { relativeTo: this.route });
  }

}
