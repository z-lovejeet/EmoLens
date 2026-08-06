'use client';

import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { BodyScene } from '@/components/body/BodyScene';
import { GenderSelect } from '@/components/checkin/GenderSelect';
import { SensationPanel } from '@/components/checkin/SensationPanel';
import { ContextInput } from '@/components/checkin/ContextInput';
import { CheckInButton } from '@/components/checkin/CheckInButton';
import { useCheckinStore, ZONE_LABELS } from '@/lib/store/checkinStore';
import type { BodyType } from '@/lib/store/checkinStore';
import { Button } from '@/components/ui/Button';
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

  const totalSensations = Object.values(zoneData).reduce(
    (acc, zone) => acc + zone.sensations.length,
    0
  );

  const handleCheckIn = async () => {
    setProcessing(true);
    try {
      // Prepare body data for API
      const bodyData = Object.entries(zoneData)
        .filter(([, data]) => data.sensations.length > 0)
        .map(([zone, data]) => ({
          zone,
          sensations: data.sensations,
        }));

      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bodyData,
          context: useCheckinStore.getState().context || undefined,
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

        {/* Instructions when not zoomed */}
        {!isZoomed && bodyType && totalSensations === 0 && (
          <div className={styles.instructions}>
            <p>Tap a body zone to begin</p>
          </div>
        )}
      </div>

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

      {/* Floating check-in button */}
      <CheckInButton onSubmit={handleCheckIn} />
    </main>
  );
}
