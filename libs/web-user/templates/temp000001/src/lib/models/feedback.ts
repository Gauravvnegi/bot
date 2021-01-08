import { get } from 'lodash';
import { IRatingScaleConfig } from 'libs/web-user/shared/src/lib/presentational/rating/rating.component';
interface IDeserializable {
  deserialize(input: any): this;
}

export class HotelRatingConfig implements IDeserializable {
  ratingScale: number[];
  ratingScaleConfig: IRatingScaleConfig;
  quickServices: IHotelQuickService[];
  hotelRatingQuestion: IFeedbackRatingQuestion;
  departmentRatingQuestion: IFeedbackRatingQuestion;
  serviceRatingQuestion: IFeedbackRatingQuestion;

  deserialize(input) {
    this.ratingScale = input.ratingScale;
    this.ratingScaleConfig = input.ratingScaleConfig;
    this.quickServices = (input.suggestions as Array<any>).map((service) =>
      new HotelQuickService().deserialize(service)
    );
    this.hotelRatingQuestion = new FeedbackRatingQuestion().deserialize(
      input.hotelRatingQuestion
    );
    this.departmentRatingQuestion = new FeedbackRatingQuestion().deserialize(
      input.departmentRatingQuestion
    );
    this.serviceRatingQuestion = new FeedbackRatingQuestion().deserialize(
      input.serviceRatingQuestion
    );

    return this;
  }
}

export class HotelQuickService implements IDeserializable {
  id: string;
  label: string;
  url: string;

  deserialize(input) {
    this.id = input.id;
    this.label = input.label;
    this.url = input.url;

    return this;
  }
}

export class FeedbackRatingQuestion implements IDeserializable {
  negativeLabel;
  positiveLabel;

  deserialize(input) {
    this.positiveLabel = input.positive_title;
    this.negativeLabel = input.negative_title;
    return this;
  }
}

export class Hotel implements IDeserializable {
  departments: IHotelDepartment[];

  deserialize(input) {
    this.departments = (input.departments as Array<any>).map((department) =>
      new HotelDepartment().deserialize(department)
    );
    return this;
  }
}

export class HotelDepartment implements IDeserializable {
  id: string;
  label: string;
  departmentServices: IDepartmentService[];

  deserialize(input) {
    this.id = input.id;
    this.label = input.label;
    this.departmentServices = input.services?.map((service) =>
      new DepartmentService().deserialize(service)
    );
    return this;
  }
}

export class DepartmentService implements IDeserializable {
  id: string;
  label: string;
  serviceTouchpoints: IServiceTouchpoint[];

  deserialize(input) {
    this.id = input.id;
    this.label = input.label;
    this.serviceTouchpoints = input.touchpoints?.map((touchpoint) =>
      new ServiceTouchpoint().deserialize(touchpoint)
    );
    return this;
  }
}

export class ServiceTouchpoint implements IDeserializable {
  id: string;
  label: string;

  deserialize(input) {
    this.id = input.id;
    this.label = input.label;
    return this;
  }
}

export interface IHotelRatingConfig
  extends Omit<HotelRatingConfig, 'deserialize'> {}

export interface IHotelQuickService
  extends Omit<HotelQuickService, 'deserialize'> {}

export interface IFeedbackRatingQuestion
  extends Omit<FeedbackRatingQuestion, 'deserialize'> {}

export interface IHotel extends Omit<Hotel, 'deserialize'> {}

export interface IHotelDepartment
  extends Omit<HotelDepartment, 'deserialize'> {}

export interface IDepartmentService
  extends Omit<DepartmentService, 'deserialize'> {}

export interface IServiceTouchpoint
  extends Omit<ServiceTouchpoint, 'deserialize'> {}
