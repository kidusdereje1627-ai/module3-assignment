import { useState } from "react";
import "./App.css";
import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";

const restaurantName = "Addis Café";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [order, setOrder] = useState([]);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  function addToOrder(item) {
    setOrder((currentOrder) => {
      const existingItem = currentOrder.find(
        (orderItem) => orderItem.id === item.id,
      );

      if (existingItem) {
        return currentOrder.map((orderItem) =>
          orderItem.id === item.id
            ? {
                ...orderItem,
                quantity: orderItem.quantity + 1,
              }
            : orderItem,
        );
      }

      return [...currentOrder, { ...item, quantity: 1 }];
    });

    setSuccess("");
  }

  function increaseQuantity(id) {
    setOrder((currentOrder) =>
      currentOrder.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }

  function decreaseQuantity(id) {
    setOrder((currentOrder) =>
      currentOrder
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeFromOrder(id) {
    setOrder((currentOrder) => currentOrder.filter((item) => item.id !== id));
  }

  const total = order.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  function handleCustomerChange(event) {
    const { name, value } = event.target;

    setCustomer((currentCustomer) => ({
      ...currentCustomer,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setSuccess("");
  }

  function validateForm() {
    const newErrors = {};

    if (!customer.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!customer.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^09\d{8}$/.test(customer.phone.trim())) {
      newErrors.phone = "Enter a valid Ethiopian phone number.";
    }

    if (!customer.address.trim()) {
      newErrors.address = "Delivery address is required.";
    }

    if (order.length === 0) {
      newErrors.order = "Please add at least one item to your order.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      setSuccess("");
      return;
    }

    setSuccess(`Order placed successfully! Total: ${total.toFixed(2)} ETB`);

    setOrder([]);

    setCustomer({
      name: "",
      phone: "",
      address: "",
    });

    setErrors({});
  }

  return (
    <div className="app">
      <Header />

      <main>
        <section className="welcome">
          <p>
            Welcome to <strong>{restaurantName}</strong>!
          </p>

          <p className="location">📍 Bole, Addis Ababa</p>

          <p className="tax-example">
            Your order total: <strong>{total.toFixed(2)} ETB</strong>
          </p>
        </section>

        <Menu
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          addToOrder={addToOrder}
        />

        <section className="order-section">
          <h2>Your Order</h2>

          {order.length === 0 ? (
            <p>Your order is empty.</p>
          ) : (
            <div className="order-list">
              {order.map((item) => (
                <div className="order-item" key={item.id}>
                  <div>
                    <h3>
                      {item.emoji} {item.name}
                    </h3>
                    <p>
                      {item.price} ETB × {item.quantity}
                    </p>
                  </div>

                  <div className="quantity-controls">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromOrder(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {errors.order && <p className="error">{errors.order}</p>}

          <div className="order-total">
            <strong>Total:</strong>
            <strong>{total.toFixed(2)} ETB</strong>
          </div>
        </section>

        <section className="delivery-section">
          <h2>TeleBirr Delivery</h2>

          <form onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="name">Full Name</label>

              <input
                id="name"
                name="name"
                type="text"
                value={customer.name}
                onChange={handleCustomerChange}
                placeholder="Enter your name"
              />

              {errors.name && <p className="error">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="phone">Phone Number</label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={customer.phone}
                onChange={handleCustomerChange}
                placeholder="09XXXXXXXX"
              />

              {errors.phone && <p className="error">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="address">Delivery Address</label>

              <textarea
                id="address"
                name="address"
                value={customer.address}
                onChange={handleCustomerChange}
                placeholder="Enter your delivery address"
                rows="3"
              />

              {errors.address && <p className="error">{errors.address}</p>}
            </div>

            <button type="submit">Place Order with TeleBirr</button>

            {success && <p className="success">{success}</p>}
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
