import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export const useOwnerStatus = () => {
  const { user } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Check if user has launched any PG
      const hasLaunchedPG = localStorage.getItem(`owner_${user.uid}`) === 'true';
      setIsOwner(hasLaunchedPG);
    }
    setLoading(false);
  }, [user]);

  const markAsOwner = () => {
    if (user) {
      localStorage.setItem(`owner_${user.uid}`, 'true');
      setIsOwner(true);
    }
  };

  return { isOwner, loading, markAsOwner };
};