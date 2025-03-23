// Product Service
// Handles product data storage, retrieval, and manipulation

import { getCategoryById } from './categoryService';

// Initial sample products data
const initialProducts = [
  {
    id: 'iphone-13',
    name: 'iPhone 13',
    description: 'Apple iPhone 13 with 128GB storage',
    price: 799.99,
    cost: 600.00,
    sku: 'APL-IP13-128',
    barcode: '123456789012',
    category: 'smartphones',
    vendor: 'apple',
    stock: 15,
    lowStockThreshold: 5,
    taxable: true,
    status: 'active',
    images: []
  },
  {
    id: 'samsung-s21',
    name: 'Samsung Galaxy S21',
    description: 'Samsung Galaxy S21 with 128GB storage',
    price: 699.99,
    cost: 500.00,
    sku: 'SAM-S21-128',
    barcode: '223456789012',
    category: 'smartphones',
    vendor: 'samsung',
    stock: 10,
    lowStockThreshold: 3,
    taxable: true,
    status: 'active',
    images: []
  },
  {
    id: 'macbook-air',
    name: 'MacBook Air M1',
    description: 'Apple MacBook Air with M1 chip and 256GB SSD',
    price: 999.99,
    cost: 800.00,
    sku: 'APL-MBA-M1',
    barcode: '323456789012',
    category: 'laptops',
    vendor: 'apple',
    stock: 8,
    lowStockThreshold: 2,
    taxable: true,
    status: 'active',
    images: []
  },
  {
    id: 'dell-xps-13',
    name: 'Dell XPS 13',
    description: 'Dell XPS 13 with Intel Core i7 and 512GB SSD',
    price: 1299.99,
    cost: 1000.00,
    sku: 'DEL-XPS13',
    barcode: '423456789012',
    category: 'laptops',
    vendor: 'dell',
    stock: 5,
    lowStockThreshold: 2,
    taxable: true,
    status: 'active',
    images: []
  },
  {
    id: 'logitech-mx-master',
    name: 'Logitech MX Master 3',
    description: 'Advanced wireless mouse for productivity',
    price: 99.99,
    cost: 60.00,
    sku: 'LOG-MXM3',
    barcode: '523456789012',
    category: 'accessories',
    vendor: 'logitech',
    stock: 20,
    lowStockThreshold: 5,
    taxable: true,
    status: 'active',
    images: []
  },
  {
    id: 'sony-wh1000xm4',
    name: 'Sony WH-1000XM4',
    description: 'Wireless noise-canceling headphones',
    price: 349.99,
    cost: 250.00,
    sku: 'SNY-WH1000XM4',
    barcode: '623456789012',
    category: 'audio',
    vendor: 'sony',
    stock: 12,
    lowStockThreshold: 3,
    taxable: true,
    status: 'active',
    images: []
  },
  {
    id: 'nintendo-switch',
    name: 'Nintendo Switch',
    description: 'Nintendo Switch gaming console',
    price: 299.99,
    cost: 220.00,
    sku: 'NIN-SWITCH',
    barcode: '723456789012',
    category: 'gaming',
    vendor: 'nintendo',
    stock: 7,
    lowStockThreshold: 2,
    taxable: true,
    status: 'active',
    images: []
  }
];

// Initialize products from localStorage or use initial data
const initializeProducts = () => {
  const storedProducts = localStorage.getItem('products');
  if (storedProducts) {
    return JSON.parse(storedProducts);
  }
  
  // If no stored products, save initial data and return it
  localStorage.setItem('products', JSON.stringify(initialProducts));
  return initialProducts;
};

// Get all products
export const getProducts = () => {
  return initializeProducts();
};

// Get product by ID
export const getProductById = (id) => {
  const products = getProducts();
  return products.find(product => product.id === id);
};

// Add new product
export const addProduct = (productData) => {
  const products = getProducts();
  
  // Generate a simple ID from the name
  const newId = productData.name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  // Create new product object
  const newProduct = {
    id: newId,
    ...productData,
    stock: parseInt(productData.stock) || 0,
    lowStockThreshold: parseInt(productData.lowStockThreshold) || 0,
    price: parseFloat(productData.price) || 0,
    cost: parseFloat(productData.cost) || 0,
    status: productData.status || 'active',
    images: productData.images || []
  };
  
  // Add to products array
  products.push(newProduct);
  
  // Save to localStorage
  localStorage.setItem('products', JSON.stringify(products));
  
  return newProduct;
};

