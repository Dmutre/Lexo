import { useState } from 'react';
import { Box, Button, Container, Heading, Input, Text, VStack } from '@chakra-ui/react';

import styles from './auth-form.module.css';
import { login, register } from '../api/auth-api';
import { ApiResponse } from '@/shared/api/base-api';
import { IAuthResponse } from '../api/types';

type Mode = 'login' | 'signup';

export const AuthForm = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);

  const isLogin = mode === 'login';

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      username: isLogin ? undefined : (formData.get('username') as string),
      mode,
    };

    let res: ApiResponse<IAuthResponse>;
    if (isLogin) {
      res = await login({ email: payload.email, password: payload.password });
    } else {
      res = await register({
        username: payload.username as string,
        email: payload.email,
        password: payload.password,
        avatarUrl: null,
      });
    }

    if (res.ok && res.data) {
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
    }
  };

  return (
    <Container maxW="container.md" py={16} className={styles.wrapper}>
      <Box className={styles.card}>
        <VStack className={styles.header}>
          <Heading size="lg" textAlign="center">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </Heading>
          <Text textAlign="center" color="gray.500" fontSize="sm">
            {isLogin ? 'Sign in to continue to Lexo.' : 'Sign up to start using Lexo.'}
          </Text>

          <form onSubmit={handleSubmit} className={styles.form}>
            <VStack align="stretch" className={styles.fields}>
              <label className={styles.field}>
                <span className={styles.label}>Email</span>
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>

              {!isLogin && (
                <label className={styles.field}>
                  <span className={styles.label}>Username</span>
                  <Input
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    autoComplete="username"
                    required
                  />
                </label>
              )}

              <label className={styles.field}>
                <span className={styles.label}>Password</span>
                <div className={styles.passwordWrapper}>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className={styles.passwordToggle}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </label>

              <Button type="submit" colorScheme="blue" width="100%" mt={2}>
                {isLogin ? 'Log in' : 'Sign up'}
              </Button>
            </VStack>
          </form>

          <Text textAlign="center" fontSize="sm" color="gray.500">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button type="button" onClick={toggleMode} className={styles.modeToggle}>
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};
