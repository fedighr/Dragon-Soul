import React, { useState } from 'react'; 
import { 
  BarChart3, ShoppingBag, Users, Package, Bell, Settings,
  TrendingUp, DollarSign, ShoppingCart, UserPlus, AlertTriangle,
  Download, Edit, Trash2, MoreVertical, Filter, Search,
  ChevronRight, Eye, CheckCircle, XCircle, Clock,
  Plus, X, ChevronDown, Calendar, CreditCard, Globe,
  Truck, Shield as ShieldIcon, Banknote as Cash, Grid,
  List, TrendingDown, Loader, LogOut, Maximize,
  ChevronsRight, ChevronsLeft, Palette, Ruler, RefreshCw,
  Save, PackageOpen, UserMinus, UserCheck, Box
} from 'lucide-react';
import './Dashboard.css';
import Footer from "../../components/layout/Footer/Footer.jsx";
import BackToTopButton from "../../components/common/button/BackToTopButton.jsx";
import { useDashboard } from '../../hooks/useDashboard';

const Dashboard = () => {
  const {
    handleProductChange,
    handleColorChange,
    newProductData,
    sizeOptions ,
    setNewProductData,
    colorOptions,
    validateProductData,
    setFormErrors,
    removeColor,
    handleAddStockClick,
    setStockData,
    stockData,
    removeSize,
    handleSizeChange,
    addColor,
    addSize,
    handleImageChange ,
    activeSection,
    setActiveSection,
    sidebarOpen,
    setSidebarOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    sidebarHover,
    setSidebarHover,
    orders,
    selectedProduct,
    orderFilter,
    setOrderFilter,
    orderSearch,
    setOrderSearch,
    selectedOrder,
    showOrderDetails,
    setShowOrderDetails,
    orderDetailsData,
    products,
    productFilter,
    setProductFilter,
    customers,
    customerSearch,
    setCustomerSearch,
    chartType,
    setChartType,
    dateRange,
    setDateRange,
    analyticsView,
    setAnalyticsView,
    notifications,
    notificationFilter,
    setNotificationFilter,
    settings,
    setSettings,
    activeSettingTab,
    setActiveSettingTab,
    isSavingSettings,
    isLoading,
    showExportDropdown,
    setShowExportDropdown,
    showFilterDropdown,
    setShowFilterDropdown,
    showUserMenu,
    setShowUserMenu,
    viewMode,
    setViewMode,
    currentProductPage,
    setCurrentProductPage,
    currentCustomerPage,
    setCurrentCustomerPage,
    totalProductPages,
    totalCustomerPages,
    homeInfo,
    dataLoaded,
    showAddOrderModal,
    setShowAddOrderModal,
    showAddProductModal,
    setShowAddProductModal,
    showAddCustomerModal,
    setShowAddCustomerModal,
    showEditOrderModal,
    setShowEditOrderModal,
    showEditProductModal,
    setShowEditProductModal,
    showEditCustomerModal,
    setShowEditCustomerModal,
    showAddStockModal,
    setShowAddStockModal,
    editingOrder,
    editingProduct,
    editingCustomer,
    showProductDetails,
    stockingProduct,
    modalLoading,
    handleViewOrderDetails,
    handleViewProductDetails,
    handleOrderStatusChange,
    handleDeleteOrder,
    handleDeleteProduct,
    handleDeleteCustomer,
    handleToggleAdmin,
    handleMarkAllNotificationsRead,
    handleDeleteNotification,
    handleSaveSettings,
    handleExportData,
    handleOpenAddOrderModal,
    handleOpenEditOrderModal,
    handleOpenAddProductModal,
    handleOpenEditProductModal,
    handleOpenAddCustomerModal,
    handleOpenEditCustomerModal,
    handleOpenAddStockModal,
    handleSaveOrder,
    handleSaveProduct,
    handleSaveCustomer,
    handleAddStock,
    filteredOrders,
    filteredProducts,
    filteredCustomers,
    filteredNotifications,
    paginatedProducts,
    paginatedCustomers,
    sections: sectionsData,
    orderStatuses,
    categories,
    chartTypes: chartTypesData,
    dateRanges,
    settingTabs: settingTabsData
  } = useDashboard();

  const [newOrderData, setNewOrderData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    items: [],
    total: 0,
    status: 'pending',
    paymentMethod: 'card'
  });

  const [newCustomerData, setNewCustomerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    isAdmin: false
  });

  const sections = [
    { id: 'overview', label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
    { id: 'products', label: 'Products', icon: <Package size={20} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} />, badge: (notifications || []).filter(n => !n?.read).length },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];
  
  const chartTypes = [
    { id: 'sales', label: 'Sales', icon: <BarChart3 size={16} /> },
    { id: 'revenue', label: 'Revenue', icon: <TrendingUp size={16} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={16} /> },
    { id: 'traffic', label: 'Traffic', icon: <Globe size={16} /> },
  ];
  
  const settingTabs = [
    { id: 'general', label: 'General', icon: <Settings size={16} /> },
    { id: 'shipping', label: 'Shipping', icon: <Truck size={16} /> },
    { id: 'payment', label: 'Payment', icon: <CreditCard size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { id: 'integrations', label: 'Integrations', icon: <Globe size={16} /> },
    { id: 'security', label: 'Security', icon: <ShieldIcon size={16} /> },
  ];

  const getNewCustomersData = () => {
    const data = { daily: [], weekly: [], monthly: [], yearly: [] };
    switch(dateRange) {
      case 'week': return data.daily;
      case 'month': return data.weekly;
      case 'quarter': return data.monthly;
      case 'year': return data.yearly;
      default: return data.daily;
    }
  };

  const getNewCustomersLabel = () => {
    switch(dateRange) {
      case 'week': return 'Daily New Customers';
      case 'month': return 'Weekly New Customers';
      case 'quarter': return 'Monthly New Customers';
      case 'year': return 'Yearly New Customers';
      default: return 'New Customers';
    }
  };

  const handleEditOrderClick = (order) => {
    setNewOrderData({
      customerName: `${order.orders__user__first_name || ''} ${order.orders__user__last_name || ''}`.trim(),
      email: order.orders__user__email || '',
      phone: order.orders__user__phone_number || '',
      address: '',
      items: [],
      total: order.orders__total_price || order.amount || 0,
      status: order.status || 'pending',
      paymentMethod: order.method || 'card'
    });
    handleOpenEditOrderModal(order);
  };

  const handleEditProductClick = (product) => {
    setNewProductData({
      name: product.name || '',
      category: product.category || '',
      price: product.price || 0,
      description: product.description || '',
      colors: product.productcolor_set?.map(c => c.color) || [],
      sizes: product.productcolor_set?.[0]?.productcolorsize_set?.map(s => s.size) || []
    });
    handleOpenEditProductModal(product);
  };

  const handleEditCustomerClick = (customer) => {
    setNewCustomerData({
      firstName: customer.first_name || '',
      lastName: customer.last_name || '',
      email: customer.email || '',
      phone: customer.phone_number || '',
      address: customer.address || '',
      isAdmin: customer.is_admin || false
    });
    handleOpenEditCustomerModal(customer);
  };

 

  const renderAddOrderModal = () => (
    <div className="ds-modal-overlay" onClick={() => setShowAddOrderModal(false)}>
      <div className="ds-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ds-modal-header">
          <h3>Add New Order</h3>
          <button className="ds-modal-close" onClick={() => setShowAddOrderModal(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="ds-modal-body">
          <div className="ds-form-group">
            <label>Customer Name</label>
            <input 
              type="text" 
              value={newOrderData.customerName}
              onChange={(e) => setNewOrderData({...newOrderData, customerName: e.target.value})}
              placeholder="Enter customer name"
            />
          </div>
          <div className="ds-form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={newOrderData.email}
              onChange={(e) => setNewOrderData({...newOrderData, email: e.target.value})}
              placeholder="Enter email"
            />
          </div>
          <div className="ds-form-group">
            <label>Phone</label>
            <input 
              type="text" 
              value={newOrderData.phone}
              onChange={(e) => setNewOrderData({...newOrderData, phone: e.target.value})}
              placeholder="Enter phone number"
            />
          </div>
          <div className="ds-form-group">
            <label>Total Amount</label>
            <input 
              type="number" 
              value={newOrderData.total}
              onChange={(e) => setNewOrderData({...newOrderData, total: parseFloat(e.target.value) || 0})}
              placeholder="Enter total amount"
            />
          </div>
          <div className="ds-form-group">
            <label>Status</label>
            <select 
              value={newOrderData.status}
              onChange={(e) => setNewOrderData({...newOrderData, status: e.target.value})}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="ds-modal-footer">
          <button className="ds-btn ds-btn-secondary" onClick={() => setShowAddOrderModal(false)}>
            Cancel
          </button>
          <button 
            className="ds-btn ds-btn-primary" 
            onClick={() => handleSaveOrder(newOrderData, true)}
            disabled={modalLoading}
          >
            {modalLoading ? <Loader size={16} className="ds-spinner" /> : <Save size={16} />}
            {modalLoading ? 'Saving...' : 'Save Order'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderEditOrderModal = () => (
    <div className="ds-modal-overlay" onClick={() => setShowEditOrderModal(false)}>
      <div className="ds-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ds-modal-header">
          <h3>Edit Order</h3>
          <button className="ds-modal-close" onClick={() => setShowEditOrderModal(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="ds-modal-body">
          <div className="ds-form-group">
            <label>Customer Name</label>
            <input 
              type="text" 
              value={newOrderData.customerName}
              onChange={(e) => setNewOrderData({...newOrderData, customerName: e.target.value})}
            />
          </div>
          <div className="ds-form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={newOrderData.email}
              onChange={(e) => setNewOrderData({...newOrderData, email: e.target.value})}
            />
          </div>
          <div className="ds-form-group">
            <label>Total Amount</label>
            <input 
              type="number" 
              value={newOrderData.total}
              onChange={(e) => setNewOrderData({...newOrderData, total: parseFloat(e.target.value) || 0})}
            />
          </div>
          <div className="ds-form-group">
            <label>Status</label>
            <select 
              value={newOrderData.status}
              onChange={(e) => setNewOrderData({...newOrderData, status: e.target.value})}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="ds-modal-footer">
          <button className="ds-btn ds-btn-secondary" onClick={() => setShowEditOrderModal(false)}>
            Cancel
          </button>
          <button 
            className="ds-btn ds-btn-primary" 
            onClick={() => handleSaveOrder({...newOrderData, id: editingOrder?.id || editingOrder?.order_id}, false)}
            disabled={modalLoading}
          >
            {modalLoading ? <Loader size={16} className="ds-spinner" /> : <Save size={16} />}
            {modalLoading ? 'Saving...' : 'Update Order'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderAddProductModal = () => (
  <div className="ds-modal-overlay" onClick={() => setShowAddProductModal(false)}>
    <div className="ds-modal ds-modal-enhanced" onClick={(e) => e.stopPropagation()}>
      <div className="ds-modal-header">
        <h3>Add New Product</h3>
        <button className="ds-modal-close" onClick={() => setShowAddProductModal(false)}>
          <X size={20} />
        </button>
      </div>
      <div className="ds-modal-body">
        <div className="ds-form-group">
          <label>Product Name</label>
          <input 
            type="text" 
            value={newProductData.name}
            onChange={(e) => handleProductChange('name', e.target.value)}
            placeholder="Enter product name"
          />
        </div>
        <div className="ds-form-group">
          <label>Price</label>
          <input 
            type="number" 
            value={newProductData.price}
            onChange={(e) => handleProductChange('price', parseFloat(e.target.value) || 0)}
            placeholder="Enter price"
          />
        </div>
        <div className="ds-form-group">
          <label>Description</label>
          <textarea 
            value={newProductData.description}
            onChange={(e) => handleProductChange('description', e.target.value)}
            rows="3"
            placeholder="Enter product description"
          />
        </div>

        {newProductData.productcolor_set.map((color, colorIndex) => (
          <div key={colorIndex} className="ds-color-block">
            <div className="ds-form-group">
              <label>Color</label>
              <select
                value={color.color}
                onChange={(e) => handleColorChange(colorIndex, 'color', e.target.value)}
              >
                <option value="">Select color</option>
                {colorOptions.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="ds-form-group">
              <label>Image</label>
              <input 
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(colorIndex, e.target.files[0])}
              />
            </div>

            {color.productcolorsize_set.map((size, sizeIndex) => (
              <div key={sizeIndex} className="ds-size-block">
                <div className="ds-form-group">
                  <label>Size</label>
                  <select
                    value={size.size}
                    onChange={(e) => handleSizeChange(colorIndex, sizeIndex, 'size', e.target.value)}
                  >
                    <option value="">Select size</option>
                    {sizeOptions.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="ds-form-group">
                  <label>Stock</label>
                  <input 
                    type="number"
                    value={size.stock}
                    onChange={(e) => handleSizeChange(colorIndex, sizeIndex, 'stock', parseInt(e.target.value) || 0)}
                    placeholder="Enter stock"
                  />
                </div>
                <button type="button" className="ds-btn ds-btn-secondary ds-delete-size-btn" onClick={() => removeSize(colorIndex, sizeIndex)}>
                  Delete Size
                </button>
              </div>
            ))}

            <button type="button" className="ds-btn ds-btn-secondary ds-add-size-btn" onClick={() => addSize(colorIndex)}>
              Add Size
            </button>

            <button type="button" className="ds-btn ds-btn-danger ds-delete-color-btn" onClick={() => removeColor(colorIndex)}>
              Delete Color
            </button>
          </div>
        ))}

        <button type="button" className="ds-btn ds-btn-primary ds-add-color-btn" onClick={addColor}>
          Add Color
        </button>
      </div>

      <div className="ds-modal-footer">
        <button className="ds-btn ds-btn-secondary" onClick={() => setShowAddProductModal(false)}>
          Cancel
        </button>
        <button 
          className="ds-btn ds-btn-primary"
          onClick={() => {
            const errors = validateProductData(newProductData);
            if (Object.keys(errors).length > 0) {
              setFormErrors(errors);
              return;
            }
            setFormErrors({});
            handleSaveProduct(newProductData, true);
          }}
          disabled={modalLoading}
        >
          {modalLoading ? <Loader size={16} className="ds-spinner" /> : <Save size={16} />}
          {modalLoading ? 'Saving...' : 'Add Product'}
        </button>
      </div>
    </div>
  </div>
  );

  const renderEditProductModal = () => (
<div className="ds-modal-overlay" onClick={() => setShowEditProductModal(false)}>
  <div className="ds-modal ds-modal-enhanced" onClick={(e) => e.stopPropagation()}>
    <div className="ds-modal-header">
      <h3>Edit Product</h3>
      <button className="ds-modal-close" onClick={() => setShowEditProductModal(false)}>
        <X size={20} />
      </button>
    </div>
    <div className="ds-modal-body">
      <div className="ds-form-group">
        <label>Product Name</label>
        <input 
          type="text" 
          value={newProductData.name}
          onChange={(e) => handleProductChange('name', e.target.value)}
          placeholder="Enter product name"
        />
      </div>
      <div className="ds-form-group">
        <label>Price</label>
        <input 
          type="number" 
          value={newProductData.price}
          onChange={(e) => handleProductChange('price', parseFloat(e.target.value) || 0)}
          placeholder="Enter price"
        />
      </div>
      <div className="ds-form-group">
        <label>Description</label>
        <textarea 
          value={newProductData.description}
          onChange={(e) => handleProductChange('description', e.target.value)}
          rows="3"
          placeholder="Enter product description"
        />
      </div>

      {newProductData.productcolor_set.map((color, colorIndex) => (
        <div key={colorIndex} className="ds-color-block">
          <div className="ds-form-group">
            <label>Color</label>
            <select
              value={color.color}
              onChange={(e) => handleColorChange(colorIndex, 'color', e.target.value)}
            >
              <option value="">Select color</option>
              {colorOptions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="ds-form-group">
            <label>Image</label>
            <input 
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(colorIndex, e.target.files[0])}
            />
            {color.image && typeof color.image === 'string' && (
              <div className="ds-current-image">
                <img src={color.image} alt="Current" style={{width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px'}} />
              </div>
            )}
          </div>

          {color.productcolorsize_set.map((size, sizeIndex) => (
            <div key={sizeIndex} className="ds-size-block">
              <div className="ds-form-group">
                <label>Size</label>
                <select
                  value={size.size}
                  onChange={(e) => handleSizeChange(colorIndex, sizeIndex, 'size', e.target.value)}
                >
                  <option value="">Select size</option>
                  {sizeOptions.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="ds-form-group">
                <label>Stock</label>
                <input 
                  type="number"
                  value={size.stock}
                  onChange={(e) => handleSizeChange(colorIndex, sizeIndex, 'stock', parseInt(e.target.value) || 0)}
                  placeholder="Enter stock"
                />
              </div>
              <button type="button" className="ds-btn ds-btn-secondary ds-delete-size-btn" onClick={() => removeSize(colorIndex, sizeIndex)}>
                Delete Size
              </button>
            </div>
          ))}

          <button type="button" className="ds-btn ds-btn-secondary ds-add-size-btn" onClick={() => addSize(colorIndex)}>
            Add Size
          </button>

          <button type="button" className="ds-btn ds-btn-danger ds-delete-color-btn" onClick={() => removeColor(colorIndex)}>
            Delete Color
          </button>
        </div>
      ))}

      <button type="button" className="ds-btn ds-btn-primary ds-add-color-btn" onClick={addColor}>
        Add Color
      </button>
    </div>

    <div className="ds-modal-footer">
      <button className="ds-btn ds-btn-secondary" onClick={() => setShowEditProductModal(false)}>
        Cancel
      </button>
      <button 
        className="ds-btn ds-btn-primary"
        onClick={() => {
          console.log("Update button clicked");
          console.log("newProductData:", newProductData);
          console.log("editingProduct:", editingProduct);
          const errors = validateProductData(newProductData);
          console.log("Validation errors:", errors);
          if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            alert("Please fix validation errors");
            return;
          }
          setFormErrors({});
          handleSaveProduct({...newProductData, id: editingProduct?.id}, false);
        }}
        disabled={modalLoading}
      >
        {modalLoading ? <Loader size={16} className="ds-spinner" /> : <Save size={16} />}
        {modalLoading ? 'Saving...' : 'Update Product'}
      </button>
    </div>
  </div>
</div>
  );

  const renderAddCustomerModal = () => (
    <div className="ds-modal-overlay" onClick={() => setShowAddCustomerModal(false)}>
      <div className="ds-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ds-modal-header">
          <h3>Add New Customer</h3>
          <button className="ds-modal-close" onClick={() => setShowAddCustomerModal(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="ds-modal-body">
          <div className="ds-form-row">
            <div className="ds-form-group">
              <label>First Name</label>
              <input 
                type="text" 
                value={newCustomerData.firstName}
                onChange={(e) => setNewCustomerData({...newCustomerData, firstName: e.target.value})}
                placeholder="Enter first name"
              />
            </div>
            <div className="ds-form-group">
              <label>Last Name</label>
              <input 
                type="text" 
                value={newCustomerData.lastName}
                onChange={(e) => setNewCustomerData({...newCustomerData, lastName: e.target.value})}
                placeholder="Enter last name"
              />
            </div>
          </div>
          <div className="ds-form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={newCustomerData.email}
              onChange={(e) => setNewCustomerData({...newCustomerData, email: e.target.value})}
              placeholder="Enter email"
            />
          </div>
          <div className="ds-form-group">
            <label>Phone</label>
            <input 
              type="text" 
              value={newCustomerData.phone}
              onChange={(e) => setNewCustomerData({...newCustomerData, phone: e.target.value})}
              placeholder="Enter phone number"
            />
          </div>
          <div className="ds-form-group">
            <label>Make Administrator</label>
            <label className="ds-switch">
              <input 
                type="checkbox" 
                checked={newCustomerData.isAdmin}
                onChange={(e) => setNewCustomerData({...newCustomerData, isAdmin: e.target.checked})}
              />
              <span className="ds-slider"></span>
            </label>
          </div>
        </div>
        <div className="ds-modal-footer">
          <button className="ds-btn ds-btn-secondary" onClick={() => setShowAddCustomerModal(false)}>
            Cancel
          </button>
          <button 
            className="ds-btn ds-btn-primary" 
            onClick={() => handleSaveCustomer(newCustomerData, true)}
            disabled={modalLoading}
          >
            {modalLoading ? <Loader size={16} className="ds-spinner" /> : <Save size={16} />}
            {modalLoading ? 'Saving...' : 'Add Customer'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderEditCustomerModal = () => (
    <div className="ds-modal-overlay" onClick={() => setShowEditCustomerModal(false)}>
      <div className="ds-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ds-modal-header">
          <h3>Edit Customer</h3>
          <button className="ds-modal-close" onClick={() => setShowEditCustomerModal(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="ds-modal-body">
          <div className="ds-form-row">
            <div className="ds-form-group">
              <label>First Name</label>
              <input 
                type="text" 
                value={newCustomerData.firstName}
                onChange={(e) => setNewCustomerData({...newCustomerData, firstName: e.target.value})}
              />
            </div>
            <div className="ds-form-group">
              <label>Last Name</label>
              <input 
                type="text" 
                value={newCustomerData.lastName}
                onChange={(e) => setNewCustomerData({...newCustomerData, lastName: e.target.value})}
              />
            </div>
          </div>
          <div className="ds-form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={newCustomerData.email}
              onChange={(e) => setNewCustomerData({...newCustomerData, email: e.target.value})}
            />
          </div>
          <div className="ds-form-group">
            <label>Phone</label>
            <input 
              type="text" 
              value={newCustomerData.phone}
              onChange={(e) => setNewCustomerData({...newCustomerData, phone: e.target.value})}
            />
          </div>
          <div className="ds-form-group">
            <label>Administrator Status</label>
            <label className="ds-switch">
              <input 
                type="checkbox" 
                checked={newCustomerData.isAdmin}
                onChange={(e) => setNewCustomerData({...newCustomerData, isAdmin: e.target.checked})}
              />
              <span className="ds-slider"></span>
            </label>
          </div>
        </div>
        <div className="ds-modal-footer">
          <button className="ds-btn ds-btn-secondary" onClick={() => setShowEditCustomerModal(false)}>
            Cancel
          </button>
          <button 
            className="ds-btn ds-btn-primary" 
            onClick={() => handleSaveCustomer({...newCustomerData, id: editingCustomer?.id}, false)}
            disabled={modalLoading}
          >
            {modalLoading ? <Loader size={16} className="ds-spinner" /> : <Save size={16} />}
            {modalLoading ? 'Saving...' : 'Update Customer'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderAddStockModal = () => (
    <div className="ds-modal-overlay" onClick={() => setShowAddStockModal(false)}>
      <div className="ds-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ds-modal-header">
          <h3>Add Stock - {stockingProduct?.name || 'Product'}</h3>
          <button className="ds-modal-close" onClick={() => setShowAddStockModal(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="ds-modal-body">
          <div className="ds-form-group">
            <label>Color</label>
            <select 
              value={stockData.color}
              onChange={(e) => setStockData({...stockData, color: e.target.value})}
            >
              <option value="">Select color</option>
              {stockingProduct?.productcolor_set?.map(color => (
                <option key={color.id} value={color.color}>{color.color}</option>
              ))}
            </select>
          </div>
          <div className="ds-form-group">
            <label>Size</label>
            <select 
              value={stockData.size}
              onChange={(e) => setStockData({...stockData, size: e.target.value})}
            >
              <option value="">Select size</option>
              {stockingProduct?.productcolor_set?.map(color => (
                <option key={color.id} value={color.color}>{color.color}</option>
              ))}
            </select>
          </div>
          <div className="ds-form-group">
            <label>Quantity</label>
            <input 
              type="number" 
              value={stockData.quantity}
              onChange={(e) => setStockData({...stockData, quantity: parseInt(e.target.value) || 0})}
              placeholder="Enter quantity"
              min="1"
            />
          </div>

        </div>
        <div className="ds-modal-footer">
          <button className="ds-btn ds-btn-secondary" onClick={() => setShowAddStockModal(false)}>
            Cancel
          </button>
          <button 
            className="ds-btn ds-btn-primary" 
            onClick={() => handleAddStock(stockingProduct?.id, stockData)}
            disabled={modalLoading}
          >
            {modalLoading ? <Loader size={16} className="ds-spinner" /> : <PackageOpen size={16} />}
            {modalLoading ? 'Adding...' : 'Add Stock'}
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading && !dataLoaded[activeSection]) {
    return (
      <div className="ds-loading-state" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader size={32} className="ds-spinning" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        if (!homeInfo) {
          return (
            <div className="ds-loading-state">
              <Loader size={32} className="ds-spinning" />
              <p>Loading overview data...</p>
            </div>
          );
        }

        return (
          <div className="ds-overview-content">
            <div className="ds-stats-grid">
              <div className="ds-stat-card">
                <div className="ds-stat-header">
                  <h3 className="ds-stat-title">Today's Sales</h3>
                  <div className="ds-stat-icon ds-sales">
                    <DollarSign size={24} />
                  </div>
                </div>
                <div className="ds-stat-value">{homeInfo?.Today_Sales ?? 0}DT</div>
                <div className="ds-stat-trend ds-trend-up">
                  <TrendingUp size={16} />
                  <span>+{homeInfo?.Today_Percentage ?? 0}%</span>
                </div>
                <div className="ds-stat-period">vs yesterday</div>
              </div>
              
              <div className="ds-stat-card">
                <div className="ds-stat-header">
                  <h3 className="ds-stat-title">Total Orders</h3>
                  <div className="ds-stat-icon ds-orders">
                    <ShoppingCart size={24} />
                  </div>
                </div>
                <div className="ds-stat-value">{homeInfo?.Total_Orders ?? 0}</div>
                <div className="ds-stat-details">
                  <div className="ds-stat-detail">
                    <span className="ds-detail-label ds-pending">Pending:</span>
                    <span className="ds-detail-value">{homeInfo?.status_orders?.pending ?? 0}</span>
                  </div>
                  <div className="ds-stat-detail">
                    <span className="ds-detail-label ds-completed">Completed:</span>
                    <span className="ds-detail-value">{homeInfo?.status_orders?.completed ?? 0}</span>
                  </div>
                  <div className="ds-stat-detail">
                    <span className="ds-detail-label ds-cancelled">cancelled:</span>
                    <span className="ds-detail-value">{homeInfo?.status_orders?.cancelled ?? 0}</span>
                  </div>                  
                </div>
              </div>
              
              <div className="ds-stat-card">
                <div className="ds-stat-header">
                  <h3 className="ds-stat-title">Total Revenue</h3>
                  <div className="ds-stat-icon ds-revenue">
                    <TrendingUp size={24} />
                  </div>
                </div>
                <div className="ds-stat-value">${homeInfo?.Month_Sales ?? 0}</div>
                <div className="ds-stat-trend ds-trend-up">
                  <TrendingUp size={16} />
                  <span>+{homeInfo?.Month_Percentage ?? 0}%</span>
                </div>
                <div className="ds-stat-period">This month</div>
              </div>
              
              <div className="ds-stat-card">
                <div className="ds-stat-header">
                  <h3 className="ds-stat-title">New Customers</h3>
                  <div className="ds-stat-icon ds-customers">
                    <UserPlus size={24} />
                  </div>
                </div>
                <div className="ds-stat-value">{homeInfo?.New_Customers ?? 0}</div>
                <div className="ds-stat-trend ds-trend-up">
                  <TrendingUp size={16} />
                  <span>+{homeInfo?.Customers_Percentage ?? 0}%</span>
                </div>
                <div className="ds-stat-period">This week</div>
              </div>
            </div>
            
            <div className="ds-charts-section">
              <div className="ds-chart-container">
                <div className="ds-chart-header">
                  <h3>Sales Overview</h3>
                  <div className="ds-chart-controls">
                    <div className="ds-date-range-selector">
                      {dateRanges.map(range => (
                        <button
                          key={range.id}
                          className={`ds-range-btn ${dateRange === range.id ? 'ds-active' : ''}`}
                          onClick={() => setDateRange(range.id)}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                    <button 
                      className="ds-chart-action-btn"
                      onClick={() => {}}
                    >
                      <Maximize size={16} />
                    </button>
                  </div>
                </div>
                <div className="ds-chart-placeholder">
                  <div className="ds-chart-visualization">
                    {[65, 40, 80, 81, 56, 55, 40].map((value, index) => (
                      <div 
                        key={index} 
                        className="ds-chart-bar" 
                        style={{ height: `${value}%` }}
                      ></div>
                    ))}
                  </div>
                  <div className="ds-chart-legend">
                    <div className="ds-legend-item">
                      <div className="ds-legend-color ds-sales"></div>
                      <span>Sales</span>
                    </div>
                    <div className="ds-legend-item">
                      <div className="ds-legend-color ds-revenue"></div>
                      <span>Revenue</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="ds-chart-container">
                <div className="ds-chart-header">
                  <h3>{getNewCustomersLabel()}</h3>
                  <div className="ds-chart-controls">
                    <div className="ds-date-range-selector">
                      {dateRanges.map(range => (
                        <button
                          key={range.id}
                          className={`ds-range-btn ${dateRange === range.id ? 'ds-active' : ''}`}
                          onClick={() => setDateRange(range.id)}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                    <button 
                      className="ds-chart-action-btn"
                      onClick={() => {}}
                    >
                      <Maximize size={16} />
                    </button>
                  </div>
                </div>
                <div className="ds-chart-placeholder">
                  <div className="ds-chart-visualization">
                    {getNewCustomersData().map((value, index) => {
                      const maxValue = Math.max(...getNewCustomersData());
                      const height = (value / maxValue) * 100 || 0;
                      return (
                        <div 
                          key={index} 
                          className="ds-chart-bar ds-customer-bar"
                          style={{ height: `${height}%` }}
                        >
                          <div className="ds-bar-value">{value}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="ds-chart-legend">
                    <div className="ds-legend-item">
                      <div className="ds-legend-color ds-customers"></div>
                      <span>New Customers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="ds-overview-bottom">
              <div className="ds-recent-orders">
                <div className="ds-section-header">
                  <h3>Recent Orders</h3>
                  <button className="ds-view-all-btn" onClick={() => setActiveSection('orders')}>
                    View All <ChevronRight size={16} />
                  </button>
                </div>
                <div className="ds-orders-list">
                  {orders && orders.length > 0 ? (
                    orders.slice(0, 5).map(order => (
                      <div key={order.order_id} className="ds-order-item" onClick={() => handleViewOrderDetails(order)}>
                        <div className="ds-order-info">
                          <div className="ds-order-id">ORD-{order.id || order.order_id}</div>
                          <div className="ds-order-customer">
                            {order.orders__user__first_name || ''} {order.orders__user__last_name || ''}
                          </div>
                        </div>
                        <div className="ds-order-details">
                          <div className="ds-order-total">${order.amount || order.orders__total_price || 0}</div>
                          <div className={`ds-order-status ds-${order.status || 'pending'}`}>
                            {order.status === 'pending' && <Clock size={12} />}
                            {order.status === 'processing' && <Loader size={12} />}
                            {order.status === 'completed' && <CheckCircle size={12} />}
                            {order.status === 'cancelled' && <XCircle size={12} />}
                            {order.status || 'pending'}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="ds-empty-state">
                      <ShoppingBag size={32} />
                      <p>No recent orders</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="ds-top-products">
                <div className="ds-section-header">
                  <h3>Top Selling Products</h3>
                  <button className="ds-view-all-btn" onClick={() => setActiveSection('products')}>
                    View All <ChevronRight size={16} />
                  </button>
                </div>
                <div className="ds-products-list">
                  {products && products.length > 0 ? (
                    products.slice(0, 5).map(product => (
                      <div key={product.id} className="ds-product-item" onClick={() => handleViewProductDetails(product)}>
                        <div className="ds-product-image">
                          <div className="ds-image-placeholder">
                            {product.productcolor_set && product.productcolor_set[0] && product.productcolor_set[0].image ? (
                              <img src={product.productcolor_set[0].image} alt={product.name} />
                            ) : (
                              <span>{product.name ? product.name.charAt(0) : 'P'}</span>
                            )}
                          </div>
                        </div>
                        <div className="ds-product-info">
                          <div className="ds-product-name">{product.name || 'Unknown Product'}</div>
                          <div className="ds-product-category">
                            {product.productcolor_set && product.productcolor_set[0] ? product.productcolor_set[0].color : 'N/A'}
                          </div>
                          {product.productcolor_set && product.productcolor_set.length > 0 && (
                            <div className="ds-product-colors">
                              {product.productcolor_set.slice(0, 3).map((color, idx) => (
                                <div key={idx} className="ds-color-dot" style={{ backgroundColor: color.color || '#ccc' }}></div>
                              ))}
                              {product.productcolor_set.length > 3 && (
                                <div className="ds-more-colors">+{product.productcolor_set.length - 3}</div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="ds-product-stats">
                          <div className="ds-product-sales">{product.Purchases || 0} sold</div>
                          <div className={`ds-stock-indicator ds-${product.status || 'available'}`}>
                            {product.productcolor_set && 
                             product.productcolor_set[0] && 
                             product.productcolor_set[0].productcolorsize_set && 
                             product.productcolor_set[0].productcolorsize_set[0] 
                              ? product.productcolor_set[0].productcolorsize_set[0].stock 
                              : 0} in stock
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="ds-empty-state">
                      <Package size={32} />
                      <p>No products available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'orders':
        if (isLoading && !dataLoaded.orders) {
          return (
            <div className="ds-loading-state">
              <Loader size={32} className="ds-spinning" />
              <p>Loading orders...</p>
            </div>
          );
        }

        return (
          <div className="ds-orders-content">
            <div className="ds-content-toolbar">
              <div className="ds-search-filter">
                <div className="ds-search-box">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                  />
                </div>
                <div className="ds-filter-options">
                  <div className="ds-filter-dropdown">
                    <button 
                      className="ds-filter-btn"
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    >
                      <Filter size={18} />
                      Status: {orderStatuses.find(s => s.value === orderFilter)?.label || 'All'}
                      <ChevronDown size={16} />
                    </button>
                    {showFilterDropdown && (
                      <div className="ds-dropdown-menu">
                        {orderStatuses.map(status => (
                          <button
                            key={status.value}
                            className="ds-dropdown-item"
                            onClick={() => {
                              setOrderFilter(status.value);
                              setShowFilterDropdown(false);
                            }}
                          >
                            <div className="ds-status-indicator" style={{ backgroundColor: status.color }}></div>
                            {status.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="ds-date-range-picker">
                    <Calendar size={18} />
                    <select>
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="ds-action-buttons">
                <div className="ds-export-dropdown">
                  <button 
                    className="ds-btn ds-btn-secondary"
                    onClick={() => setShowExportDropdown(!showExportDropdown)}
                  >
                    <Download size={16} />
                    Export
                  </button>
                  {showExportDropdown && (
                    <div className="ds-export-menu">
                      <button className="ds-export-option" onClick={() => handleExportData('csv')}>
                        CSV
                      </button>
                      <button className="ds-export-option" onClick={() => handleExportData('excel')}>
                        Excel
                      </button>
                      <button className="ds-export-option" onClick={() => handleExportData('pdf')}>
                        PDF
                      </button>
                    </div>
                  )}
                </div>
                <button className="ds-btn ds-btn-primary" onClick={handleOpenAddOrderModal}>
                  <Plus size={16} />
                  New Order
                </button>
              </div>
            </div>
            
            <div className="ds-table-container">
              <table className="ds-data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders && filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                      <tr key={order.order_id || order.id}>
                        <td>
                          <div className="ds-order-id-cell">
                            <strong>ORD-{order.order_id || order.id}</strong>
                            <span className="ds-item-count">{order?.items_count ?? 0} items</span>
                          </div>
                        </td>
                        <td>
                          <div className="ds-customer-cell">
                            <div className="ds-customer-avatar">
                              {order?.orders__user__first_name?.charAt(0) || "X"}
                            </div>
                            <div className="ds-customer-info">
                              <div className="ds-customer-name">
                                {[order?.orders__user__first_name, order?.orders__user__last_name]
                                  .filter(Boolean)
                                  .join(" ") || "Unknown"}
                              </div>   
                              <div className="ds-customer-email">{order?.orders__user__email || ""}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          {order?.orders__created_at
                            ? new Date(order.orders__created_at).toLocaleDateString()
                            : "N/A"}
                        </td>           
                        <td>
                          <div className="ds-status-cell">
                            <span className={`ds-status-badge ds-${order?.status || "pending"}`}>
                              {order?.status === "pending" && <Clock size={12} />}
                              {order?.status === "processing" && <Loader size={12} />}
                              {order?.status === "completed" && <CheckCircle size={12} />}
                              {order?.status === "cancelled" && <XCircle size={12} />}
                              {order?.status ?? "pending"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <strong>{order?.orders__total_price ?? order?.amount ?? 0.00}DT</strong>
                        </td>
                        <td>
                          <div className="ds-payment-method">
                            {order?.method?.toLowerCase() === "card" && <CreditCard size={14} />}
                            {order?.method?.toLowerCase() === "paypal" && <Globe size={14} />}
                            {order?.method?.toLowerCase() === "cash" && <Cash size={14} />}
                            {order?.method?.toUpperCase() ?? "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="ds-action-cell">
                            <button 
                              className="ds-action-btn ds-view"
                              onClick={() => handleViewOrderDetails(order)}
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              className="ds-action-btn ds-edit" 
                              title="Edit Order"
                              onClick={() => handleEditOrderClick(order)}
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="ds-action-btn ds-cancel"
                              onClick={() => handleOrderStatusChange(order.order_id || order.id, 'cancelled')}
                              disabled={order.status === 'cancelled'}
                              title="Cancel Order"
                            >
                              <XCircle size={16} />
                            </button>
                            <button 
                              className="ds-action-btn ds-delete"
                              onClick={() => handleDeleteOrder(order.order_id || order.id)}
                              title="Delete Order"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                        <div className="ds-empty-state">
                          <ShoppingBag size={32} />
                          <p>No orders found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="ds-pagination">
              <button className="ds-pagination-btn" disabled>
                Previous
              </button>
              <div className="ds-page-numbers">
                <button className="ds-page-btn ds-active">1</button>
                <button className="ds-page-btn">2</button>
                <button className="ds-page-btn">3</button>
                <span>...</span>
                <button className="ds-page-btn">10</button>
              </div>
              <button className="ds-pagination-btn">
                Next
              </button>
            </div>
          </div>
        );
      
      case 'products':
        if (isLoading && !dataLoaded.products) {
          return (
            <div className="ds-loading-state">
              <Loader size={32} className="ds-spinning" />
              <p>Loading products...</p>
            </div>
          );
        }

        return (
          <div className="ds-products-content">
            <div className="ds-content-toolbar">
              <div className="ds-view-toggle">
                <button 
                  className={`ds-view-btn ${viewMode === 'grid' ? 'ds-active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={18} />
                </button>
                <button 
                  className={`ds-view-btn ${viewMode === 'list' ? 'ds-active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} />
                </button>
              </div>
              <div className="ds-search-filter">
                <div className="ds-search-box">
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                  />
                </div>
                <select 
                  className="ds-category-filter"
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <button className="ds-btn ds-btn-primary" onClick={handleOpenAddProductModal}>
                <Plus size={16} />
                Add Product
              </button>
            </div>
            
            {viewMode === 'grid' ? (
              <div className="ds-products-grid">
                {paginatedProducts && paginatedProducts.length > 0 ? (
                  paginatedProducts.map(product => (
                    <div key={product.id} className="ds-product-card">
                      <div className="ds-product-card-header">
                        <div className="ds-product-image">
                          <div className="ds-image-placeholder">
                            {product.productcolor_set && product.productcolor_set[0] && product.productcolor_set[0].image ? (
                              <img src={product.productcolor_set[0].image} alt={product.name} />
                            ) : (
                              <span>{product.name ? product.name.charAt(0) : 'P'}</span>
                            )}
                          </div>
                          {product.productcolor_set && product.productcolor_set.some(c => c.productcolorsize_set?.some(s => s.stock < 10)) && (
                            <div className="ds-stock-alert">
                              <AlertTriangle size={14} />
                              Low Stock
                            </div>
                          )}
                        </div>
                        <div className="ds-product-actions">
                          <button className="ds-card-action-btn">
                            <MoreVertical size={16} />
                          </button>
                        </div></div>
                      <div className="ds-product-card-body">
                        <h4 className="ds-product-name">{product.name || 'Unknown'}</h4>
                        <div className="ds-product-category">{product.category || 'Uncategorized'}</div>
                        <div className="ds-product-price">${product.price || 0}</div>
                        <div className="ds-product-colors-sizes">
                          {product.productcolor_set && product.productcolor_set.length > 0 && (
                            <div className="ds-colors-section">
                              <div className="ds-section-title">
                                <Palette size={12} />
                                <span>Colors: {product.productcolor_set.length}</span>
                              </div>
                              <div className="ds-colors-list">
                                {product.productcolor_set.slice(0, 4).map((color, idx) => (
                                  <div key={idx} className="ds-color-chip" style={{ backgroundColor: color.color || '#ccc' }}></div>
                                ))}
                                {product.productcolor_set.length > 4 && (
                                  <div className="ds-more-colors-chip">+{product.productcolor_set.length - 4}</div>
                                )}
                              </div>
                            </div>
                          )}
                          {product.productcolor_set && product.productcolor_set[0]?.productcolorsize_set && (
                            <div className="ds-sizes-section">
                              <div className="ds-section-title">
                                <Ruler size={12} />
                                <span>Sizes: {product.productcolor_set[0].productcolorsize_set.length}</span>
                              </div>
                              <div className="ds-sizes-list">
                                {product.productcolor_set[0].productcolorsize_set.slice(0, 3).map((size, idx) => (
                                  <div key={idx} className="ds-size-chip">
                                    {size.size}
                                  </div>
                                ))}
                                {product.productcolor_set[0].productcolorsize_set.length > 3 && (
                                  <div className="ds-more-sizes-chip">+{product.productcolor_set[0].productcolorsize_set.length - 3}</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="ds-product-stats">
                          <div className="ds-stat">
                            <Package size={14} />
                            <span>{
                              product.productcolor_set && product.productcolor_set[0]?.productcolorsize_set?.reduce((sum, size) => sum + (size.stock || 0), 0) || 0
                            } in stock</span>
                          </div>
                          <div className="ds-stat">
                            <ShoppingCart size={14} />
                            <span>{product.Purchases || 0} sold</span>
                          </div>
                        </div>
                      </div>
                      <div className="ds-product-card-footer">
                        <button 
                          className="ds-btn ds-btn-outline"
                          onClick={() => handleViewProductDetails(product)}
                        >
                          <Eye size={14} />
                          View
                        </button>
                        <button 
                          className="ds-btn ds-btn-outline"
                          onClick={() => handleEditProductClick(product)}
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button 
                          className="ds-btn ds-btn-primary"
                          onClick={() => handleAddStockClick(product)}
                        >
                          <PackageOpen size={14} />
                          Stock
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="ds-empty-state">
                    <Package size={48} />
                    <h3>No products available</h3>
                    <p>Add your first product to get started</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="ds-table-container">
                <table className="ds-data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Colors</th>
                      <th>Sizes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts && paginatedProducts.length > 0 ? (
                      paginatedProducts.map(product => (
                        <tr key={product.id}>
                          <td>
                            <div className="ds-product-cell">
                              <div className="ds-product-avatar">
                                {product.name ? product.name.charAt(0) : 'P'}
                              </div>
                              <div className="ds-product-info">
                                <div className="ds-product-name">{product.name || 'Unknown'}</div>
                                <div className="ds-product-variants">
                                  {product.productcolor_set?.length || 0} colors
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>{product.category || 'N/A'}</td>
                          <td>
                            <strong>${(product.price || 0)}</strong>
                          </td>
                          <td>
                            <div className="ds-stock-cell">
                              <div className="ds-stock-bar">
                                <div 
                                  className="ds-stock-fill"
                                  style={{ width: `${Math.min(((product.productcolor_set?.[0]?.productcolorsize_set?.[0]?.stock || 0) / 50) * 100, 100)}%` }}
                                ></div>
                              </div>
                              <span className="ds-stock-count">{product.productcolor_set?.[0]?.productcolorsize_set?.[0]?.stock || 0}</span>
                            </div>
                          </td>
                          <td>
                            <div className="ds-colors-display">
                              {product.productcolor_set?.slice(0, 3).map((color, idx) => (
                                <div key={idx} className="ds-color-dot-small" style={{ backgroundColor: color.color || '#ccc' }}></div>
                              ))}
                              {product.productcolor_set && product.productcolor_set.length > 3 && (
                                <span className="ds-more-count">+{product.productcolor_set.length - 3}</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="ds-sizes-display">
                              {product.productcolor_set?.[0]?.productcolorsize_set?.slice(0, 3).map((size, idx) => (
                                <span key={idx} className="ds-size-tag">{size.size}</span>
                              ))}
                              {product.productcolor_set?.[0]?.productcolorsize_set && product.productcolor_set[0].productcolorsize_set.length > 3 && (
                                <span className="ds-more-count">+{product.productcolor_set[0].productcolorsize_set.length - 3}</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="ds-action-cell">
                              <button className="ds-action-btn ds-view" onClick={() => handleViewProductDetails(product)} title="View Details">
                                <Eye size={16} />
                              </button>
                              <button 
                                className="ds-action-btn ds-edit" 
                                title="Edit Product"
                                onClick={() => handleEditProductClick(product)}
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                className="ds-action-btn ds-stock"
                                onClick={() => handleAddStockClick(product)}
                                title="Add Stock"
                              >
                                <PackageOpen size={16} />
                              </button>
                              <button className="ds-action-btn ds-delete"
                                onClick={() => handleDeleteProduct(product.id)}
                                title="Delete Product"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                          <div className="ds-empty-state">
                            <Package size={32} />
                            <p>No products found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="ds-pagination">
              <button 
                className="ds-pagination-btn" 
                onClick={() => setCurrentProductPage(prev => Math.max(prev - 1, 1))}
                disabled={currentProductPage === 1}
              >
                Previous
              </button>
              <div className="ds-page-numbers">
                {Array.from({ length: totalProductPages }, (_, i) => i + 1)
                  .filter(page => {
                    if (totalProductPages <= 7) return true;
                    if (page === 1 || page === totalProductPages) return true;
                    if (Math.abs(page - currentProductPage) <= 1) return true;
                    return false;
                  })
                  .map((page, index, array) => {
                    if (index > 0 && page - array[index - 1] > 1) {
                      return (
                        <span key={`ellipsis-${page}`}>...</span>
                      );
                    }
                    return (
                      <button
                        key={page}
                        className={`ds-page-btn ${currentProductPage === page ? 'ds-active' : ''}`}
                        onClick={() => setCurrentProductPage(page)}
                      >
                        {page}
                      </button>
                    );
                  })}
              </div>
              <button 
                className="ds-pagination-btn"
                onClick={() => setCurrentProductPage(prev => Math.min(prev + 1, totalProductPages))}
                disabled={currentProductPage === totalProductPages}
              >
                Next
              </button>
            </div>
          </div>
        );
      
      case 'customers':
        if (isLoading && !dataLoaded.customers) {
          return (
            <div className="ds-loading-state">
              <Loader size={32} className="ds-spinning" />
              <p>Loading customers...</p>
            </div>
          );
        }

        return (
          <div className="ds-customers-content">
            <div className="ds-content-toolbar">
              <div className="ds-search-filter">
                <div className="ds-search-box">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                  />
                </div>
                <select className="ds-status-filter">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <button className="ds-btn ds-btn-primary" onClick={handleOpenAddCustomerModal}>
                <UserPlus size={16} />
                Add Customer
              </button>
            </div>
            
            <div className="ds-table-container">
              <table className="ds-data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers && paginatedCustomers.length > 0 ? (
                    paginatedCustomers.map(customer => (
                      <tr key={customer.id}>
                        <td>
                          <div className="ds-customer-cell">
                            <div className="ds-customer-avatar">
                              {customer.first_name?.charAt(0) || 'C'}
                            </div>
                            <div className="ds-customer-info">
                              <div className="ds-customer-name">{customer.first_name || ''} {customer.last_name || ''}</div>
                              <div className="ds-customer-join">Joined {new Date(customer.date_joined || Date.now()).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </td>
                        <td>{customer.email || ''}</td>
                        <td>{customer.phone_number || ''}</td>
                        <td>
                          <div className="ds-order-count">
                            <span className="ds-count-badge">{customer.order_count || 0}</span>
                          </div>
                        </td>
                        <td>
                          <strong>{customer?.total_spent ?? 0}DT</strong>
                        </td>
                        <td>
                          <div className="ds-status-cell">
                            <span className={`ds-status-badge ds-${customer?.is_active ? "active" : "inactive"}`}>
                              {customer?.is_active ? "active" : "inactive"}
                            </span>
                            {customer.is_admin && (
                              <span className="ds-admin-badge" title="Administrator">
                                <ShieldIcon size={10} />
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="ds-action-cell">
                            <button className="ds-action-btn ds-view" title="View Details">
                              <Eye size={16} />
                            </button>
                            <button 
                              className="ds-action-btn ds-edit" 
                              title="Edit Customer"
                              onClick={() => handleEditCustomerClick(customer)}
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="ds-action-btn ds-admin"
                              onClick={() => handleToggleAdmin(customer.id)}
                              title={customer.is_admin ? "Remove Admin" : "Make Admin"}
                            >
                              {customer.is_admin ? <UserMinus size={16} /> : <UserCheck size={16} />}
                            </button>
                            <button 
                              className="ds-action-btn ds-delete"
                              onClick={() => handleDeleteCustomer(customer.id)}
                              title="Delete Customer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                        <div className="ds-empty-state">
                          <Users size={32} />
                          <p>No customers found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="ds-pagination">
              <button 
                className="ds-pagination-btn" 
                onClick={() => setCurrentCustomerPage(prev => Math.max(prev - 1, 1))}
                disabled={currentCustomerPage === 1}
              >
                Previous
              </button>
              <div className="ds-page-numbers">
                {Array.from({ length: totalCustomerPages }, (_, i) => i + 1)
                  .filter(page => {
                    if (totalCustomerPages <= 7) return true;
                    if (page === 1 || page === totalProductPages) return true;
                    if (Math.abs(page - currentCustomerPage) <= 1) return true;
                    return false;
                  })
                  .map((page, index, array) => {
                    if (index > 0 && page - array[index - 1] > 1) {
                      return (
                        <span key={`ellipsis-${page}`}>...</span>
                      );
                    }
                    return (
                      <button
                        key={page}
                        className={`ds-page-btn ${currentCustomerPage === page ? 'ds-active' : ''}`}
                        onClick={() => setCurrentCustomerPage(page)}
                      >
                        {page}
                      </button>
                    );
                  })}
              </div>
              <button 
                className="ds-pagination-btn"
                onClick={() => setCurrentCustomerPage(prev => Math.min(prev + 1, totalCustomerPages))}
                disabled={currentCustomerPage === totalCustomerPages}
              >
                Next
              </button>
            </div>
          </div>
        );
      
      case 'analytics':
        return (
          <div className="ds-analytics-content">
            <div className="ds-analytics-header">
              <div className="ds-view-selector">
                <button 
                  className={`ds-view-option ${analyticsView === 'overview' ? 'ds-active' : ''}`}
                  onClick={() => setAnalyticsView('overview')}
                >
                  Overview
                </button>
                <button 
                  className={`ds-view-option ${analyticsView === 'sales' ? 'ds-active' : ''}`}
                  onClick={() => setAnalyticsView('sales')}
                >
                  Sales
                </button>
                <button 
                  className={`ds-view-option ${analyticsView === 'customers' ? 'ds-active' : ''}`}
                  onClick={() => setAnalyticsView('customers')}
                >
                  Customers
                </button>
                <button 
                  className={`ds-view-option ${analyticsView === 'traffic' ? 'ds-active' : ''}`}
                  onClick={() => setAnalyticsView('traffic')}
                >
                  Traffic
                </button>
              </div>
              <div className="ds-date-range">
                <Calendar size={18} />
                <select>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>This year</option>
                </select>
              </div>
            </div>
            
            <div className="ds-analytics-grid">
              <div className="ds-metric-card">
                <div className="ds-metric-header">
                  <h4>Total Sales</h4>
                  <div className="ds-metric-trend ds-trend-up">
                    <TrendingUp size={16} />
                    <span>+0%</span>
                  </div>
                </div>
                <div className="ds-metric-value">$0</div>
                <div className="ds-metric-chart">
                  <div className="ds-mini-chart">
                    {[30, 50, 70, 60, 80, 90, 85].map((h, i) => (
                      <div key={i} className="ds-mini-bar" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="ds-metric-card">
                <div className="ds-metric-header">
                  <h4>Conversion Rate</h4>
                  <div className="ds-metric-trend ds-trend-up">
                    <TrendingUp size={16} />
                    <span>+0%</span>
                  </div>
                </div>
                <div className="ds-metric-value">0%</div>
                <div className="ds-metric-progress">
                  <div className="ds-progress-bar">
                    <div className="ds-progress-fill" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="ds-metric-card">
                <div className="ds-metric-header">
                  <h4>Average Order Value</h4>
                  <div className="ds-metric-trend ds-trend-down">
                    <TrendingDown size={16} />
                    <span>-0%</span>
                  </div>
                </div>
                <div className="ds-metric-value">$0</div>
                <div className="ds-metric-change">From $0</div>
              </div>
              
              <div className="ds-metric-card">
                <div className="ds-metric-header">
                  <h4>Returning Customers</h4>
                  <div className="ds-metric-trend ds-trend-up">
                    <TrendingUp size={16} />
                    <span>+0%</span>
                  </div>
                </div>
                <div className="ds-metric-value">0%</div>
                <div className="ds-metric-description">Of total customers</div>
              </div>
            </div>
            
            <div className="ds-main-chart">
              <div className="ds-chart-header">
                <h3>Revenue Trends</h3>
                <div className="ds-chart-legend">
                  <div className="ds-legend-item">
                    <div className="ds-legend-dot ds-current"></div>
                    <span>Current Period</span>
                  </div>
                  <div className="ds-legend-item">
                    <div className="ds-legend-dot ds-previous"></div>
                    <span>Previous Period</span>
                  </div>
                </div>
              </div>
              <div className="ds-chart-visualization-large">
                <div className="ds-chart-grid">
                  <div className="ds-grid-line"></div>
                  <div className="ds-grid-line"></div>
                  <div className="ds-grid-line"></div>
                  <div className="ds-grid-line"></div>
                </div>
                <div className="ds-chart-line ds-current">
                  {[30, 45, 60, 75, 65, 80, 90].map((point, i) => (
                    <div key={i} className="ds-chart-point" style={{ left: `${i * 14.28}%`, bottom: `${point}%` }}></div>
                  ))}
                </div>
                <div className="ds-chart-line ds-previous">
                  {[25, 35, 50, 60, 55, 70, 75].map((point, i) => (
                    <div key={i} className="ds-chart-point" style={{ left: `${i * 14.28}%`, bottom: `${point}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="ds-notifications-content">
            <div className="ds-notifications-header">
              <div className="ds-filter-tabs">
                <button 
                  className={`ds-filter-tab ${notificationFilter === 'all' ? 'ds-active' : ''}`}
                  onClick={() => setNotificationFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`ds-filter-tab ${notificationFilter === 'order' ? 'ds-active' : ''}`}
                  onClick={() => setNotificationFilter('order')}
                >
                  Orders
                </button>
                <button 
                  className={`ds-filter-tab ${notificationFilter === 'stock' ? 'ds-active' : ''}`}
                  onClick={() => setNotificationFilter('stock')}
                >
                  Stock
                </button>
                <button 
                  className={`ds-filter-tab ${notificationFilter === 'system' ? 'ds-active' : ''}`}
                  onClick={() => setNotificationFilter('system')}
                >
                  System
                </button>
              </div>
              <div className="ds-notification-actions">
                <button 
                  className="ds-btn ds-btn-secondary"
                  onClick={handleMarkAllNotificationsRead}
                >
                  Mark all as read
                </button>
                <button 
                  className="ds-btn ds-btn-outline"
                  onClick={() => {}}
                >
                  <Settings size={16} />
                  Settings
                </button>
              </div>
            </div>
            
            <div className="ds-notifications-list">
              {filteredNotifications.length === 0 ? (
                <div className="ds-empty-state">
                  <Bell size={48} />
                  <h3>No notifications</h3>
                  <p>You're all caught up!</p>
                </div>
              ) : (
                filteredNotifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`ds-notification-item ${notification.read ? 'ds-read' : 'ds-unread'}`}
                  >
                    <div className="ds-notification-icon">
                      {notification.type === 'order' && <ShoppingBag size={20} />}
                      {notification.type === 'stock' && <Package size={20} />}
                      {notification.type === 'review' && <TrendingUp size={20} />}
                      {notification.type === 'system' && <Settings size={20} />}
                    </div>
                    <div className="ds-notification-content">
                      <div className="ds-notification-message">
                        {notification.message || ''}
                        {!notification.read && <div className="ds-unread-dot"></div>}
                      </div>
                      <div className="ds-notification-time">{notification.time || ''}</div>
                    </div>
                    <div className="ds-notification-actions">
                      {!notification.read && (
                        <button className="ds-mark-read-btn" onClick={() => {}}>
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button 
                        className="ds-delete-btn"
                        onClick={() => handleDeleteNotification(notification.id)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="ds-settings-content">
            <div className="ds-settings-sidebar">
              {settingTabs.map(tab => (
                <button
                  key={tab.id}
                  className={`ds-settings-tab ${activeSettingTab === tab.id ? 'ds-active' : ''}`}
                  onClick={() => setActiveSettingTab(tab.id)}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="ds-settings-main">
              {activeSettingTab === 'general' && (
                <div className="ds-settings-section">
                  <h3>Store Settings</h3>
                  <div className="ds-settings-form">
                    <div className="ds-form-group">
                      <label>Store Name</label>
                      <input 
                        type="text" 
                        value={settings.store.name || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          store: { ...settings.store, name: e.target.value }
                        })}
                      />
                    </div>
                    <div className="ds-form-row">
                      <div className="ds-form-group">
                        <label>Store Email</label>
                        <input 
                          type="email" 
                          value={settings.store.email || ''}
                          onChange={(e) => setSettings({
                            ...settings,
                            store: { ...settings.store, email: e.target.value }
                          })}
                        />
                      </div>
                      <div className="ds-form-group">
                        <label>Store Phone</label>
                        <input 
                          type="text" 
                          value={settings.store.phone || ''}
                          onChange={(e) => setSettings({
                            ...settings,
                            store: { ...settings.store, phone: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                    <div className="ds-form-group">
                      <label>Store Address</label>
                      <textarea 
                        value={settings.store.address || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          store: { ...settings.store, address: e.target.value }
                        })}
                        rows="3"
                      />
                    </div>
                    <div className="ds-form-row">
                      <div className="ds-form-group">
                        <label>Currency</label>
                        <select 
                          value={settings.store.currency || 'USD'}
                          onChange={(e) => setSettings({
                            ...settings,
                            store: { ...settings.store, currency: e.target.value }
                          })}
                        >
                          <option>USD</option>
                          <option>EUR</option>
                          <option>GBP</option>
                        </select>
                      </div>
                      <div className="ds-form-group">
                        <label>Tax Rate (%)</label>
                        <input 
                          type="number" 
                          value={settings.store.taxRate || 0}
                          onChange={(e) => setSettings({
                            ...settings,
                            store: { ...settings.store, taxRate: parseFloat(e.target.value) || 0 }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeSettingTab === 'shipping' && (
                <div className="ds-settings-section">
                  <h3>Shipping Methods</h3>
                  <div className="ds-shipping-methods">
                    {settings.shipping.map(method => (
                      <div key={method.id} className="ds-shipping-method">
                        <div className="ds-method-header">
                          <div className="ds-method-info">
                            <h4>{method.name || ''}</h4>
                            <div className="ds-method-details">
                              <span className="ds-method-cost">${method.cost || 0}</span>
                              <span className="ds-method-delivery">{method.delivery || ''}</span>
                            </div>
                          </div>
                          <label className="ds-switch">
                            <input 
                              type="checkbox" 
                              checked={method.enabled || false}
                              onChange={() => {
                                const updatedMethods = settings.shipping.map(m => 
                                  m.id === method.id ? { ...m, enabled: !m.enabled } : m
                                );
                                setSettings({ ...settings, shipping: updatedMethods });
                              }}
                            />
                            <span className="ds-slider"></span>
                          </label>
                        </div>
                      </div>
                    ))}
                    <button className="ds-btn ds-btn-outline">
                      <Plus size={16} />
                      Add Shipping Method
                    </button>
                  </div>
                </div>
              )}
              
              {activeSettingTab === 'payment' && (
                <div className="ds-settings-section">
                  <h3>Payment Gateways</h3>
                  <div className="ds-payment-methods">
                    <div className="ds-payment-method">
                      <div className="ds-method-header">
                        <div className="ds-method-info">
                          <div className="ds-method-icon">
                            <CreditCard size={24} />
                          </div>
                          <div>
                            <h4>Stripe</h4>
                            <p>Credit & Debit Cards</p>
                          </div>
                        </div>
                        <label className="ds-switch">
                          <input 
                            type="checkbox" 
                            checked={settings.payment.stripe.enabled || false}
                            onChange={() => setSettings({
                              ...settings,
                              payment: { 
                                ...settings.payment, 
                                stripe: { ...settings.payment.stripe, enabled: !settings.payment.stripe.enabled }
                              }
                            })}
                          />
                          <span className="ds-slider"></span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="ds-payment-method">
                      <div className="ds-method-header">
                        <div className="ds-method-info">
                          <div className="ds-method-icon">
                            <Globe size={24} />
                          </div>
                          <div>
                            <h4>PayPal</h4>
                            <p>PayPal Express Checkout</p>
                          </div>
                        </div>
                        <label className="ds-switch">
                          <input 
                            type="checkbox" 
                            checked={settings.payment.paypal.enabled || false}
                            onChange={() => setSettings({
                              ...settings,
                              payment: { 
                                ...settings.payment, 
                                paypal: { ...settings.payment.paypal, enabled: !settings.payment.paypal.enabled }
                              }
                            })}
                          />
                          <span className="ds-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeSettingTab === 'notifications' && (
                <div className="ds-settings-section">
                  <h3>Notification Settings</h3>
                  <div className="ds-notification-settings">
                    <div className="ds-setting-item">
                      <div className="ds-setting-info">
                        <h4>Email Notifications</h4>
                        <p>Receive notifications via email</p>
                      </div>
                      <label className="ds-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.notifications.email || false}
                          onChange={() => setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, email: !settings.notifications.email }
                          })}
                        />
                        <span className="ds-slider"></span>
                      </label>
                    </div>
                    
                    <div className="ds-setting-item">
                      <div className="ds-setting-info">
                        <h4>Push Notifications</h4>
                        <p>Receive browser push notifications</p>
                      </div>
                      <label className="ds-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.notifications.push || false}
                          onChange={() => setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, push: !settings.notifications.push }
                          })}
                        />
                        <span className="ds-slider"></span>
                      </label>
                    </div>
                    
                    <div className="ds-setting-item">
                      <div className="ds-setting-info">
                        <h4>Low Stock Alerts</h4>
                        <p>Get notified when products are running low</p>
                      </div>
                      <label className="ds-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.notifications.lowStock || false}
                          onChange={() => setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, lowStock: !settings.notifications.lowStock }
                          })}
                        />
                        <span className="ds-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="ds-settings-actions">
                <button className="ds-btn ds-btn-secondary" onClick={() => {
                  if (window.confirm('Reset all settings to default?')) {
                    setSettings({
                      store: { name: '', email: '', phone: '', address: '', currency: 'USD', taxRate: 0 },
                      shipping: [],
                      payment: { stripe: { enabled: false }, paypal: { enabled: false }, cod: { enabled: false } },
                      notifications: { email: false, push: false, lowStock: false, newOrders: false }
                    });
                  }
                }}>
                  Reset to Default
                </button>
                <button 
                  className="ds-btn ds-btn-primary"
                  onClick={handleSaveSettings}
                  disabled={isSavingSettings}
                >
                  {isSavingSettings ? (
                    <>
                      <Loader size={16} className="ds-spinner" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderOrderDetailsModal = () => {
    if (!showOrderDetails || !orderDetailsData) return null;

    return (
      <div className="ds-modal-overlay" onClick={() => setShowOrderDetails(false)}>
        <div className="ds-modal ds-large" onClick={(e) => e.stopPropagation()}>
          <div className="ds-modal-header">
            <h3>Order Details - {selectedOrder ? `ORD-${selectedOrder.id || selectedOrder.order_id}` : 'N/A'}</h3>
            <div className="ds-modal-actions">
              <button className="ds-modal-close" onClick={() => setShowOrderDetails(false)}>
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="ds-modal-body">
            <div className="ds-order-details-modal">
              <div className="ds-order-info-grid">
                <div className="ds-info-section">
                  <h4>Customer Information</h4>
                  <div className="ds-info-item">
                    <span className="ds-info-label">Name</span>
                    <span className="ds-info-value">{orderDetailsData[0]?.user_orders__user__first_name || ''} {orderDetailsData[0]?.user_orders__user__last_name || ''}</span>
                  </div>
                  <div className="ds-info-item">
                    <span className="ds-info-label">Email</span>
                    <span className="ds-info-value">{orderDetailsData[0]?.user_orders__user__email || ''}</span>
                  </div>
                  <div className="ds-info-item">
                    <span className="ds-info-label">Phone</span>
                    <span className="ds-info-value">{orderDetailsData[0]?.user_orders__user__phone_number || ''}</span>
                  </div>
                </div>
                
                <div className="ds-info-section">
                  <h4>Shipping Information</h4>
                  <div className="ds-info-item">
                    <span className="ds-info-label">Address</span>
                    <span className="ds-info-value">{orderDetailsData?.address?.street || ''}</span>
                  </div>
                  <div className="ds-info-item">
                    <span className="ds-info-label">City</span>
                    <span className="ds-info-value">{orderDetailsData?.address?.city || ''}</span>
                  </div>
                  <div className="ds-info-item">
                    <span className="ds-info-label">Country</span>
                    <span className="ds-info-value">{orderDetailsData?.address?.country || ''}</span>
                  </div>
                </div>
              </div>
              
              <div className="ds-order-items">
                <h4>Order Items</h4>
                <div className="ds-items-list">
                  <div className="ds-order-item-header">
                    <div className="ds-header-col ds-col-product">Product</div>
                    <div className="ds-header-col ds-col-size">Size</div>
                    <div className="ds-header-col ds-col-color">Color</div>
                    <div className="ds-header-col ds-col-quantity">Quantity</div>
                    <div className="ds-header-col ds-col-price">Price</div>
                    <div className="ds-header-col ds-col-total">Total</div>
                  </div>
                  {(orderDetailsData || []).map((item) => (
                    <div key={item?.id} className="ds-order-item-row">
                      <div className="ds-item-col ds-col-product">
                        <div className="ds-item-name">{item?.user_orders__user__email || "Unknown Product"}</div>
                      </div>
                      <div className="ds-item-col ds-col-size">{item?.size || "-"}</div>
                      <div className="ds-item-col ds-col-color">
                        <div
                          className="ds-color-indicator"
                          style={{ backgroundColor: item?.color || "#ccc" }}
                        ></div>
                        {item?.color || "N/A"}
                      </div>
                      <div className="ds-item-col ds-col-quantity">{item?.quantity || 0}</div>
                      <div className="ds-item-col ds-col-price">${item?.price || "0.00"}</div>
                      <div className="ds-item-col ds-col-total">${item?.total_price || "0.00"}</div>
                    </div>
                  ))}
                </div>
                
                <div className="ds-order-totals">
                  <div className="ds-total-row ds-grand-total">
                    <span>Grand Total</span>
                    <span>${orderDetailsData?.orders__total_price || "0.00"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ds-modal-footer">
            <button className="ds-btn ds-btn-secondary" onClick={() => setShowOrderDetails(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderProductDetailsModal = () => {
    if (!showProductDetails || !selectedProduct) return null;

    return (
      <div className="ds-modal-overlay" onClick={() => setShowProductDetails(false)}>
        <div className="ds-modal ds-large" onClick={(e) => e.stopPropagation()}>
          <div className="ds-modal-header">
            <h3>{selectedProduct.name || 'Product Details'}</h3>
            <div className="ds-modal-actions">
              <button className="ds-modal-close" onClick={() => setShowProductDetails(false)}>
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="ds-modal-body">
            <div className="ds-product-details-modal">
              <div className="ds-product-main-info">
                <div className="ds-product-image-large">
                  <div className="ds-image-container">
                    {selectedProduct.productcolor_set && selectedProduct.productcolor_set[0] && selectedProduct.productcolor_set[0].image ? (
                      <img src={selectedProduct.productcolor_set[0].image} alt={selectedProduct.name} />
                    ) : (
                      <div className="ds-image-placeholder-large">
                        <Package size={48} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="ds-product-info-details">
                  <h3>{selectedProduct.name}</h3>
                  <div className="ds-product-category-large">{selectedProduct.category || 'Uncategorized'}</div>
                  <div className="ds-product-price-large">${selectedProduct.price || 0}</div>
                  <div className="ds-product-stats-details">
                    <div className="ds-stat-detail">
                      <span className="ds-stat-label">Sold:</span>
                      <span className="ds-stat-value">{selectedProduct.Purchases || 0} units</span>
                    </div>
                    <div className="ds-stat-detail">
                      <span className="ds-stat-label">Status:</span>
                      <span className={`ds-status-badge ds-${selectedProduct.status || 'available'}`}>
                        {selectedProduct.status || 'available'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="ds-product-variants-section">
                <h4>Product Variants</h4>
                
                {selectedProduct.productcolor_set && selectedProduct.productcolor_set.length > 0 ? (
                  <div className="ds-colors-container">
                    <h5>Colors</h5>
                    <div className="ds-colors-grid">
                      {selectedProduct.productcolor_set.map((color) => (
                        <div key={color.id} className="ds-color-card">
                          <div className="ds-color-preview" style={{ backgroundColor: color.color || '#ccc' }}>
                            {color.image ? (
                              <img src={color.image} alt={color.color} />
                            ) : null}
                          </div>
                          <div className="ds-color-info">
                            <div className="ds-color-name">{color.color || 'Unnamed'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="ds-empty-variants">
                    <Palette size={32} />
                    <p>No colors added yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="ds-modal-footer">
            <button className="ds-btn ds-btn-secondary" onClick={() => setShowProductDetails(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="ds-dashboard">
      <header className="ds-mobile-header">
        <button 
          className="ds-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className={`ds-hamburger ${mobileMenuOpen ? 'ds-active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <div className="ds-logo">
          <h1>Dashboard</h1>
        </div>
        <div className="ds-mobile-header-actions">
          <button className="ds-notification-btn" onClick={() => setActiveSection('notifications')}>
            <Bell size={20} />
            {notifications.filter(n => !n?.read).length > 0 && (
              <span className="ds-notification-badge">{notifications.filter(n => !n?.read).length}</span>
            )}
          </button>
        </div>
      </header>

      {!sidebarOpen && (
        <button 
          className="ds-sidebar-toggle-fixed"
          onClick={() => setSidebarOpen(true)}
          onMouseEnter={() => setSidebarHover(true)}
          onMouseLeave={() => setSidebarHover(false)}
        >
          <ChevronsRight size={20} className={sidebarHover ? 'ds-pulse' : ''} />
        </button>
      )}

      <aside className={`ds-sidebar ${sidebarOpen ? 'ds-open' : ''} ${mobileMenuOpen ? 'ds-mobile-open' : ''}`}>
        <div className="ds-sidebar-header">
          <div className="ds-logo">
            <h1>Dashboard</h1>
          </div>
          <button 
            className="ds-sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ChevronsLeft size={20} />
          </button>
        </div>

        <nav className="ds-sidebar-nav">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`ds-nav-item ${activeSection === section.id ? 'ds-active' : ''}`}
              onClick={() => {
                setActiveSection(section.id);
                setMobileMenuOpen(false);
              }}
            >
              <span className="ds-nav-icon">{section.icon}</span>
              <span className="ds-nav-label">{section.label}</span>
              {section.badge > 0 && (
                <span className="ds-nav-badge">{section.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="ds-sidebar-footer">
          <div className="ds-user-info">
            <div className="ds-avatar">AD</div>
            <div className="ds-user-details">
              <h4>Admin User</h4>
              <span className="ds-user-role">Administrator</span>
            </div>
          </div>
          <div className="ds-user-menu">
            <button 
              className="ds-user-menu-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <MoreVertical size={18} />
            </button>
            {showUserMenu && (
              <div className="ds-user-dropdown">
                <button className="ds-dropdown-item" onClick={() => setActiveSection('settings')}>
                  <Settings size={16} />
                  Settings
                </button>
                <div className="ds-dropdown-divider"></div>
                <button className="ds-dropdown-item ds-logout" onClick={() => {
                  if (window.confirm('Are you sure you want to logout?')) {
                  }
                }}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div 
          className="ds-sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <main className={`ds-main-content ${sidebarOpen ? 'ds-sidebar-open' : ''}`}>
        <div className="ds-content-header">
          <div className="ds-header-left">
            <h2>{sections.find(s => s.id === activeSection)?.label}</h2>
            <p className="ds-header-subtitle">
              {activeSection === 'overview' && 'Welcome back! Here\'s what\'s happening with your store today.'}
              {activeSection === 'orders' && 'Manage and track all customer orders.'}
              {activeSection === 'products' && 'View and manage your product inventory.'}
              {activeSection === 'customers' && 'Customer database and insights.'}
              {activeSection === 'analytics' && 'Detailed analytics and reports.'}
              {activeSection === 'notifications' && 'System alerts and notifications.'}
              {activeSection === 'settings' && 'Configure your store settings.'}
            </p>
          </div>
          
          <div className="ds-header-actions">
            <div className="ds-header-info">
              <div className="ds-last-update">
                <RefreshCw size={14} />
                <span>Last updated: Just now</span>
              </div>
            </div>
          </div>
        </div>

        <div className="ds-content-container">
          {renderContent()}
        </div>
      </main>

      {renderOrderDetailsModal()}
      {renderProductDetailsModal()}
      {showAddOrderModal && renderAddOrderModal()}
      {showEditOrderModal && renderEditOrderModal()}
      {showAddProductModal && renderAddProductModal()}
      {showEditProductModal && renderEditProductModal()}
      {showAddCustomerModal && renderAddCustomerModal()}
      {showEditCustomerModal && renderEditCustomerModal()}
      {showAddStockModal && renderAddStockModal()}

      {notifications.some(n => !n?.read) && (
        <div className="ds-notification-toast">
          <div className="ds-toast-header">
            <Bell size={16} />
            <span>You have {notifications.filter(n => !n?.read).length} unread notifications</span>
          </div>
          <button 
            className="ds-toast-action"
            onClick={() => {
              setActiveSection('notifications');
            }}
          >
            View
          </button>
        </div>
      )}

      <BackToTopButton/>
    </div>
  );
};

export default Dashboard;