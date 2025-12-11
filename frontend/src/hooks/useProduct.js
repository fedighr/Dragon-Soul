// frontend/src/hooks/useProduct.js (CRÉER ce fichier)
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../services/product';

export const useProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // États pour la sélection
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [availableSizes, setAvailableSizes] = useState([]);

  // Charger les données
  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Charger le produit
      const productData = await getProduct(id);
      setProduct(productData[0]);

      // 2. Définir la première couleur par défaut
      if (productData.productcolor_set && productData.productcolor_set.length > 0) {
        
        const firstColor = productData.productcolor_set[0];
        setSelectedColor({
          id: firstColor.id,
          name: firstColor.color,
          image: firstColor.image
        });
      }


    } catch (err) {
      setError('Produit non trouvé ou erreur de chargement');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Mettre à jour les tailles disponibles
  useEffect(() => {
    if (product && selectedColor) {
      const colorObj = product.productcolor_set?.find(
        color => color.id === selectedColor.id
      );

      if (colorObj && colorObj.productcolorsize_set) {
        const sizes = colorObj.productcolorsize_set
          .filter(size => size.stock > 0)
          .map(size => size.size);

        setAvailableSizes(sizes);

        // Définir la première taille disponible
        if (sizes.length > 0 && !sizes.includes(selectedSize)) {
          setSelectedSize(sizes[0]);
        }
      }
    }
  }, [selectedColor, product]);

  // Gestionnaires d'événements
  const handleColorChange = (color) => {
    setSelectedColor(color);
    setSelectedSize(''); // Reset size
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    const maxQty = getMaxQuantity();

    if (newQuantity >= 1 && newQuantity <= maxQty) {
      setQuantity(newQuantity);
    }
  };

  const handleQuantityInput = (value) => {
    const numValue = parseInt(value) || 1;
    const maxQty = getMaxQuantity();
    setQuantity(Math.min(Math.max(numValue, 1), maxQty));
  };

  // Calculer la quantité maximale
  const getMaxQuantity = () => {
    if (!product || !selectedColor || !selectedSize) return 10;

    const colorObj = product.productcolor_set?.find(
      color => color.id === selectedColor.id
    );

    if (!colorObj) return 10;

    const sizeObj = colorObj.productcolorsize_set?.find(
      size => size.size === selectedSize
    );

    return sizeObj ? Math.min(sizeObj.stock, 10) : 10;
  };

  // Obtenir le stock total du produit
  const getTotalStock = () => {
    if (!product) return 0;

    let total = 0;
    product.productcolor_set?.forEach(color => {
      color.productcolorsize_set?.forEach(size => {
        total += size.stock;
      });
    });

    return total;
  };

  // Obtenir toutes les images
  const getAllImages = () => {
    const images = [];

    if (product?.productcolor_set) {
      product.productcolor_set.forEach(color => {
        if (color.image) {
          images.push({
            src: color.image,
            alt: `${product.name} - ${color.color}`,
            colorId: color.id
          });
        }
      });
    }

    return images;
  };

  // Initialisation
  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  return {
    // Données
    product,
    relatedProducts,
    loading,
    error,

    // États
    selectedColor,
    selectedSize,
    quantity,
    selectedImage,
    availableSizes,

    // Méthodes
    setSelectedImage,
    handleColorChange,
    handleSizeChange,
    handleQuantityChange,
    handleQuantityInput,
    reload: loadProduct,

    // Calculs
    maxQuantity: getMaxQuantity(),
    totalStock: getTotalStock(),
    allImages: getAllImages(),
    selectedColorImage: selectedColor?.image || null
  };
};