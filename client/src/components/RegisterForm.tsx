import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RegisterRequest } from '@/services/api';

interface RegisterFormProps {
  onSubmit: (data: RegisterRequest) => void;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
}

export function RegisterForm({ onSubmit, onSwitchToLogin, isLoading = false }: RegisterFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.id = t('userIdRequired');
    } else if (formData.email.length < 3) {
      newErrors.id = t('userIdMinLength');
    }

    if (!formData.password) {
      newErrors.password = t('passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('passwordMinLength');
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('passwordMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t('register')}</CardTitle>
        <CardDescription>
          {t('registerDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id">{t('userId')} {t('required')}</Label>
            <Input
              id="id"
              name="id"
              type="text"
              placeholder={t('userIdPlaceholder')}
              value={formData.email}
              onChange={handleChange}
              required
              className={errors.id ? 'border-destructive' : ''}
            />
            {errors.id && (
              <p className="text-sm text-destructive">{errors.id}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder={t('namePlaceholder')}
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">{t('password')} {t('required')}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={t('passwordPlaceholder2')}
              value={formData.password}
              onChange={handleChange}
              required
              className={errors.password ? 'border-destructive' : ''}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('confirmPassword')} {t('required')}</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder={t('confirmPasswordPlaceholder')}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={errors.confirmPassword ? 'border-destructive' : ''}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? t('registering') : t('registerButton')}
          </Button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
            >
              {t('hasAccount')} {t('goToLogin')}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}