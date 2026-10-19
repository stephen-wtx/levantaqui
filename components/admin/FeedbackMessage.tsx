'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CircleCheck, CircleAlert, X } from 'lucide-react';
import { FeedbackNotification } from '@/types/admin';

interface FeedbackMessageProps {
  notification: FeedbackNotification | null;
  onDismiss: () => void;
}

export function FeedbackMessage({
  notification,
  onDismiss,
}: FeedbackMessageProps) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex items-center justify-center px-4 sm:bottom-6 sm:justify-end sm:px-6"
    >
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`pointer-events-auto flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-[0_4px_16px_rgba(15,23,42,0.08),0_1px_3px_rgba(15,23,42,0.04)] ${
              notification.type === 'success'
                ? 'border-emerald-200/90 text-gray-900'
                : 'border-rose-200/90 text-gray-900'
            }`}
          >
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                notification.type === 'success'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-rose-50 text-rose-600'
              }`}
            >
              {notification.type === 'success' ? (
                <CircleCheck className="h-4 w-4" />
              ) : (
                <CircleAlert className="h-4 w-4" />
              )}
            </div>

            <p className="text-xs font-medium text-gray-800">
              {notification.message}
            </p>

            <button
              type="button"
              onClick={onDismiss}
              aria-label="Fechar notificação"
              className="ml-1 cursor-pointer rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
