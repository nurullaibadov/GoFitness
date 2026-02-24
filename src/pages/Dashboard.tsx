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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Plus, TrendingUp, Flame, Clock, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);

  // Workout form
  const [wTitle, setWTitle] = useState('');
  const [wType, setWType] = useState('strength');
  const [wDuration, setWDuration] = useState('');
  const [wCalories, setWCalories] = useState('');

  // Progress form
  const [pWeight, setPWeight] = useState('');
  const [pBodyFat, setPBodyFat] = useState('');
  const [pMuscle, setPMuscle] = useState('');
  const [pChest, setPChest] = useState('');
  const [pWaist, setPWaist] = useState('');
  const [pArms, setPArms] = useState('');
  const [pThighs, setPThighs] = useState('');

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    fetchWorkouts();
    fetchProgress();
  }, [user]);

  const fetchWorkouts = async () => {
    const { data } = await supabase.from('workouts').select('*').eq('user_id', user!.id).order('completed_at', { ascending: false }).limit(50);
    if (data) setWorkouts(data);
  };

  const fetchProgress = async () => {
    const { data } = await supabase.from('progress').select('*').eq('user_id', user!.id).order('date', { ascending: true }).limit(50);
    if (data) setProgress(data);
  };

  const addWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('workouts').insert({
      user_id: user!.id,
      title: wTitle,
      type: wType,
      duration_minutes: parseInt(wDuration) || null,
      calories_burned: parseInt(wCalories) || null,
    });
    if (error) toast.error(error.message);
    else { toast.success('Workout logged!'); setWorkoutOpen(false); setWTitle(''); setWDuration(''); setWCalories(''); fetchWorkouts(); }
  };

  const addProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('progress').insert({
      user_id: user!.id,
      weight_kg: parseFloat(pWeight) || null,
      body_fat_pct: parseFloat(pBodyFat) || null,
      muscle_mass_kg: parseFloat(pMuscle) || null,
      chest_cm: parseFloat(pChest) || null,
      waist_cm: parseFloat(pWaist) || null,
      arms_cm: parseFloat(pArms) || null,
      thighs_cm: parseFloat(pThighs) || null,
    });
    if (error) toast.error(error.message);
    else { toast.success('Progress logged!'); setProgressOpen(false); setPWeight(''); setPBodyFat(''); setPMuscle(''); setPChest(''); setPWaist(''); setPArms(''); setPThighs(''); fetchProgress(); }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" /></div>;

  const totalWorkouts = workouts.length;
  const totalCalories = workouts.reduce((s, w) => s + (w.calories_burned || 0), 0);
  const totalMinutes = workouts.reduce((s, w) => s + (w.duration_minutes || 0), 0);
  const latestWeight = progress.length > 0 ? progress[progress.length - 1].weight_kg : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold">{t('dashboard.title')}</h1>
          <div className="flex gap-2">
            <Dialog open={workoutOpen} onOpenChange={setWorkoutOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" />{t('dashboard.add_workout')}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{t('dashboard.add_workout')}</DialogTitle></DialogHeader>
                <form onSubmit={addWorkout} className="space-y-3">
                  <div><Label>Title</Label><Input value={wTitle} onChange={e => setWTitle(e.target.value)} required /></div>
                  <div><Label>Type</Label>
                    <Select value={wType} onValueChange={setWType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strength">Strength</SelectItem>
                        <SelectItem value="cardio">Cardio</SelectItem>
                        <SelectItem value="flexibility">Flexibility</SelectItem>
                        <SelectItem value="hiit">HIIT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Duration (min)</Label><Input type="number" value={wDuration} onChange={e => setWDuration(e.target.value)} /></div>
                  <div><Label>Calories Burned</Label><Input type="number" value={wCalories} onChange={e => setWCalories(e.target.value)} /></div>
                  <Button type="submit" className="w-full">Log Workout</Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={progressOpen} onOpenChange={setProgressOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1" />{t('dashboard.add_progress')}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{t('dashboard.add_progress')}</DialogTitle></DialogHeader>
                <form onSubmit={addProgress} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Weight (kg)</Label><Input type="number" step="0.1" value={pWeight} onChange={e => setPWeight(e.target.value)} /></div>
                    <div><Label>Body Fat %</Label><Input type="number" step="0.1" value={pBodyFat} onChange={e => setPBodyFat(e.target.value)} /></div>
                    <div><Label>Muscle Mass (kg)</Label><Input type="number" step="0.1" value={pMuscle} onChange={e => setPMuscle(e.target.value)} /></div>
                    <div><Label>Chest (cm)</Label><Input type="number" step="0.1" value={pChest} onChange={e => setPChest(e.target.value)} /></div>
                    <div><Label>Waist (cm)</Label><Input type="number" step="0.1" value={pWaist} onChange={e => setPWaist(e.target.value)} /></div>
                    <div><Label>Arms (cm)</Label><Input type="number" step="0.1" value={pArms} onChange={e => setPArms(e.target.value)} /></div>
                    <div><Label>Thighs (cm)</Label><Input type="number" step="0.1" value={pThighs} onChange={e => setPThighs(e.target.value)} /></div>
                  </div>
                  <Button type="submit" className="w-full">Log Progress</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Activity, label: 'Total Workouts', value: totalWorkouts, color: 'text-primary' },
            { icon: Flame, label: 'Calories Burned', value: totalCalories.toLocaleString(), color: 'text-destructive' },
            { icon: Clock, label: 'Total Minutes', value: totalMinutes.toLocaleString(), color: 'text-primary' },
            { icon: TrendingUp, label: 'Current Weight', value: latestWeight ? `${latestWeight} kg` : '—', color: 'text-primary' },
          ].map(stat => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  <div>
                    <p className="text-2xl font-display font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />Weight Progress</CardTitle></CardHeader>
            <CardContent>
              {progress.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={progress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="weight_kg" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.1)" name="Weight (kg)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-12">No progress data yet. Start tracking!</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />Muscle Mass</CardTitle></CardHeader>
            <CardContent>
              {progress.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={progress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="muscle_mass_kg" stroke="hsl(var(--primary))" strokeWidth={2} name="Muscle (kg)" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-12">No progress data yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent workouts */}
        <Card>
          <CardHeader><CardTitle>{t('dashboard.workouts')}</CardTitle></CardHeader>
          <CardContent>
            {workouts.length > 0 ? (
              <div className="space-y-3">
                {workouts.slice(0, 10).map(w => (
                  <div key={w.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div>
                      <p className="font-medium text-sm">{w.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{w.type} • {new Date(w.completed_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      {w.duration_minutes && <span>{w.duration_minutes} min</span>}
                      {w.calories_burned && <span>{w.calories_burned} cal</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">No workouts yet. Log your first one!</p>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
