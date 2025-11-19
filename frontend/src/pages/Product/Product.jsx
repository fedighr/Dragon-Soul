import { useEffect, useState } from 'react';
import axios from 'axios';
import "./Product.css";
import ProductCard from "../../components/common/container/ProductCard";
function Product() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/store/products/')
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map(p =>
          <ProductCard
            product={{
                id: p.id,
                name: p.name,
                price: p.price,
                image: p.image
            }}></ProductCard>
            )}
      </ul>
    </div>
  );
}

export default Product;
