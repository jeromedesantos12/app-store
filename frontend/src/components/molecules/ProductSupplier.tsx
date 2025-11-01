import { NavLink, Outlet } from "react-router-dom";

function ProductSupplierLayout() {
  return (
    <div className="w-full flex flex-col gap-4 max-w-6xl p-4">
      <div className="flex justify-center gap-4 mb-4">
        <NavLink
          to="/add-product"
          className={({ isActive }) =>
            `pb-2 border-b-2 ${
              isActive
                ? "border-cyan-500 text-cyan-500"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`
          }
        >
          Add Product
        </NavLink>
        <NavLink
          to="/add-supplier"
          className={({ isActive }) =>
            `pb-2 border-b-2 ${
              isActive
                ? "border-cyan-500 text-cyan-500"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`
          }
        >
          Add Supplier
        </NavLink>
        <NavLink
          to="/order-status"
          className={({ isActive }) =>
            `pb-2 border-b-2 ${
              isActive
                ? "border-cyan-500 text-cyan-500"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`
          }
        >
          Order Status
        </NavLink>
      </div>
      <div className="flex justify-center">
        <Outlet />
      </div>
    </div>
  );
}

export default ProductSupplierLayout;
