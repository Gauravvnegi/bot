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
    let departments: Department[] = [];
    input.departments.forEach((data, i) => {
      departments[i] = new Department().deserialize(data, config);
    });
    this.departments = departments;
    this.ratingColor = new Color().deserialize(config, input.rating).color;
    return this;
  }

  getFeedbackDate() {
    return moment(this.created).format('DD/MM/YYYY');
  }

  getFeedbackTime() {
    return moment(this.created).format('HH:mm');
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
    let services: Service[] = [];
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
    let touchpoints: Touchpoint[] = [];
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
      let ratingKey = JSON.parse(key);
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
