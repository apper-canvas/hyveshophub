import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "@/components/organisms/Layout";

// Lazy load all page components
const Home = lazy(() => import("@/components/pages/Home"));
const Search = lazy(() => import("@/components/pages/Search"));
const Category = lazy(() => import("@/components/pages/Category"));
const ProductDetail = lazy(() => import("@/components/pages/ProductDetail"));
const Cart = lazy(() => import("@/components/pages/Cart"));
const Checkout = lazy(() => import("@/components/pages/Checkout"));
const OrderConfirmation = lazy(() => import("@/components/pages/OrderConfirmation"));
const Orders = lazy(() => import("@/components/pages/Orders"));
const Deals = lazy(() => import("@/components/pages/Deals"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);

// Main routes array
const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<PageLoader />}>
        <Home />
      </Suspense>
    )
  },
  {
    path: "search",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Search />
      </Suspense>
    )
  },
  {
    path: "category/:categoryName",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Category />
      </Suspense>
    )
  },
  {
    path: "product/:id",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProductDetail />
      </Suspense>
    )
  },
  {
    path: "cart",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Cart />
      </Suspense>
    )
  },
  {
    path: "checkout",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Checkout />
      </Suspense>
    )
  },
  {
    path: "order-confirmation/:orderId",
    element: (
      <Suspense fallback={<PageLoader />}>
        <OrderConfirmation />
      </Suspense>
    )
  },
  {
    path: "orders",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Orders />
      </Suspense>
    )
  },
  {
    path: "deals",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Deals />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFound />
      </Suspense>
    )
  }
];

// Router configuration
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);