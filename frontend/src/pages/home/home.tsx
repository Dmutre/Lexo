import { useState } from 'react';
import styles from './home.module.css';
import { GameMode, SupportedLanguage } from '@/entities/game-session/api/types';
import { useNavigate } from 'react-router-dom';
import {
  createGameSessionApi,
  getGameRoundApi,
} from '@/entities/game-session/api/game-session.api';
import { useGameSessionStore } from '@/entities/game-session/model/game-session.store';

export const HomePage = () => {
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const { gameSessionId, createGameSession, createGameRound } = useGameSessionStore();
  const navigate = useNavigate();

  const handleSelect = (mode: GameMode) => {
    setSelectedMode(mode);
  };

  const handlePlay = async () => {
    const mode = selectedMode;
    const route = mode === GameMode.PARTIALS ? '/partials' : '/letters';

    if (!selectedMode) return;

    const data = await createGameSessionApi({
      mode: selectedMode,
      language: SupportedLanguage.ENGLISH,
    });

    if (data.ok && data.data?.gameSessionId) {
      createGameSession(data.data);
      const gameRound = await getGameRoundApi({ gameSessionId: data.data.gameSessionId });
      if (gameRound.ok && gameRound.data) {
        createGameRound({
          gameRoundId: gameRound.data.gameRoundId,
          task:
            typeof gameRound.data.taskPayload.data.task === 'string'
              ? gameRound.data.taskPayload.data.task
              : gameRound.data.taskPayload.data.task.join(''),
          userAnswer: gameRound.data.userAnswer,
          scoreAwarded: gameRound.data.scoreAwarded,
        });
        navigate(route);
      }
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <div className={styles.brandLogo}>Lx</div>
          <span className={styles.brandText}>Lexo</span>
        </div>
        <div>
          <h2 className={styles.title}>Select a game mode</h2>
          <p className={styles.hint}>Choose how you want to play today.</p>
          <p className={styles.subtitle}>
            Train partial guesses or practice letter precision to improve your Lexo skills.
          </p>
        </div>

        <div className={styles.modes}>
          <button
            type="button"
            className={`${styles.modeCard} ${
              selectedMode === GameMode.PARTIALS ? styles.modeCardSelected : ''
            }`}
            onClick={() => handleSelect(GameMode.PARTIALS)}
          >
            <span className={styles.modeLabel}>Partials</span>
          </button>

          <button
            type="button"
            className={`${styles.modeCard} ${
              selectedMode === GameMode.LETTERS ? styles.modeCardSelected : ''
            }`}
            onClick={() => handleSelect(GameMode.LETTERS)}
          >
            <span className={styles.modeLabel}>Letters</span>
          </button>
        </div>
        <button
          type="button"
          onClick={handlePlay}
          disabled={!selectedMode}
          className={styles.playButton}
        >
          Play
        </button>
      </div>
    </div>
  );
};
