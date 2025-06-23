export interface ApiError {
  message: string;
  statusCode?: number;
  type: 'network' | 'auth' | 'validation' | 'server' | 'unknown';
}

export function getErrorMessage(error: unknown): ApiError {
  // Type guard to check if error is an object with expected properties
  const isErrorWithResponse = (err: unknown): err is { response?: { status?: number; data?: { message?: string } } } => {
    return typeof err === 'object' && err !== null;
  };

  const isErrorWithMessage = (err: unknown): err is { message?: string } => {
    return typeof err === 'object' && err !== null;
  };

  const isErrorWithStatus = (err: unknown): err is { status?: number } => {
    return typeof err === 'object' && err !== null;
  };

  // Network error (서버 연결 실패)
  if (!isErrorWithResponse(error) || !error.response) {
    return {
      message: '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.',
      type: 'network'
    };
  }

  const statusCode = error.response?.status || (isErrorWithStatus(error) ? error.status : undefined);
  const serverMessage = error.response?.data?.message || (isErrorWithMessage(error) ? error.message : undefined);

  switch (statusCode) {
    case 400:
      return {
        message: serverMessage || '잘못된 요청입니다. 입력 정보를 확인해주세요.',
        statusCode,
        type: 'validation'
      };
    
    case 401:
      return {
        message: '로그인 정보가 올바르지 않습니다.',
        statusCode,
        type: 'auth'
      };
    
    case 403:
      return {
        message: '접근 권한이 없습니다.',
        statusCode,
        type: 'auth'
      };
    
    case 404:
      return {
        message: '요청한 리소스를 찾을 수 없습니다.',
        statusCode,
        type: 'server'
      };
    
    case 409:
      return {
        message: serverMessage || '이미 존재하는 정보입니다.',
        statusCode,
        type: 'validation'
      };
    
    case 422:
      return {
        message: serverMessage || '입력 데이터가 유효하지 않습니다.',
        statusCode,
        type: 'validation'
      };
    
    case 429:
      return {
        message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
        statusCode,
        type: 'server'
      };
    
    case 500:
      return {
        message: '서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        statusCode,
        type: 'server'
      };
    
    case 502:
    case 503:
    case 504:
      return {
        message: '서버가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.',
        statusCode,
        type: 'server'
      };
    
    default:
      return {
        message: serverMessage || '알 수 없는 오류가 발생했습니다.',
        statusCode,
        type: 'unknown'
      };
  }
}

export function getErrorTitle(errorType: ApiError['type']): string {
  switch (errorType) {
    case 'network':
      return '연결 오류';
    case 'auth':
      return '인증 오류';
    case 'validation':
      return '입력 오류';
    case 'server':
      return '서버 오류';
    default:
      return '오류';
  }
}