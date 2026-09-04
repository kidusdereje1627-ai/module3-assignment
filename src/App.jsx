import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MenuItem from "./MenuItem";
import "./App.css";

// Mock Data (ከ API የሚመጣን መረጃ ለመወከል)
const INITIAL_DISHES = [
  {
    id: 1,
    name: "Doro Wat",
    category: "Dinner",
    price: 450,
    emoji: "🍗",
    description: "Traditional spicy chicken stew served with Injera.",
  },
  {
    id: 2,
    name: "Special Chechebsa",
    category: "Breakfast",
    price: 180,
    emoji: "🥞",
    description: "Shredded flatbread fried with spices and butter.",
  },
  {
    id: 3,
    name: "Shiro Tegabino",
    category: "Lunch",
    price: 220,
    emoji: "🍲",
    description: "Rich and creamy chickpea stew served bubbling hot.",
  },
  {
    id: 4,
    name: "Ful Medames",
    category: "Breakfast",
    price: 150,
    emoji: "🧆",
    description: "Fava beans cooked with garlic, onions, and spices.",
  },
  {
    id: 5,
    name: "Beef Tibs",
    category: "Lunch",
    price: 400,
    emoji: "🥩",
    description: "Sauted beef chunks with onions, peppers, and rosemary.",
  },
  {
    id: 6,
    name: "Beyaynetu",
    category: "Dinner",
    price: 250,
    emoji: "🥗",
    description: "Assorted vegetarian stews served on Injera.",
  },
];

export default function App() {
  const [dishes, setDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auto-focus search input with useRef
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // API Fetching Simulation with AbortController cleanup
  useEffect(() => {
    const controller = new AbortController();

    const fetchMenu = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // API ጥሪን ለመምሰል delay
        await new Promise((resolve, reject) => {
          const timer = setTimeout(resolve, 600);
          controller.signal.addEventListener("abort", () => {
            clearTimeout(timer);
            reject(new DOMException("Aborted", "AbortError"));
          });
        });

        // Category ማጣሪያ
        const filteredData =
          selectedCategory === "All"
            ? INITIAL_DISHES
            : INITIAL_DISHES.filter(
                (item) =>
                  item.category.toLowerCase() ===
                  selectedCategory.toLowerCase(),
              );

        setDishes(filteredData);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Failed to load menu dishes. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();

    // Cleanup: Category ቶሎ ቶሎ ሲቀየር ቀደመውን request cancel ያደርጋል
    return () => {
      controller.abort();
    };
  }, [selectedCategory]);

  // Client-side Search Filtering
  const displayedDishes = dishes.filter((dish) =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddToOrder = (item) => {
    alert(`${item.name} added to order!`);
  };

  return (
    <div className="app">
      <Header />

      <main className="menu">
        <div className="menu-title">
          <h2>Addis Eats Menu</h2>
          <p>Order your favorite Ethiopian dishes online</p>
        </div>

        {/* Search Input with Auto-Focus */}
        <div className="search-container">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Buttons */}
        <div className="category-buttons">
          {["All", "Breakfast", "Lunch", "Dinner"].map((cat) => (
            <button
              key={cat}
              className={selectedCategory === cat ? "active" : ""}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && <div id="loading">Loading menu...</div>}

        {/* Error State */}
        {error && <div id="error">{error}</div>}

        {/* Dish Grid Display */}
        {!isLoading && !error && (
          <div className="menu-grid">
            {displayedDishes.length > 0 ? (
              displayedDishes.map((dish) => (
                <MenuItem
                  key={dish.id}
                  item={dish}
                  addToOrder={handleAddToOrder}
                />
              ))
            ) : (
              <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
                No dishes found matching your search.
              </p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
