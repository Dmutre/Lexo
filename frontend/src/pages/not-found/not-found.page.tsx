import { useNavigate } from 'react-router-dom';

import styles from './not-found.page.module.css';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/', { replace: true });
  };

  const handleGoToAuth = () => {
    navigate('/auth', { replace: true });
  };

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.logo}>Lx</div>
          <h1 className={styles.title}>Page not found</h1>
        </div>

        <div className={styles.code}>Error 404</div>

        <p className={styles.message}>
          Looks like you took a tiny wrong turn in the world of words. Unfortunately, this page
          doesn&apos;t exist in Lexo.
        </p>

        <p className={styles.hint}>
          You can head back to the main screen or go to the auth page to start a new session.
        </p>

        <div className={styles.actions}>
          <button type="button" className={styles.buttonPrimary} onClick={handleBackHome}>
            Back to home
          </button>
          <button type="button" className={styles.buttonGhost} onClick={handleGoToAuth}>
            Go to auth
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
