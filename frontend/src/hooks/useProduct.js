
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../services/product';

export const useProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
// Selection state for UI
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);


  const normalizeProduct = (data) => {
    if (!data || !Array.isArray(data.productcolor_set)) return { ...data, colors: [] };
    return {
      ...data,
      colors: data.productcolor_set.map(colorObj => ({
        id: colorObj.id,
        color: colorObj.color,
        image: colorObj.image,
        sizes: Array.isArray(colorObj.productcolorsize_set)
          ? colorObj.productcolorsize_set.map(sizeObj => ({
              id: sizeObj.id,
              size: sizeObj.size,
              stock: sizeObj.stock
            }))
          : []
      }))
    }
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getProduct(id)
      .then(data => {
        if (!isMounted) return;
        const normData = normalizeProduct(data);
        setProduct(normData);

        if (normData.colors && normData.colors.length) {
          setSelectedColor(normData.colors[0]);
          setSelectedImage(normData.colors[0].image);
          setAvailableSizes(normData.colors[0].sizes.map(sz => sz.size));
          setSelectedSize(normData.colors[0].sizes.length > 0 ? normData.colors[0].sizes[0].size : '');
        } else {
          setSelectedColor(null);
          setSelectedImage(null);
          setAvailableSizes([]);
          setSelectedSize('');
        }
      })
      .catch(err => {
        if (!isMounted) return;
        setError(
          (err?.response?.data?.detail) ||
          err?.message ||
          'Erreur lors du chargement du produit'
        );
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => { isMounted = false; }
  }, [id]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setSelectedImage(color.image || null);
    setAvailableSizes(color.sizes ? color.sizes.map(sz => sz.size) : []);
    setSelectedSize(color.sizes && color.sizes.length > 0 ? color.sizes[0].size : '');
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleImageChange = (img) => {
    setSelectedImage(img);
  };

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
  };
}


