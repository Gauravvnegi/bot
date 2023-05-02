import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  Categories,
  CategoryData,
  LibrarySearchItem,
  LibraryService,
} from '@hospitality-bot/admin/library';
import { Option } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  @Input() controlName: string;
  @Input() type: CategoryData['type'];
  categoryOffSet = 0;
  loadingCategory = false;
  noMoreCategories = false;
  categories: Option[] = [];
  $subscription = new Subscription();
  hotelId: string;
  servicesService: any;

  constructor(
    private globalFilterService: GlobalFilterService,
    private libraryService: LibraryService,
    private router: Router,
    private snackbarService: SnackBarService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.getCategories();
  }
  /**
   * @function getCategories
   * @description get categories from server
   */
  getCategories() {
    this.loadingCategory = true;
    this.$subscription.add(
      this.libraryService
        .getCategories(this.hotelId, {
          params: `?type=${this.type}&offset=${this.categoryOffSet}&limit=10&status=true`,
        })
        .subscribe((res) => {
          const data = new Categories().deserialize(res).records;
          this.categories = [...this.categories, ...data];
          this.noMoreCategories = data.length < 10;
          this.loadingCategory = false;
        })
    );
  }

  /**
   * @function loadMoreCategories
   * @description load more categories from server
   * @returns void
   * @memberof CategoryComponent
   */
  loadMoreCategories() {
    this.categoryOffSet = this.categoryOffSet + 10;
    this.getCategories();
  }

  /**
   * @function searchCategories
   * @description search categories from server
   * @param {string} text
   */
  searchCategories(text: string) {
    if (text) {
      this.loadingCategory = true;
      this.libraryService
        .searchLibraryItem(this.hotelId, {
          params: `?key=${text}&type=${LibrarySearchItem[this.type]}`,
        })
        .subscribe((res) => {
          this.loadingCategory = false;
          const data = res && res[LibrarySearchItem[this.type]];
          this.categories =
            data
              ?.filter((item) => item.active)
              .map((item) => ({
                label: item.name,
                value: item.id,
              })) ?? [];
        });
    } else {
      this.categoryOffSet = 0;
      this.categories = [];
      this.getCategories();
    }
  }

  /**
   * @function create
   * @description navigate to create category page
   * @returns void
   */
  create(event) {
    this.$subscription.add(
      this.libraryService
        .createCategory(this.hotelId, {
          name: event,
          source: 1,
          imageUrl: '',
          type: 'PACKAGE_CATEGORY',
        })
        .subscribe(() => {
          this.snackbarService.openSnackBarAsText(
            'Category created successfully',
            '',
            { panelClass: 'success' }
          );
          this.categoryOffSet = 0;
          this.getCategories();
        })
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
