import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => void;
  onSwitchToRegister: () => void;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, onSwitchToRegister, isLoading = false }: LoginFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t('login')}</CardTitle>
        <CardDescription>
          {t('loginDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id">{t('userId')}</Label>
            <Input
              id="email"
              name="email"
              type="text"
              placeholder={t('userIdPlaceholder')}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={t('passwordPlaceholder')}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? t('loggingIn') : t('loginButton')}
          </Button>
          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
            >
              {t('noAccount')} {t('goToRegister')}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}