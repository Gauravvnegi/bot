import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { dimensions, days, hours } from '../../../constants/data';
import {
  noRecordActionForComp,
  noRecordActionForCompWithId,
  noRecordActionForMenu,
  noRecordActionForMenuWithId,
} from '../../../constants/form';
import { navRoutes } from '../../../constants/routes';
import { Feature } from '../../../types/outlet';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'hospitality-bot-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss'],
})
export class RestaurantFormComponent implements OnInit {
  routes = navRoutes;
  console: any;
  @Input() set outletId(id: string) {
    if (id) {
      this.modifyNoRecordActions();
    }
  }
  @Input() compServices: any[] = [];
  @Input() menuList: any[] = [];
  @Input() isLoading: boolean;
  @Output() onCreateAndContinueFeature = new EventEmitter<Feature>();

  noRecordActionForComp = noRecordActionForComp;
  noRecordActionForMenu = noRecordActionForMenu;

  days = days;
  hours = hours;
  dimensions = dimensions;

  constructor(
    public controlContainer: ControlContainer,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.console.log(this.menuList);
  }

  modifyNoRecordActions() {
    this.noRecordActionForComp = noRecordActionForCompWithId;
    this.noRecordActionForMenu = noRecordActionForMenuWithId;
  }

  onCreateAndContinue(features: Feature) {
    this.onCreateAndContinueFeature.emit(features);
  }

  selectItems(id) {
    this.router.navigate([`menu/${id}`], { relativeTo: this.route });
  }
}
