import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Lock, Loader2, User, ChevronRight } from "lucide-react";
import { login, getAvailableUsers } from "@/lib/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password"); // Default password for demo
  const [selectedDemoUser, setSelectedDemoUser] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const availableUsers = getAvailableUsers();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      await login({ email, password });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoUserSelect = (value: string) => {
    const selectedUser = availableUsers.find(user => user.id === value);
    if (selectedUser) {
      setEmail(selectedUser.email);
      setSelectedDemoUser(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="text-xs font-medium text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Demo User (Quick Select)</Label>
          <Select value={selectedDemoUser} onValueChange={handleDemoUserSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select a demo user" />
            </SelectTrigger>
            <SelectContent>
              {availableUsers.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Select a pre-configured user to try different roles
          </p>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            Sign in
            <ChevronRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
      
      <div className="text-center text-sm mt-6">
        <span className="text-muted-foreground">Any password works for the demo users.</span>
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button" disabled={isLoading}>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 128 128">
            <path
              fill="#fff"
              d="M44.59 4.21a63.28 63.28 0 004.33 120.9 67.6 67.6 0 0032.36.35 57.13 57.13 0 0025.9-13.46 57.44 57.44 0 0016-26.26 74.33 74.33 0 001.61-33.58H65.27v24.69h34.47a29.72 29.72 0 01-12.66 19.52 36.09 36.09 0 01-13.93 5.5 41.35 41.35 0 01-20.1-2.19 37.6 37.6 0 01-14.5-10.4A38.85 38.85 0 0133 64.34a39.61 39.61 0 012.2-17.29 37.88 37.88 0 0110.5-14.25A37.86 37.86 0 0164.22 26a39.06 39.06 0 0123.82 7.91L102.75 20a61.39 61.39 0 00-25.09-13.89A69.85 69.85 0 0044.59 4.21z"
            ></path>
            <path
              fill="#e33629"
              d="M44.59 4.21a64 64 0 0111.69 1.16 69.85 69.85 0 0121.38 8.61 63.28 63.28 0 013.89 1.91L102.75 20 83.17 38.66a39.06 39.06 0 00-23.82-7.91A37.86 37.86 0 0040.63 38a37.88 37.88 0 00-10.5 14.25 39.61 39.61 0 00-2.2 17.29 38.85 38.85 0 005.53 17.4 37.6 37.6 0 0014.5 10.4 41.35 41.35 0 0020.1 2.19 36.09 36.09 0 0013.93-5.5 29.72 29.72 0 0012.66-19.54H65.27V43.51h63.73A74.33 74.33 0 01127.39 77a57.44 57.44 0 01-16 26.26c-.66.61-1.33 1.2-2 1.79a59.93 59.93 0 01-42.38 14.94 63.28 63.28 0 01-22.4-116.1z"
            ></path>
          </svg>
          Google
        </Button>
        <Button variant="outline" type="button" disabled={isLoading}>
          <svg 
            className="mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" x2="12" y1="19" y2="22"></line>
          </svg>
          Okta
        </Button>
      </div>
    </form>
  );
}
