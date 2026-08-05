'use client';

import { BodyScene } from '@/components/body/BodyScene';
import { GenderSelect } from '@/components/checkin/GenderSelect';
import { useCheckinStore, ZONE_LABELS } from '@/lib/store/checkinStore';
import type { BodyType } from '@/lib/store/checkinStore';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import styles from './page.module.css';

export default function CheckinPage() {
  const { activeZone, isZoomed, deselectZone, zoneData, bodyType, setBodyType } =
    useCheckinStore();

  // Count total sensations across all zones
  const totalSensations = Object.values(zoneData).reduce(
    (acc, zone) => acc + zone.sensations.length,
    0
  );

  return (
    <main className={styles.main}>
      {/* Gender selection modal — shows before body */}
      {!bodyType && (
        <GenderSelect onSelect={(type: BodyType) => setBodyType(type)} />
      )}

      <div className={styles.sceneWrapper}>
        <BodyScene />

        {/* Back button when zoomed */}
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

        {/* Instructions when not zoomed (only after gender selected) */}
        {!isZoomed && bodyType && (
          <div className={styles.instructions}>
            <p>Tap a body zone to begin</p>
            {totalSensations > 0 && (
              <p className={styles.sensationCount}>
                {totalSensations} sensation{totalSensations !== 1 ? 's' : ''} mapped
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
