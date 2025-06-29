'use client';

import { Button } from '../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import {Share, Share2, Pencil, Trash, MoreVertical, File, Printer, Check } from 'lucide-react';

interface OrderActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onPrint?: () => void;
  onMarkPaid?: () => void;
}

export const OrderActions: React.FC<OrderActionsProps> = ({
  onEdit,
  onDelete,
  onDuplicate,
  onPrint,
  onMarkPaid,
}) => {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Pencil className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash className="w-4 h-4 text-red-500" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onDuplicate}>
              <File className="w-4 h-4 mr-2" />
              Tambah Link Formulir
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onPrint}>
              <Printer className="w-4 h-4 mr-2" />
              Cetak Invoice
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onMarkPaid}>
              <Share2 className="w-4 h-4 mr-2" />
              Bagikan
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
};

