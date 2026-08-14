'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { BodyScene } from '@/components/body/BodyScene';
import { GenderSelect } from '@/components/checkin/GenderSelect';
import { SensationPanel } from '@/components/checkin/SensationPanel';
import { ContextInput } from '@/components/checkin/ContextInput';
import { CheckInButton } from '@/components/checkin/CheckInButton';
import { useCheckinStore, ZONE_LABELS } from '@/lib/store/checkinStore';
import type { BodyType } from '@/lib/store/checkinStore';
import { getDictionaryLocal } from '@/lib/db/local/operations';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { ArrowLeft } from 'lucide-react';
import styles from './page.module.css';

export default function CheckinPage() {
  const router = useRouter();
  const {
    activeZone,
    isZoomed,
    deselectZone,
    zoneData,
    bodyType,
    setBodyType,
    setProcessing,
    setCheckinResult,
    setCrisisResult,
  } = useCheckinStore();

  const [checkinError, setCheckinError] = useState<string | null>(null);

  const totalSensations = Object.values(zoneData).reduce(
    (acc, zone) => acc + zone.sensations.length,
    0
  );

  const handleCheckIn = async () => {
    setProcessing(true);
    setCheckinError(null);
    try {
      // Prepare body data for API
      const bodyData = Object.entries(zoneData)
        .filter(([, data]) => data.sensations.length > 0)
        .map(([zone, data]) => ({
          zone,
          sensations: data.sensations,
        }));

      // Fetch user dictionary context from IndexedDB
      const rawDict = await getDictionaryLocal();
      const dictionary = rawDict.map((d) => ({
        emotion: d.emotion,
        bodyPatterns: d.body_patterns,
        frequency: d.frequency,
        effectiveCoping: d.effective_coping,
        ineffectiveCoping: d.ineffective_coping,
      }));

      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bodyData,
          context: useCheckinStore.getState().context || undefined,
          dictionary,
        }),
      });

      if (!response.ok) throw new Error('Check-in failed');

      const data = await response.json();

      // Check for crisis response
      if (data.crisis) {
        setCrisisResult(data.validationMessage);
      } else {
        setCheckinResult({
          suggestions: data.suggestions,
          validation: data.validation,
          threadId: data.threadId,
        });
      }

      setProcessing(false);
      router.push('/results');
    } catch (error) {
      console.error('Check-in error:', error);
      setCheckinError('We couldn\u2019t process your check-in. Please check your connection and try again.');
      setProcessing(false);
    }
  };

  return (
    <main className={styles.main}>
      {!bodyType && (
        <GenderSelect onSelect={(type: BodyType) => setBodyType(type)} />
      )}

      <div
        className={[
          styles.sceneWrapper,
          isZoomed ? styles.panelOpen : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <BodyScene />
      </div>

      {/* Zone header overlay when zoomed */}
      {isZoomed && activeZone && (
        <div className={styles.overlay}>
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft size={18} />}
            onClick={deselectZone}
            className={styles.backBtn}
          >
            Back
          </Button>
          <div className={styles.zoneInfo}>
            <h2 className={styles.zoneName}>{ZONE_LABELS[activeZone]}</h2>
            <p className={styles.zoneHint}>Tap sensations you feel here</p>
          </div>
        </div>
      )}

      {/* Change model button when not zoomed */}
      {!isZoomed && bodyType && (
        <div className={styles.topActions}>
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft size={18} />}
            onClick={() => setBodyType(null)}
            className={styles.changeModelBtn}
          >
            Change Model
          </Button>
        </div>
      )}

      {/* Instructions when not zoomed */}
      {!isZoomed && bodyType && totalSensations === 0 && (
        <div className={styles.instructions}>
          <p>Tap a body zone to begin</p>
        </div>
      )}

      {/* Sensation panel (drawer on mobile, side panel on desktop) */}
      <AnimatePresence>
        {isZoomed && activeZone && <SensationPanel />}
      </AnimatePresence>

      {/* Context input — shown when user has mapped sensations and is not zoomed */}
      {!isZoomed && bodyType && totalSensations > 0 && (
        <div className={styles.contextArea}>
          <ContextInput />
        </div>
      )}
      {/* Error state */}
      {checkinError && (
        <div className={styles.contextArea}>
          <ErrorState
            message={checkinError}
            onRetry={handleCheckIn}
          />
        </div>
      )}

      {/* Floating check-in button */}
      <CheckInButton onSubmit={handleCheckIn} />
    </main>
  );
}
