import { useEffect, useState } from "react";
import { MdAddShoppingCart } from "react-icons/md";

import { useCart } from "../../hooks/useCart";
import { api } from "../../services/api";
import { formatPrice } from "../../util/format";

import { ProductList } from "./styles";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    // TODO
    sumAmount[product.id]++;

    return sumAmount;
  }, {} as CartItemsAmount);

  useEffect(() => {
    async function loadProducts() {
      // TODO
      await api
        .get("/products")
        .then((response: any) =>
          response.data.map((product: Product) => {
            return { ...product, priceFormatted: formatPrice(product.price) };
          })
        )
        .then((products: ProductFormatted[]) => setProducts(products));
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    // TODO
    addProduct(id);
  }

  return (
    <ProductList>
      {products.map((product: ProductFormatted) => (
        <li key={product.id}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{product.priceFormatted}</span>
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(product.id)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
              {cartItemsAmount[product.id] || 0}
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
};

export default Home;
