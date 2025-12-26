// dashboard.js - Utility functions for dashboard

// Chart configuration helper
export const chartConfig = {
  sales: {
    type: 'line',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value;
            }
          }
        }
      }
    }
  },
  
  revenue: {
    type: 'bar',
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }
  },
  
  pie: {
    type: 'doughnut',
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
        }
      }
    }
  }
};

// Data formatting utilities
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (date, format = 'short') => {
  const d = new Date(date);
  if (format === 'short') {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatTimeAgo = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;
  
  if (diff < minute) {
    return 'Just now';
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diff < week) {
    const days = Math.floor(diff / day);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (diff < month) {
    const weeks = Math.floor(diff / week);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diff < year) {
    const months = Math.floor(diff / month);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diff / year);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
};

// Data calculation utilities
export const calculateGrowth = (current, previous) => {
  if (previous === 0) return 100;
  return ((current - previous) / previous) * 100;
};

export const calculateAverage = (arr, key) => {
  const sum = arr.reduce((acc, item) => acc + (key ? item[key] : item), 0);
  return arr.length > 0 ? sum / arr.length : 0;
};

export const calculateTotal = (arr, key) => {
  return arr.reduce((acc, item) => acc + (key ? item[key] : item), 0);
};

// Filter utilities
export const filterByDateRange = (data, startDate, endDate, dateField = 'date') => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return data.filter(item => {
    const itemDate = new Date(item[dateField]);
    return itemDate >= start && itemDate <= end;
  });
};

export const filterByStatus = (data, status, statusField = 'status') => {
  if (!status || status === 'all') return data;
  return data.filter(item => item[statusField] === status);
};

export const searchData = (data, query, fields) => {
  if (!query) return data;
  
  const lowerQuery = query.toLowerCase();
  return data.filter(item => {
    return fields.some(field => {
      const value = item[field];
      return value && value.toString().toLowerCase().includes(lowerQuery);
    });
  });
};

// Export utilities
export const exportToCSV = (data, filename = 'export') => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (data, filename = 'export') => {
  if (!data || data.length === 0) return;
  
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Notification utilities
export const createNotification = (type, message, duration = 5000) => {
  const notification = document.createElement('div');
  notification.className = `dashboard-notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ️'}
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Add CSS for notification
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      .dashboard-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        border-left: 4px solid #ff6b00;
      }
      
      .dashboard-notification.success {
        border-left-color: #2ecc71;
      }
      
      .dashboard-notification.error {
        border-left-color: #e74c3c;
      }
      
      .dashboard-notification.info {
        border-left-color: #3498db;
      }
      
      .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  }, duration);
  
  return notification;
};

// Local storage utilities for dashboard preferences
export const saveDashboardPrefs = (prefs) => {
  try {
    localStorage.setItem('dashboard_preferences', JSON.stringify(prefs));
  } catch (error) {
    console.error('Error saving dashboard preferences:', error);
  }
};

export const loadDashboardPrefs = () => {
  try {
    const prefs = localStorage.getItem('dashboard_preferences');
    return prefs ? JSON.parse(prefs) : null;
  } catch (error) {
    console.error('Error loading dashboard preferences:', error);
    return null;
  }
};

// Theme utilities
export const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

export const getTheme = () => {
  return localStorage.getItem('theme') || 'light';
};

// Data validation utilities
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[\+]?[1-9][\d]{0,15}$/;
  return re.test(phone);
};

export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

// Generate mock data for development
export const generateMockData = (type, count = 10) => {
  const types = {
    orders: generateMockOrders,
    products: generateMockProducts,
    customers: generateMockCustomers,
    sales: generateMockSalesData
  };
  
  return types[type] ? types[type](count) : [];
};

function generateMockOrders(count) {
  const statuses = ['pending', 'completed', 'shipped', 'delivered', 'canceled'];
  const products = ['Nike Air Max', 'Jordan 1', 'Adidas Ultra Boost', 'Converse Chuck 70'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `ORD-${1000 + i}`,
    customer: `Customer ${i + 1}`,
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: Math.floor(Math.random() * 5) + 1,
    total: parseFloat((Math.random() * 500 + 50).toFixed(2)),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    product: products[Math.floor(Math.random() * products.length)]
  }));
}

function generateMockProducts(count) {
  const categories = ['Running', 'Basketball', 'Casual', 'Lifestyle', 'Training'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: parseFloat((Math.random() * 200 + 50).toFixed(2)),
    stock: Math.floor(Math.random() * 100),
    category: categories[Math.floor(Math.random() * categories.length)],
    status: Math.random() > 0.8 ? 'low' : 'active'
  }));
}

function generateMockCustomers(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Customer ${i + 1}`,
    email: `customer${i + 1}@example.com`,
    orders: Math.floor(Math.random() * 20) + 1,
    totalSpent: parseFloat((Math.random() * 5000 + 100).toFixed(2)),
    joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }));
}

function generateMockSalesData(count) {
  const categories = ['Running', 'Basketball', 'Casual', 'Lifestyle'];
  
  return Array.from({ length: count }, (_, i) => ({
    date: new Date(Date.now() - (count - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    revenue: parseFloat((Math.random() * 10000 + 1000).toFixed(2)),
    orders: Math.floor(Math.random() * 50) + 10,
    category: categories[Math.floor(Math.random() * categories.length)],
    units: Math.floor(Math.random() * 100) + 20
  }));
}

// Debounce utility for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility for scroll/resize events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};