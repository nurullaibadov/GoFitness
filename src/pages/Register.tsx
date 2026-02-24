import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dumbbell, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const Register = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Check your email to confirm your account!');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-display font-bold text-2xl">
            <Dumbbell className="h-6 w-6 text-primary" />
            Go<span className="text-primary">Fitness</span>
          </Link>
          <h1 className="font-display text-3xl font-bold mt-4">{t('auth.register')}</h1>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 bg-card p-8 rounded-2xl border border-border card-shadow">
          <div>
            <Label htmlFor="name">{t('auth.name')}</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="confirm">{t('auth.confirm_password')}</Label>
            <Input id="confirm" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '...' : t('auth.register')}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {t('auth.has_account')}{' '}
          <Link to="/login" className="text-primary hover:underline">{t('nav.login')}</Link>
        </p>
        <Link to="/" className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground mt-4">
          <ArrowLeft className="h-3 w-3" /> {t('nav.home')}
        </Link>
      </div>
    </div>
  );
};

export default Register;
