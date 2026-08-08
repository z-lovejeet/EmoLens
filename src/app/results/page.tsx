'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useCheckinStore } from '@/lib/store/checkinStore';
import { saveCopingLocal } from '@/lib/db/local/operations';
import { getDictionaryEntryByEmotion, upsertDictionaryLocal } from '@/lib/db/local/operations';
import { ValidationMessage } from '@/components/results/ValidationMessage';
import { EmotionCardList } from '@/components/results/EmotionCardList';
import { CopingCardList } from '@/components/results/CopingCardList';
import { CommunicationCard } from '@/components/results/CommunicationCard';
import { CrisisMessage } from '@/components/results/CrisisMessage';
import styles from './page.module.css';

type Phase = 'suggestions' | 'loading' | 'results';

export default function ResultsPage() {
  const router = useRouter();
  const {
    suggestions,
    validationMessage,
    threadId,
    selectedEmotion,
    copingStrategies,
    communicationCard,
    remapCount,
    isCrisis,
    crisisMessage,
    setSelectedEmotion,
    setSelectionResult,
    setRemapResult,
    incrementRemapCount,
    setProcessing,
    isProcessing,
    reset,
  } = useCheckinStore();

  const [phase, setPhase] = useState<Phase>(
    copingStrategies.length > 0 ? 'results' : 'suggestions'
  );

  // Redirect if no data & ensure processing state is clear on mount
  useEffect(() => {
    setProcessing(false);
    if (!isCrisis && suggestions.length === 0 && copingStrategies.length === 0) {
      router.replace('/checkin');
    }
  }, [isCrisis, suggestions, copingStrategies, router, setProcessing]);

  const handleSelectEmotion = async (emotion: string) => {
    setSelectedEmotion(emotion);
    setPhase('loading');
    setProcessing(true);

    try {
      const response = await fetch('/api/checkin/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threadId,
          selectedEmotion: emotion,
        }),
      });

      if (!response.ok) throw new Error('Selection failed');

      const data = await response.json();
      setSelectionResult({
        copingStrategies: data.copingStrategies,
        communicationCard: data.communicationCard,
      });
      setPhase('results');
    } catch (error) {
      console.error('Selection error:', error);
      setPhase('suggestions');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (reason?: string) => {
    setProcessing(true);
    incrementRemapCount();

    try {
      const response = await fetch('/api/checkin/remap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threadId,
          rejectionReason: reason,
        }),
      });

      if (!response.ok) throw new Error('Remap failed');

      const data = await response.json();
      setRemapResult({
        suggestions: data.suggestions,
        validation: data.validation,
      });
    } catch (error) {
      console.error('Remap error:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleStartOver = () => {
    reset();
    router.push('/checkin');
  };

  // ── Coping feedback persistence ──
  const handleCopingFeedback = useCallback(
    async (strategyName: string, helpful: boolean) => {
      // Find the category from the strategy list
      const strategy = copingStrategies.find((s) => s.name === strategyName);
      const category = strategy?.category || 'cognitive';

      try {
        // 1. Save to copingLog in IndexedDB
        await saveCopingLocal({
          id: crypto.randomUUID(),
          checkin_id: threadId,
          strategy_name: strategyName,
          category,
          was_helpful: helpful,
          created_at: new Date().toISOString(),
        });

        // 2. Update dictionary effective/ineffective coping
        if (selectedEmotion) {
          const existing = await getDictionaryEntryByEmotion(selectedEmotion);
          if (existing) {
            const effectiveSet = new Set(existing.effective_coping);
            const ineffectiveSet = new Set(existing.ineffective_coping);

            if (helpful) {
              effectiveSet.add(strategyName);
              ineffectiveSet.delete(strategyName);
            } else {
              ineffectiveSet.add(strategyName);
              effectiveSet.delete(strategyName);
            }

            await upsertDictionaryLocal({
              ...existing,
              effective_coping: Array.from(effectiveSet),
              ineffective_coping: Array.from(ineffectiveSet),
            });
          }
        }
      } catch (err) {
        console.error('[CopingFeedback] Failed to persist:', err);
      }
    },
    [copingStrategies, threadId, selectedEmotion]
  );

  // Crisis view
  if (isCrisis && crisisMessage) {
    return (
      <main className={styles.main}>
        <div className={styles.topBar}>
          <button className={styles.backBtn} onClick={() => router.back()} type="button">
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
        </div>
        <CrisisMessage message={crisisMessage} />
      </main>
    );
  }

  return (
    <main className={styles.main}>
      {/* Top bar */}
      <motion.div
        className={styles.topBar}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button className={styles.backBtn} onClick={() => router.back()} type="button">
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <button className={styles.startOverBtn} onClick={handleStartOver} type="button">
          <RotateCcw size={16} />
          <span>Start over</span>
        </button>
      </motion.div>

      {/* Suggestions Phase */}
      {phase === 'suggestions' && (
        <div className={styles.content}>
          {validationMessage && (
            <ValidationMessage message={validationMessage} />
          )}
          <EmotionCardList
            suggestions={suggestions}
            onSelect={handleSelectEmotion}
            onReject={handleReject}
            remapCount={remapCount}
            isLoading={isProcessing}
          />
        </div>
      )}

      {/* Loading Phase */}
      {phase === 'loading' && (
        <motion.div
          className={styles.loadingContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Understanding your feelings...</p>
          <p className={styles.loadingSubtext}>
            Finding coping strategies and building your communication card
          </p>
        </motion.div>
      )}

      {/* Results Phase */}
      {phase === 'results' && (
        <div className={styles.content}>
          {selectedEmotion && (
            <motion.div
              className={styles.selectedHeader}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className={styles.selectedLabel}>You identified this as</span>
              <h2 className={styles.selectedEmotion}>{selectedEmotion}</h2>
            </motion.div>
          )}

          {copingStrategies.length > 0 && (
            <CopingCardList strategies={copingStrategies} onFeedback={handleCopingFeedback} />
          )}

          {communicationCard && (
            <div className={styles.cardSection}>
              <CommunicationCard card={communicationCard} />
            </div>
          )}

          <motion.div
            className={styles.doneArea}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          >
            <button className={styles.doneBtn} onClick={handleStartOver} type="button">
              Start a new check-in
            </button>
          </motion.div>
        </div>
      )}
    </main>
  );
}
