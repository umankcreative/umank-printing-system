import { Customer, Ingredient, Product, ProductImage, Recipes } from '../types/api';
import {
  User,
  Branch,
  Permission,
  RolePermission,
  UserRole,
  UserStatus,
} from '../types/user';

export const PRODUCT_CATEGORIES = [
  'Kartu Nama',
  'Brosur',
  'Flyer',
  'Poster',
  'Banner',
  'Stiker',
  'Undangan',
  'Kalender',
  'Amplop',
  'Nota',
  'Kop Surat',
  'Yasin',
  'Lainnya',
];

export const ingredients: Ingredient[] = [
  {
    id: '1',
    name: 'Skiblat Polos',
    description: 'Halaman Lapisan Yasin sebelum dijilid Hard Cover',
    unit: 'Lembar',
    price_per_unit: 500,
    stock: 1000,
    branch_id: '1',
    taskTemplates: [{
      title: "Pasang Skiblat ke Yasin",
      description: "Lem Skiblat ke Yasin",
      priority: "medium",
      estimatedTime: 2
    }],
    created_at: '2023-12-27 06:59:50',
    updated_at: '2023-12-29 20:13:05',
  },
  {
    id: '2',
    name: 'Kertas AP 210 A3+',
    description: 'Kertas Art Paper 210 ukuran A3+',
    unit: 'Lembar',
    price_per_unit: 2000,
    stock: 10000,
    branch_id: '1',
    created_at: '2023-12-27 07:21:54',
    updated_at: '2023-12-27 07:21:54',
  },
  {
    id: '3',
    name: 'Cetak A3+ Full Color',
    description: 'Cetak Full Color di kertas ukuran A3',
    unit: 'Kali',
    price_per_unit: 5000,
    stock: 100000,
    branch_id: '1',
    created_at: '2023-12-27 07:23:18',
    updated_at: '2023-12-29 20:11:15',
  },
  {
    id: '4',
    name: 'Yasin HVS 128 Putra Bahari',
    description: 'Buku Yasin Bahan HVS 128 halaman',
    unit: 'Buah',
    price_per_unit: 3500,
    stock: 1000,
    branch_id: '1',
    created_at: '2023-12-27 07:33:32',
    updated_at: '2023-12-30 09:07:11',
  },
  {
    id: '5',
    name: 'Sudut Gold',
    description: 'Ornamen Sudut Gold',
    unit: 'Buah',
    price_per_unit: 250,
    stock: 100000,
    branch_id: '1',
    created_at: '2023-12-27 07:36:30',
    updated_at: '2023-12-27 07:36:30',
  },
  {
    id: '6',
    name: 'Cover Yasin HC 001',
    description: 'Cover Yasin Metalic Ungu Hard Cover',
    unit: 'Lembar',
    price_per_unit: 8000,
    stock: 1000,
    branch_id: '1',
    created_at: '2023-12-30 06:13:15',
    updated_at: '2023-12-30 09:08:57',
  },
  {
    id: '7',
    name: 'Cover Yasin HC 002',
    description: 'Cover Yasin Metalic Biru Hard Cover',
    unit: 'Lembar',
    price_per_unit: 8000,
    stock: 1000,
    branch_id: '1',
    created_at: '2023-12-30 06:14:42',
    updated_at: '2023-12-30 09:09:09',
  },
  {
    id: '8',
    name: 'Cover Yasin Full Color SC',
    description: 'Cover Yasin Soft Cover Full Color AP 230 gr',
    unit: 'Lembar',
    price_per_unit: 1500,
    stock: 1000000,
    branch_id: '1',
    created_at: '2023-12-30 09:10:24',
    updated_at: '2023-12-30 09:10:24',
  },
  {
    id: '9',
    name: 'Kertas AP 230 A4',
    description: 'Kertas Art Paper 230 ukuran A4',
    unit: 'Lembar',
    price_per_unit: 1500,
    stock: 10000,
    branch_id: '1',
    taskTemplates: [{
      title: "Cetak Full Color",
      description: "Cetak full color di kertas AP 230",
      priority: "high",
      estimatedTime: 5
    }],
    created_at: '2024-01-05 01:44:10',
    updated_at: '2024-01-05 01:44:10',
  },
  {
    id: '10',
    name: 'Vinyl Outdoor',
    description: 'Vinyl tahan cuaca untuk outdoor',
    unit: 'Meter',
    price_per_unit: 50000,
    stock: 100,
    branch_id: '1',
    taskTemplates: [{
      title: "Cetak UV",
      description: "Cetak dengan tinta UV",
      priority: "high",
      estimatedTime: 10
    }],
    created_at: '2024-01-05 01:44:10',
    updated_at: '2024-01-05 01:44:10',
  },
  {
    id: '11',
    name: 'Kertas Ivory 310 A4',
    description: 'Kertas Ivory 310 ukuran A4',
    unit: 'Lembar',
    price_per_unit: 2000,
    stock: 5000,
    branch_id: '1',
    taskTemplates: [{
      title: "Cetak Full Color",
      description: "Cetak full color di kertas Ivory",
      priority: "medium",
      estimatedTime: 5
    }],
    created_at: '2024-01-05 01:44:10',
    updated_at: '2024-01-05 01:44:10',
  }
];

