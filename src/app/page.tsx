'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Hand, Brain, MessageCircle, Scan, Sparkles, Share2, BookOpen } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './page.module.css';

export default function LandingPage() {
  const prefersReducedMotion = useReducedMotion();

  const getTransition = (delay = 0, duration = 0.8) => ({
    duration: prefersReducedMotion ? 0.01 : duration,
    delay: prefersReducedMotion ? 0 : delay,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  });

  const fadeUpVariant = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeUpVariantDeep = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: { opacity: 1, y: 0 },
  };

  const scaleVariant = {
    hidden: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <main className={styles.main}>
      {/* Section 1: Hero */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground} />
        
        <motion.img 
          src="/logo.jpg" 
          alt="EmoLens Logo" 
          className={styles.logo}
          initial="hidden"
          animate="visible"
          variants={scaleVariant}
          transition={{ type: "spring", stiffness: 100, damping: 20, ...getTransition(0, 0.6) }}
        />
        
        <motion.h1 
          className={styles.heroTitle}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          transition={getTransition(0, 0.8)}
        >
          Map Your Body.<br />
          Find Your Words.
        </motion.h1>
        
        <motion.p 
          className={styles.heroSubtitle}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          transition={getTransition(0.3, 0.8)}
        >
          Your body speaks before you do. We gently translate physical sensations into clear emotional understanding, giving you the exact words to express how you truly feel.
        </motion.p>
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 },
            visible: { opacity: 1, scale: 1 }
          }}
          transition={getTransition(0.6, 0.5)}
        >
          <Link href="/checkin" className={styles.primaryButton}>
            Start Check-In
          </Link>
        </motion.div>
      </section>

      {/* Section 2: How It Works */}
      <section className={styles.howItWorksSection}>
        <motion.h2 
          className={styles.sectionHeading}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          transition={getTransition()}
        >
          How It Works
        </motion.h2>

        <div className={styles.stepsGrid}>
          {[
            {
              step: "01",
              icon: <Hand className={styles.stepIcon} size={32} />,
              title: "Tap where you feel it",
              desc: "Select zones on the interactive body model and describe what you feel - tightness, tingling, warmth, or pressure."
            },
            {
              step: "02",
              icon: <Brain className={styles.stepIcon} size={32} />,
              title: "AI maps your emotions",
              desc: "Our AI translates your body sensations into emotional vocabulary, suggesting feelings that match what your body is telling you."
            },
            {
              step: "03",
              icon: <MessageCircle className={styles.stepIcon} size={32} />,
              title: "Share your way",
              desc: "Get personalized coping strategies and a communication card you can share with friends, family, or teachers."
            }
          ].map((item, index) => (
            <motion.div 
              key={index}
              className={styles.stepCard}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUpVariantDeep}
              transition={getTransition(index * 0.1, 0.6)}
            >
              <div className={styles.stepHeader}>
                {item.icon}
                <span className={styles.stepBadge}>{item.step}</span>
              </div>
              <h3 className={styles.stepTitle}>{item.title}</h3>
              <p className={styles.stepDesc}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 3: Features Grid */}
      <section className={styles.featuresSection}>
        <motion.h2 
          className={styles.sectionHeading}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          transition={getTransition()}
        >
          Built for Understanding
        </motion.h2>

        <div className={styles.featuresGrid}>
          {[
            {
              icon: <Scan className={styles.featureIcon} size={24} />,
              title: "3D Body Mapping",
              desc: "An interactive body model where you tap zones and describe physical sensations in your own words."
            },
            {
              icon: <Sparkles className={styles.featureIcon} size={24} />,
              title: "AI-Powered Insights",
              desc: "Advanced AI translates your body signals into emotional vocabulary - no guessing required."
            },
            {
              icon: <Share2 className={styles.featureIcon} size={24} />,
              title: "Communication Cards",
              desc: "Shareable cards that help you tell others how you feel and what helps - perfect for hard conversations."
            },
            {
              icon: <BookOpen className={styles.featureIcon} size={24} />,
              title: "Personal Dictionary",
              desc: "Build your own emotion dictionary over time, your body, your patterns, your words."
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              className={styles.featureCard}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUpVariant}
              transition={getTransition(index * 0.1, 0.5)}
            >
              <div className={styles.featureIconWrapper}>
                {feature.icon}
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 4: Final CTA Banner */}
      <section className={styles.finalCtaSection}>
        <motion.h2 
          className={styles.finalCtaHeading}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariant}
          transition={getTransition(0)}
        >
          Ready to understand your body?
        </motion.h2>
        
        <motion.p 
          className={styles.finalCtaSubtext}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariant}
          transition={getTransition(0.1)}
        >
          Take a gentle pause to check in with yourself. Your journey to emotional clarity takes just a moment.
        </motion.p>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariant}
          transition={getTransition(0.2)}
        >
          <Link href="/checkin" className={styles.primaryButton}>
            Start Check-In
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
