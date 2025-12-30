import { useMemo, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from "../services/api.js"
import { getOrderDetails, addProduct, updateProduct, UpdateStock, DeleteProduct, RegisterUser, UpdateUser, changeAdminStatus, deleteUser, cancelOrder, deleteOrder, getAnalyticsData} from "../services/dashboard.js"
import {EmailVerify, PhoneNumberVerify} from "../services/SignUp.js"

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
  const [productSearch, setProductSearch] = useState('');
  const [actionLockId, setActionLockId] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [stockData, setStockData] = useState({
    colorId: '',
    sizeId: '',
    quantity: 0,
    action: 'add'
  });
   const [newCustomerData, setNewCustomerData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      gender: '',
      isAdmin: false,
      old_email: '',
      old_phone: '',
    });
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
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDangerous: false
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
  const [analyticsChartRaw, setAnalyticsChartRaw] = useState({
    labels: [],
    values: []
  });
  const [analyticsMetrics, setAnalyticsMetrics] = useState({
    totalSales: 0,
    conversionRate: 0,
    avgOrderValue: 0,
    returningCustomers: 0,
    salesTrend: 0,
    conversionTrend: 0,
    avgOrderTrend: 0,
    customerTrend: 0
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

  const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
    const apiMsg = error?.response?.data?.message;
    const apiErr = error?.response?.data?.error;
    const firstFieldError = (() => {
      const data = error?.response?.data;
      if (!data || typeof data !== 'object') return null;
      const key = Object.keys(data).find(k => k !== 'message' && k !== 'error');
      const v = key ? data[key] : null;
      return Array.isArray(v) ? v[0] : typeof v === 'string' ? v : null;
    })();
    return apiMsg || apiErr || firstFieldError || error?.message || fallback;
  };

  const showConfirm = ({ title, message, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel', isDangerous = false }) => {
    setConfirmModal({
      show: true,
      title,
      message,
      onConfirm,
      confirmText,
      cancelText,
      isDangerous
    });
  };

  const closeConfirm = () => {
    setConfirmModal({
      show: false,
      title: '',
      message: '',
      onConfirm: null,
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      isDangerous: false
    });
  };

  const handleConfirm = async () => {
    if (confirmModal.onConfirm) {
      await confirmModal.onConfirm();
    }
    closeConfirm();
  };

  const withExclusiveAction = async (id, fn, { silent = false } = {}) => {
    if (actionLockId && actionLockId !== id) return null;
    setActionLockId(id);
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      return await fn();
    } catch (err) {
      if (!silent) toast.error(getErrorMessage(err));
      throw err;
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
      setActionLockId(null);
    }
  };

  const isActionLoading = (id) => Boolean(actionLoading?.[id]);

  const apiMap = {
    overview: '/dashboard/getHomeInfo/',
    orders: '/dashboard/getOrders/',
    products: '/dashboard/getProducts/',
    customers: '/dashboard/getUsers/',
  };

  useEffect(() => {
    const getData = async () => {
      const id = `fetch:${activeSection}`;
      setIsLoading(true);
      try {
        await withExclusiveAction(id, async () => {
          const response = await api.get(apiMap[activeSection]);
          const data = response.data?.data ?? response.data;

          if (activeSection === "overview") {
            setHomeInfo(data || {});
            setOrders(data?.Recent_orders || []);
            setProducts(data?.Top_Selling || []);
          }
          if (activeSection === "orders") setOrders(data || []);
          if (activeSection === "products") setProducts(data || []);
          if (activeSection === "customers") setCustomers(data || []);

          setDataLoaded(prev => ({ ...prev, [activeSection]: true }));
        }, { silent: true });
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(getErrorMessage(error, 'Failed to load dashboard data.'));
        if (activeSection === 'overview') setHomeInfo(null);
        if (activeSection === 'orders') setOrders([]);
        if (activeSection === 'products') setProducts([]);
        if (activeSection === 'customers') setCustomers([]);
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

  useEffect(() => {
    if (activeSection !== "analytics") return;

    const id = `analytics:${chartType}:${dateRange}`;
    setIsLoading(true);

    withExclusiveAction(id, async () => {
      const data = await getAnalyticsData({
        type: chartType,
        range: dateRange
      });
      setAnalyticsChartRaw(data);

      const values = data.values || [];
      const total = values.reduce((sum, v) => sum + v, 0);
      
      const halfIndex = Math.floor(values.length / 2);
      const firstHalf = values.slice(0, halfIndex);
      const secondHalf = values.slice(halfIndex);
      const firstSum = firstHalf.reduce((sum, v) => sum + v, 0);
      const secondSum = secondHalf.reduce((sum, v) => sum + v, 0);
      const trend = firstSum > 0 ? ((secondSum - firstSum) / firstSum) * 100 : 0;

      setAnalyticsMetrics({
        totalSales: total,
        conversionRate: values.length > 0 ? (total / values.length) : 0,
        avgOrderValue: values.length > 0 ? (total / values.length) : 0,
        returningCustomers: 0,
        salesTrend: trend,
        conversionTrend: trend * 0.8,
        avgOrderTrend: trend * 0.6,
        customerTrend: trend * 0.9
      });
    }).catch(() => {}).finally(() => {
      setIsLoading(false);
    });
  }, [activeSection, chartType, dateRange]);

  const getOrderItems = async (orderId) => {
    const id = `order:details:${orderId}`;
    setIsLoading(true);
    try {
      const response = await withExclusiveAction(id, async () => {
        const res = await getOrderDetails(orderId);
        setOrderDetailsData(res || {});
        return res;
      }, { silent: true });
      return response;
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error(getErrorMessage(error, 'Failed to load order details.'));
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
      colorId: '',
      sizeId: '',
      quantity: 0,
      action: 'add'
    });
    handleOpenAddStockModal(product);
  };

  const handleViewProductDetails = (product) => {
    if (!product) return;
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const handleOrderStatusChange = async(orderId, newStatus) => {
    showConfirm({
      title: 'Cancel Order',
      message: `Are you sure you want to cancel order ${orderId}?`,
      confirmText: 'Cancel Order',
      cancelText: 'Keep Order',
      isDangerous: true,
      onConfirm: async () => {
        try {
          await cancelOrder(orderId);
          setOrders(orders.map(order => 
            (order.id === orderId || order.order_id === orderId) ? { ...order, status: newStatus } : order
          ));
          toast.success('Order cancelled successfully');
        } catch(err) {
          console.error(err);
          toast.error(getErrorMessage(err, 'Failed to cancel order'));
        }
      }
    });
  };

  const handleDeleteOrder = async (orderId) => {
    showConfirm({
      title: 'Delete Order',
      message: `Are you sure you want to delete order ${orderId}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDangerous: true,
      onConfirm: async () => {
        try {
          await deleteOrder(orderId);
          setOrders(orders.filter(order => order.id !== orderId && order.order_id !== orderId));
          toast.success('Order deleted successfully');
        } catch(err) {
          console.error(err);
          toast.error(getErrorMessage(err, 'Failed to delete order'));
        }
      }
    });
  };

  const handleDeleteProduct = async (productId) => {
    const product = products.find(p => p.id === productId);
    const productName = product?.name || 'this product';
    
    showConfirm({
      title: 'Delete Product',
      message: `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDangerous: true,
      onConfirm: async () => {
        const id = `product:delete:${productId}`;
        setModalLoading(true);
        try {
          await withExclusiveAction(id, async () => {
            await DeleteProduct(productId);
          });
          setProducts(prev => prev.filter(product => product.id !== productId));
          toast.success(`Product "${productName}" deleted successfully`);
          
          setNotifications(prev => [
            {
              id: Date.now(),
              type: 'success',
              message: `Product "${productName}" deleted successfully`,
              read: false,
              timestamp: new Date().toISOString()
            },
            ...prev
          ]);
        } catch (error) {
          console.error('Error deleting product:', error);
          
          setNotifications(prev => [
            {
              id: Date.now(),
              type: 'error',
              message: `Failed to delete product "${productName}". Please try again.`,
              read: false,
              timestamp: new Date().toISOString()
            },
            ...prev
          ]);
          
          toast.error(getErrorMessage(error, `Failed to delete "${productName}".`));
        } finally {
          setModalLoading(false);
        }
      }
    });
  };

  const handleDeleteCustomer = async (customerId) => {
    showConfirm({
      title: 'Delete Customer',
      message: 'Are you sure you want to delete this customer? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDangerous: true,
      onConfirm: async () => {
        const id = `customer:delete:${customerId}`;
        setModalLoading(true);
        try {
          await withExclusiveAction(id, async () => {
            await deleteUser(customerId);
          });
          setCustomers(prev => prev.filter(customer => customer.id !== customerId));
          toast.success('Customer deleted successfully.');
        } catch (err) {
          console.error(err);
          toast.error(getErrorMessage(err, 'Failed to delete customer'));
        } finally {
          setModalLoading(false);
        }
      }
    });
  };

  const handleToggleAdmin = async (customerId, isAdmin) => {
    const id = `customer:toggleAdmin:${customerId}`;
    setModalLoading(true);
    try {
      await withExclusiveAction(id, async () => {
        await changeAdminStatus(customerId, isAdmin);
      });
      setCustomers(prev => prev.map(customer => 
        customer.id === customerId ? { ...customer, is_admin: !customer.is_admin } : customer
      ));
      toast.success(`Admin status updated.`);
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err, 'Failed to update admin status'));
    } finally {
      setModalLoading(false);
    }
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
      toast.success('Settings saved successfully');
    }, 1000);
  };

  const handleExportData = (format) => {
    setShowExportDropdown(false);
    toast.info(`Exporting data as ${format.toUpperCase()}...`);
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
        id: color.id,
        color: color.color,
        image: color.image,
        productcolorsize_set: color.productcolorsize_set.map(size => ({
          id: size.id,
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
        toast.success('Order created successfully');
      } else {
        setOrders(orders.map(order => 
          order.id === orderData.id ? { ...order, ...orderData } : order
        ));
        toast.success('Order updated successfully');
      }
      setModalLoading(false);
      setShowAddOrderModal(false);
      setShowEditOrderModal(false);
    }, 1000);
  };

const handleSaveProduct = async (productData, isNew = true) => {
  const colors = productData.productcolor_set.map(c => c.color);
  const uniqueColors = new Set(colors);
  if (colors.length !== uniqueColors.size) {
    toast.warning('Each product can only have one entry per color. Please remove duplicate colors.');
    return;
  }

  setModalLoading(true);

  const formData = new FormData();
  formData.append('name', productData.name);
  formData.append('price', productData.price);
  formData.append('description', productData.description);

  productData.productcolor_set.forEach((color, i) => {
    if (color.id) {
      formData.append(`productcolor_set[${i}][id]`, color.id);
    }
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

  try {
    if (isNew) {
      const response = await withExclusiveAction('product:create', async () => addProduct(formData));
      if (response) setProducts(prev => [response, ...prev]);
      toast.success('Product added successfully.');
    } else {
      const response = await withExclusiveAction(`product:update:${productData.id}`, async () => updateProduct(productData.id, formData));
      if (response) {
        setProducts(prev => prev.map(product => product.id === productData.id ? response : product));
        toast.success('Product updated successfully.');
      }
    }
    setShowAddProductModal(false);
    setShowEditProductModal(false);

  } catch (error) {
    console.error("Error saving product:", error);
    toast.error(getErrorMessage(error, 'Failed to save product.'));
  } finally {
    setModalLoading(false);
  }
};

  const handleSaveCustomer = async (customerData, isNew) => {
    const errors = {};
    if (!customerData.firstName?.trim()) {
      errors.firstName = "First name is required";
    } else if (customerData.firstName.length > 30) {
      errors.firstName = "First name must be less than 30 characters";
    }
    
    if (!customerData.lastName?.trim()) {
      errors.lastName = "Last name is required";
    } else if (customerData.lastName.length > 30) {
      errors.lastName = "Last name must be less than 30 characters";
    }
    
    if (!customerData.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
      errors.email = "Invalid email format";
    } else if (customerData.old_email !== customerData.email) {
      try {
        await EmailVerify(customerData.email);
      } catch (err) {
        errors.email = "Email already exists";
      }
    }
    
    if (isNew && !customerData.password?.trim()) {
      errors.password = "Password is required";
    } else if (isNew && customerData.password && customerData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    
    if (!customerData.phone?.trim()) {
      errors.phone = "Phone number is required";
    } else if (customerData.phone.length > 20) {
      errors.phone = "Phone number must be less than 20 characters";
    } else if (!/^\+?[\d\s\-()]+$/.test(customerData.phone)) {
      errors.phone = "Invalid phone number format";
    } else if (customerData.old_phone !== customerData.phone){
      try {
        await PhoneNumberVerify(customerData.phone);
      } catch (err) {
        errors.phone = "Phone number already exists";
      }
    }
    
    if (!customerData.gender) {
      errors.gender = "Gender is required";
    } else if (!['M', 'F'].includes(customerData.gender)) {
      errors.gender = "Invalid gender selection";
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.warning('Please fix the highlighted fields.');
      return;
    }
    
    setFormErrors({});
    setModalLoading(true);
    
    try {
      if (isNew) {
        await withExclusiveAction('customer:create', async () => RegisterUser(customerData));
        const newCustomer = {
          id: Date.now(),
          first_name: customerData.firstName,
          last_name: customerData.lastName,
          email: customerData.email,
          phone_number: customerData.phone,
          gender: customerData.gender,
          is_admin: customerData.isAdmin || false,
          date_joined: new Date().toISOString(),
          order_count: 0,
          total_spent: 0,
          is_active: true
        };
        setCustomers([newCustomer, ...customers]);
        toast.success('Customer added successfully.');
        
        setNotifications(prev => [
          {
            id: Date.now(),
            type: 'success',
            message: `Customer "${customerData.firstName} ${customerData.lastName}" added successfully`,
            read: false,
            timestamp: new Date().toISOString()
          },
          ...prev
        ]);
      } else {
        await withExclusiveAction(`customer:update:${customerData.id}`, async () => UpdateUser(customerData));
        setCustomers(customers.map(customer => 
          customer.id === customerData.id ? { 
            ...customer, 
            first_name: customerData.firstName,
            last_name: customerData.lastName,
            email: customerData.email,
            phone_number: customerData.phone,
            gender: customerData.gender,
            is_admin: customerData.isAdmin
          } : customer
        ));
        
        setNotifications(prev => [
          {
            id: Date.now(),
            type: 'success',
            message: `Customer "${customerData.firstName} ${customerData.lastName}" updated successfully`,
            read: false,
            timestamp: new Date().toISOString()
          },
          ...prev
        ]);
        toast.success('Customer updated successfully.');
      }
      
      setShowAddCustomerModal(false);
      setShowEditCustomerModal(false);
    } catch (error) {
      console.error('Error saving customer:', error);
      toast.error(getErrorMessage(error, `Failed to ${isNew ? 'add' : 'update'} customer.`));
      
      if (error.response?.data) {
        const serverErrors = {};
        Object.keys(error.response.data).forEach(key => {
          serverErrors[key] = Array.isArray(error.response.data[key]) 
            ? error.response.data[key][0] 
            : error.response.data[key];
        });
        setFormErrors(serverErrors);
      }
      
      setNotifications(prev => [
        {
          id: Date.now(),
          type: 'error',
          message: `Failed to ${isNew ? 'add' : 'update'} customer. ${error.response?.data?.message || error.message || 'Please try again.'}`,
          read: false,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
    } finally {
      setModalLoading(false);
    }
  };
  
  const handleProductChange = (field, value) => {
    setNewProductData(prev => ({ ...prev, [field]: value }));
  };

  const handleMarkNotificationRead = (notificationId) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
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

  const handleAddStock = async (productId, stockData) => {
    const id = `stock:update:${productId}`;
    setModalLoading(true);
    try {
      await withExclusiveAction(id, async () => UpdateStock(stockData));
      setProducts(products.map(product => {
        if (product.id === productId) {
          const updatedProduct = { ...product };
          updatedProduct.productcolor_set = updatedProduct.productcolor_set.map(colorData => {
            if (colorData.id === stockData.colorId) {
              return {
                ...colorData,
                productcolorsize_set: colorData.productcolorsize_set.map(sizeData => {
                  if (sizeData.id === stockData.sizeId) {
                    const newStock = stockData.action === 'add' 
                      ? sizeData.stock + stockData.quantity 
                      : sizeData.stock - stockData.quantity;
                    return {
                      ...sizeData,
                      stock: Math.max(0, newStock)
                    };
                  }
                  return sizeData;
                })
              };
            }
            return colorData;
          });
          return updatedProduct;
        }
        return product;
      }));

      setShowAddStockModal(false);
      setStockData({ colorId: '', sizeId: '', quantity: 0, action: 'add' });
      toast.success('Stock updated successfully.');
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error(getErrorMessage(error, 'Failed to update stock.'));
    } finally {
      setModalLoading(false);
    }
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

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    return (products || []).filter(product => {
      if (productFilter !== 'all' && product.category !== productFilter) return false;
      if (!q) return true;
      const name = (product.name || '').toLowerCase();
      const desc = (product.description || '').toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }, [products, productFilter, productSearch]);

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

  const analyticsChartData = useMemo(() => {
    return {
      labels: analyticsChartRaw.labels,
      datasets: [
        {
          label: chartType.charAt(0).toUpperCase() + chartType.slice(1),
          data: analyticsChartRaw.values,
          borderColor: chartType === 'sales' ? 'rgb(75, 192, 192)' : chartType === 'revenue' ? 'rgb(54, 162, 235)' : 'rgb(255, 99, 132)',
          backgroundColor: chartType === 'sales' ? 'rgba(75, 192, 192, 0.2)' : chartType === 'revenue' ? 'rgba(54, 162, 235, 0.2)' : 'rgba(255, 99, 132, 0.2)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    };
  }, [analyticsChartRaw, chartType]);

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
    sizeOptions,
    setFormErrors,
    colorOptions,
    products, setProducts,
    productSearch, setProductSearch,
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
    analyticsChartData,
    analyticsMetrics,
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
    actionLockId,
    isActionLoading,
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
    handleImageChange,
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
    handleMarkNotificationRead,
    filteredProducts,
    filteredCustomers,
    filteredNotifications,
    paginatedProducts,
    newCustomerData, setNewCustomerData,
    handleAddStockClick,
    setStockData,
    stockData,
    paginatedCustomers,
    confirmModal,
    showConfirm,
    closeConfirm,
    handleConfirm
  };
};