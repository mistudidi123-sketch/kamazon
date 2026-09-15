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
  saved: CartLine[];
  itemCount: number;
  subtotal: number;
  location: string;
  setLocation: (value: string) => void;
  addToCart: (product: Product) => void;
  changeQuantity: (id: string, amount: number) => void;
  removeItem: (id: string) => void;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  removeSaved: (id: string) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const CART_STORAGE_KEY = "amazon-romania-cart";
const SAVED_STORAGE_KEY = "amazon-romania-saved";
const LOCATION_STORAGE_KEY = "amazon-romania-location";
const DEFAULT_LOCATION = "Romania";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [saved, setSaved] = useState<CartLine[]>([]);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(CART_STORAGE_KEY);
      if (stored) setCart(JSON.parse(stored) as CartLine[]);
      const storedSaved = window.sessionStorage.getItem(SAVED_STORAGE_KEY);
      if (storedSaved) setSaved(JSON.parse(storedSaved) as CartLine[]);
      const storedLocation = window.sessionStorage.getItem(LOCATION_STORAGE_KEY);
      if (storedLocation) setLocation(storedLocation);
    } catch {
      window.sessionStorage.removeItem(CART_STORAGE_KEY);
      window.sessionStorage.removeItem(SAVED_STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.sessionStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(saved));
    window.sessionStorage.setItem(LOCATION_STORAGE_KEY, location);
  }, [cart, saved, location, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const mergeLine = (list: CartLine[], line: CartLine) => {
      const existing = list.find((item) => item.id === line.id);
      if (!existing) return [...list, line];
      return list.map((item) =>
        item.id === line.id ? { ...item, quantity: item.quantity + line.quantity } : item,
      );
    };

    return {
      cart,
      saved,
      location,
      setLocation: (next: string) => setLocation(next.trim() || DEFAULT_LOCATION),
      itemCount: cart.reduce((total, item) => total + item.quantity, 0),
      subtotal: cart.reduce((total, item) => total + item.price * item.quantity, 0),
      addToCart: (product: Product) =>
        setCart((current) => mergeLine(current, { ...product, quantity: 1 })),
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
      saveForLater: (id) => {
        const line = cart.find((item) => item.id === id);
        if (!line) return;
        setCart((current) => current.filter((item) => item.id !== id));
        setSaved((current) => mergeLine(current, line));
      },
      moveToCart: (id) => {
        const line = saved.find((item) => item.id === id);
        if (!line) return;
        setSaved((current) => current.filter((item) => item.id !== id));
        setCart((current) => mergeLine(current, line));
      },
      removeSaved: (id) => setSaved((current) => current.filter((item) => item.id !== id)),
    };
  }, [cart, saved, location]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
