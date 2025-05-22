-- Create branches table
CREATE TABLE branches (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM(
        'admin',
        'manager toko',
        'admin gudang',
        'kasir'
    ) NOT NULL,
    status ENUM(
        'active',
        'inactive',
        'suspended'
    ) DEFAULT 'active',
    branch_id VARCHAR(36) NOT NULL,
    avatar VARCHAR(255),
    last_active TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches (id)
);

-- Create permissions table
CREATE TABLE permissions (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    module VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create role_permissions table
CREATE TABLE role_permissions (
    role ENUM(
        'admin',
        'manager toko',
        'admin gudang',
        'kasir'
    ) NOT NULL,
    permission_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (role, permission_id),
    FOREIGN KEY (permission_id) REFERENCES permissions (id)
);

-- Add indexes
CREATE INDEX idx_users_branch ON users (branch_id);

CREATE INDEX idx_users_role ON users (role);

CREATE INDEX idx_users_status ON users (status);

CREATE INDEX idx_role_permissions_role ON role_permissions (role);

-- Insert initial branches
INSERT INTO
    branches (id, name, location, is_active)
VALUES (
        '1',
        'Umank Central',
        'Jakarta Pusat',
        true
    ),
    (
        '2',
        'Umank South',
        'Jakarta Selatan',
        true
    ),
    (
        '3',
        'Umank East',
        'Jakarta Timur',
        true
    ),
    (
        '4',
        'Umank Bandung',
        'Bandung',
        true
    ),
    (
        '5',
        'Umank Surabaya',
        'Surabaya',
        false
    );

-- Insert initial permissions
INSERT INTO
    permissions (id, name, description, module)
VALUES (
        'p1',
        'view_users',
        'View all users',
        'users'
    ),
    (
        'p2',
        'create_users',
        'Create new users',
        'users'
    ),
    (
        'p3',
        'edit_users',
        'Edit existing users',
        'users'
    ),
    (
        'p4',
        'delete_users',
        'Delete users',
        'users'
    ),
    (
        'p5',
        'manage_roles',
        'Manage user roles',
        'users'
    ),
    (
        'p6',
        'view_inventory',
        'View inventory',
        'inventory'
    ),
    (
        'p7',
        'manage_inventory',
        'Manage inventory',
        'inventory'
    ),
    (
        'p8',
        'view_sales',
        'View sales',
        'sales'
    ),
    (
        'p9',
        'manage_sales',
        'Manage sales',
        'sales'
    ),
    (
        'p10',
        'view_reports',
        'View reports',
        'reports'
    ),
    (
        'p11',
        'view_branch',
        'View branch data',
        'branch'
    ),
    (
        'p12',
        'manage_branch',
        'Manage branch',
        'branch'
    );