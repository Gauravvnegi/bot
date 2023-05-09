import { IBrandFormData } from "../types/brand.type";

export class BrandFormData {
         brand: {
           name: string;
           description: string;
         } = {
           name: '',
           description: '',
         };
         siteId: string;
         status: boolean;
         socialPlatforms;
         deserialize(input: IBrandFormData , siteId: string) {
           this.brand.name = input.name;
           this.brand.description = input.description;
           this.status = input.active;
           this.socialPlatforms = new socialPlatforms().deserialize(input).socialPlatforms;
           this.siteId = siteId;

           return this;
         }
       }
        
       export class socialPlatforms{

        socialPlatforms = new Array<socialPlatform>();
        deserialize(input: IBrandFormData) {
        this.socialPlatforms.push(new socialPlatform().deserialize(input));
        return this;
        }

       }
       export class socialPlatform{
          facebook: string;
          twitter: string;
          instagram: string;
          youtube: string;
          deserialize(input: IBrandFormData) {
            this.facebook = input.facebook;
            this.twitter = input.twitter;
            this.instagram = input.instagram;
            this.youtube = input.youtube;
            return this;
          }
       }

