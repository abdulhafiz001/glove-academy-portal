import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';

export const useNotification = () => {
  const { props } = usePage();
  const flash = props.flash || {};

  const showSuccess = (message) => {
    // Inertia flash messages are handled server-side
    // For client-side notifications, you can use a toast library
    // For now, we'll rely on server-side flash messages
    console.log('Success:', message);
  };

  const showError = (message) => {
    // Inertia flash messages are handled server-side
    console.error('Error:', message);
  };

  return {
    showSuccess,
    showError,
    success: flash.success,
    error: flash.error,
  };
};

