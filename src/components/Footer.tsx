import { Dumbbell } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-12 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display font-bold text-lg">
            <Dumbbell className="h-5 w-5 text-primary" />
            Go<span className="text-primary">Fitness</span>
          </div>
          <p className="text-xs text-muted-foreground">{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
