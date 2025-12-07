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
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
    SupportedLanguage.ENGLISH,
  );
  const { setGameSession, createGameRound } = useGameSessionStore();
  const navigate = useNavigate();

  const handleSelect = (mode: GameMode) => {
    setSelectedMode(mode);
  };

  const handleLanguageSelect = (language: SupportedLanguage) => {
    setSelectedLanguage(language);
  };

  const handlePlay = async () => {
    const mode = selectedMode;
    const route = mode === GameMode.PARTIALS ? '/partials' : '/letters';

    if (!selectedMode) return;

    const data = await createGameSessionApi({
      mode: selectedMode,
      language: selectedLanguage,
    });

    if (data.ok && data.data?.gameSessionId) {
      setGameSession(data.data);
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

        <div className={styles.welcomeSection}>
          <h1 className={styles.mainTitle}>Welcome to Lexo</h1>
          <p className={styles.mainSubtitle}>Choose your language and game mode to start playing</p>
        </div>

        <div className={styles.selectionGroup}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Language</h2>
            <div className={styles.modes}>
              <button
                type="button"
                className={`${styles.modeCard} ${
                  selectedLanguage === SupportedLanguage.ENGLISH ? styles.modeCardSelected : ''
                }`}
                onClick={() => handleLanguageSelect(SupportedLanguage.ENGLISH)}
              >
                <span className={styles.modeIcon} role="img" aria-label="English">
                  🇬🇧🇺🇸🇦🇺
                </span>
                <span className={styles.modeLabel}>English</span>
              </button>

              <button
                type="button"
                className={`${styles.modeCard} ${
                  selectedLanguage === SupportedLanguage.UKRAINIAN ? styles.modeCardSelected : ''
                }`}
                onClick={() => handleLanguageSelect(SupportedLanguage.UKRAINIAN)}
              >
                <span className={styles.modeIcon} role="img" aria-label="Ukrainian">
                  🇺🇦
                </span>
                <span className={styles.modeLabel}>Ukrainian</span>
              </button>
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Game Mode</h2>
            <p className={styles.sectionHint}>Choose how you want to play</p>
            <div className={styles.modes}>
              <button
                type="button"
                className={`${styles.modeCard} ${
                  selectedMode === GameMode.PARTIALS ? styles.modeCardSelected : ''
                }`}
                onClick={() => handleSelect(GameMode.PARTIALS)}
              >
                <span className={styles.modeIcon} role="img" aria-label="Puzzle piece">
                  🧩
                </span>
                <span className={styles.modeLabel}>Partials</span>
                <span className={styles.modeDescription}>Train partial guesses</span>
              </button>

              <button
                type="button"
                className={`${styles.modeCard} ${
                  selectedMode === GameMode.LETTERS ? styles.modeCardSelected : ''
                }`}
                onClick={() => handleSelect(GameMode.LETTERS)}
              >
                <span className={styles.modeIcon} role="img" aria-label="Letters">
                  🔤
                </span>
                <span className={styles.modeLabel}>Letters</span>
                <span className={styles.modeDescription}>Practice letter precision</span>
              </button>
            </div>
          </div>
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
