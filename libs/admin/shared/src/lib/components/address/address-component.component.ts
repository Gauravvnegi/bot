import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { FormComponent } from '../form-component/form.components';
import { ControlContainer, Form, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
declare let google: any;

@Component({
  selector: 'hospitality-bot-address-component',
  templateUrl: './address-component.component.html',
  styleUrls: ['./address-component.component.scss'],
})
export class AddressComponent extends FormComponent implements OnInit {
  @Input() controlName: string = 'address';
  addressList;
  addressForm: FormGroup;

  constructor(
    public controlContainer: ControlContainer,
    private fb: FormBuilder
  ) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.loadGoogleMapsAPI();
    this.initForm();
    this.initInputControl();
    this.getValueFromParent();
    this.onValueChange();
  }

  initForm() {
    this.addressForm = this.fb.group({
      addressData: [[]],
    });
  }

  getValueFromParent() {
    this.inputControl.valueChanges.subscribe((res) => {
      if (res !== null && res !== undefined && res !== '') {
        this.addressList = [
          {
            label: this.inputControl.value.formattedAddress,
            value: this.inputControl.value.id,
          },
        ];
        this.addressForm.get('addressData').patchValue({
          label: this.inputControl.value.formattedAddress,
          value: this.inputControl.value.id,
        });
      }
    });
  }

  onValueChange() {
    this.addressForm.get('addressData').valueChanges.subscribe((res) => {
      if (res !== null && res !== undefined && res !== '') {
        this.getAddressById(res.value).subscribe((res) => {
          this.inputControl.setValue(res);
        });
      } else {
        this.inputControl.setValue(null);
      }
    });
  }

  searchOptions(text: string) {
    if (text) {
      var placeServiceRequest = {
        input: text,
        types: ['establishment'],
      };
      var service = new google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        placeServiceRequest,
        (predictions, status) => {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            this.addressList = predictions.map((item) => {
              return {
                label: item.description,
                value: item.place_id,
              };
            });
          }
        }
      );
    }
  }

  getAddressById(placeId: string): Observable<any> {
    return new Observable((observer) => {
      this.initializeGoogleMaps().subscribe(() => {
        const geocoder = new google.maps.Geocoder();
        const geocodeRequest = {
          placeId: placeId,
        };

        geocoder.geocode(geocodeRequest, (results: any[], status: string) => {
          if (status === google.maps.GeocoderStatus.OK) {
            const data = this.extractAddressData(results[0]);

            observer.next(data);
            observer.complete();
          } else {
            observer.error(new Error('Geocode request failed'));
          }
        });
      });
    }).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  private loadGoogleMapsAPI(): void {
    const script = document.createElement('script');
    script.src =
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyC42YgNcCSadoy8dxDKKEXZohJU9B5eM2M&libraries=places';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }

  private initializeGoogleMaps(): Observable<void> {
    return new Observable((observer) => {
      if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        // Delay to wait for the Google Maps API to load
        const interval = setInterval(() => {
          if (
            typeof google !== 'undefined' &&
            typeof google.maps !== 'undefined'
          ) {
            clearInterval(interval);
            observer.next();
            observer.complete();
          }
        }, 100);
      } else {
        observer.next();
        observer.complete();
      }
    });
  }

  private extractAddressData(result: any): any {
    const addressComponents = result.address_components;
    const location = result.geometry.location;
    const formattedAddress = result.formatted_address;
    let data: any = {};

    const getAddressComponent = (type: string): string => {
      const component = addressComponents.find((c: any) =>
        c.types.includes(type)
      );
      return component ? component.long_name : '';
    };

    data = {
      placeId: result.place_id,
      formattedAddress: formattedAddress || '',
      buildingName: getAddressComponent('premise'),
      floor: getAddressComponent('floor'),
      sector: getAddressComponent('sublocality_level_1'),
      street:
        getAddressComponent('route') || getAddressComponent('street_address'),
      city: getAddressComponent('locality'),
      state: getAddressComponent('administrative_area_level_1'),
      country: getAddressComponent('country'),
      postalCode: getAddressComponent('postal_code'),
      latitude: location.lat(),
      longitude: location.lng(),
    };

    return data;
  }
}
