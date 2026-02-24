import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Activity, BarChart3 } from 'lucide-react';

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [allWorkouts, setAllWorkouts] = useState<any[]>([]);
  const [allProgress, setAllProgress] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate('/');
  }, [authLoading, user, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    supabase.from('profiles').select('*').then(({ data }) => { if (data) setUsers(data); });
    supabase.from('workouts').select('*').order('completed_at', { ascending: false }).limit(100).then(({ data }) => { if (data) setAllWorkouts(data); });
    supabase.from('progress').select('*').order('date', { ascending: false }).limit(100).then(({ data }) => { if (data) setAllProgress(data); });
  }, [isAdmin]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="font-display text-3xl font-bold">{t('admin.title')}</h1>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-display font-bold">{users.length}</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-display font-bold">{allWorkouts.length}</p>
                <p className="text-xs text-muted-foreground">Total Workouts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-display font-bold">{allProgress.length}</p>
                <p className="text-xs text-muted-foreground">Progress Entries</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">{t('admin.users')}</TabsTrigger>
            <TabsTrigger value="workouts">{t('admin.workouts')}</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {users.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div>
                        <p className="font-medium text-sm">{u.full_name || 'No name'}</p>
                        <p className="text-xs text-muted-foreground">{u.goal || 'No goal set'}</p>
                      </div>
                      <div className="flex gap-2">
                        {u.weight_kg && <Badge variant="secondary">{u.weight_kg}kg</Badge>}
                        <Badge variant="outline">{new Date(u.created_at).toLocaleDateString()}</Badge>
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No users yet.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workouts">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {allWorkouts.slice(0, 20).map(w => (
                    <div key={w.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div>
                        <p className="font-medium text-sm">{w.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{w.type} • {new Date(w.completed_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        {w.duration_minutes && <Badge variant="secondary">{w.duration_minutes} min</Badge>}
                        {w.calories_burned && <Badge variant="outline">{w.calories_burned} cal</Badge>}
                      </div>
                    </div>
                  ))}
                  {allWorkouts.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No workouts yet.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
