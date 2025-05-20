import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Task, TaskStatus, TaskPriority, TaskCategory } from '../types';
import { toast } from 'sonner';
import { Trash, Clock } from 'lucide-react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '../components/ui/form';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onAddTask: (task: Task) => void;
  // onAddTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskDialog({
  isOpen,
  onClose,
  task,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: TaskDialogProps) {
  // Create form instance using react-hook-form
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'todo' as TaskStatus,
      priority: 'medium' as TaskPriority,
      category: 'preparation' as TaskCategory,
      estimatedTime: 30,
      dueDate: '',
      deadline: '',
      assignee: '',
      subtasks: [],
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority || 'medium',
        category: task.category || 'preparation',
        estimatedTime: task.estimatedTime || 30,
        dueDate: task.dueDate || '',
        deadline: task.deadline || '',
        assignee: task.assignee || '',
        subtasks: [],
      });
    } else {
      form.reset({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        category: 'preparation',
        estimatedTime: 30,
        dueDate: '',
        deadline: '',
        assignee: '',
      });
    }
  }, [task?.id]); // hanya reset saat ID task berubah

  const handleSubmit = form.handleSubmit((values) => {
    // if (!values.title.trim()) {
    //   toast.error('Title is required');
    //   return;
    // }

    // if (!values.deadline.trim()) {
    //   toast.error('Deadline is required');
    //   return;
    // }

    const now = new Date().toISOString();

    if (task) {
      onUpdateTask({
        ...task,
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority,
        category: values.category,
        estimatedTime: values.estimatedTime,
        dueDate: values.dueDate || undefined,
        deadline: values.deadline,
        assignee: values.assignee || undefined,
        subtasks: [],
        updated_at: now,
      });
      toast.success('Task updated successfully');
    } else {
      onAddTask({
        id: uuidv4(),
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority,
        category: values.category,
        estimatedTime: values.estimatedTime,
        dueDate: values.dueDate || undefined,
        deadline: values.deadline,
        assignee: values.assignee || undefined,
        ingredient_id: undefined,
        order_id: undefined,
        parent_task_id: undefined,
        subtasks: [],
        created_at: now,
        updated_at: now,
      });
      toast.success('Task added successfully');
    }

    onClose();
  });

  const handleDelete = () => {
    if (task) {
      onDeleteTask(task.id);
      toast.success('Task deleted successfully');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter task title..."
                      {...field}
                      required
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter task description..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="preparation">Preparation</SelectItem>
                        <SelectItem value="cooking">Cooking</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="cleaning">Cleaning</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Time (minutes)</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                          className="flex-1"
                        />
                        <Clock
                          size={16}
                          className="ml-2 text-muted-foreground"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline (required)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="assignee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter assignee name..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 gap-2">
              {task && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDelete}
                  className="mr-auto text-destructive hover:text-destructive"
                >
                  <Trash size={16} className="mr-2" />
                  Delete
                </Button>
              )}
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button className="btn btn-primary " type="submit">
                {task ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
