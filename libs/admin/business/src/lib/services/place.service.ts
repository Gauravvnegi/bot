import { Injectable } from '@angular/core';
declare let google: any;

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  getAddressById(placeId) {
    console.log(placeId, 'placeId');
    return new Promise((resolve, reject) => {
      var geocoder = new google.maps.Geocoder();
      var geocodeRequest = {
        placeId: placeId,
      };

      geocoder.geocode(geocodeRequest, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          var addressComponents = results[0].address_components;
          var location = results[0].geometry.location;
          var country, city, pincode, state;

          for (var i = 0; i < addressComponents.length; i++) {
            var component = addressComponents[i];
            var componentType = component.types[0];

            if (componentType === 'country') {
              country = component.long_name;
            } else if (
              componentType === 'locality' ||
              componentType === 'administrative_area_level_1'
            ) {
              state = component.long_name;
            } else if (componentType === 'postal_code') {
              pincode = component.long_name;
            } else if (componentType === 'locality') {
              city = component.long_name;
            }
          }

          var data = {
            placeId: placeId,
            country: country || '',
            state: state || '',
            latitude: location.lat(),
            longitude: location.lng(),
            pincode: pincode || '',
            city: city || '',
          };

          resolve(data);
        } else {
          reject(new Error('Geocode request failed'));
        }
      });
    });
  }
}
