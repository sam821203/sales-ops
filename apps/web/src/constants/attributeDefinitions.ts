export type AttributeDefinition =
  | { key: string; label: string; type: 'text' }
  | { key: string; label: string; type: 'enum'; options: string[] };

export const STANDARD_ATTRIBUTE_DEFINITIONS: AttributeDefinition[] = [
  { key: 'Color', label: 'Color', type: 'enum', options: ['Black', 'White', 'Silver', 'Blue'] },
  { key: 'Storage', label: 'Storage / Capacity', type: 'enum', options: ['128GB', '256GB', '512GB', '1TB'] },
  { key: 'Size', label: 'Size / Screen Size', type: 'enum', options: ['6.1"', '6.7"', '15"', '27"'] },
  { key: 'RAM', label: 'RAM / Memory', type: 'enum', options: ['8GB', '16GB', '32GB'] },
  { key: 'Length', label: 'Length', type: 'enum', options: ['1m', '2m', '3m'] },
  { key: 'Layout', label: 'Layout', type: 'enum', options: ['US', 'UK', 'JP'] },
  { key: 'Switch', label: 'Switch', type: 'enum', options: ['Brown', 'Red', 'Blue', 'Silent'] },
  { key: 'Material', label: 'Material', type: 'enum', options: ['Aluminum', 'Plastic'] },
  {
    key: 'Connectivity',
    label: 'Connectivity',
    type: 'enum',
    options: ['WiFi', 'WiFi+Cellular', 'Bluetooth 5.0'],
  },
  { key: 'Voltage', label: 'Voltage / Power', type: 'enum', options: ['110V', '220V', '65W', '100W'] },
  { key: 'Model', label: 'Model / Variant', type: 'text' },
  { key: 'Compatibility', label: 'Compatibility', type: 'text' },
];
