import { IHotelRatingConfig, IHotel } from '../models/feedback';

export interface IFeedbackConfigResObj extends IHotelRatingConfig, IHotel {}

export interface IFeedbackConfig extends IFeedbackConfigResObj {}
