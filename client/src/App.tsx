import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { LoginForm } from './components/LoginForm'
import { RegisterForm } from './components/RegisterForm'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Dialog } from './components/ui/dialog'
import { apiService, LoginRequest, RegisterRequest } from './services/api'
import { validateEnvironment } from './config/api'
import { getErrorMessage, getErrorTitle } from './utils/errorHandling'
import './utils/healthCheck'
import './i18n'

function App() {
  const { t } = useTranslation()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'default' | 'destructive';
  }>({ isOpen: false, title: '', message: '', variant: 'default' })

  useEffect(() => {
    validateEnvironment();
  }, []);

  const handleLogin = async (data: LoginRequest) => {
    setIsLoading(true)
    try {
      const response = await apiService.login(data);
      if (response.success) {
        console.log('✅ Login successful:', response);
        setDialog({
          isOpen: true,
          title: '로그인 성공',
          message: '로그인에 성공했습니다!',
          variant: 'default'
        });
      } else {
        console.error('❌ Login failed:', response.message);
        setDialog({
          isOpen: true,
          title: '로그인 실패',
          message: response.message || '로그인에 실패했습니다.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      const apiError = getErrorMessage(error);
      setDialog({
        isOpen: true,
        title: getErrorTitle(apiError.type),
        message: apiError.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (data: RegisterRequest) => {
    setIsLoading(true)
    try {
      const response = await apiService.register(data);
      if (response.success) {
        console.log('✅ Registration successful:', response);
        setDialog({
          isOpen: true,
          title: '회원가입 성공',
          message: '회원가입에 성공했습니다! 로그인 페이지로 이동합니다.',
          variant: 'default'
        });
        setIsLogin(true);
      } else {
        console.error('❌ Registration failed:', response.message);
        setDialog({
          isOpen: true,
          title: '회원가입 실패',
          message: response.message || '회원가입에 실패했습니다.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      const apiError = getErrorMessage(error);
      setDialog({
        isOpen: true,
        title: getErrorTitle(apiError.type),
        message: apiError.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="absolute top-4 right-4">
            <LanguageSwitcher />
          </div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('appTitle')}</h1>
            <p className="text-gray-600">{t('appDescription')}</p>
          </div>
          
          {isLogin ? (
            <LoginForm
              onSubmit={handleLogin}
              onSwitchToRegister={() => setIsLogin(false)}
              isLoading={isLoading}
            />
          ) : (
            <RegisterForm
              onSubmit={handleRegister}
              onSwitchToLogin={() => setIsLogin(true)}
              isLoading={isLoading}
            />
          )}
        </div>
        
        <Dialog
          isOpen={dialog.isOpen}
          onClose={() => setDialog(prev => ({ ...prev, isOpen: false }))}
          title={dialog.title}
          variant={dialog.variant}
        >
          {dialog.message}
        </Dialog>
      </div>
    </ErrorBoundary>
  )
}

export default App