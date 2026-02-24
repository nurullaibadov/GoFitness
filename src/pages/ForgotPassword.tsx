import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dumbbell, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t('auth.reset_sent'));
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
          <h1 className="font-display text-3xl font-bold mt-4">{t('auth.reset')}</h1>
        </div>

        <form onSubmit={handleReset} className="space-y-4 bg-card p-8 rounded-2xl border border-border card-shadow">
          <div>
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '...' : t('auth.reset')}
          </Button>
        </form>

        <Link to="/login" className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground mt-6">
          <ArrowLeft className="h-3 w-3" /> {t('auth.back_login')}
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
