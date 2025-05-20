import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { formatDistanceToNow } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import { Rows3, Columns3, ArrowDown, ArrowUp } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '../components/ui/context-menu';

interface TaskTableProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

type SortField = 'title' | 'status' | 'created_at';
type SortDirection = 'asc' | 'desc';

export function TaskTable({ tasks, onTaskClick }: TaskTableProps) {
  const [viewMode, setViewMode] = useState<'rows' | 'columns'>('rows');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'todo':
        return 'todo-badge';
      case 'in-progress':
        return 'inprogress-badge';
      case 'review':
        return 'review-badge';
      case 'completed':
        return 'completed-badge';
      case 'closed':
        return 'closed-badge';
      default:
        return 'todo-badge';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in-progress':
        return 'In Progress';
      case 'review':
        return 'Review';
      case 'completed':
        return 'Completed';
      case 'closed':
        return 'Closed';
      default:
        return 'To Do';
    }
  };

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    // Create a new task object with the updated status
    const updatedTask = {
      ...task,
      status: newStatus,
    };

    // Call the onTaskClick handler with the updated task
    onTaskClick(updatedTask);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ArrowUp size={16} />
    ) : (
      <ArrowDown size={16} />
    );
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortField === 'title') {
      const comparison = a.title.localeCompare(b.title);
      return sortDirection === 'asc' ? comparison : -comparison;
    } else if (sortField === 'status') {
      const comparison = a.status.localeCompare(b.status);
      return sortDirection === 'asc' ? comparison : -comparison;
    } else if (sortField === 'created_at') {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      const comparison = dateA - dateB;
      return sortDirection === 'asc' ? comparison : -comparison;
    }
    return 0;
  });

  const renderRowsView = () => (
    <div className="w-full">
      <Table className="w-full table-fixed border-collapse">
        <TableHeader>
          <TableRow>
            <TableHead
              className="w-[160px] cursor-pointer"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center">
                Status {getSortIcon('status')}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              style={{ width: '60%' }}
              onClick={() => handleSort('title')}
            >
              <div className="flex items-center">
                Task {getSortIcon('title')}
              </div>
            </TableHead>
            <TableHead
              className="w-[140px] text-right cursor-pointer"
              onClick={() => handleSort('created_at')}
            >
              <div className="flex items-center justify-end">
                Created {getSortIcon('created_at')}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTasks.map((task) => (
            <TableRow
              key={task.id}
              className="cursor-pointer hover:bg-muted/60"
              onClick={() => onTaskClick(task)}
            >
              <TableCell className="w-[160px] align-top">
                <ContextMenu>
                  <ContextMenuTrigger className="block w-full">
                    <span
                      className={`status-badge ${getStatusBadgeClass(
                        task.status
                      )}`}
                    >
                      {getStatusText(task.status)}
                    </span>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem
                      className={
                        task.status === 'todo'
                          ? 'bg-accent text-accent-foreground'
                          : ''
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(task, 'todo');
                      }}
                    >
                      To Do
                    </ContextMenuItem>
                    <ContextMenuItem
                      className={
                        task.status === 'in-progress'
                          ? 'bg-accent text-accent-foreground'
                          : ''
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(task, 'in-progress');
                      }}
                    >
                      In Progress
                    </ContextMenuItem>
                    <ContextMenuItem
                      className={
                        task.status === 'review'
                          ? 'bg-accent text-accent-foreground'
                          : ''
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(task, 'review');
                      }}
                    >
                      Review
                    </ContextMenuItem>
                    <ContextMenuItem
                      className={
                        task.status === 'completed'
                          ? 'bg-accent text-accent-foreground'
                          : ''
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(task, 'completed');
                      }}
                    >
                      Completed
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem
                      className={
                        task.status === 'closed'
                          ? 'bg-accent text-accent-foreground'
                          : ''
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(task, 'closed');
                      }}
                    >
                      Closed
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </TableCell>
              <TableCell className="align-top" style={{ width: '60%' }}>
                <div>
                  <h4 className="font-medium mb-1 text-left">{task.title}</h4>
                  {task.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1 text-left">
                      {task.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm text-right w-[140px] align-top">
                {formatDistanceToNow(new Date(task.created_at), {
                  addSuffix: true,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderColumnsView = () => {
    const statuses = ['todo', 'in-progress', 'review', 'completed', 'closed'];

    return (
      <div className="w-full">
        <Table className="w-full table-fixed border-collapse">
          <TableHeader>
            <TableRow>
              <TableHead
                className="w-[300px] cursor-pointer"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center">
                  Task {getSortIcon('title')}
                </div>
              </TableHead>
              {statuses.map((status) => (
                <TableHead key={status} className="w-[100px] text-center">
                  <span
                    className={`status-badge ${getStatusBadgeClass(status)}`}
                  >
                    {getStatusText(status)}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="w-[300px] align-top">
                  <div
                    className="cursor-pointer text-left"
                    onClick={() => onTaskClick(task)}
                  >
                    <h4 className="font-medium mb-1">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {task.description}
                      </p>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(task.created_at), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </TableCell>
                {statuses.map((status) => (
                  <TableCell
                    key={status}
                    className="w-[100px] text-center align-middle"
                  >
                    <ContextMenu>
                      <ContextMenuTrigger className="block w-full h-full">
                        {task.status === status ? (
                          <span className="inline-flex items-center justify-center text-primary text-lg">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center text-muted-foreground">
                            &nbsp;
                          </span>
                        )}
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem
                          className={
                            task.status === 'todo'
                              ? 'bg-accent text-accent-foreground'
                              : ''
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(task, 'todo');
                          }}
                        >
                          To Do
                        </ContextMenuItem>
                        <ContextMenuItem
                          className={
                            task.status === 'in-progress'
                              ? 'bg-accent text-accent-foreground'
                              : ''
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(task, 'in-progress');
                          }}
                        >
                          In Progress
                        </ContextMenuItem>
                        <ContextMenuItem
                          className={
                            task.status === 'review'
                              ? 'bg-accent text-accent-foreground'
                              : ''
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(task, 'review');
                          }}
                        >
                          Review
                        </ContextMenuItem>
                        <ContextMenuItem
                          className={
                            task.status === 'completed'
                              ? 'bg-accent text-accent-foreground'
                              : ''
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(task, 'completed');
                          }}
                        >
                          Completed
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem
                          className={
                            task.status === 'closed'
                              ? 'bg-accent text-accent-foreground'
                              : ''
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(task, 'closed');
                          }}
                        >
                          Closed
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value) =>
            value && setViewMode(value as 'rows' | 'columns')
          }
          className="border rounded-md"
        >
          <ToggleGroupItem value="rows" aria-label="Row view">
            <Rows3 size={16} />
          </ToggleGroupItem>
          <ToggleGroupItem value="columns" aria-label="Column view">
            <Columns3 size={16} />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="overflow-x-auto">
        {viewMode === 'rows' ? renderRowsView() : renderColumnsView()}
      </div>
    </div>
  );
}
