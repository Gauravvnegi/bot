import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Option } from '@hospitality-bot/admin/shared';
import {
  noRecordActionForComp,
  noRecordActionForCompWithId,
  noRecordActionForMenu,
  noRecordActionForMenuWithId,
} from '../../../constants/form';
import { navRoutes } from '../../../constants/routes';
import { OutletService } from '../../../services/outlet.service';
import { Feature } from '../../../types/outlet';
@Component({
  selector: 'hospitality-bot-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss'],
})
export class RestaurantFormComponent implements OnInit {
  routes = navRoutes;
  console: any;
  isId: boolean = false;
  @Input() set outletId(id: string) {
    if (id) {
      this.isId = true;
      this.modifyNoRecordActions();
    }
  }
  @Input() compServices: any[] = [];
  @Input() menuList: any[] = [];
  @Input() isLoading: boolean;
  @Output() onCreateAndContinueFeature = new EventEmitter<Feature>();

  noRecordActionForComp = noRecordActionForComp;
  noRecordActionForMenu = noRecordActionForMenu;

  days: Option[] = [];
  hours: Option[] = [];
  dimensions: Option[] = [];

  constructor(
    public controlContainer: ControlContainer,
    private router: Router,
    private route: ActivatedRoute,
    public outletService: OutletService
  ) {}

  ngOnInit(): void {
  }


  modifyNoRecordActions() {
    this.noRecordActionForComp = noRecordActionForCompWithId;
    this.noRecordActionForMenu = noRecordActionForMenuWithId;
  }

  onCreateAndContinue(features: Feature) {
    this.onCreateAndContinueFeature.emit(features);
  }

  selectItems(id) {
    this.onCreateAndContinueFeature.emit('save');

    this.router.navigate([`menu/${id}`], { relativeTo: this.route });
  }
}
