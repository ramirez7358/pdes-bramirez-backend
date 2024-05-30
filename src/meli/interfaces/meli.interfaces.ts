export interface MeliCategory {
  id: string;
  name: string;
}

export interface MeliProduct {
  id: string;
  title: string;
  condition: string;
  thumbnail_id: string;
  catalog_product_id: string;
  listing_type_id: string;
  permalink: string;
  buying_mode: string;
  site_id: string;
  category_id: string;
  domain_id: string;
  thumbnail: string;
  currency_id: string;
  order_backend: number;
  price: number;
  original_price: number | null;
  sale_price: number | null;
  available_quantity: number;
  official_store_id: number | null;
  use_thumbnail_id: boolean;
  accepts_mercadopago: boolean;
  shipping: Shipping;
  stop_time: string;
  seller: Seller;
  attributes: Attribute[];
  installments: any;
  winner_item_id: any;
  catalog_listing: boolean;
  discounts: any;
  promotions: any[];
  inventory_id: string;
}

interface Shipping {
  store_pick_up: boolean;
  free_shipping: boolean;
  logistic_type: string;
  mode: string;
  tags: string[];
  benefits: any;
  promise: any;
  shipping_score: number;
}

interface Seller {
  id: number;
  nickname: string;
}

interface AttributeValue {
  id: string | null;
  name: string;
  struct: {
    number: number;
    unit: string;
  } | null;
  source: number;
}

interface Attribute {
  id: string;
  name: string;
  value_id: string | null;
  value_name: string;
  attribute_group_id: string;
  attribute_group_name: string;
  value_struct: {
    number: number;
    unit: string;
  } | null;
  values: AttributeValue[];
  source: number;
  value_type: string;
}
