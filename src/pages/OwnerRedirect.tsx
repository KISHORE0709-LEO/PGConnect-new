import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const OwnerRedirect = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const checkOwnerPGs = async () => {
      try {
        const { auth } = await import('@/config/firebase');
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          navigate('/auth?role=owner');
          return;
        }

        const { collection, query, where, getDocs } = await import('firebase/firestore');
        const { db } = await import('@/config/firebase');
        
        const pgsQuery = query(
          collection(db, 'pgs'),
          where('ownerId', '==', currentUser.uid)
        );
        const pgsSnapshot = await getDocs(pgsQuery);
        
        if (pgsSnapshot.empty) {
          navigate('/owner/register-pg');
        } else {
          navigate('/owner/dashboard');
        }
      } catch (error) {
        console.error('Error checking owner PGs:', error);
        navigate('/owner/dashboard');
      }
    };

    checkOwnerPGs();
  }, [navigate, user]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

export default OwnerRedirect;