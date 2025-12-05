import { useEffect, useMemo, useState } from 'react';
import styles from './partials-mode.page.module.css';

const TOTAL_SECONDS = 120;
const CORRECT_MESSAGES = [
  '🎉 Perfect!',
  '⚡ Amazing!',
  '🔥 On fire!',
  '✨ Brilliant!',
  '🌟 Superb!',
  '💫 Excellent!',
  '🎯 Spot on!',
];

const ERROR_MESSAGES = [
  '❌ Not quite...',
  '🤔 Try again!',
  '💭 Keep going!',
  '🎮 Give it another shot!',
];

export const PartialsModePage = () => {
  const [round, setRound] = useState(1);
  const [letters] = useState('cke');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<null | { type: 'success' | 'error'; message: string }>(
    null,
  );
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);

  const isTimerDanger = secondsLeft <= 15;

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const id = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearInterval(id);
  }, [secondsLeft]);

  const formattedTime = useMemo(() => {
    const m = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, '0');
    const s = (secondsLeft % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }, [secondsLeft]);

  const handleValidate = () => {
    const index = answer.toLowerCase().indexOf(letters.toLowerCase());
    const isValid = index !== -1;

    if (isValid) {
      const newStreak = streak + 1;
      const points = 10 + (newStreak >= 3 ? 5 : 0); // Bonus for streak
      setScore((prev) => prev + points);
      setStreak(newStreak);

      const randomMsg = CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
      setFeedback({
        type: 'success',
        message:
          newStreak >= 3
            ? `${randomMsg} ${newStreak}x STREAK! +${points} pts`
            : `${randomMsg} +${points} pts`,
      });

      setIsCelebrating(true);
      setTimeout(() => setIsCelebrating(false), 600);

      setRound((prev) => prev + 1);
      setTimeout(() => setAnswer(''), 300);
    } else {
      setStreak(0);
      const randomMsg = ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)];
      setFeedback({ type: 'error', message: randomMsg });

      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleEndEarly = () => {
    // For now this just stops the timer. Navigation or summary can be added later.
    setSecondsLeft(0);
  };

  return (
    <div className={styles.root}>
      <div
        className={`${styles.card} ${isCelebrating ? styles.celebrate : ''} ${
          isShaking ? styles.shake : ''
        }`}
      >
        <div className={styles.header}>
          <div className={styles.brand}>
            <div className={styles.logo}>Lx</div>
            <div className={styles.titleBlock}>
              <h1 className={styles.title}>Partials mode</h1>
              <p className={styles.subtitle}>Use the given letters inside a full word.</p>
            </div>
          </div>

          <div
            className={`${styles.timer} ${isTimerDanger ? styles.timerDanger : ''} ${
              isTimerDanger ? styles.pulse : ''
            }`}
          >
            {formattedTime}
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Score</span>
            <span className={styles.statValue}>{score}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Round</span>
            <span className={styles.statValue}>{round}</span>
          </div>
          {streak >= 2 && (
            <div className={`${styles.statItem} ${styles.streakBadge}`}>
              <span className={styles.statLabel}>
                <span role="img" aria-label="fire">
                  🔥
                </span>{' '}
                Streak
              </span>
              <span className={styles.statValue}>{streak}x</span>
            </div>
          )}
        </div>

        <div className={styles.roundInfo}>
          <span className={styles.lettersLabel}>Use this fragment:</span>
        </div>

        <div className={styles.lettersRow}>
          <div className={`${styles.letters} ${styles.lettersPulse}`}>
            {letters.split('').map((letter, idx) => (
              <span
                key={idx}
                className={styles.letterBubble}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.inputBlock}>
          <label className={styles.inputLabel} htmlFor="answer">
            Type a word
          </label>
          <input
            id="answer"
            type="text"
            className={styles.inputField}
            placeholder="e.g. rocket"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setFeedback(null);
            }}
            disabled={secondsLeft <= 0}
          />
          <p className={styles.inputHint}>
            Your word must contain the fragment exactly in this order.
          </p>
        </div>

        {feedback && (
          <p
            className={`${styles.feedback} ${
              feedback.type === 'error' ? styles.feedbackError : styles.feedbackSuccess
            }`}
          >
            {feedback.message}
          </p>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.buttonSecondary} onClick={handleEndEarly}>
            End game
          </button>
          <button
            type="button"
            className={styles.buttonPrimary}
            onClick={handleValidate}
            disabled={!answer || secondsLeft <= 0}
          >
            Check &amp; next
          </button>
        </div>
      </div>
    </div>
  );
};
