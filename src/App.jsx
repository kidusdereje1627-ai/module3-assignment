import React, { createContext, useContext, useEffect, useState } from "react";

import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

/* =====================================================
   DATA
===================================================== */

const DISHES = [
  {
    id: "1",
    name: "Margherita Pizza",
    category: "main",
    price: 12,
    description: "Classic pizza with tomato, mozzarella and basil.",
  },
  {
    id: "2",
    name: "Caesar Salad",
    category: "starter",
    price: 8,
    description: "Fresh lettuce with Caesar dressing and croutons.",
  },
  {
    id: "3",
    name: "Tiramisu",
    category: "dessert",
    price: 6,
    description: "Classic Italian dessert with coffee and mascarpone.",
  },
  {
    id: "4",
    name: "Garlic Bread",
    category: "starter",
    price: 5,
    description: "Fresh baked bread with garlic and herbs.",
  },
];

/* =====================================================
   CONTEXT
===================================================== */

const CartContext = createContext();
const AuthContext = createContext();

/* =====================================================
   APP PROVIDER
===================================================== */

export function AppProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [user, setUser] = useState(() => {
    return localStorage.getItem("user") || null;
  });

  /* Save cart */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* Add item */
  const addToCart = (dish) => {
    setCart((previousCart) => [...previousCart, dish]);
  };

  /* Remove item */
  const removeFromCart = (indexToRemove) => {
    setCart((previousCart) =>
      previousCart.filter((_, index) => index !== indexToRemove),
    );
  };

  /* Login */
  const login = (username) => {
    setUser(username);
    localStorage.setItem("user", username);
  };

  /* Logout */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      <CartContext.Provider
        value={{
          cart,
          addToCart,
          removeFromCart,
        }}
      >
        {children}
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}

/* =====================================================
   SHARED LAYOUT
===================================================== */

function SharedLayout() {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/menu">Menu</Link>

          <Link to="/cart">Cart ({cart.length})</Link>

          <Link to="/checkout">Checkout</Link>
        </div>

        <div className="nav-right">
          {user ? (
            <>
              <span>
                Hello, <strong>{user}</strong>
              </span>

              <button className="sign-out-button" onClick={logout}>
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login">Sign In</Link>
          )}
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

/* =====================================================
   MENU PAGE
===================================================== */

function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFilter = searchParams.get("category") || "all";

  const filteredDishes =
    categoryFilter === "all"
      ? DISHES
      : DISHES.filter((dish) => dish.category === categoryFilter);

  const categories = ["all", "starter", "main", "dessert"];

  return (
    <div className="menu-page">
      {/* TITLE */}
      <h1>Menu</h1>

      {/* CATEGORY BUTTONS */}
      <div className="category-buttons">
        {categories.map((category) => (
          <button
            key={category}
            className={categoryFilter === category ? "active-category" : ""}
            onClick={() => {
              if (category === "all") {
                setSearchParams({});
              } else {
                setSearchParams({
                  category: category,
                });
              }
            }}
          >
            {category.toUpperCase()}
          </button>
        ))}
      </div>

      {/* MENU CARDS */}
      <div className="menu-grid">
        {filteredDishes.map((dish) => (
          <div className="menu-card" key={dish.id}>
            {/* FOOD IMAGE AREA */}
            <div className="food-image">🍽️</div>

            <div className="menu-card-content">
              <h2>
                <Link to={`/dish/${dish.id}`}>{dish.name}</Link>
              </h2>

              <p className="dish-category">{dish.category}</p>

              <p className="dish-description">{dish.description}</p>

              <div className="menu-card-footer">
                <span className="price">${dish.price}</span>

                <Link to={`/dish/${dish.id}`} className="view-button">
                  View Dish
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =====================================================
   DISH PAGE
===================================================== */

function DishPage() {
  const { id } = useParams();

  const { addToCart } = useContext(CartContext);

  const dish = DISHES.find((item) => item.id === id);

  if (!dish) {
    return (
      <div className="not-found">
        <h2>Dish not found</h2>

        <Link to="/menu" className="view-button">
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="dish-page">
      <div className="dish-detail-card">
        <div className="large-food-image">🍽️</div>

        <div className="dish-details">
          <h1>{dish.name}</h1>

          <p className="dish-category">{dish.category}</p>

          <p className="dish-description">{dish.description}</p>

          <h2 className="large-price">${dish.price}</h2>

          <button className="add-cart-button" onClick={() => addToCart(dish)}>
            Add to Cart
          </button>

          <Link to="/menu" className="back-link">
            ← Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   CART PAGE
===================================================== */

function CartPage() {
  const { cart, removeFromCart } = useContext(CartContext);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty.</h2>

          <p>Add some delicious food from the menu.</p>

          <Link to="/menu" className="view-button">
            Go to Menu
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item, index) => (
              <div className="cart-item" key={`${item.id}-${index}`}>
                <div>
                  <h3>{item.name}</h3>

                  <p>${item.price}</p>
                </div>

                <button
                  className="remove-button"
                  onClick={() => removeFromCart(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Total: ${total}</h2>

            <Link to="/checkout" className="checkout-button">
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

/* =====================================================
   PROTECTED ROUTE
===================================================== */

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* =====================================================
   CHECKOUT PAGE
===================================================== */

function CheckoutPage() {
  const { cart } = useContext(CartContext);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleOrder = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    alert("Order placed successfully!");
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-card">
        <h2>Order Summary</h2>

        <p>
          Total Items: <strong>{cart.length}</strong>
        </p>

        <p className="checkout-total">Total Amount: ${total}</p>

        <button className="place-order-button" onClick={handleOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
}

/* =====================================================
   LOGIN PAGE
===================================================== */

function LoginPage() {
  const [username, setUsername] = useState("");

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!username.trim()) {
      alert("Please enter your username.");
      return;
    }

    login(username.trim());

    navigate("/checkout");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Sign In</h1>

        <p>Sign in to continue to checkout.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

/* =====================================================
   APP
===================================================== */

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            {/* HOME */}
            <Route index element={<Navigate to="/menu" replace />} />

            {/* MENU */}
            <Route path="menu" element={<MenuPage />} />

            {/* DISH */}
            <Route path="dish/:id" element={<DishPage />} />

            {/* CART */}
            <Route path="cart" element={<CartPage />} />

            {/* CHECKOUT */}
            <Route
              path="checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />

            {/* LOGIN */}
            <Route path="login" element={<LoginPage />} />
          </Route>

          {/* UNKNOWN PAGE */}
          <Route path="*" element={<Navigate to="/menu" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
