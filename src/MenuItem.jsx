function MenuItem({ item, addToOrder }) {
  const { name, price, description, category, emoji } = item;

  return (
    <article className={`menu-card ${category.toLowerCase()}`}>
      <div className="menu-card-header">
        <h3>
          {emoji} {name}
        </h3>

        <span className="category">{category}</span>
      </div>

      <p className="description">{description}</p>

      <div className="menu-card-footer">
        <p className="price">{price} ETB</p>

        <button type="button" onClick={() => addToOrder(item)}>
          Add to Order
        </button>
      </div>
    </article>
  );
}

export default MenuItem;
