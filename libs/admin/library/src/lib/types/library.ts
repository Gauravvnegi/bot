export type CategoryData = {
  name: string;
  description?: string;
  imageUrl?: {
    isFeatured: boolean;
    url: string;
  }[];
  active?: boolean;
  source: 1;
  type: 'SERVICE_CATEGORY' | 'PACKAGE_CATEGORY' | 'FOOD_PACKAGE_CATEGORY';
};

/**
 * @type QueryConfig
 * @key params format is `?type=NEW`
 * One of the query param is 'type'
 */
export type QueryConfig = {
  params: string;
};
