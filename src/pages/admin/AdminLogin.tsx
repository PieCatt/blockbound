import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const AdminLogin = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = "Admin Giriş — Blockbound";
    if (!loading && user) navigate("/admin", { replace: true });
  }, [user, loading, navigate]);

  const handle = async (mode: "in" | "up") => {
    if (!email || password.length < 6) {
      toast.error("Email ve en az 6 karakterli şifre gerekli.");
      return;
    }
    setBusy(true);
    const { error } = mode === "in" ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (error) {
      toast.error(error);
    } else if (mode === "up") {
      toast.success("Hesap oluşturuldu! Giriş yapabilirsin.");
    } else {
      toast.success("Giriş başarılı.");
      navigate("/admin", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="glass-card glow-border rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-black mb-2">
          <span className="gradient-text">Admin</span> Paneli
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Sadece yetkili hesaplar girebilir.
        </p>

        <Tabs defaultValue="in">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="in">Giriş yap</TabsTrigger>
            <TabsTrigger value="up">Hesap oluştur</TabsTrigger>
          </TabsList>

          {(["in", "up"] as const).map((m) => (
            <TabsContent key={m} value={m} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="sen@ornek.com" />
              </div>
              <div className="space-y-2">
                <Label>Şifre</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="En az 6 karakter" />
              </div>
              <Button variant="hero" className="w-full" disabled={busy} onClick={() => handle(m)}>
                {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {m === "in" ? "Giriş yap" : "Hesap oluştur"}
              </Button>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminLogin;
