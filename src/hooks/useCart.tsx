import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";

import { Product, Stock } from "../types";

import { api } from "../services/api";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    // Buscar dados do localStorage
    const storagedCart = localStorage.getItem("@RocketShoes:cart");

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      // TODO
      const stockAmount = await api
        .get(`/stock/${productId}`)
        .then((response) => response.data.amount);

      let product = cart.find((product) => product.id === productId);
      if (product) {
        product.amount += 1;
        if (product) {
          product.amount += 1;
          if (product.amount > stockAmount) {
            toast.error("Quantidade solicitada fora de estoque");
            return;
          }
          setCart([...cart, product]);
        }
      } else {
        product = await api
          .get(`/products/${productId}`)
          .then((response) => response.data);

        if (product) {
          product.amount += 1;
          if (product.amount > stockAmount) {
            toast.error("Quantidade solicitada fora de estoque");
            return;
          }
          setCart([...cart, product]);
        }
      }

      localStorage.setItem("@RocketShoes:cart", JSON.stringify(cart));

      console.log(cart);
      console.log(stockAmount);
    } catch {
      // TODO

      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
      toast.error("Erro na remoção do produto");
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
      toast.error("Quantidade solicitada fora de estoque");

      toast.error("Erro na alteração de quantidade do produto");
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
