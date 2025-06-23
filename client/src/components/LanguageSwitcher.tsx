import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'ko', name: t('korean') },
    { code: 'en', name: t('english') },
    { code: 'ja', name: t('japanese') },
  ];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">{t('language')}:</span>
      <div className="flex gap-1">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={i18n.language === lang.code ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleLanguageChange(lang.code)}
            className="text-xs"
          >
            {lang.name}
          </Button>
        ))}
      </div>
    </div>
  );
}