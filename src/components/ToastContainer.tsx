import React from 'react';
import {Toast} from './Toast';
import {useToastStore} from '../store/useToastStore';

export function ToastContainer() {
  const {toasts, hideToast} = useToastStore();

  return (
    <>
      {toasts.map((toast, _index) => (
        <Toast
          key={toast.id}
          toast={{
            ...toast,
            // Offset each toast vertically if multiple toasts
            id: toast.id,
          }}
          onHide={hideToast}
        />
      ))}
    </>
  );
}