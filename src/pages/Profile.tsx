import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { User, Save } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [goal, setGoal] = useState('');

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('*').eq('user_id', user.id).single().then(({ data }) => {
      if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
        setBio(data.bio || '');
        setHeightCm(data.height_cm?.toString() || '');
        setWeightKg(data.weight_kg?.toString() || '');
        setGoal(data.goal || '');
      }
    });
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('profiles').update({
      full_name: fullName,
      bio,
      height_cm: parseFloat(heightCm) || null,
      weight_kg: parseFloat(weightKg) || null,
      goal,
    }).eq('user_id', user!.id);
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success('Profile updated!');
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 container mx-auto px-4 max-w-2xl">
        <h1 className="font-display text-3xl font-bold mb-8">{t('profile.title')}</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" />{t('profile.edit')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label>{t('auth.email')}</Label>
                <Input value={user?.email || ''} disabled className="mt-1 opacity-60" />
              </div>
              <div>
                <Label>{t('auth.name')}</Label>
                <Input value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea value={bio} onChange={e => setBio(e.target.value)} className="mt-1" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Height (cm)</Label>
                  <Input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>Weight (kg)</Label>
                  <Input type="number" step="0.1" value={weightKg} onChange={e => setWeightKg(e.target.value)} className="mt-1" />
                </div>
              </div>
              <div>
                <Label>Fitness Goal</Label>
                <Input value={goal} onChange={e => setGoal(e.target.value)} placeholder="e.g., Lose 10kg, Build muscle..." className="mt-1" />
              </div>
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? '...' : t('profile.save')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
