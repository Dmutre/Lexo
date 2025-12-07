import { useEffect, useMemo, useState } from 'react';
import styles from './partials-mode.page.module.css';
import { useGameSessionStore } from '@/entities/game-session/model/game-session.store';
import {
  finishGameSessionApi,
  validateAnswerApi,
} from '@/entities/game-session/api/game-session.api';
import dayjs from 'dayjs';
import { GameStatus } from '@/entities/game-session/api/types';
import { useNavigate } from "react-router-dom";

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
  const gameSession = useGameSessionStore();
  const { task, gameRoundId, scoreAwarded } = gameSession.round || {};
  const {
    startedAt,
    finishesAt,
    gameSessionId,
    setGameSession,
    setScore,
    createGameRound,
    status,
  } = gameSession;
  const navigate = useNavigate();

  const [round, setRound] = useState(1);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<null | { type: 'success' | 'error'; message: string }>(
    null,
  );
  const [secondsLeft, setSecondsLeft] = useState(
    dayjs(finishesAt).diff(dayjs(startedAt), 'second'),
  );
  const [streak, setStreak] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);

  const isTimerDanger = secondsLeft <= 15;

  const endGame = async () => {
    const gameInfo = await finishGameSessionApi(gameSessionId);
    if (gameInfo.ok && gameInfo.data) {
      setGameSession(gameInfo.data);
    }
  };

  useEffect(() => {
    const updateTimeLeft = () => {
      const timeLeft = dayjs(finishesAt).diff(dayjs(Date.now()), 'second');
      setSecondsLeft(Math.max(timeLeft, 0));
    };

    updateTimeLeft();

    const id = window.setInterval(() => {
      updateTimeLeft();
      if (secondsLeft <= 0) {
        endGame();
      }
    }, 1000);

    return () => window.clearInterval(id);
  }, [secondsLeft, finishesAt]);

  useEffect(() => {
    if (status === GameStatus.FINISHED) {
      navigate('/game-over');
    }
  }, [status, navigate]);

  const formattedTime = useMemo(() => {
    const m = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, '0');
    const s = (secondsLeft % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }, [secondsLeft]);

  const handleValidate = async () => {
    const validatedAnswer = await validateAnswerApi({
      gameRoundId,
      userAnswer: answer,
    });

    if (validatedAnswer.ok && validatedAnswer.data) {
      const roundResult = validatedAnswer.data;
      const newStreak = streak + 1;

      setScore(roundResult.scoreAwarded);
      setStreak(newStreak);

      const randomMsg = CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
      setFeedback({
        type: 'success',
        message: newStreak >= 3 ? `${randomMsg} ${newStreak}x STREAK!` : `${randomMsg}`,
      });

      createGameRound({
        gameRoundId: roundResult.gameRoundId,
        task:
          typeof roundResult.taskPayload.data.task === 'string'
            ? roundResult.taskPayload.data.task
            : roundResult.taskPayload.data.task.join(''),
        userAnswer: roundResult.userAnswer,
        scoreAwarded: roundResult.scoreAwarded,
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

  // Active game screen
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
            <span className={styles.statValue}>{scoreAwarded}</span>
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
        </div>

        <div className={styles.inputBlock}>
          <label className={styles.inputLabel} htmlFor="answer">
            Type a word
          </label>
          <input
            id="answer"
            type="text"
            className={styles.inputField}
            placeholder="Your answer here"
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
          <button type="button" className={styles.buttonSecondary} onClick={endGame}>
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
