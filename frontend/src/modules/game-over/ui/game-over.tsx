import { useGameSession } from '@/entities/game-session/hooks/useGameSession';
import styles from './game-over.module.css';
import { useGameSessionStore } from '@/entities/game-session/model/game-session.store';
import { useNavigate } from 'react-router-dom';

interface IGameOverProps {
  round: number;
}

export const GameOver = ({ round }: IGameOverProps) => {
  const { startGame, isLoading } = useGameSession();
  const {
    clearGameSession,
    round: { scoreAwarded },
  } = useGameSessionStore();
  const navigate = useNavigate();

  const handleGoHome = () => {
    clearGameSession();
    navigate('/');
  };

  const handlePlayAgain = () => {
    clearGameSession();
    startGame();
  };
  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.logo}>Lx</div>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>Game over!</h1>
            <p className={styles.subtitle}>Great job completing the challenge.</p>
          </div>
        </div>

        <div className={styles.gameOverStats}>
          <div className={styles.finalScoreContainer}>
            <span className={styles.finalScoreLabel}>Final Score</span>
            <span className={styles.finalScoreValue}>{scoreAwarded || 0}</span>
          </div>
          <div className={styles.gameOverInfo}>
            <div className={styles.gameOverStatItem}>
              <span className={styles.gameOverStatLabel}>Rounds completed</span>
              <span className={styles.gameOverStatValue}>{round - 1}</span>
            </div>
          </div>
        </div>

        <div className={styles.welcomeActions}>
          <button
            type="button"
            className={styles.buttonPrimary}
            onClick={handlePlayAgain}
            disabled={isLoading}
          >
            {isLoading ? 'Starting...' : 'Play again'}
          </button>
          <button type="button" className={styles.buttonSecondary} onClick={handleGoHome}>
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
};
