import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/Sidebar";
import Login from "@/pages/Login";
import UsersPage from "@/pages/Users";
import PaymentsPage from "@/pages/Payments";
import ReportsPage from "@/pages/Reports";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";
import { ConfigProvider, Spin, App as AntApp } from "antd";

const theme = {
  token: {
    colorPrimary: "#1890ff",
    colorBgLayout: "#f0f2f5",
    fontFamily: "'Inter', sans-serif",
  },
};

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!user && !isLoading) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, overflow: "auto", maxHeight: "100vh", background: "#f0f2f5" }}>
        {children}
      </main>
    </div>
  );
}

function Router() {
  const [location] = useLocation();

  if (location === "/login") {
    return <Login />;
  }

  return (
    <AuthenticatedLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/users" component={UsersPage} />
        <Route path="/payments" component={PaymentsPage} />
        <Route path="/reports" component={ReportsPage} />
        <Route component={NotFound} />
      </Switch>
    </AuthenticatedLayout>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <AntApp>
          <Router />
        </AntApp>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
