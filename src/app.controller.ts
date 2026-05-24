import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import collections from '../in-sales-response/collections.json';
import products from '../in-sales-response//products.json';
import { COLLECTION_IMAGES } from '@/data/images';
import { Labels } from './data/labels';

export interface IRawProduct {
  created_at: string;
  variants: {
    quantity: number;
  }[];
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'K-Pop Backend API',
    };
  }

  @Get('collections')
  getCollections(): any {
    const mainCollectionId = 30593010;

    const normalizeCollection = (collection) => {
      return {
        id: collection.id,
        name: collection.title,
        image: COLLECTION_IMAGES[collection.id] ?? null,
      };
    };
    const normalizeCollections = (collections) => {
      return collections.map(normalizeCollection);
    };

    const rootCollections = collections
      .filter(
        (collection) =>
          collection.parent_id === mainCollectionId && !collection.is_hidden,
      )
      .sort((a, b) => a.position - b.position);

    const allCollections = collections
      .filter(
        (collection) =>
          collection.parent_id &&
          collection.parent_id !== mainCollectionId &&
          !collection.is_hidden,
      )
      .sort((a, b) => a.position - b.position);

    const result = {};

    allCollections.forEach((collection) => {
      if (result[collection.parent_id]) {
        result[collection.parent_id].push(normalizeCollection(collection));
      } else {
        result[collection.parent_id] = [normalizeCollection(collection)];
      }
    });

    return {
      rootCollections: normalizeCollections(rootCollections),
      allCollections: result,
    };
  }

  @Get('products')
  getProducts(): any {
    const rawProducts = products as IRawProduct[];

    const sortedProducts = rawProducts.sort((a, b) => {
      const aInStock = a.variants.some(
        (variant) => variant.quantity === null || variant.quantity > 0,
      );
      const bInStock = b.variants.some(
        (variant) => variant.quantity === null || variant.quantity > 0,
      );

      if (aInStock !== bInStock) {
        return aInStock ? -1 : 0;
      }

      return a.created_at > b.created_at ? -1 : 0;
    });

    const normalizeImage = (image) => {
      return {
        url: image.medium_url,
      };
    };

    const normalizeCharacteristics = (characteristic) => {
      return {
        title: characteristic.title,
      };
    };

    const normalizeVariant = (variant) => {
      const price = Number(variant.price);
      const oldPrice = variant.old_price ? Number(variant.old_price) : null;
      const hasOldPrice = oldPrice && price !== oldPrice;

      const differencePercent = hasOldPrice
        ? ((price - oldPrice) / oldPrice) * 100
        : null;
      const label = differencePercent
        ? Labels.getSaleLabel(Math.round(differencePercent))
        : null;

      return {
        id: variant.id,
        title: variant.title,
        price,
        oldPrice: hasOldPrice ? oldPrice : null,
        optionValues: variant.option_values.map((option) => ({
          id: option.id,
          title: option.title,
        })),
        quantity: variant.quantity,
        label,
      };
    };

    const normalizeProduct = (product) => {
      const characteristic = product.characteristics[0];
      const label = Labels.getLabelColor(characteristic?.permalink);

      return {
        id: product.id,
        title: product.title,
        collectionIds: product.collections_ids,
        images: product.images.map(normalizeImage),
        characteristics: product.characteristics.map(normalizeCharacteristics),
        variants: product.variants.map(normalizeVariant),
        description: product.description,
        label: label
          ? {
              text: characteristic.title,
              color: label.color,
            }
          : null,
      };
    };

    return sortedProducts.map(normalizeProduct);
  }
}
