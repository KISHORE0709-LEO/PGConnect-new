import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import InteractiveBuildingVisualizer from "@/components/InteractiveBuildingVisualizer";

const PGManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const pgId = id;
  const [pgData, setPgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchPGData = async () => {
      try {
        if (!pgId) {
          setLoading(false);
          return;
        }
        
        const pgDocRef = doc(db, 'pgs', pgId);
        const pgDocSnap = await getDoc(pgDocRef);
        
        if (pgDocSnap.exists()) {
          setPgData({ id: pgDocSnap.id, ...pgDocSnap.data() });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPGData();
  }, [pgId, refreshTrigger]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!pgData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">PG not found</h2>
          <Button onClick={() => navigate('/owner/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="bg-card border-b sticky top-0 z-50 backdrop-blur-lg bg-card/95">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/owner/dashboard')}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl font-bold">{pgData.name} - Tenant Management</h1>
          <div className="w-32" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-2">Manage Tenants</h2>
          <p className="text-muted-foreground">
            View all tenants room-wise, add new tenants, edit details, mark as vacated, and track rent payments.
          </p>
        </Card>

        <InteractiveBuildingVisualizer 
          pgId={pgId}
          onDataChange={() => setRefreshTrigger(prev => prev + 1)}
        />
      </div>
    </div>
  );
};

export default PGManagement;