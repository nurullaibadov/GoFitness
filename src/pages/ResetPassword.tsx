import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dumbbell } from 'lucide-react';
import { toast } from 'sonner';

const ResetPassword = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      setReady(true);
    }
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password updated!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 font-display font-bold text-2xl">
            <Dumbbell className="h-6 w-6 text-primary" />
            Go<span className="text-primary">Fitness</span>
          </div>
          <h1 className="font-display text-3xl font-bold mt-4">{t('auth.new_password')}</h1>
        </div>

        {ready ? (
          <form onSubmit={handleUpdate} className="space-y-4 bg-card p-8 rounded-2xl border border-border card-shadow">
            <div>
              <Label htmlFor="password">{t('auth.new_password')}</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '...' : t('auth.reset')}
            </Button>
          </form>
        ) : (
          <p className="text-center text-muted-foreground">Invalid or expired reset link.</p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
