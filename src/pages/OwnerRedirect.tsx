import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useOwnerStatus } from '@/hooks/useOwnerStatus';

const OwnerRedirect = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOwner, loading } = useOwnerStatus();

  useEffect(() => {
    if (!loading && user) {
      if (isOwner) {
        // Returning owner - go to dashboard
        navigate('/owner/dashboard');
      } else {
        // First-time owner - go to registration
        navigate('/owner/register-pg');
      }
    }
  }, [loading, user, isOwner, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default OwnerRedirect;