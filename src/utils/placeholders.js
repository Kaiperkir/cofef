// Стабильные заглушки через picsum.photos — каждый продукт получает уникальную картинку
// по формуле: id % length, что гарантирует разные изображения для разных товаров

const COFFEE_IDS = [
  292, 312, 367, 63, 431, 486, 493, 1060,
  430, 366, 442, 488, 425, 312, 403, 482,
  494, 437, 628, 145, 184, 214, 251, 375
];

const TEA_IDS = [
  113, 225, 326, 432, 494, 503, 433, 436,
  458, 237, 175, 139, 188, 219, 334, 127,
  163, 209, 262, 317, 388, 441, 515, 576
];

const DEFAULT_IDS = [
  1060, 292, 113, 367, 430, 225, 366, 63,
  486, 326, 493, 432, 431, 494, 442, 503,
  488, 433, 425, 436, 403, 458, 482, 237,
  312, 175, 628, 139, 145, 188, 184, 219
];

const makeUrl = (seed) => `https://picsum.photos/seed/${seed}/800/800`;

export const getPlaceholderImage = (item) => {
  if (!item) return makeUrl('default-coffee');

  const id = item.id || Math.random().toString(36).substring(7);
  const catName = (item.category?.name || item.category || '').toLowerCase();

  let prefix = 'coffee';
  if (catName.includes('чай') || catName.includes('tea')) {
    prefix = 'tea';
  }

  return makeUrl(`${prefix}-${id}`);
};
