import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { getCountry } from "@/lib/countries";

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
  countryCode: string;
  setCountryCode: (value: string) => void;
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
const COUNTRY_STORAGE_KEY = "kamazon-country-code";
const DEFAULT_LOCATION = "Romania";
const DEFAULT_COUNTRY_CODE = "US";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [saved, setSaved] = useState<CartLine[]>([]);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(CART_STORAGE_KEY);
      if (stored) setCart(JSON.parse(stored) as CartLine[]);
      const storedSaved = window.sessionStorage.getItem(SAVED_STORAGE_KEY);
      if (storedSaved) setSaved(JSON.parse(storedSaved) as CartLine[]);
    } catch {
      window.sessionStorage.removeItem(CART_STORAGE_KEY);
      window.sessionStorage.removeItem(SAVED_STORAGE_KEY);
    }
    try {
      const storedLocation =
        window.localStorage.getItem(LOCATION_STORAGE_KEY) ??
        window.sessionStorage.getItem(LOCATION_STORAGE_KEY);
      if (storedLocation) setLocation(storedLocation);
      const storedCountryCode = window.localStorage.getItem(COUNTRY_STORAGE_KEY);
      if (storedCountryCode) setCountryCode(getCountry(storedCountryCode).code);
    } catch {
      // Keep the default delivery location if browser storage is unavailable.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.sessionStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(saved));
    window.localStorage.setItem(LOCATION_STORAGE_KEY, location);
    window.localStorage.setItem(COUNTRY_STORAGE_KEY, countryCode);
  }, [cart, saved, location, countryCode, hydrated]);

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
      countryCode,
      setLocation: (next: string) => setLocation(next.trim() || DEFAULT_LOCATION),
      setCountryCode: (next: string) => setCountryCode(getCountry(next).code),
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
  }, [cart, saved, location, countryCode]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
