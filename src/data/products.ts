export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number; // KSh
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  stock: number;
  vendor: string;
  description: string;
  tags: string[];
  flashSale?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
}

export const categories = [
  { id: 'electronics', name: 'Electronics', icon: 'Smartphone', count: 234 },
  { id: 'fashion', name: 'Fashion', icon: 'Shirt', count: 412 },
  { id: 'home', name: 'Home & Living', icon: 'Home', count: 189 },
  { id: 'beauty', name: 'Beauty', icon: 'Sparkles', count: 156 },
  { id: 'food', name: 'Groceries', icon: 'ShoppingBasket', count: 98 },
  { id: 'sports', name: 'Sports', icon: 'Dumbbell', count: 76 },
];

export const brands = ['Samsung', 'Tecno', 'Infinix', 'Bata', 'Safaricom', 'Kenyan Originals', 'Bidco', 'Tuskys'];

export const products: Product[] = [
  {
    id: 'p1', slug: 'samsung-galaxy-a54',
    name: 'Samsung Galaxy A54 5G — 128GB',
    price: 38999, originalPrice: 45999,
    image: 'https://d64gsuwffb70l.cloudfront.net/69fbb62b6a319bdf2d4c3d4b_1778104106669_f5449886.png',
    category: 'electronics', brand: 'Samsung',
    rating: 4.7, reviews: 312, stock: 24, vendor: 'Phone Hub Kenya',
    description: 'Brand new Samsung Galaxy A54 5G with a stunning 6.4" Super AMOLED display, 50MP camera, and all-day battery. Comes with 1-year Kenyan warranty.',
    tags: ['featured', 'bestseller'], bestSeller: true,
  },
  {
    id: 'p2', slug: 'tecno-camon-20',
    name: 'Tecno Camon 20 Pro — 256GB',
    price: 26500, originalPrice: 31000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69fbb62b6a319bdf2d4c3d4b_1778104109487_509c23ee.png',
    category: 'electronics', brand: 'Tecno',
    rating: 4.5, reviews: 198, stock: 41, vendor: 'Tecno Kenya',
    description: '64MP camera, 8GB RAM, fast charging. Built for the African market.',
    tags: ['flash-sale'], flashSale: true,
  },
  {
    id: 'p3', slug: 'infinix-hot-30',
    name: 'Infinix Hot 30 — 128GB',
    price: 17999, originalPrice: 21500,
    image: 'https://d64gsuwffb70l.cloudfront.net/69fbb62b6a319bdf2d4c3d4b_1778104116131_12708ecc.png',
    category: 'electronics', brand: 'Infinix',
    rating: 4.3, reviews: 543, stock: 87, vendor: 'Mobile World',
    description: '6.78" display, 5000mAh battery, perfect for everyday use.',
    tags: ['bestseller'], bestSeller: true,
  },
  {
    id: 'p4', slug: 'wireless-headphones',
    name: 'Premium Wireless Headphones',
    price: 4999, originalPrice: 7500,
    image: 'https://d64gsuwffb70l.cloudfront.net/69fbb62b6a319bdf2d4c3d4b_1778104273807_221a3b0b.png',
    category: 'electronics', brand: 'Samsung',
    rating: 4.6, reviews: 89, stock: 53, vendor: 'Audio Plus',
    description: 'Bluetooth 5.3, active noise cancellation, 40-hour battery life.',
    tags: ['flash-sale', 'new'], flashSale: true, newArrival: true,
  },
  {
    id: 'p5', slug: 'kitenge-dress-1',
    name: 'Ankara Kitenge Maxi Dress',
    price: 2499, originalPrice: 3500,
    image: 'https://d64gsuwffb70l.cloudfront.net/69fbb62b6a319bdf2d4c3d4b_1778104141507_c46775f1.png',
    category: 'fashion', brand: 'Kenyan Originals',
    rating: 4.8, reviews: 156, stock: 32, vendor: 'Mama Africa Fashions',
    description: 'Hand-tailored 100% cotton Ankara print dress. Available in S–XXL.',
    tags: ['featured', 'new'], newArrival: true,
  },
  {
    id: 'p6', slug: 'kitenge-dress-2',
    name: 'Royal Kitenge Two-Piece',
    price: 3499,
    image: 'https://d64gsuwffb70l.cloudfront.net/69fbb62b6a319bdf2d4c3d4b_1778104140369_3d6e9aff.png',
    category: 'fashion', brand: 'Kenyan Originals',
    rating: 4.7, reviews: 92, stock: 18, vendor: 'Mama Africa Fashions',
    description: 'Elegant kitenge top and skirt set, perfect for special occasions.',
    tags: ['featured'],
  },
  {
    id: 'p7', slug: 'kitenge-dress-3',
    name: 'Modern Ankara Wrap Dress',
    price: 2799,
    image: 'https://d64gsuwffb70l.cloudfront.net/69fbb62b6a319bdf2d4c3d4b_1778104136891_a0bf8405.jpg',
    category: 'fashion', brand: 'Kenyan Originals',
    rating: 4.6, reviews: 64, stock: 27, vendor: 'Mama Africa Fashions',
    description: 'Flattering wrap design with vibrant African print.',
    tags: ['new'], newArrival: true,
  },
  {
    id: 'p8', slug: 'leather-sandals',
    name: 'Handmade Leather Sandals',
    price: 1899, originalPrice: 2500,
    image: 'https://d64gsuwffb70l.cloudfront.net/69fbb62b6a319bdf2d4c3d4b_1778104202646_fee17b5f.jpg',
    category: 'fashion', brand: 'Bata',
    rating: 4.5, reviews: 211, stock: 64, vendor: 'Leather Crafts KE',
    description: 'Genuine cowhide leather, made in Kariokor. Sizes 38–46.',
    tags: ['bestseller'], bestSeller: true,
  },
  {
    id: 'p9', slug: 'sandals-2',
    name: 'Maasai Beaded Sandals',
    price: 2299,
    image: 'https://d64gsuwffb70l.cloudfront.net/69fbb62b6a319bdf2d4c3d4b_1778104213706_7dd39394.png',
    category: 'fashion', brand: 'Kenyan Originals',
    rating: 4.9, reviews: 78, stock: 22, vendor: 'Maasai Market',
    description: 'Authentic Maasai beadwork on premium leather sandals.',
    tags: ['featured', 'new'], newArrival: true,
  },
  {
    id: 'p10', slug: 'kenyan-coffee-aa',
    name: 'Kenyan AA Coffee Beans (1kg)',
    price: 1450, originalPrice: 1800,
    image: 'https://d64gsuwffb70l.cloudfront.net/69fbb62b6a319bdf2d4c3d4b_1778104181425_2c120881.png',
    category: 'food', brand: 'Bidco',
    rating: 4.9, reviews: 423, stock: 120, vendor: 'Kiambu Coffee Co.',
    description: 'Single-origin Kiambu AA grade arabica. Whole beans, freshly roasted.',
    tags: ['bestseller', 'flash-sale'], bestSeller: true, flashSale: true,
  },
  {
    id: 'p11', slug: 'kenyan-coffee-2',
    name: 'Mt. Kenya Premium Coffee (500g)',
    price: 850,
    image: 'https://d64gsuwffb70l.cloudfront.net/69fbb62b6a319bdf2d4c3d4b_1778104161429_608a913b.jpg',
    category: 'food', brand: 'Bidco',
    rating: 4.7, reviews: 167, stock: 89, vendor: 'Kiambu Coffee Co.',
    description: 'Smooth medium roast from the slopes of Mount Kenya.',
    tags: ['new'], newArrival: true,
  },
  {
    id: 'p12', slug: 'wood-decor',
    name: 'Hand-carved Wooden Sculpture',
    price: 3299,
    image: 'https://d64gsuwffb70l.cloudfront.net/69fbb62b6a319bdf2d4c3d4b_1778104230863_a566f09c.jpg',
    category: 'home', brand: 'Kenyan Originals',
    rating: 4.8, reviews: 54, stock: 12, vendor: 'Akamba Wood Carvers',
    description: 'Traditional Akamba hand-carved sculpture in mahogany.',
    tags: ['featured'],
  },
  {
    id: 'p13', slug: 'wood-decor-2',
    name: 'African Decorative Bowl',
    price: 1799,
    image: 'https://d64gsuwffb70l.cloudfront.net/69fbb62b6a319bdf2d4c3d4b_1778104252178_720021df.png',
    category: 'home', brand: 'Kenyan Originals',
    rating: 4.6, reviews: 41, stock: 28, vendor: 'Akamba Wood Carvers',
    description: 'Beautifully carved wooden bowl perfect for fruits or decor.',
    tags: ['new'], newArrival: true,
  },
  {
    id: 'p14', slug: 'samsung-phone-2',
    name: 'Samsung Galaxy S23 Ultra',
    price: 145000, originalPrice: 165000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69fbb62b6a319bdf2d4c3d4b_1778104106522_702143b7.jpg',
    category: 'electronics', brand: 'Samsung',
    rating: 4.9, reviews: 87, stock: 8, vendor: 'Phone Hub Kenya',
    description: 'Flagship phone with 200MP camera and S Pen.',
    tags: ['featured'],
  },
];

export function formatKsh(amount: number): string {
  return 'KSh ' + amount.toLocaleString('en-KE');
}
