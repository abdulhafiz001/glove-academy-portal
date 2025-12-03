import { usePage } from '@inertiajs/react';

export const useAuth = () => {
  const { props } = usePage();
  const user = props.auth?.user;

  return {
    user,
    student: user?.role === 'student' ? user : null,
    loading: false, // Inertia handles loading state
  };
};