export interface Photo {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
}


export const photos: Photo[] = [
  {
    id: 1,
    title: "Pemandangan Gunung",
    category: "nature",
    imageUrl: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop&w=800&q=80",
    description: "Pemandangan indah hewan di alam liar"
  },
  {
    id: 2,
    title: "Laptop Modern",
    category: "technology",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
    description: "Laptop dengan teknologi terdepan"
  },
  {
    id: 3,
    title: "Circuit Board",
    category: "technology",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    description: "Detail circuit board elektronik"
  },
  {
    id: 4,
    title: "Programming Code",
    category: "technology",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
    description: "Monitor menampilkan kode Java"
  },
  {
    id: 5,
    title: "Workspace",
    category: "lifestyle",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    description: "Ruang kerja yang nyaman dan produktif"
  },
  {
    id: 6,
    title: "Matrix Code",
    category: "technology",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    description: "Tampilan kode matrix yang futuristik"
  },
  {
    id: 7,
    title: "Web Development",
    category: "technology",
    imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80",
    description: "Kode web berwarna-warni di monitor"
  },
  {
    id: 8,
    title: "Digital Display",
    category: "technology",
    imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80",
    description: "Tampilan layar digital modern"
  },
  {
    id: 9,
    title: "Team Meeting",
    category: "lifestyle",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    description: "Tim bekerja dengan laptop di meja"
  },
  {
    id: 10,
    title: "Innovation",
    category: "technology",
    imageUrl: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=800&q=80",
    description: "Lampu sebagai simbol inovasi"
  },
  {
    id: 11,
    title: "MacBook Setup",
    category: "technology",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    description: "MacBook dengan setup coding"
  },
  {
    id: 12,
    title: "Cute Cat",
    category: "animals",
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80",
    description: "Kucing lucu yang sedang istirahat"
  },
  {
    id: 13,
    title: "Living Room",
    category: "lifestyle",
    imageUrl: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80",
    description: "Ruang tamu yang nyaman dan modern"
  },
  {
    id: 14,
    title: "Wildlife Safari",
    category: "animals",
    imageUrl: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop&w=800&q=80",
    description: "Hewan liar di alam bebas"
  },
  {
    id: 15,
    title: "Mountain Ox",
    category: "animals",
    imageUrl: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?auto=format&fit=crop&w=800&q=80",
    description: "Banteng di pegunungan"
  },
  {
    id: 16,
    title: "Kitten",
    category: "animals",
    imageUrl: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=800&q=80",
    description: "Anak kucing yang menggemaskan"
  },
  {
    id: 17,
    title: "Flying Bees",
    category: "nature",
    imageUrl: "https://images.unsplash.com/photo-1498936178812-4b2e558d2937?auto=format&fit=crop&w=800&q=80",
    description: "Lebah yang sedang terbang"
  },
  {
    id: 18,
    title: "Whale Jump",
    category: "nature",
    imageUrl: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&w=800&q=80",
    description: "Paus yang sedang melompat"
  },
  {
    id: 19,
    title: "Forest Deer",
    category: "nature",
    imageUrl: "https://images.unsplash.com/photo-1439886183900-e79ec0057170?auto=format&fit=crop&w=800&q=80",
    description: "Rusa di dalam hutan"
  },
  {
    id: 20,
    title: "Forest Cattle",
    category: "nature",
    imageUrl: "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?auto=format&fit=crop&w=800&q=80",
    description: "Sapi di tengah hutan"
  }
];

