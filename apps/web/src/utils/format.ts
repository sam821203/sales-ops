/**
 * Format a number as USD price (e.g. "$12.99").
 */
export const formatPrice = (price: number): string => `$${price.toFixed(2)}`;

/**
 * Format a price range. Returns a single price if min === max, otherwise "min - max".
 */
export const formatPriceRange = (minPrice: number, maxPrice: number): string =>
  minPrice === maxPrice
    ? formatPrice(minPrice)
    : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;

/**
 * Format key-value pairs for display (e.g. "Color: Black, Size: M").
 */
export const formatKeyValuePairs = (attributes: Record<string, string>): string =>
  Object.entries(attributes)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
