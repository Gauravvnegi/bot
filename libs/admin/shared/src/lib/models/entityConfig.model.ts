import { EntitySubType, EntityType } from '../types/table.type';
import {
  Address,
  Brand,
  Entity,
  Sites,
  SocialPlatforms,
} from '../types/user.type';

export class EntityConfig {
  id: string;
  category: EntityType;
  name: string;
  logo: string;
  address: Address;
  websiteUrl?: string;
  socialPlatforms: SocialPlatforms[];
  nationality: string;
  status: string;
  parentId: string;
  entities?: EntityConfig[];
  timezone: string;
  type: EntitySubType;

  deserialize(input: Entity) {
    this.id = input.id;
    this.category = input.category;
    this.name = input.name;
    this.logo = input.logo;
    this.address = input.address;

    this.websiteUrl = input.websiteUrl;
    this.nationality = input.nationality;
    this.socialPlatforms = input.socialPlatforms;
    this.status = input.status;
    this.parentId = input.parentId;
    this.entities =
      input.entities?.map((item) => new EntityConfig().deserialize(item)) ?? [];

    this.timezone = input.timezone;
    this.type = input.type;

    return this;
  }
}

export class BrandConfig {
  id: string;
  name: string;
  logo: string;
  entities: EntityConfig[];
  socialPlatforms: SocialPlatforms[];
  category: string;
  address: Address;
  status: string | boolean;

  deserialize(input: Brand) {
    this.id = input.id;
    this.name = input.name;
    this.logo = input.logo;
    this.entities =
      input.entities?.map((item) => new EntityConfig().deserialize(item)) ?? [];

    this.socialPlatforms = input.socialPlatforms;
    this.category = input.category;
    this.address = input.address;
    this.status = input.status;

    return this;
  }
}

export class SiteConfig {
  id: string;
  name: string;
  siteUrl: string;
  themeId: string;
  status: string;
  brands: BrandConfig[];
  socialPlatforms: SocialPlatforms[];

  deserialize(input: Sites) {
    this.id = input.id;
    this.name = input.name;
    this.siteUrl = input.siteUrl;
    this.themeId = input.themeId;
    this.status = input.status;
    this.brands =
      input.brands?.map((item) => new BrandConfig().deserialize(item)) ?? [];
    this.socialPlatforms = input.socialPlatforms;

    return this;
  }
}
