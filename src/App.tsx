import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Home from "@/pages/home";
import Store from "@/pages/store";
import ProductPage from "@/pages/product";
import Cart from "@/pages/cart";
import Account from "@/pages/account";
import Orders from "@/pages/orders";
import Membership from "@/pages/membership";
import Achievements from "@/pages/achievements";
import Passport from "@/pages/passport";
import Registry from "@/pages/registry";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/store" component={Store} />
        <Route path="/product/:id" component={ProductPage} />
        <Route path="/cart" component={Cart} />
        <Route path="/account" component={Account} />
        <Route path="/orders" component={Orders} />
        <Route path="/membership" component={Membership} />
        <Route path="/achievements" component={Achievements} />
        <Route path="/passport/:id" component={Passport} />
        <Route path="/registry" component={Registry} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
