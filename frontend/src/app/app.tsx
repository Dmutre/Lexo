// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { meApi } from '@/entities/user/api/user-api';
import { useUserStore } from '@/entities/user/model/user.store';
import { AuthPage } from '@/pages/auth/auth-page';
import NotFoundPage from '@/pages/not-found/not-found.page';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

const HelloWorld = () => {
  return <h1>Hello, World!</h1>;
};

export function App() {
  const isAuth = useUserStore((state) => state.isAuth);
  const setIsAuth = useUserStore((state) => state.setIsAuth);

  useEffect(() => {
    (async () => {
      const res = await meApi();
      if (res.ok && res.data) {
        setIsAuth(true);
      }
    })();
  }, []);

  return (
    <Routes>
      {!isAuth ? (
        <Route path="auth" index element={<AuthPage />} />
      ) : (
        <Route path="*" element={<HelloWorld />} />
      )}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
