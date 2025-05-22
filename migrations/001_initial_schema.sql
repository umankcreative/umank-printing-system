-- Create product_categories table
CREATE TABLE product_categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create paper_options table
CREATE TABLE paper_options (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create paper_grammars table
CREATE TABLE paper_grammars (
    id VARCHAR(36) PRIMARY KEY,
    paper_option_id VARCHAR(36) NOT NULL,
    grammar VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (paper_option_id) REFERENCES paper_options (id) ON DELETE CASCADE,
    UNIQUE KEY unique_paper_grammar (paper_option_id, grammar)
);

-- Create products table
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id VARCHAR(36),
    thumbnail_id VARCHAR(255),
    cost_price DECIMAL(10, 2) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    min_order INT DEFAULT 1,
    stock INT DEFAULT 0,
    branch_id VARCHAR(36) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    paper_type VARCHAR(255),
    paper_grammar VARCHAR(50),
    print_type ENUM('Black & White', 'Full Color'),
    finishing_type ENUM(
        'Tanpa Finishing',
        'Doff',
        'Glossy',
        'Lainnya'
    ),
    custom_finishing VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES product_categories (id)
);

-- Create product_images table
CREATE TABLE product_images (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

-- Insert initial product categories
INSERT INTO
    product_categories (id, name)
VALUES ('1', 'Kartu Nama'),
    ('2', 'Brosur'),
    ('3', 'Flyer'),
    ('4', 'Poster'),
    ('5', 'Banner'),
    ('6', 'Stiker'),
    ('7', 'Undangan'),
    ('8', 'Kalender'),
    ('9', 'Amplop'),
    ('10', 'Nota'),
    ('11', 'Kop Surat'),
    ('12', 'Yasin'),
    ('13', 'Lainnya');

-- Insert initial paper options
INSERT INTO
    paper_options (id, name)
VALUES ('1', 'Art Paper'),
    ('2', 'Art Carton'),
    ('3', 'Ivory'),
    ('4', 'Dupleks'),
    ('5', 'HVS'),
    ('6', 'Samson Kraft'),
    ('7', 'BW'),
    ('8', 'Yupo'),
    ('9', 'Concorde'),
    ('10', 'Mohawk Eggshell'),
    ('11', 'Linen Jepang'),
    ('12', 'Yellow Board'),
    ('13', 'Fancy Paper'),
    ('14', 'Corrugated'),
    ('15', 'NCR');

-- Insert paper grammars for Art Paper
INSERT INTO
    paper_grammars (paper_option_id, grammar)
VALUES ('1', '85gr'),
    ('1', '100gr'),
    ('1', '115gr'),
    ('1', '120gr'),
    ('1', '150gr');

-- Insert paper grammars for Art Carton
INSERT INTO
    paper_grammars (paper_option_id, grammar)
VALUES ('2', '190gr'),
    ('2', '210gr'),
    ('2', '230gr'),
    ('2', '260gr'),
    ('2', '310gr'),
    ('2', '350gr'),
    ('2', '400gr');

-- Insert paper grammars for Ivory
INSERT INTO
    paper_grammars (paper_option_id, grammar)
VALUES ('3', '210gr'),
    ('3', '230gr'),
    ('3', '250gr'),
    ('3', '310gr'),
    ('3', '400gr');

-- Add indexes for better performance
CREATE INDEX idx_products_category ON products (category_id);

CREATE INDEX idx_products_branch ON products (branch_id);

CREATE INDEX idx_paper_grammars_option ON paper_grammars (paper_option_id);

CREATE INDEX idx_product_images_product ON product_images (product_id);