// Update existing product
export const updateProduct = (id, productData) => {
  const products = getProducts();
  
  // Find product index
  const productIndex = products.findIndex(product => product.id === id);
  
  if (productIndex === -1) {
    throw new Error(`Product with ID ${id} not found`);
  }
  
  // Update product
  const updatedProduct = {
    ...products[productIndex],
    ...productData,
    stock: parseInt(productData.stock) || products[productIndex].stock,
    lowStockThreshold: parseInt(productData.lowStockThreshold) || products[productIndex].lowStockThreshold,
    price: parseFloat(productData.price) || products[productIndex].price,
    cost: parseFloat(productData.cost) || products[productIndex].cost
  };
  
  products[productIndex] = updatedProduct;
  
  // Save to localStorage
  localStorage.setItem('products', JSON.stringify(products));
  
  return updatedProduct;
};

// Delete product
export const deleteProduct = (id) => {
  const products = getProducts();
  
  // Filter out the product to delete
  const updatedProducts = products.filter(product => product.id !== id);
  
  // Save to localStorage
  localStorage.setItem('products', JSON.stringify(updatedProducts));
  
  return true;
};

// Update inventory stock
export const updateInventoryStock = (productId, quantityChange) => {
  const products = getProducts();
  
  // Find product index
  const productIndex = products.findIndex(product => product.id === productId);
  
  if (productIndex === -1) {
    console.error(`Product with ID ${productId} not found`);
    return false;
  }
  
  // Get current stock
  const currentStock = products[productIndex].stock || 0;
  
  // Calculate new stock
  const newStock = currentStock + quantityChange;
  
  // Update product stock
  products[productIndex].stock = Math.max(0, newStock); // Ensure stock doesn't go below 0
  
  // Save to localStorage
  localStorage.setItem('products', JSON.stringify(products));
  
  return true;
};

// Get low stock products
export const getLowStockProducts = () => {
  const products = getProducts();
  
  return products.filter(product => 
    product.stock <= product.lowStockThreshold && 
    product.status === 'active'
  );
};

// Get product count
export const getProductCount = () => {
  const products = getProducts();
  return products.length;
};

// Get products by category
export const getProductsByCategory = (categoryId) => {
  const products = getProducts();
  return products.filter(product => product.category === categoryId);
};

// Get products by vendor
export const getProductsByVendor = (vendorId) => {
  const products = getProducts();
  return products.filter(product => product.vendor === vendorId);
};

// Get total inventory value
export const getTotalInventoryValue = () => {
  const products = getProducts();
  
  return products.reduce((total, product) => {
    // Ensure we have valid numbers
    const cost = parseFloat(product.cost) || 0;
    const stock = parseInt(product.stock) || 0;
    return total + (cost * stock);
  }, 0);
};

// Get total retail value
export const getTotalRetailValue = () => {
  const products = getProducts();
  
  return products.reduce((total, product) => {
    // Ensure we have valid numbers
    const price = parseFloat(product.price) || 0;
    const stock = parseInt(product.stock) || 0;
    return total + (price * stock);
  }, 0);
};

// Calculate inventory value for a specific product
export const calculateInventoryValue = (product) => {
  if (!product) return 0;
  const cost = parseFloat(product.cost) || 0;
  const stock = parseInt(product.stock) || 0;
  return cost * stock;
};

// Filter products based on criteria
export const filterProducts = (filters = {}) => {
  const products = getProducts();
  
  return products.filter(product => {
    // Filter by status
    if (filters.status && product.status !== filters.status) {
      return false;
    }
    
    // Filter by category
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    
    // Filter by vendor
    if (filters.vendor && product.vendor !== filters.vendor) {
      return false;
    }
    
    // Filter by price range
    if (filters.minPrice && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && product.price > filters.maxPrice) {
      return false;
    }
    
    // Filter by stock level
    if (filters.inStock === true && product.stock <= 0) {
      return false;
    }
    if (filters.lowStock === true && product.stock > product.lowStockThreshold) {
      return false;
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(term);
      const descMatch = product.description && product.description.toLowerCase().includes(term);
      const skuMatch = product.sku && product.sku.toLowerCase().includes(term);
      const barcodeMatch = product.barcode && product.barcode.toLowerCase().includes(term);
      
      if (!nameMatch && !descMatch && !skuMatch && !barcodeMatch) {
        return false;
      }
    }
    
    return true;
  });
};

// Search products
export const searchProducts = (query) => {
  if (!query) return [];
  
  const products = getProducts();
  const searchTerm = query.toLowerCase();
  
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    (product.description && product.description.toLowerCase().includes(searchTerm)) ||
    (product.sku && product.sku.toLowerCase().includes(searchTerm)) ||
    (product.barcode && product.barcode.toLowerCase().includes(searchTerm))
  );
};

// Re-export getCategoryById for convenience
export { getCategoryById };
