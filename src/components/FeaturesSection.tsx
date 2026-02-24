import { motion } from 'framer-motion';
import { Activity, BarChart3, Target, Users, Zap, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Activity, title: t('features.track'), desc: t('features.track.desc') },
    { icon: BarChart3, title: t('features.progress'), desc: t('features.progress.desc') },
    { icon: TrendingUp, title: t('features.muscle'), desc: t('features.muscle.desc') },
    { icon: Target, title: t('features.goals'), desc: t('features.goals.desc') },
    { icon: Users, title: t('features.community'), desc: t('features.community.desc') },
    { icon: Zap, title: t('features.analytics'), desc: t('features.analytics.desc') },
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">{t('features.title')}</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t('features.subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 card-shadow hover:shadow-xl"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
