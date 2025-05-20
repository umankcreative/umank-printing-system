import React, { useState } from 'react';
import { Task } from '../types';
import { format, addMonths, subMonths } from 'date-fns';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Calendar } from './ui/calendar';

interface TaskCalendarProps {
  tasks: Task[];
  onAddTask: (date: Date) => void;
  onTaskClick: (task: Task) => void;
}

export function TaskCalendar({
  tasks,
  onAddTask,
  onTaskClick,
}: TaskCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // List of holidays (Month is 0-based)
  const holidays = [
    { year: 2025, month: 0, day: 1, name: 'Tahun Baru 2025' },
    { year: 2026, month: 0, day: 1, name: 'Tahun Baru 2026' },
    { year: 2025, month: 0, day: 27, name: "Isra' Mi'raj Nabi Muhammad SAW" },
    {
      year: 2025,
      month: 0,
      day: 28,
      name: 'Cuti Bersama Tahun Baru Imlek 2576 Kongzili',
    },
    { year: 2025, month: 0, day: 29, name: 'Tahun Baru Imlek 2576 Kongzili' },
    {
      year: 2025,
      month: 2,
      day: 28,
      name: 'Cuti Bersama Hari Raya Nyepi Tahun Baru Saka 1947',
    },
    { year: 2025, month: 2, day: 31, name: 'Hari Raya Idul Fitri 1446H' },
    {
      year: 2025,
      month: 2,
      day: 29,
      name: 'Hari Raya Nyepi Tahun Baru Saka 1947',
    },
    { year: 2025, month: 3, day: 1, name: 'Hari Raya Idul Fitri 1446H' },
    {
      year: 2025,
      month: 3,
      day: 2,
      name: 'Cuti Bersama Hari Raya Idul Fitri 1446H',
    },
    {
      year: 2025,
      month: 3,
      day: 3,
      name: 'Cuti Bersama Hari Raya Idul Fitri 1446H',
    },
    {
      year: 2025,
      month: 3,
      day: 4,
      name: 'Cuti Bersama Hari Raya Idul Fitri 1446H',
    },
    {
      year: 2025,
      month: 3,
      day: 7,
      name: 'Cuti Bersama Hari Raya Idul Fitri 1446H',
    },
    { year: 2025, month: 3, day: 18, name: 'Wafat Yesus Kristus' },
    { year: 2025, month: 3, day: 20, name: 'Kebangkitan Yesus Kristus' },
    { year: 2025, month: 4, day: 1, name: 'Hari Buruh' },
    { year: 2025, month: 4, day: 12, name: 'Hari Raya Waisak 2569 BE' },
    {
      year: 2025,
      month: 4,
      day: 13,
      name: 'Cuti Bersama Hari Raya Waisak 2569 BE',
    },
    { year: 2025, month: 4, day: 29, name: 'Kenaikan Yesus Kristus' },
    {
      year: 2025,
      month: 4,
      day: 30,
      name: 'Cuti Bersama Kenaikan Yesus Kristus',
    },
    { year: 2025, month: 5, day: 1, name: 'Hari Lahir Pancasila' },
    { year: 2025, month: 5, day: 6, name: 'Hari Raya Idul Adha 1446H' },
    {
      year: 2025,
      month: 5,
      day: 9,
      name: 'Cuti Bersama Hari Raya Idul Adha 1446H',
    },
    {
      year: 2025,
      month: 5,
      day: 27,
      name: 'Tahun Baru Islam 1 Muharram 1447H',
    },
    {
      year: 2025,
      month: 7,
      day: 17,
      name: 'Hari Kemerdekaan Republik Indonesia ke 80',
    },
    {
      year: 2026,
      month: 7,
      day: 17,
      name: 'Hari Kemerdekaan Republik Indonesia ke 81',
    },
    { year: 2025, month: 8, day: 5, name: 'Maulid Nabi Muhammad SAW' },
    { year: 2025, month: 11, day: 25, name: 'Hari Raya Natal' },
    { year: 2026, month: 11, day: 25, name: 'Hari Raya Natal' },
    { year: 2025, month: 11, day: 26, name: 'Cuti Bersama Hari Raya Natal' },
    // Add more holidays as needed
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate);

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(newDate);
  };

  const handleQuickAddTask = (day: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(newDate);
    onAddTask(newDate);
  };

  const getTasksForDate = (day: number): Task[] => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return tasks.filter((task) => {
      const taskDate = new Date(task.deadline);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const isHoliday = (day: number) => {
    return holidays.some(
      (holiday) =>
        holiday.year === currentDate.getFullYear() &&
        holiday.month === currentDate.getMonth() &&
        holiday.day === day
    );
  };

  const isSunday = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return date.getDay() === 0;
  };

  const getDateClassName = (day: number, isSelected: boolean) => {
    const baseClasses =
      'group relative min-h-[100px] p-2 border border-gray-200 cursor-pointer transition-colors';
    const holiday = isHoliday(day);
    const sunday = isSunday(day);

    if (isSelected) return `${baseClasses} bg-blue-100`;
    if (holiday) return `${baseClasses} bg-red-50 hover:bg-red-100`;
    if (sunday) return `${baseClasses} bg-orange-50 hover:bg-orange-100`;
    return `${baseClasses} hover:bg-gray-50`;
  };

  const renderCalendarDays = () => {
    const days = [];
    const daysOfWeek = [
      'Minggu',
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      "Jum'at",
      'Sabtu',
    ];

    // Render week days
    daysOfWeek.forEach((day, index) => {
      days.push(
        <div
          key={day}
          className={`font-semibold p-2 text-center ${
            index === 0 ? 'text-orange-500' : 'text-gray-600'
          }`}
        >
          {day}
        </div>
      );
    });

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const dayTasks = getTasksForDate(day);
      const holiday = isHoliday(day);
      const sunday = isSunday(day);
      const isNonWorkingDay = holiday || sunday;

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={getDateClassName(day, isSelected)}
        >
          <div className="flex justify-between items-start">
            <span
              className={`text-sm ${isSelected ? 'font-bold' : ''} ${
                holiday
                  ? 'text-red-600'
                  : isSunday(day)
                  ? 'text-orange-600'
                  : ''
              }`}
            >
              {day}
              {holiday && (
                <span className="block text-xs text-red-500">
                  {
                    holidays.find(
                      (h) => h.month === currentDate.getMonth() && h.day === day
                    )?.name
                  }
                </span>
              )}
            </span>
            {dayTasks.length > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {dayTasks.length}
              </span>
            )}
          </div>
          <div className="mt-2">
            {dayTasks.map((task, index) => (
              <div
                key={index}
                className="text-xs bg-blue-50 p-1 mb-1 rounded truncate hover:bg-blue-100"
                title={task.title}
                onClick={(e) => {
                  e.stopPropagation();
                  onTaskClick(task);
                }}
              >
                {task.title}
              </div>
            ))}
          </div>
          <button
            onClick={(e) => handleQuickAddTask(day, e)}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return days;
  };

  const openDatePicker = () => {
    setIsCalendarOpen(true);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={openDatePicker}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            {format(currentDate, 'MMMM yyyy')}
          </Button>
          <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Select Month</DialogTitle>
              </DialogHeader>
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={handleDateChange}
                className="p-3 pointer-events-auto"
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            onClick={() => onAddTask(selectedDate || new Date())}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 flex-1 overflow-y-auto">
        {renderCalendarDays()}
      </div>
    </div>
  );
}
