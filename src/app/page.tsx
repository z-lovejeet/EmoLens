'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Hand, Brain, MessageCircle, Scan, Sparkles, Share2, BookOpen,
  AlertTriangle, Target, Lightbulb, Users, HeartPulse, ShieldCheck,
  GraduationCap, Activity, ArrowRight,
} from 'lucide-react';
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
      {/* ── Hero ── */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <div className={styles.orbPrimary} />
          <div className={styles.orbSecondary} />
          <div className={styles.orbAccent} />
        </div>

        <motion.div
          className={styles.heroBadge}
          initial="hidden"
          animate="visible"
          variants={scaleVariant}
          transition={getTransition(0, 0.5)}
        >
          <Sparkles size={13} />
          <span>AI for Connection &amp; Wellbeing</span>
        </motion.div>

        <motion.h1
          className={styles.heroTitle}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          transition={getTransition(0.15, 0.9)}
        >
          <span className={styles.heroTitleLine1}>Map Your Body.</span>
          <span className={styles.heroTitleLine2}>Find Your Words.</span>
        </motion.h1>

        <motion.p
          className={styles.heroSubtitle}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          transition={getTransition(0.35, 0.8)}
        >
          Your body speaks before you do. EmoLens gently translates physical
          sensations into emotional vocabulary giving neurodivergent youth the
          words to express what they already feel.
        </motion.p>

        <motion.div
          className={styles.heroActions}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 12 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={getTransition(0.55, 0.6)}
        >
          <Link href="/checkin" className={styles.primaryButton}>
            Start Check-In
            <ArrowRight size={18} className={styles.btnArrow} />
          </Link>
          <Link href="#problem" className={styles.secondaryButton}>
            Learn More
          </Link>
        </motion.div>

        <motion.p
          className={styles.heroTagline}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          transition={getTransition(0.7, 0.6)}
        >
          Free &middot; No sign-up required &middot; Privacy-first
        </motion.p>
      </section>

      {/* ── Problem Statement ── */}
      <section id="problem" className={styles.problemSection}>
        <motion.div
          className={styles.sectionBadge}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUpVariant}
          transition={getTransition()}
        >
          <AlertTriangle size={14} />
          <span>The Problem</span>
        </motion.div>

        <motion.h2
          className={styles.sectionHeading}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUpVariant}
          transition={getTransition(0.05)}
        >
          The question &ldquo;How do you feel?&rdquo; is broken
        </motion.h2>

        <motion.p
          className={styles.sectionSubtext}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUpVariant}
          transition={getTransition(0.1)}
        >
          <strong>Alexithymia</strong> &mdash; the inability to identify and describe
          one&apos;s own emotions &mdash; affects approximately <strong>50% of autistic
          individuals</strong>, compared to roughly 10% of the general population.
          For neurodivergent youth, this creates a devastating cascade:
        </motion.p>

        <motion.div
          className={styles.cascadeFlow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={fadeUpVariant}
          transition={getTransition(0.15)}
        >
          {[
            'Physical Sensation',
            'Cannot Name Emotion',
            'Cannot Communicate',
            'Escalation',
            'Meltdown / Shutdown',
          ].map((step, i) => (
            <React.Fragment key={i}>
              <span className={styles.cascadeStep}>{step}</span>
              {i < 4 && <ArrowRight size={16} className={styles.cascadeArrow} />}
            </React.Fragment>
          ))}
        </motion.div>

        <div className={styles.problemGrid}>
          {[
            {
              icon: <Activity size={22} />,
              stat: '50%',
              label: 'of autistic youth experience alexithymia',
              source: 'Cambridge Research, 2024',
            },
            {
              icon: <AlertTriangle size={22} />,
              stat: '1 in 2',
              label:
                'cannot answer "How do you feel?" because they lack the prerequisite skill the question demands',
              source: 'NIH Network Analysis, 2026',
            },
            {
              icon: <HeartPulse size={22} />,
              stat: 'Body-first',
              label:
                'Clinical interoception research confirms somatic pathways are the key to emotional awareness for alexithymic individuals',
              source: 'Interoception Research, 2025-2026',
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              className={styles.problemCard}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUpVariantDeep}
              transition={getTransition(i * 0.1, 0.6)}
            >
              <div className={styles.problemCardIcon}>{card.icon}</div>
              <span className={styles.problemStat}>{card.stat}</span>
              <p className={styles.problemLabel}>{card.label}</p>
              <span className={styles.problemSource}>{card.source}</span>
            </motion.div>
          ))}
        </div>

        <motion.blockquote
          className={styles.pullQuote}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={fadeUpVariant}
          transition={getTransition(0.2)}
        >
          &ldquo;Asking someone with alexithymia &lsquo;How do you feel?&rsquo; is like
          asking someone who lost their glasses to just look harder. The body
          already knows &mdash; the vocabulary is what&apos;s missing.&rdquo;
        </motion.blockquote>
      </section>

      {/* ── Objective ── */}
      <section className={styles.objectiveSection}>
        <motion.div
          className={styles.sectionBadge}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUpVariant}
          transition={getTransition()}
        >
          <Target size={14} />
          <span>Our Objective</span>
        </motion.div>

        <motion.h2
          className={styles.sectionHeading}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUpVariant}
          transition={getTransition(0.05)}
        >
          Bridge the gap between body and words
        </motion.h2>

        <motion.p
          className={styles.sectionSubtext}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUpVariant}
          transition={getTransition(0.1)}
        >
          EmoLens exists to give neurodivergent youth a pathway to emotional
          self-understanding that starts where they already have awareness &mdash;
          their body &mdash; rather than demanding the skill they lack.
        </motion.p>

        <div className={styles.objectiveGrid}>
          {[
            {
              icon: <Lightbulb size={24} />,
              title: 'Translate, not diagnose',
              desc: 'Convert physical sensations into emotional vocabulary using AI, without ever assigning clinical labels. Suggestions are hypotheses for the user to evaluate, never assignments.',
            },
            {
              icon: <BookOpen size={24} />,
              title: 'Build personal vocabulary',
              desc: 'Help each individual build their own emotion dictionary over time, learning from their unique body-sensation patterns rather than borrowing from someone else\'s vocabulary.',
            },
            {
              icon: <MessageCircle size={24} />,
              title: 'Enable non-verbal communication',
              desc: 'Provide shareable Communication Cards so users can show parents, teachers, and therapists exactly what they feel and what helps, without needing to find the words in the moment.',
            },
            {
              icon: <ShieldCheck size={24} />,
              title: 'Preserve privacy and autonomy',
              desc: 'Operate fully offline with local-first data storage. No account required. No personal information collected. Users own their data completely.',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className={styles.objectiveCard}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUpVariantDeep}
              transition={getTransition(i * 0.08, 0.6)}
            >
              <div className={styles.objectiveIconWrap}>{item.icon}</div>
              <h3 className={styles.objectiveTitle}>{item.title}</h3>
              <p className={styles.objectiveDesc}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Solution ── */}
      <section className={styles.solutionSection}>
        <motion.div
          className={styles.sectionBadge}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUpVariant}
          transition={getTransition()}
        >
          <Sparkles size={14} />
          <span>The Solution</span>
        </motion.div>

        <motion.h2
          className={styles.sectionHeading}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUpVariant}
          transition={getTransition(0.05)}
        >
          An AI-powered body-to-emotion translator
        </motion.h2>

        <motion.p
          className={styles.sectionSubtext}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUpVariant}
          transition={getTransition(0.1)}
        >
          EmoLens combines an interactive 3D body map, a multi-model AI
          orchestration engine, and a personal learning system into a single,
          sensory-safe experience designed from the ground up with neurodivergent
          users.
        </motion.p>

        <div className={styles.solutionGrid}>
          {[
            {
              icon: <Scan size={28} />,
              title: 'Interactive 3D Body Map',
              desc: 'A low-poly human body model with 12 clickable zones. Users tap where they feel something and describe it using sensation chips (tightness, tingling, warmth, pressure) with 1-5 intensity scales.',
              accent: 'var(--color-teal-500)',
            },
            {
              icon: <Brain size={28} />,
              title: 'Dual AI Emotion Engine',
              desc: 'A LangGraph JS directed graph orchestrates Gemini 3.6 Flash for deep body-to-emotion reasoning and Groq Llama 3.3 70B for fast coping and fallback. The AI never diagnoses \u2014 it suggests hypotheses for the user to evaluate.',
              accent: 'var(--color-lavender)',
            },
            {
              icon: <Users size={28} />,
              title: 'Human-in-the-Loop',
              desc: 'After AI suggests 2-4 emotion hypotheses, the user confirms or says "None of these feel right" to trigger remapping. The user is always in control, and the system learns from their choices over time.',
              accent: 'var(--color-amber)',
            },
            {
              icon: <Share2 size={28} />,
              title: 'Communication Cards',
              desc: 'Exportable, shareable visual cards containing emotion labels, body signals, intensity level, a validation message, and personalized coping strategies. Designed for showing a teacher: "This is what\'s happening and what helps."',
              accent: 'var(--color-mint)',
            },
            {
              icon: <BookOpen size={28} />,
              title: 'Personal Emotion Dictionary',
              desc: 'A local-first learning engine that maps recurring body-sensation patterns to emotions over time. Each user builds their own vocabulary \u2014 their body, their patterns, their words \u2014 and this data feeds back into AI for increasingly personalized results.',
              accent: 'var(--color-coral)',
            },
            {
              icon: <ShieldCheck size={28} />,
              title: 'Crisis Safety Net',
              desc: 'Built-in crisis detection monitors for distress signals and automatically routes to the 988 Suicide & Crisis Lifeline and Crisis Text Line. Safety is never optional \u2014 it\u2019s woven into the architecture.',
              accent: 'var(--color-teal-500)',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className={styles.solutionCard}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUpVariantDeep}
              transition={getTransition(i * 0.08, 0.6)}
            >
              <div className={styles.solutionIconWrap}>{item.icon}</div>
              <h3 className={styles.solutionTitle}>{item.title}</h3>
              <p className={styles.solutionDesc}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Target Audience ── */}
      <section className={styles.audienceSection}>
        <motion.div
          className={styles.sectionBadge}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUpVariant}
          transition={getTransition()}
        >
          <Users size={14} />
          <span>Who It&apos;s For</span>
        </motion.div>

        <motion.h2
          className={styles.sectionHeading}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUpVariant}
          transition={getTransition(0.05)}
        >
          Designed with real people in mind
        </motion.h2>

        <motion.p
          className={styles.sectionSubtext}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUpVariant}
          transition={getTransition(0.1)}
        >
          EmoLens serves neurodivergent youth and the people who care about them.
          Every feature was co-designed following neurodiversity-affirming
          participatory principles.
        </motion.p>

        <div className={styles.personaGrid}>
          {[
            {
              icon: <GraduationCap size={24} />,
              name: 'Maya, 13',
              role: 'Autistic + ADHD',
              quote:
                'I freeze when someone asks "what\'s wrong?" My meltdowns get called defiance. I need a way to show my teacher what\'s happening without having to find the words myself.',
              uses: 'Generates Communication Cards to hand to teachers during overwhelm.',
            },
            {
              icon: <Activity size={24} />,
              name: 'Kai, 16',
              role: 'Autistic, High Alexithymia',
              quote:
                'I tell my therapist everything is "fine" or "not fine." There\'s nothing in between. Therapy feels wasted because I can\'t give them data.',
              uses: 'Builds a Personal Emotion Dictionary and brings body-pattern data to therapy sessions.',
            },
            {
              icon: <HeartPulse size={24} />,
              name: 'Priya, 42',
              role: 'Parent of Arjun (11)',
              quote:
                'I watch my son shut down and I can\'t reach him. I don\'t know if he\'s angry, scared, or in pain. I just want to understand.',
              uses: 'Receives Communication Cards from Arjun that explain what he\u2019s feeling and what helps.',
            },
          ].map((persona, i) => (
            <motion.div
              key={i}
              className={styles.personaCard}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUpVariantDeep}
              transition={getTransition(i * 0.12, 0.6)}
            >
              <div className={styles.personaHeader}>
                <div className={styles.personaIconWrap}>{persona.icon}</div>
                <div>
                  <h3 className={styles.personaName}>{persona.name}</h3>
                  <span className={styles.personaRole}>{persona.role}</span>
                </div>
              </div>
              <blockquote className={styles.personaQuote}>
                &ldquo;{persona.quote}&rdquo;
              </blockquote>
              <p className={styles.personaUses}>
                <strong>Uses EmoLens to:</strong> {persona.uses}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className={styles.howItWorksSection}>
        <motion.h2
          className={styles.sectionHeading}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUpVariant}
          transition={getTransition()}
        >
          How It Works
        </motion.h2>

        <div className={styles.stepsGrid}>
          {[
            {
              step: '01',
              icon: <Hand className={styles.stepIcon} size={32} />,
              title: 'Tap where you feel it',
              desc: 'Select zones on the interactive body model and describe what you feel - tightness, tingling, warmth, or pressure.',
            },
            {
              step: '02',
              icon: <Brain className={styles.stepIcon} size={32} />,
              title: 'AI maps your emotions',
              desc: 'Our AI translates your body sensations into emotional vocabulary, suggesting feelings that match what your body is telling you.',
            },
            {
              step: '03',
              icon: <MessageCircle className={styles.stepIcon} size={32} />,
              title: 'Share your way',
              desc: 'Get personalized coping strategies and a communication card you can share with friends, family, or teachers.',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className={styles.stepCard}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
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

      {/* ── Features Grid ── */}
      <section className={styles.featuresSection}>
        <motion.h2
          className={styles.sectionHeading}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUpVariant}
          transition={getTransition()}
        >
          Built for Understanding
        </motion.h2>

        <div className={styles.featuresGrid}>
          {[
            {
              icon: <Scan className={styles.featureIcon} size={24} />,
              title: '3D Body Mapping',
              desc: 'An interactive body model where you tap zones and describe physical sensations in your own words.',
            },
            {
              icon: <Sparkles className={styles.featureIcon} size={24} />,
              title: 'AI-Powered Insights',
              desc: 'Advanced AI translates your body signals into emotional vocabulary - no guessing required.',
            },
            {
              icon: <Share2 className={styles.featureIcon} size={24} />,
              title: 'Communication Cards',
              desc: 'Shareable cards that help you tell others how you feel and what helps - perfect for hard conversations.',
            },
            {
              icon: <BookOpen className={styles.featureIcon} size={24} />,
              title: 'Personal Dictionary',
              desc: 'Build your own emotion dictionary over time, your body, your patterns, your words.',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className={styles.featureCard}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUpVariant}
              transition={getTransition(index * 0.1, 0.5)}
            >
              <div className={styles.featureIconWrapper}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className={styles.finalCtaSection}>
        <motion.h2
          className={styles.finalCtaHeading}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeUpVariant}
          transition={getTransition(0)}
        >
          Ready to understand your body?
        </motion.h2>

        <motion.p
          className={styles.finalCtaSubtext}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeUpVariant}
          transition={getTransition(0.1)}
        >
          Take a gentle pause to check in with yourself. Your journey to
          emotional clarity takes just a moment.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
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
