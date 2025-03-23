import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FiArrowLeft, FiUpload, FiInfo, FiEdit2, FiPlus, FiX, FiPrinter } from 'react-icons/fi';
import { getProductById, updateProduct } from '../services/productService';
import { getCategories, getCategoryById } from '../services/categoryService';
import { getVendors, getVendorById } from '../services/vendorService';
import CategoryModal from '../components/CategoryModal';
import VendorModal from '../components/VendorModal';
import PrintLabelModal from '../components/PrintLabelModal';

const Container = styled.div`
  padding: 12px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  
  .back-button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    color: var(--primary-color);
    font-weight: 500;
    cursor: pointer;
    margin-right: 12px;
    text-decoration: none;
    
    svg {
      margin-right: 6px;
    }
  }
  
  h1 {
    font-size: 20px;
    font-weight: 600;
  }
`;

const FormLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 12px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 12px;
  margin-bottom: 12px;
  
  .section-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
    color: #333;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 10px;
  
  label {
    display: block;
    margin-bottom: 4px;
    font-weight: 500;
    color: #555;
    font-size: 12px;
  }
  
  input[type="text"],
  input[type="number"],
  textarea,
  select {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 13px;
    transition: border-color 0.2s;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color, #0066ff);
    }
  }
  
  textarea {
    min-height: 60px;
    resize: vertical;
  }
  
  .input-with-action {
    display: flex;
    gap: 6px;
    
    input, select {
      flex: 1;
    }
    
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 0 8px;
      color: var(--primary-color, #0066ff);
      cursor: pointer;
      font-size: 12px;
      
      &:hover {
        border-color: var(--primary-color, #0066ff);
      }
      
      svg {
        margin-right: 3px;
        font-size: 12px;
      }
    }
  }
  
  .checkbox-group {
    display: flex;
    align-items: center;
    margin-top: 4px;
    font-size: 12px;
    
    input[type="checkbox"] {
      margin-right: 6px;
    }
  }
  
  .helper-text {
    font-size: 11px;
    color: #777;
    margin-top: 3px;
  }
  
  .input-group {
    display: flex;
    align-items: center;
    
    .currency-symbol {
      margin-right: 6px;
      color: #555;
    }
    
    .percentage-symbol {
      margin-left: 6px;
      color: #555.percentage-symbol {
      margin-left: 6px;
      color: #555;
    }
  }
`;

// Simplified pricing layout
const PricingSection = styled.div`
  .pricing-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 8px;
  }
  
  .pricing-row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  
  .form-group {
    margin-bottom: 0;
    
    label {
      display: block;
      margin-bottom: 4px;
      font-weight: 500;
      color: #555;
      font-size: 12px;
    }
    
    input {
      width: 100%;
      padding: 6px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
    }
    
    .percentage-input {
      position: relative;
      
      input {
        padding-right: 20px;
      }
      
      .percentage-symbol {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        color: #555;
        font-size: 12px;
      }
    }
  }
`;

const MediaUpload = styled.div`
  border: 1px dashed #ddd;
  border-radius: 6px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  
  &:hover {
    border-color: var(--primary-color, #0066ff);
  }
  
  .upload-icon {
    font-size: 20px;
    color: #999;
    margin-bottom: 8px;
  }
  
  .upload-text {
    font-weight: 500;
    color: #555;
    margin-bottom: 4px;
    font-size: 12px;
  }
  
  .upload-hint {
    font-size: 11px;
    color: #999;
  }

  input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
`;

const ImagePreview = styled.div`
  position: relative;
  width: 100%;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 10px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  .remove-image {
    position: absolute;
    top: 6px;
    right: 6px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    
    &:hover {
      background: rgba(0, 0, 0, 0.7);
    }
  }
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0069d9;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.secondary ? 'white' : '#007bff'};
  color: ${props => props.secondary ? '#333' : 'white'};
  border: ${props => props.secondary ? '1px solid #ddd' : 'none'};
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 10px;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: ${props => props.secondary ? '#f5f5f5' : '#0069d9'};
  }
