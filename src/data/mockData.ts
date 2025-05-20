import { Ingredient, Product, ProductImage, Recipes } from '../types';
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
    NamaBahan: 'Skiblat Polos',
    Deskripsi: 'Halaman Lapisan Yasin sebelum dijilid Hard Cover',
    Satuan: 'Lembar',
    HargaPerSatuan: '500',
    Stok: '1000',
    id_cabang: '1',
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
    NamaBahan: 'Kertas AP 210 A3+',
    Deskripsi: 'Kertas Art Paper 210 ukuran A3+',
    Satuan: 'Lembar',
    HargaPerSatuan: '2000',
    Stok: '10000',
    id_cabang: '1',
    created_at: '2023-12-27 07:21:54',
    updated_at: '2023-12-27 07:21:54',
  },
  {
    id: '3',
    NamaBahan: 'Cetak A3+ Full Color',
    Deskripsi: 'Cetak Full Color di kertas ukuran A3',
    Satuan: 'Kali',
    HargaPerSatuan: '5000',
    Stok: '100000',
    id_cabang: '1',
    created_at: '2023-12-27 07:23:18',
    updated_at: '2023-12-29 20:11:15',
  },
  {
    id: '4',
    NamaBahan: 'Yasin HVS 128 Putra Bahari',
    Deskripsi: 'Buku Yasin Bahan HVS 128 halaman',
    Satuan: 'Buah',
    HargaPerSatuan: '3500',
    Stok: '1000',
    id_cabang: '1',
    created_at: '2023-12-27 07:33:32',
    updated_at: '2023-12-30 09:07:11',
  },
  {
    id: '5',
    NamaBahan: 'Sudut Gold',
    Deskripsi: 'Ornamen Sudut Gold',
    Satuan: 'Buah',
    HargaPerSatuan: '250',
    Stok: '100000',
    id_cabang: '1',
    created_at: '2023-12-27 07:36:30',
    updated_at: '2023-12-27 07:36:30',
  },
  {
    id: '6',
    NamaBahan: 'Cover Yasin HC 001',
    Deskripsi: 'Cover Yasin Metalic Ungu Hard Cover',
    Satuan: 'Lembar',
    HargaPerSatuan: '8000',
    Stok: '1000',
    id_cabang: '1',
    created_at: '2023-12-30 06:13:15',
    updated_at: '2023-12-30 09:08:57',
  },
  {
    id: '7',
    NamaBahan: 'Cover Yasin HC 002',
    Deskripsi: 'Cover Yasin Metalic Biru Hard Cover',
    Satuan: 'Lembar',
    HargaPerSatuan: '8000',
    Stok: '1000',
    id_cabang: '1',
    created_at: '2023-12-30 06:14:42',
    updated_at: '2023-12-30 09:09:09',
  },
  {
    id: '8',
    NamaBahan: 'Cover Yasin Full Color SC',
    Deskripsi: 'Cover Yasin Soft Cover Full Color AP 230 gr',
    Satuan: 'Lembar',
    HargaPerSatuan: '1500',
    Stok: '1000000',
    id_cabang: '1',
    created_at: '2023-12-30 09:10:24',
    updated_at: '2023-12-30 09:10:24',
  },
  {
    id: '9',
    NamaBahan: 'Kertas AP 230 A4',
    Deskripsi: 'Kertas Art Paper 230 ukuran A4',
    Satuan: 'Lembar',
    HargaPerSatuan: '1500',
    Stok: '10000',
    id_cabang: '1',
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
    NamaBahan: 'Vinyl Outdoor',
    Deskripsi: 'Vinyl tahan cuaca untuk outdoor',
    Satuan: 'Meter',
    HargaPerSatuan: '50000',
    Stok: '100',
    id_cabang: '1',
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
    NamaBahan: 'Kertas Ivory 310 A4',
    Deskripsi: 'Kertas Ivory 310 ukuran A4',
    Satuan: 'Lembar',
    HargaPerSatuan: '2000',
    Stok: '5000',
    id_cabang: '1',
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

export const products: Product[] = [
  {
    id: '1',
    NamaProduk: 'Yasin Full Color 128 SC',
    Deskripsi: 'Yasin 128 Halaman, dengan cover Full COlor',
    category: 'Yasin',
    thumbnail_id:
      'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg',
    HargaModal: '16200',
    Harga: '16200',
    minOrder: '50',
    Stok: '1000',
    branch_id: '1',
    isActive: true,
    created_at: '2023-12-30 01:13:21',
    updated_at: '2024-01-05 01:40:10',
  },
  {
    id: '2',
    NamaProduk: 'Yasin AP 170 HC',
    Deskripsi: 'Buku Yasin Art Paper isi Hard Cover Sudut Gold',
    category: 'Yasin',
    thumbnail_id:
      'https://images.pexels.com/photos/6501751/pexels-photo-6501751.jpeg',
    HargaModal: '9500',
    Harga: '19000',
    minOrder: '50',
    Stok: '1000',
    branch_id: '1',
    isActive: true,
    created_at: '2024-01-01 13:26:34',
    updated_at: '2024-10-16 05:42:50',
  },
  {
    id: '3',
    NamaProduk: 'Kalender Dinding 4 Lembar Spiral',
    Deskripsi: 'Kalender Dinding 4 Lembar Spiral',
    category: 'Kalender',
    thumbnail_id:
      'https://images.pexels.com/photos/762687/pexels-photo-762687.jpeg',
    HargaModal: '30000',
    Harga: '60000',
    minOrder: '50',
    Stok: '1000',
    branch_id: '1',
    isActive: true,
    created_at: '2024-01-04 21:11:24',
    updated_at: '2024-01-05 07:43:05',
  },
  {
    id: '4',
    NamaProduk: 'Yasin Hard Cover 128',
    Deskripsi: 'Yasin Hard Cover Isi 128 Halaman',
    category: 'Yasin',
    thumbnail_id:
      'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg',
    HargaModal: '14500',
    Harga: '29000',
    minOrder: '1',
    Stok: '10',
    branch_id: '1',
    isActive: false,
    created_at: '2025-04-23 01:44:10',
    updated_at: '2025-04-23 01:44:10',
  },
  {
    id: '5',
    NamaProduk: 'Kartu Nama Premium',
    Deskripsi: 'Kartu Nama dengan finishing spot UV dan emboss',
    category: 'Kartu Nama',
    thumbnail_id: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg',
    HargaModal: '25000',
    Harga: '50000',
    minOrder: '100',
    Stok: '1000',
    branch_id: '1',
    isActive: true,
    created_at: '2024-01-05 01:44:10',
    updated_at: '2024-01-05 01:44:10',
  },
  {
    id: '6',
    NamaProduk: 'Brosur A4 Full Color',
    Deskripsi: 'Brosur ukuran A4 dengan kertas AP 210gsm',
    category: 'Brosur',
    thumbnail_id: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg',
    HargaModal: '15000',
    Harga: '30000',
    minOrder: '100',
    Stok: '5000',
    branch_id: '1',
    isActive: true,
    created_at: '2024-01-05 01:44:10',
    updated_at: '2024-01-05 01:44:10',
  },
  {
    id: '7',
    NamaProduk: 'Stiker Vinyl Outdoor',
    Deskripsi: 'Stiker vinyl tahan cuaca untuk outdoor',
    category: 'Stiker',
    thumbnail_id: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg',
    HargaModal: '50000',
    Harga: '100000',
    minOrder: '10',
    Stok: '100',
    branch_id: '1',
    isActive: true,
    created_at: '2024-01-05 01:44:10',
    updated_at: '2024-01-05 01:44:10',
  },
  {
    id: '8',
    NamaProduk: 'Undangan Pernikahan Premium',
    Deskripsi: 'Undangan pernikahan dengan emboss dan spot UV',
    category: 'Undangan',
    thumbnail_id: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg',
    HargaModal: '35000',
    Harga: '70000',
    minOrder: '50',
    Stok: '500',
    branch_id: '1',
    isActive: true,
    created_at: '2024-01-05 01:44:10',
    updated_at: '2024-01-05 01:44:10',
  },
  {
    id: '9',
    NamaProduk: 'Banner Flexy 3x4',
    Deskripsi: 'Banner flexy ukuran 3x4 meter',
    category: 'Banner',
    thumbnail_id: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg',
    HargaModal: '150000',
    Harga: '300000',
    minOrder: '1',
    Stok: '50',
    branch_id: '1',
    isActive: true,
    created_at: '2024-01-05 01:44:10',
    updated_at: '2024-01-05 01:44:10',
  },
  {
    id: '10',
    NamaProduk: 'Kop Surat Premium',
    Deskripsi: 'Kop surat dengan watermark dan emboss',
    category: 'Kop Surat',
    thumbnail_id: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg',
    HargaModal: '20000',
    Harga: '40000',
    minOrder: '100',
    Stok: '1000',
    branch_id: '1',
    isActive: true,
    created_at: '2024-01-05 01:44:10',
    updated_at: '2024-01-05 01:44:10',
  },
  {
    id: '11',
    NamaProduk: 'Nota Custom',
    Deskripsi: 'Nota dengan logo dan informasi custom',
    category: 'Nota',
    thumbnail_id: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg',
    HargaModal: '10000',
    Harga: '20000',
    minOrder: '100',
    Stok: '2000',
    branch_id: '1',
    isActive: true,
    created_at: '2024-01-05 01:44:10',
    updated_at: '2024-01-05 01:44:10',
  },
  {
    id: '12',
    NamaProduk: 'Amplop Premium',
    Deskripsi: 'Amplop dengan emboss dan spot UV',
    category: 'Amplop',
    thumbnail_id: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg',
    HargaModal: '15000',
    Harga: '30000',
    minOrder: '100',
    Stok: '1000',
    branch_id: '1',
    isActive: true,
    created_at: '2024-01-05 01:44:10',
    updated_at: '2024-01-05 01:44:10',
  },
  {
    id: '13',
    NamaProduk: 'Poster A3 Premium',
    Deskripsi: 'Poster ukuran A3 dengan kertas AP 230gsm',
    category: 'Poster',
    thumbnail_id: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg',
    HargaModal: '25000',
    Harga: '50000',
    minOrder: '50',
    Stok: '500',
    branch_id: '1',
    isActive: true,
    created_at: '2024-01-05 01:44:10',
    updated_at: '2024-01-05 01:44:10',
  },
  {
    id: '14',
    NamaProduk: 'Flyer A5 Premium',
    Deskripsi: 'Flyer ukuran A5 dengan kertas AP 210gsm',
    category: 'Flyer',
    thumbnail_id: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg',
    HargaModal: '10000',
    Harga: '20000',
    minOrder: '100',
    Stok: '2000',
    branch_id: '1',
    isActive: true,
    created_at: '2024-01-05 01:44:10',
    updated_at: '2024-01-05 01:44:10',
  }
];

export const productImages: ProductImage[] = [
  {
    id: '5',
    image:
      'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg',
    product_id: '1',
    created_at: '2023-12-30 01:19:44',
    updated_at: '2023-12-30 01:19:44',
  },
  {
    id: '10',
    image: 'https://images.pexels.com/photos/762687/pexels-photo-762687.jpeg',
    product_id: '2',
    created_at: '2024-01-01 13:26:34',
    updated_at: '2024-01-01 13:26:34',
  },
  {
    id: '13',
    image: 'https://images.pexels.com/photos/6501751/pexels-photo-6501751.jpeg',
    product_id: '3',
    created_at: '2024-01-04 21:11:24',
    updated_at: '2024-01-04 21:11:24',
  },
  {
    id: '17',
    image: 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg',
    product_id: '4',
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
