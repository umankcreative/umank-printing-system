
import React from 'react';
import { FormElement } from '../../../types/formTypes';
import { Calendar } from '../../ui/calendar';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../ui/popover';
import { format } from 'date-fns';
import { cn } from '../../../lib/utils';

interface DateFieldProps {
  element: FormElement;
  selectedDate: Date | null;
  onDateChange: (date: Date | null, elementId: string) => void;
  error?: boolean;
}

const DateField: React.FC<DateFieldProps> = ({ element, selectedDate, onDateChange, error }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={element.id}>
        {element.label}
        {element.required && <span className="text-red-500">*</span>}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={element.id}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "PPP")
            ) : (
              <span>Pilih tanggal</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate || undefined}
            onSelect={(date) => onDateChange(date, element.id)}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      {element.required && !selectedDate && error && (
        <p className="text-sm text-red-500">Pilih tanggal</p>
      )}
    </div>
  );
};

export default DateField;
