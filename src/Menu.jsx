import React, { useState, useEffect, useRef } from "react";

export default function AddisEatsMenu() {
  const [dishes, setDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auto-focus search field using useRef
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Fetching menu data with cleanup (AbortController)
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchMenu = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Category ማጣሪያ ያለው API URL (እንደ አስፈላጊነቱ URL ይለውጡ)
        const url =
          selectedCategory === "All"
            ? "/api/dishes"
            : `/api/dishes?category=${encodeURIComponent(selectedCategory)}`;

        const response = await fetch(url, { signal });

        if (!response.ok) {
          throw new Error("Failed to load menu dishes. Please try again.");
        }

        const data = await response.json();
        setDishes(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong!");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();

    // Cleanup function: cancels previous pending request when category changes
    return () => {
      controller.abort();
    };
  }, [selectedCategory]);

  // Client-side search filtering
  const filteredDishes = dishes.filter((dish) =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Addis Eats Menu</h1>

      {/* Search Input with Auto-Focus */}
      <div style={{ marginBottom: "15px" }}>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search dishes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "8px",
            width: "100%",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Category Filter Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {["All", "Traditional", "Fast Food", "Drinks"].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: "8px 16px",
              backgroundColor:
                selectedCategory === category ? "#0070f3" : "#e0e0e0",
              color: selectedCategory === category ? "#fff" : "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div style={{ fontSize: "18px", color: "#666" }}>Loading menu...</div>
      )}

      {error && (
        <div style={{ fontSize: "18px", color: "red" }}>Error: {error}</div>
      )}

      {/* Dishes List Display */}
      {!isLoading && !error && (
        <div style={{ display: "grid", gap: "15px" }}>
          {filteredDishes.length > 0 ? (
            filteredDishes.map((dish) => (
              <div
                key={dish.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 5px 0" }}>{dish.name}</h3>
                  <p style={{ margin: 0, color: "#666" }}>{dish.category}</p>
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#2e7d32",
                  }}
                >
                  {dish.price} ETB
                </div>
              </div>
            ))
          ) : (
            <p>No dishes found.</p>
          )}
        </div>
      )}
    </div>
  );
}
