import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  imageClass?: string;
};

export type CartLine = Product & { quantity: number };

type CartContextValue = {
  cart: CartLine[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product) => void;
  changeQuantity: (id: string, amount: number) => void;
  removeItem: (id: string) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const CART_STORAGE_KEY = "amazon-romania-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(CART_STORAGE_KEY);
      if (stored) setCart(JSON.parse(stored) as CartLine[]);
    } catch {
      window.sessionStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) window.sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const addToCart = (product: Product) => {
      setCart((current) => {
        const existing = current.find((item) => item.id === product.id);
        if (!existing) return [...current, { ...product, quantity: 1 }];
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      });
    };

    return {
      cart,
      itemCount: cart.reduce((total, item) => total + item.quantity, 0),
      subtotal: cart.reduce((total, item) => total + item.price * item.quantity, 0),
      addToCart,
      changeQuantity: (id, amount) => {
        setCart((current) =>
          current
            .map((item) =>
              item.id === id ? { ...item, quantity: item.quantity + amount } : item,
            )
            .filter((item) => item.quantity > 0),
        );
      },
      removeItem: (id) => setCart((current) => current.filter((item) => item.id !== id)),
    };
  }, [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}