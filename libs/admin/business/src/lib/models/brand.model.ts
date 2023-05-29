import { SocialPlatForms } from '../types/brand.type';

export class BrandResponse {
  brand: {
    name: string;
    description: string;
    socialPlatforms: SocialPlatForms[];
    status: boolean;
  } = {
    name: '',
    description: '',
    socialPlatforms: [],
    status: true,
  };
  siteId: string;
  deserialize(input: any) {
    this.brand.name = input?.name;
    this.brand.description = input?.description;
    this.brand.socialPlatforms = input?.socialPlatforms;
    this.brand.status = input?.status;
    this.siteId = input?.siteId;
    return this;
  }
}
