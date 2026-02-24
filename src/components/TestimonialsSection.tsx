import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TestimonialsSection = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Lost 30 lbs',
      text: 'GoFitness completely changed my approach to training. The tracking is incredible!',
      rating: 5,
    },
    {
      name: 'James K.',
      role: 'Gained 15 lbs muscle',
      text: 'The muscle tracking feature helped me see exactly where I was gaining. Game changer.',
      rating: 5,
    },
    {
      name: 'Maria L.',
      role: 'Marathon runner',
      text: 'From couch to marathon in 8 months. GoFitness kept me accountable every step.',
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">{t('testimonials.title')}</h2>
          <p className="text-muted-foreground text-lg">{t('testimonials.subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((test, i) => (
            <motion.div
              key={test.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-card border border-border card-shadow"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: test.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground mb-6 text-sm leading-relaxed">"{test.text}"</p>
              <div>
                <div className="font-display font-semibold text-sm">{test.name}</div>
                <div className="text-xs text-muted-foreground">{test.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
