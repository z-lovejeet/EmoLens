'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, BookPlus, Check, Loader2 } from 'lucide-react';
import { useCheckinStore } from '@/lib/store/checkinStore';
import { useDictionaryStore } from '@/lib/store/dictionaryStore';
import { saveCopingLocal } from '@/lib/db/local/operations';
import { getDictionaryEntryByEmotion, upsertDictionaryLocal } from '@/lib/db/local/operations';
import { saveDictionaryAndCardDual } from '@/lib/db/supabase/sync';
import { ValidationMessage } from '@/components/results/ValidationMessage';
import { EmotionCardList } from '@/components/results/EmotionCardList';
import { CopingCardList } from '@/components/results/CopingCardList';
import { CommunicationCard } from '@/components/results/CommunicationCard';
import { CrisisMessage } from '@/components/results/CrisisMessage';
import { BreathingExercise } from '@/components/results/BreathingExercise';
import { ErrorState } from '@/components/ui/ErrorState';
import styles from './page.module.css';

type Phase = 'suggestions' | 'loading' | 'results' | 'error';

const LOADING_MESSAGES = [
  'Listening to your body...',
  'Understanding your sensations...',
  'Finding the right words...',
  'Building your coping toolkit...',
];

export default function ResultsPage() {
  const router = useRouter();
  const {
    suggestions,
    validationMessage,
    threadId,
    selectedEmotion,
    copingStrategies,
    communicationCard,
    dictionaryUpdate,
    zoneData,
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
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [isSavingDict, setIsSavingDict] = useState(false);
  const [isDictSaved, setIsDictSaved] = useState(false);
  const [showBreathing, setShowBreathing] = useState(true);
  const retryActionRef = useRef<(() => void) | null>(null);

  // Redirect if no data & ensure processing state is clear on mount
  useEffect(() => {
    setProcessing(false);
    if (!isCrisis && suggestions.length === 0 && copingStrategies.length === 0) {
      router.replace('/checkin');
    }
  }, [isCrisis, suggestions, copingStrategies, router, setProcessing]);

  const handleSaveToDictionary = async () => {
    if (!selectedEmotion || isSavingDict || isDictSaved) return;
    setIsSavingDict(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const bodyPatterns =
        dictionaryUpdate?.bodyPatterns ||
        Object.entries(zoneData)
          .filter(([, data]) => data.sensations.length > 0)
          .map(([zone, data]) => ({
            zone,
            sensations: data.sensations.map((s) => s.type),
            avgIntensity: Math.round(
              data.sensations.reduce((acc, s) => acc + s.intensity, 0) /
                data.sensations.length
            ),
          }));

      const entryToSave = {
        id: crypto.randomUUID(),
        emotion: selectedEmotion,
        body_patterns: bodyPatterns,
        frequency: 1,
        effective_coping:
          dictionaryUpdate?.effectiveCoping || copingStrategies.map((s) => s.name),
        ineffective_coping: dictionaryUpdate?.ineffectiveCoping || [],
        first_identified: new Date().toISOString(),
        last_identified: new Date().toISOString(),
        synced: false,
        synced_at: null,
        updated_at: new Date().toISOString(),
      };

      const cardToSave = {
        id: communicationCard?.id || crypto.randomUUID(),
        checkin_id: threadId,
        emotion: selectedEmotion,
        intensity_level: (communicationCard?.intensityLevel as 'mild' | 'moderate' | 'strong') || 'moderate',
        what_helps_me: communicationCard?.whatHelpsMe || copingStrategies.map((s) => s.name),
        validation_message: communicationCard?.validationMessage || null,
        created_at: new Date().toISOString(),
        synced: false,
        synced_at: null,
      };

      await saveDictionaryAndCardDual(entryToSave, cardToSave);
      await useDictionaryStore.getState().refresh();
      setIsDictSaved(true);
    } catch (err) {
      console.error('Failed to save to dictionary:', err);
    } finally {
      setIsSavingDict(false);
    }
  };

  const handleSelectEmotion = async (emotion: string) => {
    setSelectedEmotion(emotion);
    setPhase('loading');
    setProcessing(true);
    setLoadingMsgIndex(0);

    try {
      // Build bodyData from store for serverless compatibility
      const bodyDataForApi = Object.entries(zoneData)
        .filter(([, data]) => data.sensations.length > 0)
        .map(([zone, data]) => ({
          zone,
          sensations: data.sensations,
        }));

      const response = await fetch('/api/checkin/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threadId,
          selectedEmotion: emotion,
          bodyData: bodyDataForApi,
        }),
      });

      if (!response.ok) throw new Error('Selection failed');

      const data = await response.json();
      setSelectionResult({
        copingStrategies: data.copingStrategies,
        communicationCard: data.communicationCard,
        dictionaryUpdate: data.dictionaryUpdate,
      });
      setPhase('results');
    } catch (error) {
      console.error('Selection error:', error);
      setErrorMessage('We couldn\u2019t process your selection. Please try again.');
      retryActionRef.current = () => handleSelectEmotion(emotion);
      setPhase('error');
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
      setErrorMessage('We couldn\u2019t find new suggestions. Please try again.');
      retryActionRef.current = () => handleReject(reason);
      setPhase('error');
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
      const strategy = copingStrategies.find((s) => s.name === strategyName);
      const category = strategy?.category || 'cognitive';

      try {
        await saveCopingLocal({
          id: crypto.randomUUID(),
          checkin_id: threadId,
          strategy_name: strategyName,
          category,
          was_helpful: helpful,
          created_at: new Date().toISOString(),
        });

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
        {showBreathing ? (
          <BreathingExercise onSkip={() => setShowBreathing(false)} />
        ) : (
          <CrisisMessage message={crisisMessage} />
        )}
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
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>
            {LOADING_MESSAGES[loadingMsgIndex % LOADING_MESSAGES.length]}
          </p>
          <p className={styles.loadingSubtext}>
            Finding coping strategies and building your communication card
          </p>
        </motion.div>
      )}

      {/* Error Phase */}
      {phase === 'error' && (
        <div className={styles.content}>
          <ErrorState
            message={errorMessage}
            onRetry={() => {
              setPhase('suggestions');
              retryActionRef.current?.();
            }}
          />
        </div>
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
            <div className={styles.saveDictCard}>
              <h3 className={styles.saveDictTitle}>Save to Emotion Dictionary</h3>
              <p className={styles.saveDictDesc}>
                Store this emotional mapping in your personal dictionary so you can track body patterns and personalize future recommendations.
              </p>
              {isDictSaved ? (
                <div className={styles.saveDictBtnSaved}>
                  <Check size={18} />
                  <span>Saved to Dictionary</span>
                </div>
              ) : (
                <button
                  className={styles.saveDictBtn}
                  onClick={handleSaveToDictionary}
                  disabled={isSavingDict}
                  type="button"
                >
                  {isSavingDict ? (
                    <>
                      <Loader2 size={18} className={styles.spin} />
                      <span>Saving to Dictionary...</span>
                    </>
                  ) : (
                    <>
                      <BookPlus size={18} />
                      <span>Save this check-in to dictionary</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <button className={styles.doneBtn} onClick={handleStartOver} type="button">
              Start a new check-in
            </button>
          </motion.div>
        </div>
      )}
    </main>
  );
}
