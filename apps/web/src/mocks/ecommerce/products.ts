import type { Product } from '@salesops/shared';

export const productMocks: Product[] = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    status: 'Active',
    skus: [
      { id: 101, productId: 1, price: 79.99, stock: 120, attributes: { Color: 'Black' } },
      { id: 102, productId: 1, price: 79.99, stock: 85, attributes: { Color: 'White' } },
      { id: 103, productId: 1, price: 89.99, stock: 42, attributes: { Color: 'Silver' } },
    ],
  },
  {
    id: 2,
    name: 'USB-C Fast Charging Cable 2m',
    status: 'Active',
    skus: [
      { id: 201, productId: 2, price: 12.99, stock: 500, attributes: { Length: '2m' } },
      { id: 202, productId: 2, price: 15.99, stock: 320, attributes: { Length: '3m' } },
    ],
  },
  {
    id: 3,
    name: 'Mechanical Keyboard RGB',
    status: 'Draft',
    skus: [
      { id: 301, productId: 3, price: 129.0, stock: 0, attributes: { Layout: 'US', Switch: 'Brown' } },
      { id: 302, productId: 3, price: 129.0, stock: 0, attributes: { Layout: 'US', Switch: 'Red' } },
    ],
  },
  {
    id: 4,
    name: 'Portable Power Bank 20000mAh',
    status: 'Active',
    skus: [
      { id: 401, productId: 4, price: 45.99, stock: 8, attributes: { Color: 'Black' } },
      { id: 402, productId: 4, price: 45.99, stock: 15, attributes: { Color: 'Blue' } },
    ],
  },
  {
    id: 5,
    name: 'Wireless Mouse Ergonomic',
    status: 'Inactive',
    skus: [
      { id: 501, productId: 5, price: 34.5, stock: 0, attributes: { Color: 'Black' } },
    ],
  },
  {
    id: 6,
    name: 'Laptop Stand Aluminum',
    status: 'Active',
    skus: [
      { id: 601, productId: 6, price: 59.99, stock: 76, attributes: { Material: 'Aluminum' } },
      { id: 602, productId: 6, price: 49.99, stock: 93, attributes: { Material: 'Plastic' } },
    ],
  },
  {
    id: 7,
    name: 'Screen Protector Tempered Glass',
    status: 'Active',
    skus: [
      { id: 701, productId: 7, price: 9.99, stock: 240, attributes: { Size: '6.1"' } },
      { id: 702, productId: 7, price: 11.99, stock: 180, attributes: { Size: '6.7"' } },
    ],
  },
  {
    id: 8,
    name: 'Desk Organizer Set',
    status: 'Draft',
    skus: [
      { id: 801, productId: 8, price: 24.99, stock: 0, attributes: { Set: '5-piece' } },
    ],
  },
];
