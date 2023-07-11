import { get, set } from 'lodash';
import * as moment from 'moment';

export class BookingFeedback {
  id: string;
  reservationId: string;
  guestId: string;
  rating: number;
  ratingColor: string;
  comments: string;
  created: number;
  active: boolean;
  departments: Department[];
  suggestions;

  deserialize(input, config) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'reservationId', get(input, ['reservationId'])),
      set({}, 'guestId', get(input, ['guestId'])),
      set({}, 'rating', get(input, ['rating'])),
      set({}, 'comments', get(input, ['comments'])),
      set({}, 'created', get(input, ['created'])),
      set({}, 'active', get(input, ['active']))
    );
    this.suggestions =
      input.quickServices &&
      input.quickServices.map((service) => {
        return new FeedbackSuggestion().deserialize(service);
      });
    const departments: Department[] = [];
    input.departments.forEach((data, i) => {
      departments[i] = new Department().deserialize(data, config);
    });
    this.departments = departments;
    this.ratingColor = new Color().deserialize(config, input.rating).color;
    return this;
  }

  getFeedbackDate(timezone = '+05:30') {
    return moment(this.created).utcOffset(timezone).format('DD/MM/YYYY');
  }

  getFeedbackTime(timezone = '+05:30') {
    return moment(this.created).utcOffset(timezone).format('HH:mm');
  }
}

export class FeedbackSuggestion {
  id;
  label;
  url;
  deserialize(input) {
    this.id = input.serviceId;
    return this;
  }
}

export class Department {
  id: string;
  name: string;
  rating: number;
  ratingColor: string;
  services: Service[];

  deserialize(input, config) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'name', get(input, ['name'])),
      set({}, 'rating', get(input, ['rating']))
    );
    const services: Service[] = [];
    input.services.forEach((data, i) => {
      services[i] = new Service().deserialize(data, config);
    });
    this.services = services;
    this.ratingColor = new Color().deserialize(config, input.rating).color;
    return this;
  }
}

export class Service {
  id: string;
  name: string;
  comments: string;
  rating: number;
  ratingColor: string;
  touchpoints: Touchpoint[];

  deserialize(input, config) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'name', get(input, ['name'])),
      set({}, 'rating', get(input, ['rating'])),
      set({}, 'comments', get(input, ['comments']))
    );
    const touchpoints: Touchpoint[] = [];
    input.touchpoints.forEach((data, i) => {
      touchpoints[i] = new Touchpoint().deserialize(data, config);
    });
    this.touchpoints = touchpoints;
    this.ratingColor = new Color().deserialize(config, input.rating).color;
    return this;
  }
}

export class Touchpoint {
  id: string;
  name: string;
  rating: number;
  ratingColor: string;

  deserialize(input, config) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'name', get(input, ['name'])),
      set({}, 'rating', get(input, ['rating']))
    );
    this.ratingColor = new Color().deserialize(config, input.rating).color;

    return this;
  }
}

export class Color {
  color: string;
  deserialize(config, rating) {
    Object.keys(config).map((key) => {
      const ratingKey = JSON.parse(key);
      ratingKey.forEach((element) => {
        if (element === rating) {
          const rating = config[key];
          this.color = rating;
        }
      });
    });
    return this;
  }
}