import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const PricingSection = () => {
  const { t } = useLanguage();

  const plans = [
    {
      name: t('pricing.free'),
      price: t('pricing.free.price'),
      features: ['5 workouts/week', 'Basic tracking', 'Progress charts', 'Community access'],
      popular: false,
    },
    {
      name: t('pricing.pro'),
      price: t('pricing.pro.price'),
      features: ['Unlimited workouts', 'Advanced analytics', 'Muscle tracking', 'Custom programs', 'Priority support'],
      popular: true,
    },
    {
      name: t('pricing.elite'),
      price: t('pricing.elite.price'),
      features: ['Everything in Pro', 'AI coach', 'Nutrition plans', 'Video analysis', '1-on-1 coaching', 'API access'],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">{t('pricing.title')}</h2>
          <p className="text-muted-foreground text-lg">{t('pricing.subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-card border-2 border-primary shadow-lg scale-105'
                  : 'bg-card border border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                  {t('pricing.popular')}
                </div>
              )}
              <h3 className="font-display text-xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-display font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{t('pricing.mo')}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register">
                <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                  {t('pricing.cta')}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
