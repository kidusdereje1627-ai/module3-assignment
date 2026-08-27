import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";

const restaurantName = "Addis Café";
const price = 100;

function App() {
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
            Example price with 15% service charge:{" "}
            <strong>{(price * 1.15).toFixed(2)} ETB</strong>
          </p>
        </section>

        <Menu />
      </main>

      <Footer />
    </div>
  );
}

export default App;
