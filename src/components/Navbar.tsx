import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Menu, X, Moon, Sun, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { isDark, toggle } = useTheme();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const langs = [
    { code: 'en' as const, label: 'English' },
    { code: 'es' as const, label: 'Español' },
    { code: 'fr' as const, label: 'Français' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl text-foreground">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span>Go<span className="text-primary">Fitness</span></span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('nav.home')}</Link>
            <a href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('nav.features')}</a>
            <a href="/#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('nav.pricing')}</a>
            {user && (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('nav.dashboard')}</Link>
                <Link to="/profile" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('nav.profile')}</Link>
                {isAdmin && (
                  <Link to="/admin" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">{t('nav.admin')}</Link>
                )}
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {/* Language switcher */}
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <Globe className="h-4 w-4 text-muted-foreground" />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
                  >
                    {langs.map(l => (
                      <button
                        key={l.code}
                        onClick={() => { setLanguage(l.code); setLangOpen(false); }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${language === l.code ? 'text-primary font-semibold' : 'text-foreground'}`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme toggle */}
            <button onClick={toggle} className="p-2 rounded-lg hover:bg-secondary transition-colors">
              {isDark ? <Sun className="h-4 w-4 text-muted-foreground" /> : <Moon className="h-4 w-4 text-muted-foreground" />}
            </button>

            {user ? (
              <Button variant="outline" size="sm" onClick={handleSignOut}>{t('nav.logout')}</Button>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">{t('nav.login')}</Button></Link>
                <Link to="/register"><Button size="sm">{t('nav.register')}</Button></Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass border-t border-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              <Link to="/" onClick={() => setIsOpen(false)} className="block text-sm text-foreground">{t('nav.home')}</Link>
              {user && (
                <>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block text-sm text-foreground">{t('nav.dashboard')}</Link>
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="block text-sm text-foreground">{t('nav.profile')}</Link>
                  {isAdmin && <Link to="/admin" onClick={() => setIsOpen(false)} className="block text-sm text-primary">{t('nav.admin')}</Link>}
                </>
              )}
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <button onClick={toggle} className="p-2 rounded-lg bg-secondary">
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                {langs.map(l => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`px-2 py-1 rounded text-xs font-medium ${language === l.code ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}
                  >
                    {l.code.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="pt-2">
                {user ? (
                  <Button variant="outline" className="w-full" onClick={handleSignOut}>{t('nav.logout')}</Button>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" className="flex-1" onClick={() => setIsOpen(false)}><Button variant="outline" className="w-full">{t('nav.login')}</Button></Link>
                    <Link to="/register" className="flex-1" onClick={() => setIsOpen(false)}><Button className="w-full">{t('nav.register')}</Button></Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
