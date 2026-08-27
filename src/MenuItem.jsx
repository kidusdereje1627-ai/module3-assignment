function MenuItem({ name, price, description, category, emoji }) {
  return (
    <article className={`menu-card ${category.toLowerCase()}`}>
      <div className="menu-card-header">
        <h3>
          {emoji} {name}
        </h3>

        <span className="category">{category}</span>
      </div>

      <p className="description">{description}</p>

      <p className="price">{price} ETB</p>
    </article>
  );
}

export default MenuItem;
