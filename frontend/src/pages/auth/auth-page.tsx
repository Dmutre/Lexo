import { AuthForm } from '@/modules/auth-form/ui/auth-form';
import styles from './auth-page.module.css';

export const AuthPage = () => {
  return (
    <div className={styles.root}>
      <div className={styles.leftPane}>
        <div className={styles.brand}>
          <div className={styles.logo}>Lx</div>
          <h1 className={styles.title}>Lexo</h1>
        </div>
        <p className={styles.subtitle}>
          Lexo is a word game about playing with letters and words. It’s a light but clever way to
          train your focus, vocabulary, and speed of thinking.
        </p>
        <ul className={styles.features}>
          <li>
            Match word by random part — guess the word from a prefix, suffix, or fragment in the
            middle.
          </li>
          <li>
            Complete word with these letters — build and complete words from a limited set of
            letters.
          </li>
          <li>Improve your focus, vocabulary, and thinking speed a little bit every day.</li>
        </ul>
      </div>

      <div className={styles.rightPane}>
        <AuthForm />
      </div>
    </div>
  );
};