// Update count for categories

export const productImages: ProductImage[] = [
  {
    id: '5',
    url:
      'https://umank.com/wp-content/uploads/2022/09/779CD726-3D25-4C33-8ACA-6FCFDD9FC3F8-1024x768.jpeg',
    product_id: '2',
    created_at: '2023-12-30 01:19:44',
    updated_at: '2023-12-30 01:19:44',
  },
  {
    id: '10',
    url: 'https://umank.com/wp-content/uploads/2022/09/223A433A-7C3E-473E-8606-102AD1A87BDC-768x1024.jpeg',
    product_id: '2',
    created_at: '2024-01-01 13:26:34',
    updated_at: '2024-01-01 13:26:34',
  },
  {
    id: '13',
    url: 'https://umank.com/wp-content/uploads/2022/09/A99FD56E-DD8F-4B59-B5E4-BDAC3F6AB1D8-1024x768.jpeg',
    product_id: '1',
    created_at: '2024-01-04 21:11:24',
    updated_at: '2024-01-04 21:11:24',
  },
  {
    id: '17',
    url: 'https://umank.com/wp-content/uploads/2022/09/EB30F4C0-C659-418D-9CFC-1D42F519BF6B-1024x768.jpeg',
    product_id: '1',
    created_at: '2025-04-23 01:44:10',
    updated_at: '2025-04-23 01:44:10',
  },
];

export const recipes: Recipes[] = [
  {
    id: '1',
    product_id: '1',
    ingredient_id: '7',
    quantity: '1',
    created_at: '2023-12-30 01:13:21',
    updated_at: '2023-12-30 01:13:21',
  },
  {
    id: '2',
    product_id: '1',
    ingredient_id: '5',
    quantity: '4',
    created_at: '2024-01-04 04:35:20',
    updated_at: '2024-01-04 04:35:20',
  },
  {
    id: '3',
    product_id: '1',
    ingredient_id: '1',
    quantity: '2',
    created_at: '2024-01-04 04:35:20',
    updated_at: '2024-01-04 04:35:20',
  },
  {
    id: '4',
    product_id: '2',
    ingredient_id: '1',
    quantity: '1',
    created_at: '2024-01-04 04:35:20',
    updated_at: '2024-01-04 04:35:20',
  },
  {
    id: '5',
    product_id: '2',
    ingredient_id: '5',
    quantity: '1',
    created_at: '2025-04-23 01:44:10',
    updated_at: '2025-04-23 01:44:10',
  },
  {
    id: '6',
    product_id: '2',
    ingredient_id: '7',
    quantity: '1',
    created_at: '2025-04-23 01:44:10',
    updated_at: '2025-04-23 01:44:10',
  },
  {
    id: '7',
    product_id: '3',
    ingredient_id: '1',
    quantity: '4',
    created_at: '2025-04-23 01:44:10',
    updated_at: '2025-04-23 01:44:10',
  },
  {
    id: '8',
    product_id: '3',
    ingredient_id: '5',
    quantity: '4',
    created_at: '2025-04-23 01:44:10',
    updated_at: '2025-04-23 01:44:10',
  },
  {
    id: '9',
    product_id: '3',
    ingredient_id: '7',
    quantity: '4',
    created_at: '2025-04-23 01:44:10',
    updated_at: '2025-04-23 01:44:10',
  },
  {
    id: '10',
    product_id: '5',
    ingredient_id: '9',
    quantity: '1',
    created_at: '2024-01-05 01:44:10',
    updated_at: '2024-01-05 01:44:10',
  },
  {
    id: '11',
    product_id: '6',
    ingredient_id: '9',
    quantity: '1',
    created_at: '2024-01-05 01:44:10',
    updated_at: '2024-01-05 01:44:10',
  },
  {
    id: '12',
    product_id: '7',
    ingredient_id: '10',
    quantity: '1',
    created_at: '2024-01-05 01:44:10',
    updated_at: '2024-01-05 01:44:10',
  },
  {
    id: '13',
    product_id: '8',
    ingredient_id: '11',
    quantity: '1',
    created_at: '2024-01-05 01:44:10',
    updated_at: '2024-01-05 01:44:10',
  },
  {
    id: '14',
    product_id: '9',
    ingredient_id: '10',
    quantity: '12',
    created_at: '2024-01-05 01:44:10',
    updated_at: '2024-01-05 01:44:10',
  },
  {
    id: '15',
    product_id: '10',
    ingredient_id: '11',
    quantity: '1',
    created_at: '2024-01-05 01:44:10',
    updated_at: '2024-01-05 01:44:10',
  },
  {
    id: '16',
    product_id: '11',
    ingredient_id: '9',
    quantity: '1',
    created_at: '2024-01-05 01:44:10',
    updated_at: '2024-01-05 01:44:10',
  },
  {
    id: '17',
    product_id: '12',
    ingredient_id: '11',
    quantity: '1',
    created_at: '2024-01-05 01:44:10',
    updated_at: '2024-01-05 01:44:10',
  },
  {
    id: '18',
    product_id: '13',
    ingredient_id: '9',
    quantity: '1',
    created_at: '2024-01-05 01:44:10',
    updated_at: '2024-01-05 01:44:10',
  },
  {
    id: '19',
    product_id: '14',
    ingredient_id: '9',
    quantity: '1',
    created_at: '2024-01-05 01:44:10',
    updated_at: '2024-01-05 01:44:10',
  }
];

