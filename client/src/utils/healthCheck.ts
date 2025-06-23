import { apiService } from '../services/api';
import { validateEnvironment } from '../config/api';

export const performHealthCheck = async (): Promise<boolean> => {
  console.log('🔍 Performing health check...');
  
  if (!validateEnvironment()) {
    return false;
  }

  try {
    const response = await apiService.checkHealth();
    console.log('✅ Health check passed:', response);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return false;
  }
};

export const showHealthStatus = async (): Promise<void> => {
  const isHealthy = await performHealthCheck();
  
  if (isHealthy) {
    alert('✅ 서버 연결 상태가 양호합니다!');
  } else {
    alert('❌ 서버 연결에 문제가 있습니다. 콘솔을 확인해주세요.');
  }
};

// 개발 도구용 전역 함수
declare global {
  interface Window {
    checkHealth?: () => Promise<void>;
    validateEnv?: () => boolean;
  }
}

if (typeof window !== 'undefined') {
  window.checkHealth = showHealthStatus;
  window.validateEnv = validateEnvironment;
}