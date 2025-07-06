import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, ArrowUpDown, Eye, CopyCheck } from 'lucide-react';
import { Product } from '../types/api';
import { formatCurrency } from '../lib/utils';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  ColumnDef,
  Row,
  HeaderGroup,
  Header,
} from '@tanstack/react-table';
import { Button } from './ui/button';

interface ProductTableProps {
  products: Product[];
  currentPage: number;
  itemsPerPage: number;
  onDelete: (product: Product) => void;
  onClone?: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  currentPage,
  itemsPerPage,
  onDelete,
  onClone // Default no-op function if not provided
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const columns = React.useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'index',
        header: 'No',
        cell: ({ row }: { row: Row<Product> }) => startIndex + row.index + 1,
        size: 32,
      },
      {
        accessorKey: 'name',
        header: 'Nama Produk',
        cell: ({ row }: { row: Row<Product> }) => (
          <div className="flex items-center">
            {row.original.thumbnail_id && (
              <img
                src={row.original.thumbnail_id}
                alt={row.original.name}
                className="h-10 w-10 rounded-full object-cover mr-3"
                loading="lazy"
              />
            )}
            <div>
              <div className="text-sm font-medium text-gray-900">
                {row.original.name}
              </div>
              <div className="text-sm text-gray-500 line-clamp-1">
                {row.original.description}
              </div>
            </div>
          </div>
        ),
        size: 352,
      },
      {
        accessorKey: 'category',
        header: 'Kategori',
        cell: ({ row }: { row: Row<Product> }) => (
          <span className="text-sm text-gray-700">
            {row.original.category?.name || 'Tidak ada kategori'}
          </span>
        ),
        size: 112,
      },
      {
        accessorKey: 'cost_price',
        header: 'Harga Modal',
        cell: ({ row }: { row: Row<Product> }) => formatCurrency(row.original.cost_price),
        size: 112,
      },
      {
        accessorKey: 'price',
        header: 'Harga Jual',
        cell: ({ row }: { row: Row<Product> }) => formatCurrency(row.original.price),
        size: 112,
      },
      {
        accessorKey: 'stock',
        header: 'Stok',
        cell: ({ row }: { row: Row<Product> }) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              parseInt(row.original.stock.toString()) > 100
                ? 'bg-green-100 text-green-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {row.original.stock}
          </span>
        ),
        size: 96,
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }: { row: Row<Product> }) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              row.original.is_active
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {row.original.is_active ? 'Aktif' : 'Nonaktif'}
          </span>
        ),
        size: 96,
      },
      {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }: { row: Row<Product> }) => (
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => onClone?.(row.original)}
              className="inline-flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors border border-gray-200"
            
            >
              <CopyCheck size={18} />
            </Button>
            <Link
              to={`/admin/products/${row.original.id}`}
              className="inline-flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors border border-gray-200"
            >
              <Eye size={18} />
            </Link>
            <Link
              to={`/admin/products/edit/${row.original.id}`}
              className="inline-flex items-center justify-center p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-md transition-colors border border-indigo-200"
            >
              <Edit size={18} />
            </Link>
            <button
              onClick={() => onDelete(row.original)}
              className="inline-flex items-center justify-center p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors border border-red-200"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ),
        size: 192, // Auto size based on content
      },
    ],
    [startIndex, onDelete]
  );

  const table = useReactTable({
    data: products,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Get sorted and paginated rows
  const sortedRows = table.getRowModel().rows;
  const paginatedRows = sortedRows.slice(startIndex, endIndex);

  return (
    <div className="border rounded-lg shadow-sm">
      <div className="overflow-auto" style={{ height: '600px' }}>
        <table className="w-full table-fixed border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-50">
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<Product>) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: Header<Product, unknown>) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none flex items-center gap-1'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? (
                          header.column.getCanSort() ? (
                            <ArrowUpDown className="h-4 w-4" />
                          ) : null
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {paginatedRows.map((row: Row<Product>) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(ProductTable); 