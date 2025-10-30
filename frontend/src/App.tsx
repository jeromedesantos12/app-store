import type { ProductType } from "./types/product";
import type { CartType } from "./types/cart";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { api, extractAxiosError } from "./services/api";
import { useDebounce } from "./hooks/useDebounce";
import AuthProvider from "./context/AuthProvider";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import Navbar from "./components/molecules/Navbar";
import Footer from "./components/molecules/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
// import ProductForm from "./pages/ProductForm";
// import AdminRoute from "./routes/AdminRoute";
import "./App.css";
import Register from "./pages/Register";

function App() {
  const [carts, setCarts] = useState<CartType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filterProducts, setFilterProducts] = useState<ProductType[]>([]);
  const [isLoadProducts, setIsLoadProducts] = useState(false);
  const [isErrProducts, setIsErrProducts] = useState<string | null>(null);
  const [isLoadFilterProducts, setIsLoadFilterProducts] = useState(false);
  const [isErrFilterProducts, setIsErrFilterProducts] = useState<string | null>(
    null
  );
  const [isLoadCarts, setIsLoadCarts] = useState(false);
  const [isErrCarts, setIsErrCarts] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce<string>(search, 500);
  const [nav, setNav] = useState(false);

  async function fetchFilterProducts(search: string = "") {
    try {
      setIsLoadFilterProducts(true);
      const res = await api.get("/product", {
        params: {
          search,
        },
      });
      setFilterProducts(res.data.data);
      setIsErrFilterProducts(null);
    } catch (err) {
      setIsErrFilterProducts(extractAxiosError(err));
    } finally {
      setIsLoadFilterProducts(false);
    }
  }

  async function fetchProducts() {
    try {
      setIsLoadProducts(true);
      const res = await api.get("/product");
      setProducts(res.data.data);
      setIsErrProducts(null);
    } catch (err) {
      setIsErrProducts(extractAxiosError(err));
    } finally {
      setIsLoadProducts(false);
    }
  }

  async function fetchCarts() {
    try {
      setIsLoadCarts(true);
      const res = await api.get("/cart/me");
      setCarts(res.data.data);
      setIsErrCarts(null);
    } catch (err) {
      setIsErrCarts(extractAxiosError(err));
    } finally {
      setIsLoadCarts(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchCarts();
  }, []);

  useEffect(() => {
    fetchFilterProducts(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div onClick={() => setNav(false)}>
      <AuthProvider>
        <BrowserRouter>
          <Navbar nav={nav} setNav={setNav} carts={carts.length} />
          <div className="dark:bg-zinc-950 w-full font-inter flex flex-col items-center min-h-screen mt-10 px-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route path="/about" element={<About />} />
              <Route
                path="/product"
                element={
                  <PrivateRoute>
                    <ProductList
                      search={search}
                      products={filterProducts}
                      isLoad={isLoadFilterProducts}
                      isErr={isErrFilterProducts}
                      setSearch={setSearch}
                    />
                  </PrivateRoute>
                }
              >
                <Route
                  path=":productId"
                  element={
                    <PrivateRoute>
                      <ProductDetail
                        products={products}
                        isLoad={isLoadProducts}
                        isErr={isErrProducts}
                        fetchProducts={fetchProducts}
                        fetchFilterProducts={fetchFilterProducts}
                        fetchCarts={fetchCarts}
                      />
                    </PrivateRoute>
                  }
                />
              </Route>
              {/* <Route
                path="/add"
                element={
                  <PrivateRoute>
                    <AdminRoute>
                      <ProductForm
                        products={products}
                        fetchProducts={fetchProducts}
                        fetchFilterProducts={fetchFilterProducts}
                      />
                    </AdminRoute>
                  </PrivateRoute>
                }
              /> */}
              <Route
                path="/cart"
                element={
                  <PrivateRoute>
                    <Cart
                      products={products}
                      carts={carts}
                      isLoad={isLoadCarts}
                      isErr={isErrCarts}
                      fetchProducts={fetchProducts}
                      fetchFilterProducts={fetchFilterProducts}
                      fetchCarts={fetchCarts}
                    />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
