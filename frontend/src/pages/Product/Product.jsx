import React from 'react';

import Footer from '../../components/layout/Footer/Footer';
import BackToTopButton from '../../components/common/button/BackToTopButton';
import LoadingSpinner from '../../components/common/loader/LoadingSpinner';
import './Product.css';


import { useEffect, useState } from 'react';


const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadFlag, setReloadFlag] = useState(false);

 
  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`/api/getproduct/${productId}/`) 
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement du produit');
        return res.json();
      })
      .then(data => {
        setProduct(data);
       
        if (data.colors && data.colors.length) {
          setSelectedColor(data.colors[0]);
          setSelectedImage(data.colors[0].image);
          if (data.colors[0].sizes) setAvailableSizes(data.colors[0].sizes.map(sz=>sz.size));
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [productId, reloadFlag]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setSelectedImage(color.image);
    setAvailableSizes(color.sizes ? color.sizes.map(sz=>sz.size) : []);
    setSelectedSize('');
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleImageChange = (img) => {
    setSelectedImage(img);
  };

  const reload = () => setReloadFlag(f => !f);

  return {
    product,
    loading,
    error,
    selectedColor,
    selectedSize,
    quantity,
    availableSizes,
    selectedImage,
    setQuantity,
    handleColorChange,
    handleSizeChange,
    handleImageChange,
    reload,
  };
};

export { useProduct };