// Helper function to get product with its ingredients
export const getProductWithIngredients = (
  productId: string
): Product | undefined => {
  const product = products.find((p) => p.id === productId);

  if (!product) return undefined;

  const productRecipes = recipes.filter((r) => r.product_id === productId);
  const productImgs = images.filter(
    (img) => img.product_id === productId
  );

  const recipeIngredients = productRecipes.map((recipe) => {
    const ingredient = ingredients.find((i) => i.id === recipe.ingredient.id);
    return {
      ingredient: ingredient!,
      quantity: recipe.quantity,
    };
  });

  return {
    ...product,
    images: productImages,
    ingredients: recipeIngredients,
  };
};

export const getProducts = (): Product[] => {
  return products.map((product) => {
    const productImages = productImages.filter(
      (img) => img.product_id === product.id
    );
    return {
      ...product,
      images: productImages,
    };
  });
};

export const getIngredients = (): Ingredient[] => {
  return ingredients;
};

export const branches: Branch[] = [
  { id: '1', name: 'Umank Central', location: 'Jakarta Pusat', isActive: true },
  { id: '2', name: 'Umank South', location: 'Jakarta Selatan', isActive: true },
  { id: '3', name: 'Umank East', location: 'Jakarta Timur', isActive: true },
  { id: '4', name: 'Umank Bandung', location: 'Bandung', isActive: true },
  { id: '5', name: 'Umank Surabaya', location: 'Surabaya', isActive: false },
];

export const permissions: Permission[] = [
  {
    id: 'p1',
    name: 'view_users',
    description: 'View all users',
    module: 'users',
  },
  {
    id: 'p2',
    name: 'create_users',
    description: 'Create new users',
    module: 'users',
  },
  {
    id: 'p3',
    name: 'edit_users',
    description: 'Edit existing users',
    module: 'users',
  },
  {
    id: 'p4',
    name: 'delete_users',
    description: 'Delete users',
    module: 'users',
  },
  {
    id: 'p5',
    name: 'manage_roles',
    description: 'Manage user roles',
    module: 'users',
  },
  {
    id: 'p6',
    name: 'view_inventory',
    description: 'View inventory',
    module: 'inventory',
  },
  {
    id: 'p7',
    name: 'manage_inventory',
    description: 'Manage inventory',
    module: 'inventory',
  },
  { id: 'p8', name: 'view_sales', description: 'View sales', module: 'sales' },
  {
    id: 'p9',
    name: 'manage_sales',
    description: 'Manage sales',
    module: 'sales',
  },
  {
    id: 'p10',
    name: 'view_reports',
    description: 'View reports',
    module: 'reports',
  },
  {
    id: 'p11',
    name: 'view_branch',
    description: 'View branch data',
    module: 'branch',
  },
  {
    id: 'p12',
    name: 'manage_branch',
    description: 'Manage branch',
    module: 'branch',
  },
];

