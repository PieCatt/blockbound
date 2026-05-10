import { ReactNode } from "react";
import { Navigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileText, Package, LogOut, Loader2 } from "lucide-react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary-glow" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="glass-card glow-border rounded-2xl p-8 max-w-md text-center">
          <h1 className="text-2xl font-black mb-3">Yetkin yok</h1>
          <p className="text-muted-foreground mb-6">
            Bu hesap admin değil. Admin yapılma adımları için bana yaz.
          </p>
          <Button variant="outline" onClick={() => signOut()}>Çıkış yap</Button>
        </div>
      </div>
    );
  }

  const nav = [
    { to: "/admin", label: "Panel", icon: LayoutDashboard },
    { to: "/admin/posts", label: "Blog Yazıları", icon: FileText },
    { to: "/admin/products", label: "Ürünler", icon: Package },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/70 sticky top-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <Link to="/admin" className="text-xl font-black gradient-text">Blockbound Admin</Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">Siteye dön</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              <LogOut className="h-4 w-4 mr-2" /> Çıkış
            </Button>
          </div>
        </div>
      </header>

      <div className="container grid lg:grid-cols-[220px_1fr] gap-8 py-8">
        <aside className="space-y-1">
          {nav.map((n) => {
            const active = location.pathname === n.to || location.pathname.startsWith(n.to + "/");
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-gradient-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
