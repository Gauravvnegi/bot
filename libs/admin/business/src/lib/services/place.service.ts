import { Injectable } from '@angular/core';
declare let google: any;

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  storeData;
  getAddressById(placeId, isSameAddress) {
    console.log(isSameAddress, 'isSameAddress');
    if (isSameAddress) {
      return new Promise((resolve, reject) => {
        resolve(this.storeData);
      });
    }

    return new Promise((resolve, reject) => {
      var geocoder = new google.maps.Geocoder();
      var geocodeRequest = {
        placeId: placeId,
      };

      geocoder.geocode(geocodeRequest, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          var addressComponents = results[0].address_components;
          var location = results[0].geometry.location;
          var formattedAddress = results[0].formatted_address;
          var buildingName,
            floor,
            sector,
            streetAddress,
            city,
            state,
            country,
            pincode,
            apartment;

          for (var i = 0; i < addressComponents.length; i++) {
            var component = addressComponents[i];
            var componentType = component.types[0];

            if (componentType === 'premise') {
              buildingName = component.long_name;
            } else if (componentType === 'floor') {
              floor = component.long_name;
            } else if (componentType === 'sublocality_level_1') {
              sector = component.long_name;
            } else if (
              componentType === 'route' ||
              componentType === 'street_address'
            ) {
              streetAddress = component.long_name;
            } else if (componentType === 'locality') {
              city = component.long_name;
            } else if (componentType === 'administrative_area_level_1') {
              state = component.long_name;
            } else if (componentType === 'country') {
              country = component.long_name;
            } else if (componentType === 'postal_code') {
              pincode = component.long_name;
            } else if (componentType === 'subpremise') {
              apartment = component.long_name;
            }
          }

          var data = {
            placeId: placeId,
            formattedAddress: formattedAddress || '',
            buildingName: buildingName || '',
            floor: floor || '',
            sector: sector || '',
            street: streetAddress || '',
            city: city || '',
            state: state || '',
            country: country || '',
            postalCode: pincode || '',
            latitude: location.lat(),
            longitude: location.lng(),
          };

          this.storeData = data;

          resolve(data);
        } else {
          reject(new Error('Geocode request failed'));
        }
      });
    });
  }
}
