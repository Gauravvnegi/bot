import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Option } from '@hospitality-bot/admin/shared';
import { HotelService } from '../services/hotel.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Services } from '../models/hotel.models';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'hospitality-bot-add-hotel',
  templateUrl: './add-hotel.component.html',
  styleUrls: ['./add-hotel.component.scss'],
})
export class AddHotelComponent implements OnInit {
  hotelId: string;
  itemId: string;
  useForm: FormGroup;
  code: string = '#add-hotel';
  compServices = [];
  loading = false;
  imageLimit: number = 4;
  segmentList: Option[];
  $subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private hotelService: HotelService,
    private snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.initForm();
    this.getSegmentList();
    this.getServices();

    this.itemId = this.route.snapshot.params['id'];
  }

  initForm() {
    this.useForm = this.fb.group({
      active: [true],
      serviceName: ['', [Validators.required]],
      segment: ['', [Validators.required]],
      email: [''],
      contact: ['', [Validators.required]],
      address: ['', [Validators.required]],
      imageUrls: [[], [Validators.required]],
      description: ['', [Validators.required]],
      complimentaryAmenities: [[], [Validators.required]],
      facebook: [''],
      twitter: [''],
      instagram: [''],
      youtube: [''],
    });
  }

  saveHotelData() {}

  addMoreImage() {
    this.imageLimit = this.imageLimit + 4;
  }

  getSegmentList() {
    this.hotelService.getSegments(this.hotelId).subscribe((res) => {
      this.segmentList = res;
    });
  }

  /**
   * @function getServices to get amenities (paid and services)
   * @param serviceType
   */
  getServices() {
    this.$subscription.add(
      this.hotelService
        .getServices(this.hotelId, {
          params: `?limit=5&type=SERVICE&serviceType=COMPLIMENTARY&status=true`,
        })
        .subscribe(
          (res) => {
            this.compServices = new Services().deserialize(
              res.complimentaryPackages
            ).services;
          },
          (error) => {
            this.snackbarService.openSnackBarAsText(error.error.message);
          }
        )
    );
  }

  submitForm() {
    console.log(this.useForm.getRawValue())
    if (this.useForm.invalid) {
      console.log(this.useForm.errors);
      this.loading = false;
      this.snackbarService.openSnackBarAsText(
        'Invalid Form: Please fix the errors'
      );
      this.useForm.markAllAsTouched();
      return;
    }
    const data = {
      hotel: {
        name: 'hotel Reddish',
        logo:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/bot/hotel/logos/static-content/hilltop/hiltop-logo2.png',
        timezone: 'Asia/Calcutta',
        address: {
          city: 'Noida',
          country: 'India',
          latitude: 0.0,
          longitude: 0.0,
          pincode: 0,
        },
        contactInfo: {},
      },
      brandId: '3a3b06c6-e3cc-47a2-903a-22aa6c6f005e',
    };
    this.loading = true;
    this.$subscription.add(
      this.hotelService
        .createHotel(this.hotelId, data)
        .subscribe(this.handleSuccess, this.handelFinal)
    );
  }

  resetForm() {
    this.useForm.reset({}, { emitEvent: true });
  }

  /**
   * @function handleSuccess To show success message
   * @returns void
   */
  handleSuccess = () => {
    this.snackbarService.openSnackBarAsText(
      `Tax ${this.hotelId ? 'edited' : 'created'} successfully`,
      '',
      { panelClass: 'success' }
    );
  };

  /**
   * @function handelFinal To handel loading
   * @param param0  network error
   */
  handelFinal = () => {
    this.loading = false;
  };
}
