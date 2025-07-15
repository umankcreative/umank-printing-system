'use client';
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { Share2, Pencil, Trash, MoreVertical, File, Printer, Check, CalendarClock, CalendarCheck, CalendarClockIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


interface OrderActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onPrint?: () => void;
  viewTasks?: () => void;
  orderId?: string;
}



export const OrderActions: React.FC<OrderActionsProps> = ({
  onEdit,
  onDelete,
  onDuplicate,
  onPrint,
  viewTasks,
  orderId,
}) => {
  // const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/form/${orderId}`;
    const shareData = {
      title: 'Bagikan Formulir Pesanan',
      text: 'Silakan isi formulir pesanan berikut:',
      url,
    };

    if (navigator.share) {
      navigator.share(shareData)
        .then(() => {
          setCopied(true);
          setShowTooltip(true);
          setTimeout(() => setCopied(false), 2000);
          setTimeout(() => setShowTooltip(false), 3000);
        })
        .catch((err) => {
          // fallback to clipboard if user cancels or share fails
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url)
              .then(() => {
                setCopied(true);
                setShowTooltip(true);
                setTimeout(() => setCopied(false), 2000);
                setTimeout(() => setShowTooltip(false), 3000);
              })
              .catch(err => {
                console.error('Failed to copy: ', err);
              });
          }
        });
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => {
          setCopied(true);
          setShowTooltip(true);
          setTimeout(() => setCopied(false), 2000);
          setTimeout(() => setShowTooltip(false), 3000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setShowTooltip(true);
        setTimeout(() => setCopied(false), 2000);
        setTimeout(() => setShowTooltip(false), 3000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
      document.body.removeChild(textArea);
    }
  };

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
          <TooltipContent>Hapus</TooltipContent>
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
              Lihat isian Formulir
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onPrint}>
              <Printer className="w-4 h-4 mr-2" />
              Cetak Invoice
            </DropdownMenuItem>
            <DropdownMenuItem onClick={viewTasks}>
              <CalendarClockIcon className="w-4 h-4 mr-2" />
              Lihat Tugas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShare}>
            {copied ? (
          <Check className="h-5 w-5" />
        ) : (
          <Share2 className="h-5 w-5" />
        )}
              Bagikan
            </DropdownMenuItem>
            
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
};

