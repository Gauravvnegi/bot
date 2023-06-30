import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
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

  @Input() compServices: any[] = [];
  @Output() OnSave = new EventEmitter<string[]>();

  @Input() set serviceIds(value: string[]) {
    this.useForm.patchValue({
      serviceIds: value,
    });
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
    this.$subscription.add(
      this.importService.getServices().subscribe(
        (res) => {
          this.compServices = res.service;
          this.filteredServices = this.compServices;

          //still left to implement the logic for the filter already imported services
        },
        (err) => {},
        () => {
          this.loading = false;
        }
      )
    );
  }

  /**
   * @function saveForm
   * @description emit the form value to the parent component
   */
  saveForm() {
    this.OnSave.emit(this.useForm.value);
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
