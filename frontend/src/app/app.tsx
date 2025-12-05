// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { meApi } from '@/entities/user/api/user-api';
import { useUserStore } from '@/entities/user/model/user.store';
import { AuthPage } from '@/pages/auth/auth-page';
import { HomePage } from '@/pages/home';
import NotFoundPage from '@/pages/not-found/not-found.page';
import { PartialsModePage } from "@/pages/partials-mode";
import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

export function App() {
  const isAuth = useUserStore((state) => state.isAuth);
  const setIsAuth = useUserStore((state) => state.setIsAuth);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const res = await meApi();
      if (res.ok && res.data) {
        setIsAuth(true);
      }
    })();
  }, [setIsAuth, navigate]);

  return (
    <Routes>
      {!isAuth ? (
        <Route path="/" index element={<AuthPage />} />
      ) : (
        <>
          <Route path="/" element={<HomePage />} />
          <Route path="partials" element={<PartialsModePage />} />
        </>
      )}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
