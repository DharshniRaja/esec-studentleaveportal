import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import collegeLogo from '@/assets/college-logo.jpg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(username, password)) {
      const role = username.toUpperCase() === 'ES23CD01' ? 'advisor' : 'student';
      navigate(role === 'student' ? '/student' : '/advisor');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center college-gradient p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-2 pt-8">
          <img src={collegeLogo} alt="Erode Sengunthar Engineering College" className="w-24 h-24 mx-auto mb-4 rounded-full object-cover shadow-lg" />
          <h1 className="text-lg font-heading font-bold text-primary leading-tight">
            Erode Sengunthar Engineering College
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Student Leave Request Portal
          </p>
        </CardHeader>
        <CardContent className="pt-4 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your ID"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-accent font-medium">{error}</p>
            )}
            <Button type="submit" className="w-full" size="lg">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
