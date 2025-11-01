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
import ProductForm from "./pages/ProductForm";
import AdminRoute from "./routes/AdminRoute";
import Register from "./pages/Register";
import Order from "./pages/Order";
import ProductOrderLayout from "./components/molecules/CartOrder";
import type { OrderType } from "./types/order";
import { CustomerRoute } from "./routes/CustomerRoute";
import SupplierForm from "./pages/SupplierForm";
import ProductSupplierLayout from "./components/molecules/ProductSupplier";
import { Toaster } from "react-hot-toast";
import "./App.css";

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
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [isLoadOrders, setIsLoadOrders] = useState(false);
  const [isErrOrders, setIsErrOrders] = useState<string | null>(null);
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

  async function fetchOrders() {
    try {
      setIsLoadOrders(true);
      const res = await api.get("/order/me");
      setOrders(res.data.data);
      setIsErrOrders(null);
    } catch (err) {
      setIsErrOrders(extractAxiosError(err));
    } finally {
      setIsLoadOrders(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchCarts();
    fetchOrders();
  }, []);

  useEffect(() => {
    fetchFilterProducts(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div onClick={() => setNav(false)}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-center" />
          <Navbar nav={nav} setNav={setNav} carts={carts.length} />
          <div className="dark:bg-zinc-950 w-full font-inter flex flex-col items-center min-h-screen mt-10 px-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login
                      fetchProducts={fetchProducts}
                      fetchFilterProducts={fetchFilterProducts}
                      fetchCarts={fetchCarts}
                      fetchOrders={fetchOrders}
                    />
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
                    <CustomerRoute>
                      <ProductList
                        search={search}
                        products={filterProducts}
                        isLoad={isLoadFilterProducts}
                        isErr={isErrFilterProducts}
                        setSearch={setSearch}
                      />
                    </CustomerRoute>
                  </PrivateRoute>
                }
              >
                <Route
                  path=":productId"
                  element={
                    <PrivateRoute>
                      <CustomerRoute>
                        <ProductDetail
                          products={products}
                          isLoad={isLoadProducts}
                          isErr={isErrProducts}
                          fetchProducts={fetchProducts}
                          fetchFilterProducts={fetchFilterProducts}
                          fetchCarts={fetchCarts}
                        />
                      </CustomerRoute>
                    </PrivateRoute>
                  }
                />
              </Route>
              <Route
                element={
                  <PrivateRoute>
                    <AdminRoute>
                      <ProductSupplierLayout />
                    </AdminRoute>
                  </PrivateRoute>
                }
              >
                <Route
                  path="/productForm"
                  element={
                    <ProductForm
                      products={products}
                      fetchProducts={fetchProducts}
                    />
                  }
                />
                <Route path="/supplierForm" element={<SupplierForm />} />
              </Route>
              <Route
                element={
                  <PrivateRoute>
                    <CustomerRoute>
                      <ProductOrderLayout />
                    </CustomerRoute>
                  </PrivateRoute>
                }
              >
                <Route
                  path="/cart"
                  element={
                    <Cart
                      carts={carts}
                      products={products}
                      isLoad={isLoadCarts}
                      isErr={isErrCarts}
                      fetchCarts={fetchCarts}
                      fetchOrders={fetchOrders}
                    />
                  }
                />
                <Route
                  path="/order"
                  element={
                    <Order
                      orders={orders}
                      isLoad={isLoadOrders}
                      isErr={isErrOrders}
                      fetchProducts={fetchProducts}
                      fetchCarts={fetchCarts}
                      fetchOrders={fetchOrders}
                    />
                  }
                />
              </Route>
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
