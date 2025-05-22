-- Create tasks table
CREATE TABLE tasks (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM(
        'pending',
        'todo',
        'in-progress',
        'review',
        'completed',
        'closed',
        'blocked'
    ) DEFAULT 'pending',
    priority ENUM(
        'low',
        'medium',
        'high',
        'urgent'
    ) DEFAULT 'medium',
    category ENUM(
        'preparation',
        'cooking',
        'service',
        'cleaning',
        'other'
    ) DEFAULT 'other',
    deadline TIMESTAMP,
    assignee VARCHAR(36),
    ingredient_id VARCHAR(36),
    order_id VARCHAR(36),
    parent_task_id VARCHAR(36),
    estimated_time INT, -- in minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients (id),
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (parent_task_id) REFERENCES tasks (id)
);

-- Create timeline_events table
CREATE TABLE timeline_events (
    id VARCHAR(36) PRIMARY KEY,
    task_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM(
        'pending',
        'todo',
        'in-progress',
        'review',
        'completed',
        'closed',
        'blocked'
    ),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_url VARCHAR(255),
    file_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
);

-- Create timeline_responses table
CREATE TABLE timeline_responses (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    author VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_url VARCHAR(255),
    file_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES timeline_events (id) ON DELETE CASCADE
);

-- Create task_responses table
CREATE TABLE task_responses (
    id VARCHAR(36) PRIMARY KEY,
    task_id VARCHAR(36) NOT NULL,
    author VARCHAR(255),
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
);

-- Create task_templates table
CREATE TABLE task_templates (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority ENUM(
        'low',
        'medium',
        'high',
        'urgent'
    ) DEFAULT 'medium',
    category ENUM(
        'preparation',
        'cooking',
        'service',
        'cleaning',
        'other'
    ) DEFAULT 'other',
    estimated_time INT, -- in minutes
    product_category_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_category_id) REFERENCES product_categories (id)
);

-- Create task_assignments table
CREATE TABLE task_assignments (
    id VARCHAR(36) PRIMARY KEY,
    task_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    assigned_by VARCHAR(36) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM(
        'pending',
        'accepted',
        'rejected',
        'completed'
    ) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
);

-- Add indexes for better performance
CREATE INDEX idx_tasks_ingredient ON tasks (ingredient_id);

CREATE INDEX idx_tasks_order ON tasks (order_id);

CREATE INDEX idx_tasks_parent ON tasks (parent_task_id);

CREATE INDEX idx_tasks_status ON tasks (status);

CREATE INDEX idx_timeline_events_task ON timeline_events (task_id);

CREATE INDEX idx_timeline_responses_event ON timeline_responses (event_id);

CREATE INDEX idx_task_responses_task ON task_responses (task_id);

-- Add indexes for task templates and assignments
CREATE INDEX idx_task_templates_category ON task_templates (product_category_id);

CREATE INDEX idx_task_assignments_task ON task_assignments (task_id);

CREATE INDEX idx_task_assignments_user ON task_assignments (user_id);

CREATE INDEX idx_task_assignments_status ON task_assignments (status);