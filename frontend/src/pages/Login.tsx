
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation - if both fields have content, proceed to upload page
    if (username.trim() && password.trim()) {
      navigate("/upload-bill");
    }
  };

  return (
    <div className="min-h-screen bg-med-gray flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img src="/lovable-uploads/dadcb6d4-b96a-4832-8730-e803e8b44cc9.png" alt="VeriCare" className="w-12 h-12" />
            </div>
            <h1 className="text-2xl font-bold text-med-charcoal">Welcome Back</h1>
            <p className="text-med-muted mt-2">Sign in to your VeriCare account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-med-charcoal">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-med-charcoal">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                placeholder="Enter your password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-med-primary hover:bg-med-primary/90 text-white"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-med-primary hover:text-med-primary/80 text-sm">
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
