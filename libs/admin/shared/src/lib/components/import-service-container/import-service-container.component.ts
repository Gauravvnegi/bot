import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, forkJoin } from 'rxjs';
import { Services } from '../../models/import-service.model';
import { ImportService } from '../../services/import-service.service';

@Component({
  selector: 'hospitality-bot-import-service-container',
  templateUrl: './import-service-container.component.html',
  styleUrls: ['./import-service-container.component.scss'],
  providers: [ImportService],
})
export class ImportServiceContainerComponent implements OnInit {
  useForm: FormGroup;
  searchForm: FormGroup;
  loading: boolean = false;
  $subscription = new Subscription();
  filteredServices: any[] = [];
  itemId: string;
  endpoint = '';
  params: string;
  allComplimentaryServices: any[] = [];
  attachedServicesPackageCode: string[] = [];

  @Input() compServices: any[] = [];
  @Output() OnSave = new EventEmitter<any>();
  @Input() attachedServices: any[] = [];

  @Input() set apiConfig(apiConfig: apiConfig) {
    this.endpoint = apiConfig.endpoint;
    this.params = apiConfig.params;
    this.itemId = apiConfig.itemId;
  }

  constructor(private fb: FormBuilder, private importService: ImportService) {}

  ngOnInit(): void {
    this.initForm();
    this.getDefaultServices();
    this.registerSearch();
  }

  /**
   * @function initForm
   * @description initialize the form values
   *
   */
  initForm() {
    this.useForm = this.fb.group({
      serviceIds: [[]],
    });

    this.searchForm = this.fb.group({
      searchText: [''],
    });
  }

  /**
   * @function searchServices
   */
  registerSearch() {
    this.searchForm.get('searchText').valueChanges.subscribe((res) => {
      if (res) {
        this.filteredServices = this.compServices.filter((service) =>
          service.name.toLowerCase().includes(res.toLowerCase())
        );
      } else {
        this.filteredServices = this.compServices;
      }
    });
  }

  /**
   * @function getDefaultServices
   * @description get the default services from the server
   * @returns void
   */
  getDefaultServices() {
    this.loading = true;
    const api1$ = this.importService.getServices();
    const api2$ = this.importService.getAttachedServices(
      this.endpoint,
      this.itemId,
      {
        params: this.params,
      }
    );

    forkJoin([api1$, api2$]).subscribe(
      ([api1Data, api2Data]) => {
        api2Data = api2Data.complimentaryPackages.map((res) => res.packageCode);
        //backup the attached services
        this.attachedServicesPackageCode = api2Data;

        this.compServices = new Services().deserialize(
          api1Data.service
        ).services;

        // backup the default services
        this.allComplimentaryServices = this.compServices;

        // remove the attached services from the default services
        this.compServices = this.compServices.filter(
          (res) => !api2Data.includes(res.packageCode)
        );
        // set the default services to the form
        this.filteredServices = this.compServices;
      },
      (err) => {},
      () => {
        this.loading = false;
      }
    );
  }

  /**
   * @function saveForm
   * @description emit the form value to the parent component
   */
  saveForm() {
    // get the attached services according to the config api id
    const attachedServiceIds = this.allComplimentaryServices.filter((res) =>
      this.attachedServicesPackageCode.includes(res.packageCode)
    );

    const data = this.useForm.getRawValue();
    data.serviceIds = [
      ...data.serviceIds,
      ...attachedServiceIds.map((res) => res.id),
    ];

    const packageCode = this.allComplimentaryServices
      .filter((res) => data.serviceIds.includes(res.id))
      .map((res) => res.packageCode);

    this.OnSave.emit({ serviceIds: data.serviceIds, packageCode: packageCode });
  }

  /**
   * @function resetForm
   * @description reset the form
   * @returns void
   */
  resetForm() {
    this.useForm.get('serviceIds').setValue([]);
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}

type apiConfig = {
  endpoint: string;
  itemId: string;
  params;
};

type Form = {
  serviceIds: string[];
};
