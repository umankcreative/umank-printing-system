
import { FormCategoryMapping, FormTemplate } from "../types/formTypes";
import { PRODUCT_CATEGORIES } from "../types/";

export const formTemplates: FormTemplate[] = [
  {
    id: '1',
    name: 'Form Pemesanan Kartu Nama',
    description: 'Form untuk pemesanan produk kategori Kartu Nama',
    elements: [
      {
        id: 'name',
        type: 'input',
        label: 'Nama',
        placeholder: 'Masukkan nama lengkap',
        required: true
      },
      {
        id: 'job_title',
        type: 'input',
        label: 'Jabatan',
        placeholder: 'Masukkan jabatan',
        required: true
      },
      {
        id: 'company',
        type: 'input',
        label: 'Perusahaan',
        placeholder: 'Masukkan nama perusahaan',
        required: true
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'Masukkan email',
        required: true
      },
      {
        id: 'phone',
        type: 'phone',
        label: 'Nomor Handphone',
        placeholder: 'Masukkan nomor handphone',
        required: true
      },
      {
        id: 'address',
        type: 'textarea',
        label: 'Alamat',
        placeholder: 'Masukkan alamat lengkap',
        required: true
      },
      {
        id: 'design_type',
        type: 'select',
        label: 'Jenis Desain',
        required: true,
        options: [
          { label: 'Desain Baru', value: 'new' },
          { label: 'Gunakan Desain Lama', value: 'existing' }
        ]
      }
    ],
    categoryId: 'Kartu Nama'
  },
  {
    id: '2',
    name: 'Form Pemesanan Yasin',
    description: 'Form untuk pemesanan produk kategori Yasin',
    elements: [
      {
        id: 'name',
        type: 'input',
        label: 'Nama Pemesan',
        placeholder: 'Masukkan nama pemesan',
        required: true
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'Masukkan email',
        required: true
      },
      {
        id: 'phone',
        type: 'phone',
        label: 'Nomor Handphone',
        placeholder: 'Masukkan nomor handphone',
        required: true
      },
      {
        id: 'event',
        type: 'input',
        label: 'Nama Acara',
        placeholder: 'Masukkan nama acara',
        required: true
      },
      {
        id: 'event_date',
        type: 'date',
        label: 'Tanggal Acara',
        required: true
      },
      {
        id: 'delivery_address',
        type: 'textarea',
        label: 'Alamat Pengiriman',
        placeholder: 'Masukkan alamat pengiriman',
        required: true
      },
      {
        id: 'cover_type',
        type: 'select',
        label: 'Jenis Sampul',
        required: true,
        options: [
          { label: 'Hard Cover', value: 'hard' },
          { label: 'Soft Cover', value: 'soft' }
        ]
      },
      {
        id: 'cover_color',
        type: 'select',
        label: 'Warna Sampul',
        required: true,
        options: [
          { label: 'Hitam', value: 'black' },
          { label: 'Biru', value: 'blue' },
          { label: 'Hijau', value: 'green' },
          { label: 'Cokelat', value: 'brown' }
        ]
      },
      {
        id: 'notes',
        type: 'textarea',
        label: 'Catatan Tambahan',
        placeholder: 'Masukkan catatan tambahan jika ada',
        required: false
      }
    ],
    categoryId: 'Yasin'
  }
];

export const formCategoryMappings: FormCategoryMapping[] = PRODUCT_CATEGORIES.map(category => {
  const template = formTemplates.find(t => t.categoryId === category);
  return {
    categoryId: category,
    categoryName: category,
    formTemplateId: template?.id || ''
  };
});