export const rolePermissions: RolePermission[] = [
  {
    role: 'admin',
    permissions: permissions.map((p) => p.id),
  },
  {
    role: 'manager toko',
    permissions: ['p1', 'p3', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11'],
  },
  {
    role: 'admin gudang',
    permissions: ['p6', 'p7', 'p11'],
  },
  {
    role: 'kasir',
    permissions: ['p8', 'p11'],
  },
];

export const users: User[] = [
  {
    id: '1',
    name: 'Ahmad Sunarto',
    email: 'ahmad@umankcreative.com',
    role: 'admin',
    status: 'active',
    branch: '1',
    avatar:
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150',
    lastActive: new Date('2023-12-01T08:30:00'),
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-10-20'),
  },
  {
    id: '2',
    name: 'Budi Santoso',
    email: 'budi@umankcreative.com',
    role: 'manager toko',
    status: 'active',
    branch: '1',
    avatar:
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150',
    lastActive: new Date('2023-12-02T10:15:00'),
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-09-15'),
  },
  {
    id: '3',
    name: 'Citra Dewi',
    email: 'citra@umankcreative.com',
    role: 'admin gudang',
    status: 'active',
    branch: '2',
    avatar:
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150',
    lastActive: new Date('2023-12-01T14:45:00'),
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-11-05'),
  },
  {
    id: '4',
    name: 'Deni Hermawan',
    email: 'deni@umankcreative.com',
    role: 'kasir',
    status: 'active',
    branch: '3',
    avatar:
      'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150',
    lastActive: new Date('2023-12-02T09:20:00'),
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date('2023-09-20'),
  },
  {
    id: '5',
    name: 'Eka Putra',
    email: 'eka@umankcreative.com',
    role: 'kasir',
    status: 'inactive',
    branch: '1',
    avatar:
      'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150',
    lastActive: new Date('2023-11-15T11:30:00'),
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2023-11-20'),
  },
  {
    id: '6',
    name: 'Fani Wijaya',
    email: 'fani@umankcreative.com',
    role: 'manager toko',
    status: 'suspended',
    branch: '4',
    avatar:
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150',
    lastActive: new Date('2023-10-30T16:15:00'),
    createdAt: new Date('2023-01-25'),
    updatedAt: new Date('2023-10-30'),
  },
  {
    id: '7',
    name: 'Gunawan Prasetyo',
    email: 'gunawan@umankcreative.com',
    role: 'admin gudang',
    status: 'active',
    branch: '5',
    avatar:
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150',
    lastActive: new Date('2023-12-01T13:10:00'),
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-11-10'),
  },
  {
    id: '8',
    name: 'Hana Kusuma',
    email: 'hana@umankcreative.com',
    role: 'kasir',
    status: 'inactive',
    branch: '4',
    avatar:
      'https://images.pexels.com/photos/3762802/pexels-photo-3762802.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150',
    lastActive: new Date('2023-11-20T10:45:00'),
    createdAt: new Date('2023-06-10'),
    updatedAt: new Date('2023-11-25'),
  },
];

export const getRoleColor = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'bg-indigo-100 text-indigo-800';
    case 'manager toko':
      return 'bg-blue-100 text-blue-800';
    case 'admin gudang':
      return 'bg-purple-100 text-purple-800';
    case 'kasir':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusColor = (status: UserStatus): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    case 'suspended':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusBadgeColor = (status: UserStatus): string => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'inactive':
      return 'bg-gray-400';
    case 'suspended':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
};

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'PT Maju Bersama',
    email: 'contact@majubersama.com',
    phone: '021-5553789',
    company: 'PT Maju Bersama',
    contact: 'Budi Santoso',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    isActive: true,
    created_at: '2024-01-01T08:00:00Z',
    updated_at: '2024-01-01T08:00:00Z'
  },
  {
    id: '2', 
    name: 'CV Sukses Makmur',
    email: 'info@suksesmakmur.co.id',
    phone: '022-4445678',
    company: 'CV Sukses Makmur',
    contact: 'Dewi Lestari',
    address: 'Jl. Asia Afrika No. 88, Bandung',
    isActive: true,
    created_at: '2024-01-02T09:30:00Z',
    updated_at: '2024-01-02T09:30:00Z'
  },
  {
    id: '3',
    name: 'UD Sejahtera',
    email: 'order@sejahtera.com',
    phone: '031-7778899',
    company: 'UD Sejahtera',
    contact: 'Ahmad Hidayat',
    address: 'Jl. Pemuda No. 45, Surabaya',
    isActive: true,
    created_at: '2024-01-03T10:15:00Z',
    updated_at: '2024-01-03T10:15:00Z'
  },
  {
    id: '4',
    name: 'Toko Makmur Jaya',
    email: 'makmurjaya@gmail.com',
    phone: '0812-3456-7890',
    company: 'Toko Makmur Jaya',
    contact: 'Siti Aminah',
    address: 'Jl. Gatot Subroto No. 67, Medan',
    isActive: true,
    created_at: '2024-01-04T11:20:00Z',
    updated_at: '2024-01-04T11:20:00Z'
  },
  {
    id: '5',
    name: 'PT Karya Indah',
    email: 'sales@karyaindah.com',
    phone: '024-8889900',
    company: 'PT Karya Indah',
    contact: 'Rudi Hartono',
    address: 'Jl. Pandanaran No. 33, Semarang',
    isActive: true,
    created_at: '2024-01-05T13:45:00Z',
    updated_at: '2024-01-05T13:45:00Z'
  },
  {
    id: '6',
    name: 'Koperasi Mitra Usaha',
    email: 'koperasi@mitrausaha.org',
    phone: '0815-7890-1234',
    company: 'Koperasi Mitra Usaha',
    contact: 'Rina Wijaya',
    address: 'Jl. Diponegoro No. 156, Yogyakarta',
    isActive: true,
    created_at: '2024-01-06T14:30:00Z',
    updated_at: '2024-01-06T14:30:00Z'
  },
  {
    id: '7',
    name: 'CV Berkah Jaya',
    email: 'info@berkahjaya.net',
    phone: '0813-2345-6789',
    company: 'CV Berkah Jaya',
    contact: 'Hendra Gunawan',
    address: 'Jl. Ahmad Yani No. 90, Malang',
    isActive: true,
    created_at: '2024-01-07T15:20:00Z',
    updated_at: '2024-01-07T15:20:00Z'
  },
  {
    id: '8',
    name: 'PT Cemerlang Abadi',
    email: 'contact@cemerlangabadi.co.id',
    phone: '061-3334455',
    company: 'PT Cemerlang Abadi',
    contact: 'Linda Kusuma',
    address: 'Jl. Thamrin No. 234, Palembang',
    isActive: true,
    created_at: '2024-01-08T16:10:00Z',
    updated_at: '2024-01-08T16:10:00Z'
  },
  {
    id: '9',
    name: 'UD Bintang Terang',
    email: 'sales@bintangterang.com',
    phone: '0816-8901-2345',
    company: 'UD Bintang Terang',
    contact: 'Agus Setiawan',
    address: 'Jl. Veteran No. 78, Makassar',
    isActive: true,
    created_at: '2024-01-09T17:05:00Z',
    updated_at: '2024-01-09T17:05:00Z'
  },
  {
    id: '10',
    name: 'PT Global Sukses',
    email: 'info@globalsukses.com',
    phone: '0878-9012-3456',
    company: 'PT Global Sukses',
    contact: 'Maria Susanti',
    address: 'Jl. Gajah Mada No. 111, Denpasar',
    isActive: true,
    created_at: '2024-01-10T18:00:00Z',
    updated_at: '2024-01-10T18:00:00Z'
  }
];
