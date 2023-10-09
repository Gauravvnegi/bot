import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormProps, Option } from '../../types/form.type';
import { Router } from '@angular/router';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Subscription } from 'rxjs';
import { AdminUtilityService } from '../../services/admin-utility.service';
import { ControlContainer } from '@angular/forms';
import { FormComponent } from '../../components/form-component/form.components';
import { MultiSelectSettings } from '../../components/form-component/multi-select/multi-select.component';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { convertToTitleCase } from '../../utils/valueFormatter';
@Component({
  selector: 'hospitality-bot-quick-select',
  templateUrl: './quick-select.component.html',
  styleUrls: ['./quick-select.component.scss'],
})
export class QuickSelectComponent extends FormComponent implements OnInit {
  /**
   * Initial Config Variables
   */
  _qsProps: QSProps;
  postLink: string; // api endpoint , modal also

  placeholder: string;
  class:
    | 'half-width'
    | 'full-width'
    | 'one-half-width'
    | 'one-third-width'
    | 'one-fourth-width';
  isAsync = false;
  qsLoading = false;

  /**
   * Pagination Variables
   */
  isPagination: boolean;
  offSet = 0;
  noMoreData = true;
  limit = 10;

  /**
   * @var dataModel API model for requesting OptionList
   * @type key is optional
   */
  model = {
    key: 'records',
    values: {
      label: 'name',
      value: 'id',
    },
  };
  dataModel: DataModel = { ...this.model };
  baseURL: string;
  entityId = '';
  apiEndPoint: string;
  queryParams: Record<string, string>;

  searchAPIEndPoint?: string;
  searchQueryParams?: Record<string, string>;
  searchModel?: DataModel = { ...this.model };

  postAPIEndPoint?: string;
  postQueryParams?: Record<string, string>;
  postModel?: DataModel = { ...this.model };

  // Settings variables
  showHeader = true;
  showChips = false;
  maxSelectedLabels = 1;

  @Input() settings: MultiSelectSettings;
  @Input() controlName: string;
  @Input() label: string;
  @Input() inputType: 'select' | 'multiselect' = 'select';
  @Input() set paginationConfig(values: PaginationConfig) {
    this.setValues<PaginationConfig>(values);
  }
  @Input() set apiConfig(values: APIConfig) {
    this.setValues<APIConfig>(values);
  }
  @Input() set props(values: QSProps) {
    this.setValues<QSProps>(values);
    this._qsProps = values;
  }

  @Output() clickedOption = new EventEmitter<Option>();

  $subscription: Subscription;

