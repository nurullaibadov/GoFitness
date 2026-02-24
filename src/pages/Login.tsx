import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dumbbell, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-display font-bold text-2xl mb-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            Go<span className="text-primary">Fitness</span>
          </Link>
          <h1 className="font-display text-3xl font-bold mt-4">{t('auth.login')}</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 bg-card p-8 rounded-2xl border border-border card-shadow">
          <div>
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1" />
          </div>
          <Link to="/forgot-password" className="text-sm text-primary hover:underline block">{t('auth.forgot')}</Link>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '...' : t('auth.login')}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {t('auth.no_account')}{' '}
          <Link to="/register" className="text-primary hover:underline">{t('nav.register')}</Link>
        </p>
        <Link to="/" className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground mt-4">
          <ArrowLeft className="h-3 w-3" /> {t('nav.home')}
        </Link>
      </div>
    </div>
  );
};

export default Login;
