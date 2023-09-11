import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  noRecordActionForFood,
  noRecordActionForFoodWithId,
} from '../../../constants/form';
import { outletBusinessRoutes } from '../../../constants/routes';
import { Feature } from '../../../types/outlet';
import { FoodPackageList } from '../../../models/outlet.model';
import { OutletService } from '../../../services/outlet.service';

@Component({
  selector: 'hospitality-bot-food-package',
  templateUrl: './food-package.component.html',
  styleUrls: ['./food-package.component.scss'],
})
export class FoodPackageComponent implements OnInit {
  routerLink = outletBusinessRoutes;
  noRecordActionForFood = noRecordActionForFood;
  foodPackages: any[] = [];
  outletId: string = '';
  loading: boolean = false;

  @Output() onCreateAndContinueFeature = new EventEmitter<Feature>();
  OutletFormService: any;

  @Input() set isOutletId(id: boolean) {
    if (id) {
      // this.outletId = id;
      this.noRecordActionForFood = noRecordActionForFoodWithId;
    }
  }

  constructor(
    private outletService: OutletService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.outletId = this.route.snapshot.params['outletId'];
    this.getFoodPackages();
  }

  onCreateAndContinue(feature: Feature): void {
    this.onCreateAndContinueFeature.emit(feature);
  }

  getFoodPackages() {
    this.outletService
      .getFoodPackageList(this.outletId, {
        params: `?type=FOOD_PACKAGE&pagination=false`,
      })
      .subscribe(
        (res) => {
          this.loading = false;
          this.foodPackages = new FoodPackageList().deserialize(res).records;
        },
        (err) => {},
        () => {
          this.loading = false;
        }
      );
  }

  selectItems(id) {
    this.onCreateAndContinueFeature.emit('save');

    this.router.navigate([`food-package/${id}`], { relativeTo: this.route });
  }
}