  constructor(
    private route: Router,
    private adminUtilityService: AdminUtilityService,
    private apiService: ApiService,
    public controlContainer: ControlContainer,
    private snackbarService: SnackBarService
  ) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.getItems();
    this.listenControl();
  }

  /**
   * @function setValues generic method to setting instance value
   * @param values will be values of all props
   * @var modelList for mapping model
   * @var endPoint if prefix '/' representing baseURL, 'URL
   */
  setValues<T extends PropsTypes>(values: T) {
    const modelList = ['dataModel', 'searchModel', 'postModel'];
    const endPointKeys = [
      'apiEndPoint',
      'searchAPIEndPoint',
      'postAPIEndPoint',
    ];
    Object.keys(values).forEach((key) => {
      if (endPointKeys.includes(key)) {
        const endPoint =
          values[key][0] != '/'
            ? `/api/v1/entity/${this.entityId}/${values[key] ?? ''}`
            : values[key];
        this[key] = endPoint;
      } else {
        if (modelList.includes(key)) {
          Object.keys(values[key]).forEach((itemKey) => {
            this[key][itemKey] = values[key][itemKey];
          });
        } else {
          this[key] = values[key];
        }
      }
    });
  }

  /**
   * @function search To search categories
   * @function getOptions modify the response as Option[] type using @var DataModel type
   * @param text search text
   */
  search(key: string) {
    if (key) {
      const apiEndPoint = this.searchAPIEndPoint
        ? this.searchAPIEndPoint
        : this.apiEndPoint;
      this.qsLoading = true;
      this.apiService
        .get(
          `${apiEndPoint}${this.getQueryConfig({
            key: key,
            ...this.queryParams,
          })}`,
          {
            'entity-id': this.entityId,
          }
        )
        .subscribe(
          (res) => {
            const model = this.searchModel ? this.searchModel : this.dataModel;
            this.menuOptions = this.getOptions(res, model);
          },
          (error) => {},
          () => {
            this.qsLoading = false;
          }
        );
    } else {
      this.offSet = 0;
      this.menuOptions = [];
      this.getItems();
    }
  }

  /**
   * @function getItems Get Item by API
   * @function getOptions modify the response as Option[] type using @var DataModel type
   * @function removeDuplicate will remove duplicate from the option list
   * @var noMoreData stop pagination when limit will cross
   */
  getItems() {
    this.qsLoading = true;
    this.apiService
      .get(
        `${this.apiEndPoint}${this.getQueryConfig({
          ...this.queryParams,
          offset: this.offSet,
          limit: this.limit,
        })}`,
        {
          'entity-id': this.entityId,
        }
      )
      .subscribe(
        (res) => {
          let data = this.getOptions(res, this.dataModel);
          this.menuOptions = this.removeDuplicate([
            ...this.menuOptions,
            ...data,
            ...(this._qsProps.selectedOption
              ? [this._qsProps.selectedOption]
              : []),
          ]);
          this.noMoreData = data.length < this.limit;
        },
        (error) => {},
        () => {
          this.qsLoading = false;
        }
      );
  }

  /**
   *
   * @param res response of api
   * @param model which kind of model is used for api
   * @returns list of option[]
   */
  getOptions(res, model) {
    const items = res ? (model?.key ? res[model.key] : res) : [];
    return (
      items.map((item) => {
        const label = Array.isArray(model.values?.label)
          ? `${item[model.values?.label[0]]} ${item[model.values?.label[1]]}` // Concatenate labels in case of an array
          : item[model.values?.label];
        return {
          ...item,
          label: convertToTitleCase(label ?? ''),
          value: item[model.values.value] ?? '',
        };
      }) ?? []
    );
  }

  /**
   * @function loadMoreData is paginator will set previous offset + 5 and call @function getItems to load data
   */
  loadMoreData() {
    this.offSet = this.offSet + 10;
    this.getItems();
  }

  /**
   * @function create for prompt link
   * @instance inputPrompt POST API will be call & data will be reload
   */
  create(event) {
    if (event?.length) {
      //Case When inputPrompt haven't to redirect...
      if (this._qsProps.inputPrompt) {
        const model = this.postModel ? this.postModel : this.dataModel;
        // API call with values
        let endPoint = this.postAPIEndPoint
          ? this.postAPIEndPoint
          : this.apiEndPoint;
        endPoint =
          endPoint[0] == '/'
            ? endPoint
            : `/api/v1/entity/${this.entityId}/${endPoint}`;
        const data = {
          ...model?.data,
          [model.key]: event,
        };
        this.apiService.post(endPoint, data).subscribe(
          (res) => {
            // push created option
            this.menuOptions.push({
              ...res,
              label: Array.isArray(model.values?.label)
                ? `${res[model.values?.label[0]]} ${
                    res[model.values?.label[1]]
                  }` // Concatenate labels in case of an array
                : res[model.values?.label],
              value: res[model.values.value],
            });
            this.controlContainer.control
              .get(this.controlName)
              .setValue(res[model.values.value]);
            this.snackbarService.openSnackBarAsText(
              this.label + ' created successfully',
              '',
              { panelClass: 'success' }
            );
          },
          () => {
            this.offSet = 0;
            this.menuOptions = [];
            this.getItems();
          }
        );
      }
    } else {
      //The case when you want to redirect
      this.route.navigate([this._qsProps.promptLink]);
    }
  }

  /**
   * @param param0 items which may be exists duplicate object value
   * @returns removed duplicate object item
   */
  removeDuplicate([...items]) {
    return items.filter(
      (item, index, arr) =>
        arr.findIndex(
          (obj) => obj.label === item.label && obj.value === item.value
        ) === index
    );
  }

  /**
   *
   * @param config configuration of the api calling
   * @returns
   */
  getQueryConfig(config?: Record<string, string | number>) {
    return this.adminUtilityService.makeQueryParams([config]);
  }

  /**
   * @function listenControl will emit the selected option to parent
   */
  listenControl() {
    this.controlContainer.control
      .get(this.controlName)
      .valueChanges.subscribe((res) => {
        this.clickedOption.emit(
          this.menuOptions.find((item) => item.value == res)
        );
      });
  }
}

type PropsTypes = PaginationConfig | APIConfig | QSProps | MultiSelectSettings;

interface PaginationConfig {
  isPagination: boolean;
  offSet?: number;
  noMoreData?: boolean;
  limit?: number;
}

export type APIConfig = {
  entityId: string;
  apiEndPoint: string;
  dataModel: DataModel;
  queryParams?: Record<string, string>;

  searchAPIEndPoint?: string;
  searchModel?: DataModel;
  searchQueryParams?: Record<string, string>;

  postApiEndPoint?: string;
  postModel?: DataModel;
  postQueryParams?: Record<string, string>;
};

export type QSProps = FormProps & {
  createPrompt: string;
  promptLink: string;
  selectedOption: Option;
  showChips: boolean;
};

/**
 * @type DataModel The key is optional. Without it, the response will be [{}]
 * @type Record<string,string> for the postDataModel
 */
export type DataModel = {
  key?: string;
  values: { label: string | string[]; value: string } | Record<string, string>;
  data?: Record<string, string>;
};
