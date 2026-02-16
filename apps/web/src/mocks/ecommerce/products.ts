import type { Product, Category, Brand } from '@salesops/shared';

export const categoryMocks: Category[] = [
  { id: 1, name: 'Audio' },
  { id: 2, name: 'Cables' },
  { id: 3, name: 'Keyboards' },
  { id: 4, name: 'Power' },
  { id: 5, name: 'Peripherals' },
  { id: 6, name: 'Accessories' },
  { id: 7, name: 'Screen' },
];

export const brandMocks: Brand[] = [
  { id: 1, name: 'SoundPro' },
  { id: 2, name: 'CableTech' },
  { id: 3, name: 'KeyFlow' },
  { id: 4, name: 'PowerUp' },
  { id: 5, name: 'DeskEssentials' },
];

export const productMocks: Product[] = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    status: 'Active',
    imageUrl: 'https://placehold.co/64x64?text=P1',
    categoryId: 1,
    brandId: 1,
    skus: [
      { id: 1, productId: 1, price: 79.99, stock: 120, attributes: { Color: 'Black' } },
      { id: 2, productId: 1, price: 79.99, stock: 85, attributes: { Color: 'White' } },
      { id: 3, productId: 1, price: 89.99, stock: 42, attributes: { Color: 'Silver' } },
    ],
  },
  {
    id: 2,
    name: 'USB-C Fast Charging Cable 2m',
    status: 'Active',
    imageUrl: 'https://placehold.co/64x64?text=P2',
    categoryId: 2,
    brandId: 2,
    skus: [
      { id: 4, productId: 2, price: 12.99, stock: 500, attributes: { Length: '2m' } },
      { id: 5, productId: 2, price: 15.99, stock: 320, attributes: { Length: '3m' } },
    ],
  },
  {
    id: 3,
    name: 'Mechanical Keyboard RGB',
    status: 'Draft',
    imageUrl: 'https://placehold.co/64x64?text=P3',
    categoryId: 3,
    brandId: 3,
    skus: [
      { id: 6, productId: 3, price: 129.0, stock: 0, attributes: { Layout: 'US', Switch: 'Brown' } },
      { id: 7, productId: 3, price: 129.0, stock: 0, attributes: { Layout: 'US', Switch: 'Red' } },
    ],
  },
  {
    id: 4,
    name: 'Portable Power Bank 20000mAh',
    status: 'Active',
    imageUrl: 'https://placehold.co/64x64?text=P4',
    categoryId: 4,
    brandId: 4,
    skus: [
      { id: 8, productId: 4, price: 45.99, stock: 8, attributes: { Color: 'Black' } },
      { id: 9, productId: 4, price: 45.99, stock: 15, attributes: { Color: 'Blue' } },
    ],
  },
  {
    id: 5,
    name: 'Wireless Mouse Ergonomic',
    status: 'Inactive',
    imageUrl: 'https://placehold.co/64x64?text=P5',
    categoryId: 5,
    brandId: 5,
    skus: [
      { id: 10, productId: 5, price: 34.5, stock: 0, attributes: { Color: 'Black' } },
    ],
  },
  {
    id: 6,
    name: 'Laptop Stand Aluminum',
    status: 'Active',
    imageUrl: 'https://placehold.co/64x64?text=P6',
    categoryId: 6,
    brandId: 5,
    skus: [
      { id: 11, productId: 6, price: 59.99, stock: 76, attributes: { Material: 'Aluminum' } },
      { id: 12, productId: 6, price: 49.99, stock: 93, attributes: { Material: 'Plastic' } },
    ],
  },
  {
    id: 7,
    name: 'Screen Protector Tempered Glass',
    status: 'Active',
    imageUrl: 'https://placehold.co/64x64?text=P7',
    categoryId: 7,
    brandId: 2,
    skus: [
      { id: 13, productId: 7, price: 9.99, stock: 240, attributes: { Size: '6.1"' } },
      { id: 14, productId: 7, price: 11.99, stock: 180, attributes: { Size: '6.7"' } },
    ],
  },
  {
    id: 8,
    name: 'Desk Organizer Set',
    status: 'Draft',
    imageUrl: 'https://placehold.co/64x64?text=P8',
    categoryId: 6,
    brandId: 5,
    skus: [
      { id: 15, productId: 8, price: 24.99, stock: 0, attributes: { Set: '5-piece' } },
    ],
  },
];
