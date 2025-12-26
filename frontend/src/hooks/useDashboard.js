import { useState, useEffect } from 'react';
import api from "../services/api.js"
import { getOrderDetails, addProduct, updateProduct } from "../services/dashboard.js"

export const useDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarHover, setSidebarHover] = useState(false);
  const [orders, setOrders] = useState([]);
  const [homeInfo, setHomeInfo] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [orderDetailsData, setOrderDetailsData] = useState(null);
  const [productFilter, setProductFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [chartType, setChartType] = useState('sales');
  const [dateRange, setDateRange] = useState('month');
  const [analyticsView, setAnalyticsView] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [notificationFilter, setNotificationFilter] = useState('all');
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [settings, setSettings] = useState({
    store: { name: '', email: '', phone: '', address: '', currency: 'USD', taxRate: 0 },
    shipping: [],
    payment: { stripe: { enabled: false }, paypal: { enabled: false }, cod: { enabled: false } },
    notifications: { email: false, push: false, lowStock: false, newOrders: false }
  });
  const [newProductData, setNewProductData] = useState({
  name: '',
  price: 0,
  description: '',
  productcolor_set: [
    {
      color: '',
      image: null,
      productcolorsize_set: [
        { size: '', stock: 0 }
      ]
    }
  ]
});

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const colorOptions = ["White", "Black", "Red", "Blue"];
  const [activeSettingTab, setActiveSettingTab] = useState('general');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const [currentCustomerPage, setCurrentCustomerPage] = useState(1);
  const [dataLoaded, setDataLoaded] = useState({
    overview: false,
    orders: false,
    products: false,
    customers: false
  });
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showEditOrderModal, setShowEditOrderModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [stockingProduct, setStockingProduct] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const itemsPerPage = 10;

  const apiMap = {
    overview: '/dashboard/getHomeInfo/',
    orders: '/dashboard/getOrders/',
    products: '/dashboard/getProducts/',
    customers: '/dashboard/getUsers/',
  };

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(apiMap[activeSection]);
        const data = response.data.data ?? response.data;

        if (activeSection === "overview") {
          setHomeInfo(data || {});
          setOrders(data?.Recent_orders || []);
          setProducts(data?.Top_Selling || []);
        }
        if (activeSection === "orders") setOrders(data || []);
        if (activeSection === "products") setProducts(data || []);
        if (activeSection === "customers") setCustomers(data || []);
        
        setDataLoaded(prev => ({ ...prev, [activeSection]: true }));
      } catch (error) {
        console.error('Error fetching data:', error);
        setHomeInfo(null);
        setOrders([]);
        setProducts([]);
        setCustomers([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (apiMap[activeSection]) getData();
  }, [activeSection]);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1200);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getOrderItems = async (orderId) => {
    setIsLoading(true);
    try {
      const response = await getOrderDetails(orderId);
      setOrderDetailsData(response || {});
      return response;
    } catch (error) {
      console.error('Error fetching order details:', error);
      setOrderDetailsData(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewOrderDetails = async (order) => {
    if (!order) return;
    setSelectedOrder(order);
    const data = await getOrderItems(order.order_id || order.id);
    if (data) setShowOrderDetails(true);
  };

   const handleAddStockClick = (product) => {
    setStockData({
      quantity: 0,
      size: product.productcolor_set?.[0]?.productcolorsize_set?.[0]?.size || '',
      color: product.productcolor_set?.[0]?.color || ''
    });
    handleOpenAddStockModal(product);
  };

  const handleViewProductDetails = (product) => {
    if (!product) return;
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const handleOrderStatusChange = (orderId, newStatus) => {
    if (newStatus === 'cancelled' && !window.confirm(`Cancel order ${orderId}?`)) return;
    setOrders(orders.map(order => 
      (order.id === orderId || order.order_id === orderId) ? { ...order, status: newStatus } : order
    ));
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm(`Delete order ${orderId}?`)) {
      setOrders(orders.filter(order => order.id !== orderId && order.order_id !== orderId));
    }
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Delete this product?')) {
      setProducts(products.filter(product => product.id !== productId));
    }
  };

  const handleDeleteCustomer = (customerId) => {
    if (window.confirm('Delete this customer?')) {
      setCustomers(customers.filter(customer => customer.id !== customerId));
    }
  };

  const handleToggleAdmin = (customerId) => {
    setCustomers(customers.map(customer => 
      customer.id === customerId ? { ...customer, is_admin: !customer.is_admin } : customer
    ));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications(notifications.filter(notif => notif.id !== notificationId));
  };

  const handleSaveSettings = () => {
    setIsSavingSettings(true);
    setTimeout(() => {
      setIsSavingSettings(false);
    }, 1000);
  };

  const handleExportData = (format) => {
    setShowExportDropdown(false);
  };

  const handleOpenAddOrderModal = () => {
    setEditingOrder(null);
    setShowAddOrderModal(true);
  };

  const handleOpenEditOrderModal = (order) => {
    setEditingOrder(order);
    setShowEditOrderModal(true);
  };

  const handleOpenAddProductModal = () => {
    setEditingProduct(null);
    setNewProductData({
      name: '',
      price: 0,
      description: '',
      productcolor_set: [
        {
          color: '',
          image: null,
          productcolorsize_set: [
            { size: '', stock: 0 }
          ]
        }
      ]
    });
    setShowAddProductModal(true);
  };

  const handleOpenEditProductModal = (product) => {
    setEditingProduct(product);
    setNewProductData({
      name: product.name,
      price: product.price,
      description: product.description,
      productcolor_set: product.productcolor_set.map(color => ({
        color: color.color,
        image: color.image,
        productcolorsize_set: color.productcolorsize_set.map(size => ({
          size: size.size,
          stock: size.stock
        }))
      }))
    });
    setShowEditProductModal(true);
  };

  const handleOpenAddCustomerModal = () => {
    setEditingCustomer(null);
    setShowAddCustomerModal(true);
  };

  const handleOpenEditCustomerModal = (customer) => {
    setEditingCustomer(customer);
    setShowEditCustomerModal(true);
  };

  const handleOpenAddStockModal = (product) => {
    setStockingProduct(product);
    setShowAddStockModal(true);
  };

  const handleSaveOrder = (orderData, isNew = true) => {
    setModalLoading(true);
    setTimeout(() => {
      if (isNew) {
        const newOrder = {
          id: Date.now(),
          order_id: Date.now(),
          ...orderData,
          status: 'pending',
          orders__created_at: new Date().toISOString()
        };
        setOrders([newOrder, ...orders]);
      } else {
        setOrders(orders.map(order => 
          order.id === orderData.id ? { ...order, ...orderData } : order
        ));
      }
      setModalLoading(false);
      setShowAddOrderModal(false);
      setShowEditOrderModal(false);
    }, 1000);
  };

const handleSaveProduct = async (productData, isNew = true) => {
  console.log("product data", productData);
  
  const colors = productData.productcolor_set.map(c => c.color);
  const uniqueColors = new Set(colors);
  if (colors.length !== uniqueColors.size) {
    alert("Each product can only have one entry per color. Please remove duplicate colors.");
    return;
  }

  setModalLoading(true);

  const formData = new FormData();
  formData.append('name', productData.name);
  formData.append('price', productData.price);
  formData.append('description', productData.description);

  productData.productcolor_set.forEach((color, i) => {
    formData.append(`productcolor_set[${i}][color]`, color.color);
    
    if (color.image instanceof File) {
      formData.append(`productcolor_set[${i}][image]`, color.image);
    } else if (color.image && typeof color.image === 'string') {
      formData.append(`productcolor_set[${i}][existing_image]`, color.image);
    }

    formData.append(
      `productcolor_set[${i}][productcolorsize_set]`,
      JSON.stringify(color.productcolorsize_set)
    );
  });

  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  try {
    if (isNew) {
      const response = await addProduct(formData);
      setProducts(prev => [response, ...prev]);
    } else {
      const response = await updateProduct(productData.id, formData);
      setProducts(prev =>
        prev.map(product =>
          product.id === productData.id ? response : product
        )
      );
    }
    setShowAddProductModal(false);
    setShowEditProductModal(false);

  } catch (error) {
    console.error("Error saving product:", error);
    
    if (error.productcolor_set) {
      alert("Error with product colors. Please check your color entries.");
    } else if (error.error) {
      alert(error.error);
    } else {
      alert("Something went wrong while saving the product.");
    }
  } finally {
    setModalLoading(false);
  }
};

  const handleSaveCustomer = (customerData, isNew = true) => {
    setModalLoading(true);
    setTimeout(() => {
      if (isNew) {
        const newCustomer = {
          id: Date.now(),
          ...customerData,
          date_joined: new Date().toISOString(),
          order_count: 0,
          total_spent: 0,
          is_active: true,
          is_admin: false
        };
        setCustomers([newCustomer, ...customers]);
      } else {
        setCustomers(customers.map(customer => 
          customer.id === customerData.id ? { ...customer, ...customerData } : customer
        ));
      }
      setModalLoading(false);
      setShowAddCustomerModal(false);
      setShowEditCustomerModal(false);
    }, 1000);
  };

    const handleProductChange = (field, value) => {
  setNewProductData(prev => ({ ...prev, [field]: value }));
};

const handleColorChange = (index, field, value) => {
  const colors = [...newProductData.productcolor_set];
  colors[index][field] = value;
  setNewProductData(prev => ({ ...prev, productcolor_set: colors }));
};

const handleSizeChange = (colorIndex, sizeIndex, field, value) => {
  const colors = [...newProductData.productcolor_set];
  colors[colorIndex].productcolorsize_set[sizeIndex][field] = value;
  setNewProductData(prev => ({ ...prev, productcolor_set: colors }));
};

const addColor = () => {
  setNewProductData(prev => ({
    ...prev,
    productcolor_set: [
      ...prev.productcolor_set,
      { color: '', image: null, productcolorsize_set: [{ size: '', stock: 0 }] }
    ]
  }));
};

  const addSize = (colorIndex) => {
    const colors = [...newProductData.productcolor_set];
    colors[colorIndex].productcolorsize_set.push({ size: '', stock: 0 });
    setNewProductData(prev => ({ ...prev, productcolor_set: colors }));
  };

  const removeColor = (colorIndex) => {
    const colors = [...newProductData.productcolor_set];
    colors.splice(colorIndex, 1);
    setNewProductData(prev => ({ ...prev, productcolor_set: colors }));
  };

  const removeSize = (colorIndex, sizeIndex) => {
    const colors = [...newProductData.productcolor_set];
    colors[colorIndex].productcolorsize_set.splice(sizeIndex, 1);
    setNewProductData(prev => ({ ...prev, productcolor_set: colors }));
  };

  const handleImageChange = (colorIndex, file) => {
    handleColorChange(colorIndex, 'image', file);
  };

  const validateProductData = (data) => {
    const errors = {};

    if (!data.name.trim()) errors.name = "Product name is required.";
    if (data.price <= 0) errors.price = "Price must be greater than 0.";
    if (!data.description.trim()) errors.description = "Description is required.";

    data.productcolor_set.forEach((color, i) => {
      if (!color.color) errors[`color-${i}`] = `Color #${i + 1} must be selected.`;
      if (!color.image) errors[`image-${i}`] = `Image for color #${i + 1} is required.`;

      color.productcolorsize_set.forEach((size, j) => {
        if (!size.size) errors[`size-${i}-${j}`] = `Size #${j + 1} for color #${i + 1} must be selected.`;
        if (size.stock < 0) errors[`stock-${i}-${j}`] = `Stock for size #${j + 1} of color #${i + 1} cannot be negative.`;
      });
    });

    return errors;
  };

  const handleAddStock = (productId, stockData) => {
    setModalLoading(true);
    setTimeout(() => {
      setProducts(products.map(product => {
        if (product.id === productId) {
          const updatedProduct = { ...product };
          if (updatedProduct.productcolor_set && updatedProduct.productcolor_set[0]) {
            if (!updatedProduct.productcolor_set[0].productcolorsize_set) {
              updatedProduct.productcolor_set[0].productcolorsize_set = [];
            }
            const existingSize = updatedProduct.productcolor_set[0].productcolorsize_set.find(s => s.size === stockData.size);
            if (existingSize) {
              existingSize.stock = (existingSize.stock || 0) + stockData.quantity;
            } else {
              updatedProduct.productcolor_set[0].productcolorsize_set.push({
                size: stockData.size,
                stock: stockData.quantity
              });
            }
          }
          return updatedProduct;
        }
        return product;
      }));
      setModalLoading(false);
      setShowAddStockModal(false);
    }, 1000);
  };

  const filteredOrders = (orders || []).filter(order => {
    if (orderFilter !== 'all' && order.status !== orderFilter) return false;
    if (orderSearch) {
      const searchLower = orderSearch.toLowerCase();
      const orderId = (order.id?.toString() || order.order_id?.toString() || '').toLowerCase();
      const firstName = order.orders__user__first_name?.toLowerCase() || '';
      const lastName = order.orders__user__last_name?.toLowerCase() || '';
      const email = order.orders__user__email?.toLowerCase() || '';
      
      return orderId.includes(searchLower) || 
             firstName.includes(searchLower) || 
             lastName.includes(searchLower) ||
             email.includes(searchLower);
    }
    return true;
  });

  const filteredProducts = (products || []).filter(product => {
    if (productFilter !== 'all' && product.category !== productFilter) return false;
    return true;
  });

  const filteredCustomers = (customers || []).filter(customer => {
    if (customerSearch) {
      const searchLower = customerSearch.toLowerCase();
      const firstName = customer.first_name?.toLowerCase() || '';
      const lastName = customer.last_name?.toLowerCase() || '';
      const email = customer.email?.toLowerCase() || '';
      
      return firstName.includes(searchLower) || 
             lastName.includes(searchLower) ||
             email.includes(searchLower);
    }
    return true;
  });

  const filteredNotifications = (notifications || []).filter(notification => {
    if (notificationFilter !== 'all' && notification.type !== notificationFilter) return false;
    return true;
  });

  const paginatedProducts = filteredProducts.slice(
    (currentProductPage - 1) * itemsPerPage,
    currentProductPage * itemsPerPage
  );

  const paginatedCustomers = filteredCustomers.slice(
    (currentCustomerPage - 1) * itemsPerPage,
    currentCustomerPage * itemsPerPage
  );

  const totalProductPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const totalCustomerPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const sections = [
    { id: 'overview', label: 'Dashboard', icon: 'overview' },
    { id: 'orders', label: 'Orders', icon: 'orders' },
    { id: 'products', label: 'Products', icon: 'products' },
    { id: 'customers', label: 'Customers', icon: 'customers' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications', badge: (notifications || []).filter(n => !n?.read).length },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  const orderStatuses = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending', color: '#ffc107' },
    { value: 'processing', label: 'Processing', color: '#17a2b8' },
    { value: 'completed', label: 'Completed', color: '#28a745' },
    { value: 'cancelled', label: 'Cancelled', color: '#dc3545' },
  ];

  const categories = ['All', 'Electronics', 'Clothing', 'Home', 'Books', 'Sports'];
  const chartTypes = [
    { id: 'sales', label: 'Sales', icon: 'sales' },
    { id: 'revenue', label: 'Revenue', icon: 'revenue' },
    { id: 'customers', label: 'Customers', icon: 'customers' },
    { id: 'traffic', label: 'Traffic', icon: 'traffic' },
  ];

  const dateRanges = [
    { id: 'week', label: 'Last Week' },
    { id: 'month', label: 'Last Month' },
    { id: 'quarter', label: 'Last Quarter' },
    { id: 'year', label: 'Last Year' },
  ];

  const settingTabs = [
    { id: 'general', label: 'General', icon: 'general' },
    { id: 'shipping', label: 'Shipping', icon: 'shipping' },
    { id: 'payment', label: 'Payment', icon: 'payment' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'integrations', label: 'Integrations', icon: 'integrations' },
    { id: 'security', label: 'Security', icon: 'security' },
  ];

  return {
    activeSection, setActiveSection,
    sidebarOpen, setSidebarOpen,
    mobileMenuOpen, setMobileMenuOpen,
    sidebarHover, setSidebarHover,
    orders, setOrders,
    homeInfo,
    sizeOptions ,
    setFormErrors,
    colorOptions,
    products, setProducts,
    customers, setCustomers,
    orderFilter, setOrderFilter,
    orderSearch, setOrderSearch,
    selectedOrder, setSelectedOrder,
    showOrderModal, setShowOrderModal,
    showOrderDetails, setShowOrderDetails,
    orderDetailsData,
    productFilter, setProductFilter,
    selectedProduct, setSelectedProduct,
    showProductModal, setShowProductModal,
    showProductDetails, setShowProductDetails,
    customerSearch, setCustomerSearch,
    selectedCustomer, setSelectedCustomer,
    showCustomerModal, setShowCustomerModal,
    chartType, setChartType,
    dateRange, setDateRange,
    analyticsView, setAnalyticsView,
    notifications, setNotifications,
    notificationFilter, setNotificationFilter,
    showNotificationSettings, setShowNotificationSettings,
    settings, setSettings,
    activeSettingTab, setActiveSettingTab,
    isSavingSettings, setIsSavingSettings,
    isLoading, setIsLoading,
    showExportDropdown, setShowExportDropdown,
    showFilterDropdown, setShowFilterDropdown,
    showUserMenu, setShowUserMenu,
    viewMode, setViewMode,
    currentProductPage, setCurrentProductPage,
    currentCustomerPage, setCurrentCustomerPage,
    totalProductPages,
    totalCustomerPages,
    dataLoaded,
    removeColor,
    removeSize,
    sections,
    orderStatuses,
    categories,
    chartTypes,
    dateRanges,
    settingTabs,
    showAddOrderModal, setShowAddOrderModal,
    showAddProductModal, setShowAddProductModal,
    showAddCustomerModal, setShowAddCustomerModal,
    showEditOrderModal, setShowEditOrderModal,
    showEditProductModal, setShowEditProductModal,
    showEditCustomerModal, setShowEditCustomerModal,
    showAddStockModal, setShowAddStockModal,
    editingOrder,
    handleProductChange,
    setNewProductData,
    newProductData,
    handleColorChange,
    handleSizeChange,
    addColor,
    addSize,
    handleImageChange ,
    editingProduct,
    editingCustomer,
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
    formErrors,
    handleSaveOrder,
    handleSaveProduct,
    handleSaveCustomer,
    validateProductData,
    handleAddStock,
    filteredOrders,
    filteredProducts,
    filteredCustomers,
    filteredNotifications,
    paginatedProducts,
    handleAddStockClick,
    setStockData,
    stockData,
    paginatedCustomers
  };
};