`;

const SuccessMessage = styled.div`
  background-color: #e6f7e6;
  color: #2e7d32;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 12px;
  font-weight: 500;
  font-size: 13px;
`;

// Compact right side sections
const CompactSection = styled(FormSection)`
  padding: 10px;
  
  .section-title {
    font-size: 13px;
    margin-bottom: 8px;
  }
  
  ${FormGroup} {
    margin-bottom: 8px;
  }
`;

// Combined right side sections
const CombinedSection = styled(FormSection)`
  .section-divider {
    border-top: 1px solid #eee;
    margin: 10px 0;
    padding-top: 10px;
  }
`;

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [trackQuantity, setTrackQuantity] = useState(true);
  const [hasSKU, setHasSKU] = useState(true);
  const [isService, setIsService] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showPrintLabelModal, setShowPrintLabelModal] = useState(false);
  const fileInputRef = useRef(null);
  
  // Category and vendor state
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    vendor: '',
    tags: '',
    price: '',
    minPrice: '',
    cost: '',
    status: 'active',
    condition: 'new',
    quantity: '0',
    minStock: '5',
    sku: '',
    barcode: '',
    category: ''
  });
  
  // Load product data, categories and vendors on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load product data
        const product = getProductById(id);
        
        if (!product) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        
        // Set form data from product
        setFormData({
          title: product.name || '',
          description: product.description || '',
          vendor: product.vendor || '',
          tags: product.tags ? product.tags.join(', ') : '',
          price: product.price ? product.price.toString() : '',
          minPrice: product.minPrice ? product.minPrice.toString() : '',
          cost: product.cost ? product.cost.toString() : '',
          status: product.status || 'active',
          condition: product.condition || 'new',
          quantity: product.inventory !== null ? product.inventory.toString() : '0',
          minStock: product.minStock ? product.minStock.toString() : '5',
          sku: product.sku || '',
          barcode: product.barcode || '',
          category: product.category || ''
        });
        
        // Set other state based on product data
        setTrackQuantity(product.inventory !== null);
        setHasSKU(product.sku !== null || product.barcode !== null);
        setIsService(product.isService || false);
        setImagePreview(product.image);
        
        // Load categories and vendors
        loadCategories();
        loadVendors();
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading product:', error);
        setNotFound(true);
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]);
  
  const loadCategories = () => {
    const categoriesData = getCategories();
    setCategories(categoriesData);
  };
  
  const loadVendors = () => {
    const vendorsData = getVendors();
    setVendors(vendorsData);
  };
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };
  
  const calculateProfit = () => {
    const price = parseFloat(formData.price) || 0;
    const cost = parseFloat(formData.cost) || 0;
    return (price - cost).toFixed(2);
  };
  
  const calculateMargin = () => {
    const price = parseFloat(formData.price) || 0;
    const cost = parseFloat(formData.cost) || 0;
    if (price === 0) return 0;
    return Math.round(((price - cost) / price) * 100);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare product data from form
      const productData = {
        id,
        name: formData.title,
        description: formData.description,
        vendor: formData.vendor,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        price: parseFloat(formData.price) || 0,
        minPrice: parseFloat(formData.minPrice) || 0,
        cost: parseFloat(formData.cost) || 0,
        status: formData.status,
        condition: formData.condition,
        inventory: trackQuantity ? parseInt(formData.quantity, 10) || 0 : null,
        minStock: parseInt(formData.minStock, 10) || 5,
        sku: hasSKU ? formData.sku : null,
        barcode: hasSKU ? formData.barcode : null,
        category: formData.category,
        isService: isService,
        image: imagePreview
      };
      
      // Update product
      updateProduct(productData);
      
      // Show success message
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };
  
  const handleAddCategory = () => {
    setShowCategoryModal(true);
  };
  
  const handleAddVendor = () => {
    setShowVendorModal(true);
  };
  
  const handleCategoryAdded = (newCategory) => {
    loadCategories();
    setFormData({
      ...formData,
      category: newCategory.id
    });
    setShowCategoryModal(false);
  };
  
  const handleVendorAdded = (newVendor) => {
    loadVendors();
    setFormData({
      ...formData,
      vendor: newVendor.id
    });
    setShowVendorModal(false);
  };
  
  const handlePrintLabel = () => {
    setShowPrintLabelModal(true);
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (notFound) {
    return (
      <Container>
        <Header>
          <Link to="/products" className="back-button">
            <FiArrowLeft /> Back to Products
          </Link>
          <h1>Product Not Found</h1>
        </Header>
        <p>The product you are looking for does not exist or has been deleted.</p>
      </Container>
    );
  }
  
  return (
    <Container>
      <Header>
        <Link to="/products" className="back-button">
          <FiArrowLeft /> Back to Products
        </Link>
        <h1>Edit Product</h1>
      </Header>
      
      {success && (
        <SuccessMessage>
          Product updated successfully!
        </SuccessMessage>
      )}
      
      <form onSubmit={handleSubmit}>
        <FormLayout>
          {/* Left Column - Main Product Info */}
          <div>
            <FormSection>
              <div className="section-title">Basic Information</div>
              
              <FormGroup>
                <label htmlFor="title">Product Name</label>
                <input 
                  type="text" 
                  id="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  required 
                />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="description">Description</label>
                <textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={handleInputChange}
                ></textarea>
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="category">Category</label>
                <div className="input-with-action">
                  <select 
                    id="category" 
                    value={formData.category} 
                    onChange={handleInputChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={handleAddCategory}>
                    <FiPlus /> Add
                  </button>
                </div>
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="vendor">Vendor</label>
                <div className="input-with-action">
                  <select 
                    id="vendor" 
                    value={formData.vendor} 
                    onChange={handleInputChange}
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map(vendor => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={handleAddVendor}>
                    <FiPlus /> Add
                  </button>
                </div>
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="tags">Tags (comma separated)</label>
                <input 
                  type="text" 
                  id="tags" 
                  value={formData.tags} 
                  onChange={handleInputChange} 
                  placeholder="e.g. summer, sale, featured" 
                />
              </FormGroup>
              
              <FormGroup>
                <div className="checkbox-group">
                  <input 
                    type="checkbox" 
                    id="isService" 
                    checked={isService} 
                    onChange={(e) => setIsService(e.target.checked)} 
                  />
                  <label htmlFor="isService">This is a service (not a physical product)</label>
                </div>
              </FormGroup>
            </FormSection>
            
            <FormSection>
              <div className="section-title">Pricing</div>
              
              <PricingSection>
                <div className="pricing-row">
                  <div className="form-group">
                    <label htmlFor="price">Selling Price</label>
                    <input 
                      type="number" 
                      id="price" 
                      value={formData.price} 
                      onChange={handleInputChange} 
                      step="0.01" 
                      min="0" 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cost">Cost</label>
                    <input 
                      type="number" 
                      id="cost" 
                      value={formData.cost} 
                      onChange={handleInputChange} 
                      step="0.01" 
                      min="0" 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="minPrice">Minimum Price</label>
                    <input 
                      type="number" 
                      id="minPrice" 
                      value={formData.minPrice} 
                      onChange={handleInputChange} 
                      step="0.01" 
                      min="0" 
                    />
                  </div>
                </div>
                
                <div className="pricing-row-2">
                  <div className="form-group">
                    <label>Profit</label>
                    <input 
                      type="text" 
                      value={`$${calculateProfit()}`} 
                      disabled 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Margin</label>
                    <div className="percentage-input">
                      <input 
                        type="text" 
                        value={calculateMargin()} 
                        disabled 
                      />
                      <span className="percentage-symbol">%</span>
                    </div>
                  </div>
                </div>
              </PricingSection>
            </FormSection>
            
            <FormSection>
              <div className="section-title">Inventory</div>
              
              <FormGroup>
                <div className="checkbox-group">
                  <input 
                    type="checkbox" 
                    id="trackQuantity" 
                    checked={trackQuantity} 
                    onChange={(e) => setTrackQuantity(e.target.checked)} 
                  />
                  <label htmlFor="trackQuantity">Track quantity</label>
                </div>
              </FormGroup>
              
              {trackQuantity && (
                <>
                  <FormGroup>
                    <label htmlFor="quantity">Quantity in Stock</label>
                    <input 
                      type="number" 
                      id="quantity" 
                      value={formData.quantity} 
                      onChange={handleInputChange} 
                      min="0" 
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <label htmlFor="minStock">Low Stock Alert</label>
                    <input 
                      type="number" 
                      id="minStock" 
                      value={formData.minStock} 
                      onChange={handleInputChange} 
                      min="0" 
                    />
                    <div className="helper-text">
                      Get alerted when stock falls below this number
                    </div>
                  </FormGroup>
                </>
              )}
              
              <FormGroup>
                <div className="checkbox-group">
                  <input 
                    type="checkbox" 
                    id="hasSKU" 
                    checked={hasSKU} 
                    onChange={(e) => setHasSKU(e.target.checked)} 
                  />
                  <label htmlFor="hasSKU">This product has SKU or Barcode</label>
                </div>
              </FormGroup>
              
              {hasSKU && (
                <>
                  <FormGroup>
                    <label htmlFor="sku">SKU (Stock Keeping Unit)</label>
                    <input 
                      type="text" 
                      id="sku" 
                      value={formData.sku} 
                      onChange={handleInputChange} 
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <label htmlFor="barcode">Barcode (ISBN, UPC, GTIN, etc.)</label>
                    <input 
                      type="text" 
                      id="barcode" 
                      value={formData.barcode} 
                      onChange={handleInputChange} 
                    />
                  </FormGroup>
                </>
              )}
            </FormSection>
          </div>
          
          {/* Right Column - Media, Status, Actions */}
          <div>
            <CombinedSection>
              <div className="section-title">Product Image</div>
              
              {imagePreview ? (
                <ImagePreview>
                  <img src={imagePreview} alt="Product" />
                  <button 
                    type="button" 
                    className="remove-image" 
                    onClick={handleRemoveImage}
                  >
                    <FiX />
                  </button>
                </ImagePreview>
              ) : (
                <MediaUpload onClick={() => fileInputRef.current.click()}>
                  <div className="upload-icon">
                    <FiUpload />
                  </div>
                  <div className="upload-text">Upload Product Image</div>
                  <div className="upload-hint">
                    Recommended: 800x800px, JPG or PNG
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*" 
                  />
                </MediaUpload>
              )}
              
              <div className="section-divider"></div>
              
              <div className="section-title">Product Status</div>
              
              <FormGroup>
                <label htmlFor="status">Status</label>
                <select 
                  id="status" 
                  value={formData.status} 
                  onChange={handleInputChange}
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="condition">Condition</label>
                <select 
                  id="condition" 
                  value={formData.condition} 
                  onChange={handleInputChange}
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </FormGroup>
              
              <div className="section-divider"></div>
              
              <div className="section-title">Actions</div>
              
              <SaveButton type="submit">
                Save Changes
              </SaveButton>
              
              <ActionButton 
                type="button" 
                secondary 
                onClick={handlePrintLabel}
              >
                <FiPrinter /> Print Label
              </ActionButton>
            </CombinedSection>
          </div>
        </FormLayout>
      </form>
      
      {/* Modals */}
      {showCategoryModal && (
        <CategoryModal 
          onClose={() => setShowCategoryModal(false)} 
          onCategorySaved={handleCategoryAdded}
        />
      )}
      
      {showVendorModal && (
        <VendorModal 
          onClose={() => setShowVendorModal(false)} 
          onVendorSaved={handleVendorAdded}
        />
      )}
      
      {showPrintLabelModal && (
        <PrintLabelModal 
          onClose={() => setShowPrintLabelModal(false)}
          product={{
            id,
            name: formData.title,
            price: parseFloat(formData.price) || 0,
            sku: formData.sku,
            barcode: formData.barcode
          }}
        />
      )}
    </Container>
  );
}

export default EditProduct;
