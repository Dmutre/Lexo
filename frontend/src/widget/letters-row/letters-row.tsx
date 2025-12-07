import { FC } from 'react';
import styles from './letters-row.module.css';
import { GameMode } from '@/entities/game-session/api/types';

interface ILettersRowProps {
  task: string;
  mode: GameMode;
}

export const LettersRow: FC<ILettersRowProps> = ({ task, mode }) => {
  return (
    <div className={styles.lettersRow}>
      {mode === GameMode.PARTIALS ? (
        <div className={`${styles.letters} ${styles.lettersPulse}`}>
          {task.split('').map((letter, idx) => (
            <span
              key={idx}
              className={styles.letterBubble}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {letter}
            </span>
          ))}
        </div>
      ) : (
        <div className={styles.lettersGrid}>
          {task.split('').map((letter, idx) => (
            <div
              key={idx}
              className={styles.letterTile}
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              {letter}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
