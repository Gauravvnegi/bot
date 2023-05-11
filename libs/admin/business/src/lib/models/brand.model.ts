import { IBrandFormData , SocialPlaforms} from "../types/brand.type";

export class BrandFormData {
         brand: {
           name: string;
           description: string;
           status: boolean;
         } = {
           name: '',
           description: '',
            status: true,
         };
         siteId: string;
         socialPlatforms;
         deserialize(input: IBrandFormData, siteId: string) {
           this.brand.name = input.name;
           this.brand.description = input.description;
          //  this.brand.socialPlatforms = new socialPlatforms().deserialize(
          //    input.socialPlatforms
          //  )
           this.siteId = siteId;

           return this;
         }
       }
        
       export class socialPlatforms{

         deserialize(input) {
          
          //  this.socialPlatforms = input.map((item) => { 
          //    new socialPlatform().deserialize(item);
          //  });
        return this;
        }

       }
       export class socialPlatform{
        name: string;
        imageUrl: string;
        redirectUrl: string;
        deserialize(input) {
          this.name = 'facebook';
        this.imageUrl = input.facebook;
        this.redirectUrl = input.facebook;
        return this;
        }
       }

