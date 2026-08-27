import MenuItem from "./MenuItem";

const menu = [
  {
    id: 1,
    name: "Buna",
    price: 80,
    description: "Traditional Ethiopian coffee served fresh and aromatic",
    category: "Drink",
    emoji: "☕",
  },
  {
    id: 2,
    name: "Shiro",
    price: 150,
    description: "Traditional Ethiopian chickpea stew with spices",
    category: "Main",
    emoji: "🍲",
  },
  {
    id: 3,
    name: "Tibs",
    price: 250,
    description: "Sautéed beef with vegetables, herbs, and spices",
    category: "Main",
    emoji: "🥩",
  },
  {
    id: 4,
    name: "Chechebsa",
    price: 120,
    description: "Torn flatbread mixed with honey and spiced butter",
    category: "Breakfast",
    emoji: "🥞",
  },
  {
    id: 5,
    name: "Firfir",
    price: 130,
    description: "Pieces of injera mixed with berbere and spiced butter",
    category: "Breakfast",
    emoji: "🍳",
  },
  {
    id: 6,
    name: "Doro Wot",
    price: 300,
    description: "Spicy chicken stew served with injera and egg",
    category: "Main",
    emoji: "🍗",
  },
  {
    id: 7,
    name: "Baklava",
    price: 100,
    description: "Sweet layered pastry with nuts and honey",
    category: "Dessert",
    emoji: "🍰",
  },
  {
    id: 8,
    name: "Spris",
    price: 90,
    description: "Refreshing layered blend of avocado and mango",
    category: "Drink",
    emoji: "🥑",
  },
];

function Menu() {
  return (
    <section className="menu">
      <div className="menu-title">
        <h2>Our Menu</h2>
        <p>Traditional Ethiopian flavors made with love.</p>
      </div>

      <div className="menu-grid">
        {menu.map((item) => (
          <MenuItem
            key={item.id}
            name={item.name}
            price={item.price}
            description={item.description}
            category={item.category}
            emoji={item.emoji}
          />
        ))}
      </div>
    </section>
  );
}

export default Menu;
