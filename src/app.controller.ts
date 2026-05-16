import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import collections from './data/collections.json';
import products from './data/products.json';
import { COLLECTION_IMAGES } from '@/data/images';
import { labels } from './data/labels';

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
      return {
        id: variant.id,
        title: variant.title,
        costPrice: variant.cost_price,
        basePrice: variant.base_price,
        optionValues: variant.option_values.map((option) => ({
          id: option.id,
          title: option.title,
        })),
        quantity: variant.quantity,
      };
    };

    const normalizeProduct = (product) => {
      const characteristic = product.characteristics[0];
      const label = labels[characteristic?.permalink];

      return {
        id: product.id,
        title: product.title,
        collectionIds: product.collections_ids,
        images: product.images.map(normalizeImage),
        characteristics: product.characteristics.map(normalizeCharacteristics),
        variants: product.variants.map(normalizeVariant),
        label: label
          ? {
              text: characteristic.title,
              color: label.color,
            }
          : null,
      };
    };

    return products.map(normalizeProduct);
  }
}
