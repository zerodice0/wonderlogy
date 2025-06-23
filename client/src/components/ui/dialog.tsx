import React, { useEffect, useRef, useCallback } from 'react';
import { Button } from './button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
}

export function Dialog({ isOpen, onClose, title, children, variant = 'default' }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const centerDialog = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const rect = dialog.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const left = (viewportWidth - rect.width) / 2;
    const top = (viewportHeight - rect.height) / 2;

    dialog.style.left = `${Math.max(0, left)}px`;
    dialog.style.top = `${Math.max(0, top)}px`;
    dialog.style.margin = '0';
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      // Dialog가 열린 후 중앙 정렬
      requestAnimationFrame(() => {
        centerDialog();
      });
    } else {
      dialog.close();
    }
  }, [isOpen, centerDialog]);

  // 뷰포트 크기 변경 시 Dialog 위치 재계산
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      centerDialog();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, centerDialog]);

  const handleClose = () => {
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onClick={handleBackdropClick}
      className="backdrop:bg-black/50 bg-transparent p-0 max-w-md w-full fixed"
      style={{
        position: 'fixed',
        transform: 'none',
        inset: 'auto'
      }}
    >
      <div className={`
        bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4
        ${variant === 'destructive' ? 'border-l-4 border-red-500' : 'border-l-4 border-blue-500'}
      `}>
        {title && (
          <h2 className={`
            text-lg font-semibold mb-4
            ${variant === 'destructive' ? 'text-red-700' : 'text-gray-900'}
          `}>
            {title}
          </h2>
        )}
        <div className="mb-6 text-gray-700">
          {children}
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleClose}
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            size="sm"
          >
            확인
          </Button>
        </div>
      </div>
    </dialog>
  );
}