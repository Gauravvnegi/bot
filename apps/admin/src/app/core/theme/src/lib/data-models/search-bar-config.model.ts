import { get, set } from 'lodash';

export interface Deserializable {
  deserialize(input: any): this;
}

export class SearchResultDetail implements Deserializable {
  searchResults = new Array<any>();

  deserialize(input: any) {
    if (input) {
      input.reservations &&
        input.reservations.length > 0 &&
        input.reservations.forEach((booking) => {
          this.searchResults.push(
            new ReservationSearchResult().deserialize(booking)
          );
        });
      input.guests &&
        input.guests.length > 0 &&
        input.guests.forEach((guest) => {
          this.searchResults.push(new GuestSearchResult().deserialize(guest));
        });

      input.packages &&
        input.packages.length > 0 &&
        input.packages.forEach((amenity) => {
          this.searchResults.push(
            new PackageSearchResult().deserialize(amenity)
          );
        });
    }

    return this;
  }
}

export class GuestSearchResult implements Deserializable {
  id: string;
  label: string;
  description: string;
  imageUrl: string;
  type: string;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'label', this.getGuestName(input)),
      set({}, 'description', ''),
      set({}, 'type', get(input, ['searchType'])),
      set({}, 'imageUrl', '')
    );
    return this;
  }

  getGuestName(input): string {
    return `${input.firstName}${input.lastName}`;
  }
}

export class ReservationSearchResult implements Deserializable {
  id: string;
  label: string;
  bookingNumber: string;
  imageUrl: string;
  type: string;
  arrivalTime: string;
  departureTime: string;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'label', get(input, ['primaryGuestName'])),
      set({}, 'type', get(input, ['searchType'])),
      set({}, 'bookingNumber', get(input, ['number'])),
      set({}, 'imageUrl', get(input, ['imageUrl'])),
      set({}, 'arrivalTime', get(input, ['arrivalTime'])),
      set({}, 'departureTime', get(input, ['departureTime']))
    );
    return this;
  }
}

export class PackageSearchResult implements Deserializable {
  id: string;
  label: string;
  description: string;
  imageUrl: string;
  type: string;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'label', get(input, ['name'])),
      set({}, 'description', this.getPackageRate(input)),
      set({}, 'imageUrl', get(input, ['imageUrl'])),
      set({}, 'type', get(input, ['searchType']))
    );
    return this;
  }

  getPackageRate(input) {
    return `${input.currency}${input.rate}`;
  }
}

export enum SearchType {
  reservation = 'RESERVATIONS',
  guest = 'GUEST',
  package = 'PACKAGES',
}
