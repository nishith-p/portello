import { Item } from '@/types/store';

// Mock store item data
export const items: Item[] = [
  {
    id: 'SHIRT-001',
    name: 'Conference T-Shirt',
    price: 29.99,
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1503341733017-1901578f9f1e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Blue', hex: '#0000FF' },
    ],
    description:
      'A premium quality, soft cotton t-shirt featuring the conference logo. This comfortable shirt is perfect for casual wear and representing your participation.',
  },
  {
    id: 'HAT-002',
    name: 'Bucket Hat',
    price: 19.99,
    images: [
      'https://images.unsplash.com/photo-1582791694770-cbdc9dda338f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1612610581557-74fd89e0d92d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Beige', hex: '#F5F5DC' },
    ],
    description:
      'Protect yourself from the sun with this stylish bucket hat featuring an embroidered logo. Perfect for outdoor events.',
  },
  {
    id: 'HOODIE-003',
    name: 'Logo Hoodie',
    price: 49.99,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Gray', hex: '#808080' },
      { name: 'Navy', hex: '#000080' },
    ],
    description:
      'Stay warm and comfortable with this premium hoodie. Features a front pocket and adjustable drawstrings.',
  },
  {
    id: 'PIN-004',
    name: 'Enamel Pin',
    price: 7.99,
    images: [
      'https://images.unsplash.com/photo-1607703703520-bb638e84caf2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    ],
    sizes: ['One Size'],
    colors: [],
    description:
      'A collectible enamel pin with our logo design. Perfect for backpacks, lanyards, or jackets.',
  },
];