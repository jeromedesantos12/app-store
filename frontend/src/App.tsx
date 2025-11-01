import OrderStatus from "./pages/OrderStatus";
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
import type { SupplierType } from "./types/supplier";

function App() {
  const [carts, setCarts] = useState<CartType[]>([]);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [allOrders, setAllOrders] = useState<OrderType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [productsAll, setProductsAll] = useState<ProductType[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
  const [suppliersAll, setSuppliersAll] = useState<SupplierType[]>([]);
  const [filterProducts, setFilterProducts] = useState<ProductType[]>([]);
  const [isLoadProducts, setIsLoadProducts] = useState(false);
  const [isErrProducts, setIsErrProducts] = useState<string | null>(null);
  const [isLoadProductsAll, setIsLoadProductsAll] = useState(false);
  const [isErrProductsAll, setIsErrProductsAll] = useState<string | null>(null);
  const [isLoadFilterProducts, setIsLoadFilterProducts] = useState(false);
  const [isErrFilterProducts, setIsErrFilterProducts] = useState<string | null>(
    null
  );
  const [isLoadCarts, setIsLoadCarts] = useState(false);
  const [isErrCarts, setIsErrCarts] = useState<string | null>(null);
  const [isLoadOrders, setIsLoadOrders] = useState(false);
  const [isErrOrders, setIsErrOrders] = useState<string | null>(null);
  const [isLoadAllOrders, setIsLoadAllOrders] = useState(false);
  const [isErrAllOrders, setIsErrAllOrders] = useState<string | null>(null);
  const [isLoadSuppliers, setIsLoadSuppliers] = useState(false);
  const [isErrSuppliers, setIsErrSuppliers] = useState<string | null>(null);
  const [isLoadSuppliersAll, setIsLoadSuppliersAll] = useState(false);
  const [isErrSuppliersAll, setIsErrSuppliersAll] = useState<string | null>(
    null
  );
  const [search, setSearch] = useState<string>("");
  const [nav, setNav] = useState(false);
  const debouncedSearch = useDebounce<string>(search, 500);

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

  async function fetchProductsAll() {
    try {
      setIsLoadProductsAll(true);
      const res = await api.get("/productAll");
      setProductsAll(res.data.data);
      setIsErrProductsAll(null);
    } catch (err) {
      setIsErrProductsAll(extractAxiosError(err));
    } finally {
      setIsLoadProductsAll(false);
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

  async function fetchOrdersAll() {
    try {
      setIsLoadAllOrders(true);
      const res = await api.get("/order/all");
      setAllOrders(res.data.data);
      setIsErrAllOrders(null);
    } catch (err) {
      setIsErrAllOrders(extractAxiosError(err));
    } finally {
      setIsLoadAllOrders(false);
    }
  }

  async function fetchSuppliers() {
    try {
      setIsLoadSuppliers(true);
      const res = await api.get("/supplier");
      setSuppliers(res.data.data);
      setIsErrSuppliers(null);
    } catch (err) {
      setIsErrSuppliers(extractAxiosError(err));
    } finally {
      setIsLoadSuppliers(false);
    }
  }

  async function fetchSuppliersAll() {
    try {
      setIsLoadSuppliersAll(true);
      const res = await api.get("/supplierAll");
      setSuppliersAll(res.data.data);
      setIsErrSuppliersAll(null);
    } catch (err) {
      setIsErrSuppliersAll(extractAxiosError(err));
    } finally {
      setIsLoadSuppliersAll(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchCarts();
    fetchOrders();
    fetchSuppliers();
    fetchProductsAll();
    fetchSuppliersAll();
    fetchOrdersAll();
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
                      fetchProductsAll={fetchProductsAll}
                      fetchSuppliersAll={fetchSuppliersAll}
                      fetchOrdersAll={fetchOrdersAll}
                      fetchSuppliers={fetchSuppliers}
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
                  path="/add-product"
                  element={
                    <ProductForm
                      products={productsAll}
                      suppliers={suppliers}
                      isLoad={isLoadProductsAll}
                      isErr={isErrProductsAll}
                      fetchProducts={fetchProductsAll}
                      isLoadSuppliers={isLoadSuppliers}
                      isErrSuppliers={isErrSuppliers}
                    />
                  }
                />
                <Route
                  path="/add-supplier"
                  element={
                    <SupplierForm
                      suppliers={suppliersAll}
                      isLoad={isLoadSuppliersAll}
                      isErr={isErrSuppliersAll}
                      fetchSuppliers={fetchSuppliersAll}
                    />
                  }
                />
                <Route
                  path="/order-status"
                  element={
                    <OrderStatus
                      orders={allOrders}
                      isLoad={isLoadAllOrders}
                      isErr={isErrAllOrders}
                      fetchOrdersAll={fetchOrdersAll}
                    />
                  }
                />
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
