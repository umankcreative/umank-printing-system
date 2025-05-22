-- Create ingredients table
CREATE TABLE ingredients (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit VARCHAR(50) NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    branch_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create recipe_ingredients table (junction table for products and ingredients)
CREATE TABLE recipe_ingredients (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    ingredient_id VARCHAR(36) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients (id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_ingredient (product_id, ingredient_id)
);

-- Create task_templates table for ingredients
CREATE TABLE ingredient_task_templates (
    id VARCHAR(36) PRIMARY KEY,
    ingredient_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority ENUM(
        'low',
        'medium',
        'high',
        'urgent'
    ) DEFAULT 'medium',
    estimated_time INT, -- in minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients (id) ON DELETE CASCADE
);

-- Add indexes for better performance
CREATE INDEX idx_ingredients_branch ON ingredients (branch_id);

CREATE INDEX idx_recipe_ingredients_product ON recipe_ingredients (product_id);

CREATE INDEX idx_recipe_ingredients_ingredient ON recipe_ingredients (ingredient_id);

CREATE INDEX idx_ingredient_task_templates ON ingredient_task_templates (ingredient_id);

-- Insert sample ingredients
INSERT INTO
    ingredients (
        id,
        name,
        description,
        unit,
        price_per_unit,
        stock,
        branch_id
    )
VALUES (
        '1',
        'Skiblat Polos',
        'Halaman Lapisan Yasin sebelum dijilid Hard Cover',
        'Lembar',
        500,
        1000,
        '1'
    ),
    (
        '2',
        'Kertas AP 210 A3+',
        'Kertas Art Paper 210 ukuran A3+',
        'Lembar',
        2000,
        10000,
        '1'
    ),
    (
        '3',
        'Cetak A3+ Full Color',
        'Cetak Full Color di kertas ukuran A3',
        'Kali',
        5000,
        100000,
        '1'
    ),
    (
        '4',
        'Yasin HVS 128 Putra Bahari',
        'Buku Yasin Bahan HVS 128 halaman',
        'Buah',
        3500,
        1000,
        '1'
    ),
    (
        '5',
        'Sudut Gold',
        'Ornamen Sudut Gold',
        'Buah',
        250,
        100000,
        '1'
    );

-- Insert sample task templates for ingredients
INSERT INTO
    ingredient_task_templates (
        id,
        ingredient_id,
        title,
        description,
        priority,
        estimated_time
    )
VALUES (
        '1',
        '1',
        'Pasang Skiblat ke Yasin',
        'Lem Skiblat ke Yasin',
        'medium',
        2
    ),
    (
        '2',
        '9',
        'Cetak Full Color',
        'Cetak full color di kertas AP 230',
        'high',
        5
    ),
    (
        '3',
        '10',
        'Cetak UV',
        'Cetak dengan tinta UV',
        'high',
        10
    );