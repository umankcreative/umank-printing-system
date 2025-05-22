-- Create form_templates table
CREATE TABLE form_templates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES product_categories (id)
);

-- Create form_elements table
CREATE TABLE form_elements (
    id VARCHAR(36) PRIMARY KEY,
    template_id VARCHAR(36) NOT NULL,
    type ENUM(
        'input',
        'textarea',
        'select',
        'checkbox',
        'radio',
        'number',
        'date',
        'file',
        'email',
        'phone'
    ) NOT NULL,
    label VARCHAR(255) NOT NULL,
    placeholder VARCHAR(255),
    required BOOLEAN DEFAULT false,
    default_value TEXT,
    file_accept VARCHAR(255),
    validation_pattern VARCHAR(255),
    validation_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES form_templates (id) ON DELETE CASCADE
);

-- Create form_element_options table
CREATE TABLE form_element_options (
    id VARCHAR(36) PRIMARY KEY,
    element_id VARCHAR(36) NOT NULL,
    label VARCHAR(255) NOT NULL,
    value VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (element_id) REFERENCES form_elements (id) ON DELETE CASCADE
);

-- Add indexes for better performance
CREATE INDEX idx_form_templates_category ON form_templates (category_id);

CREATE INDEX idx_form_elements_template ON form_elements (template_id);

CREATE INDEX idx_form_element_options_element ON form_element_options (element_id);

-- Insert sample form templates from formTemplates.ts
INSERT INTO
    form_templates (
        id,
        name,
        description,
        category_id
    )
VALUES (
        '1',
        'Form Pemesanan Kartu Nama',
        'Form untuk pemesanan produk kategori Kartu Nama',
        '1'
    ),
    (
        '2',
        'Form Pemesanan Yasin',
        'Form untuk pemesanan produk kategori Yasin',
        '12'
    );

-- Insert sample form elements for Kartu Nama template
INSERT INTO form_elements (id, template_id, type, label, placeholder, required)
VALUES
('1', '1', 'input', 'Nama', 'Masukkan nama lengkap', true),
('2', '1', 'input', 'Jabatan', 'Masukkan jabatan', true),
('3', '1', 'input', 'Perusahaan', 'Masukkan nama perusahaan', true),
('4', '1', 'email', 'Email', 'Masukkan email', true),
('5', '1', 'phone', 'Nomor Handphone', 'Masukkan nomor handphone', true),
('6', '1', 'textarea', 'Alamat', 'Masukkan alamat lengkap', true),
('7', '1', 'select', 'Jenis Desain', NULL, true);

-- Insert options for Jenis Desain select
INSERT INTO
    form_element_options (element_id, label, value)
VALUES ('7', 'Desain Baru', 'new'),
    (
        '7',
        'Gunakan Desain Lama',
        'existing'
    );

-- Create form_submissions table
CREATE TABLE form_submissions (
    id VARCHAR(36) PRIMARY KEY,
    template_id VARCHAR(36) NOT NULL,
    customer_id VARCHAR(36),
    order_id VARCHAR(36),
    status ENUM(
        'draft',
        'submitted',
        'processing',
        'completed',
        'cancelled'
    ) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES form_templates (id),
    FOREIGN KEY (customer_id) REFERENCES customers (id),
    FOREIGN KEY (order_id) REFERENCES orders (id)
);

-- Create form_submission_values table
CREATE TABLE form_submission_values (
    id VARCHAR(36) PRIMARY KEY,
    submission_id VARCHAR(36) NOT NULL,
    element_id VARCHAR(36) NOT NULL,
    value TEXT,
    file_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES form_submissions (id) ON DELETE CASCADE,
    FOREIGN KEY (element_id) REFERENCES form_elements (id)
);

-- Add indexes for form submissions
CREATE INDEX idx_form_submissions_template ON form_submissions (template_id);

CREATE INDEX idx_form_submissions_customer ON form_submissions (customer_id);

CREATE INDEX idx_form_submissions_order ON form_submissions (order_id);

CREATE INDEX idx_form_submissions_status ON form_submissions (status);

CREATE INDEX idx_form_submission_values_submission ON form_submission_values (submission_id);

CREATE INDEX idx_form_submission_values_element ON form_submission_values (element_id);