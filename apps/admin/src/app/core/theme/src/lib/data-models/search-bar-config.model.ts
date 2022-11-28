import { get, set } from 'lodash';
import { IDeserializable } from '@hospitality-bot/admin/shared';

export class SearchResultDetail implements IDeserializable {
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

export class GuestSearchResult implements IDeserializable {
  id: string;
  label: string;
  description: string;
  imageUrl: string;
  type: string;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'label', this.getFullName(input)),
      set({}, 'description', ''),
      set({}, 'type', get(input, ['searchType'])),
      set({}, 'imageUrl', '')
    );
    return this;
  }

  getFullName(input): string {
    return `${input.firstName} ${input.lastName}`;
  }
}

export class ReservationSearchResult implements IDeserializable {
  id: string;
  label: string;
  bookingNumber: string;
  imageUrl: string;
  type: string;
  arrivalTime: string;
  departureTime: string;
  guestId: string;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'label', get(input, ['primaryGuestName'])),
      set({}, 'type', get(input, ['searchType'])),
      set({}, 'bookingNumber', get(input, ['number'])),
      set({}, 'imageUrl', get(input, ['imageUrl'])),
      set({}, 'arrivalTime', get(input, ['arrivalTime'])),
      set({}, 'departureTime', get(input, ['departureTime'])),
      set({}, 'guestId', get(input, ['guestId']))
    );
    return this;
  }
}

export class PackageSearchResult implements IDeserializable {
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
