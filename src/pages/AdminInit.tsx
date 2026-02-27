import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { initializeCitiesAndColleges } from '@/utils/initializeFirebaseData';
import { addBuildingConfigToAllPGs } from '@/utils/addBuildingConfig';
import { CheckCircle2, Loader2 } from 'lucide-react';

const AdminInit = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [buildingLoading, setBuildingLoading] = useState(false);
  const [buildingSuccess, setBuildingSuccess] = useState(false);

  const handleInitialize = async () => {
    setLoading(true);
    const result = await initializeCitiesAndColleges();
    setLoading(false);
    setSuccess(result);
  };

  const handleAddBuildingConfig = async () => {
    setBuildingLoading(true);
    const result = await addBuildingConfigToAllPGs();
    setBuildingLoading(false);
    setBuildingSuccess(result.success);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Initialize Firebase Data</h1>
        <p className="text-muted-foreground mb-6">
          Click the button below to initialize cities and colleges data in Firebase. 
          This only needs to be done once.
        </p>
        
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="text-green-800">Data initialized successfully!</span>
          </div>
        )}

        <Button 
          onClick={handleInitialize} 
          disabled={loading || success}
          className="w-full"
          size="lg"
        >
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {success ? 'Already Initialized' : 'Initialize Cities & Colleges'}
        </Button>

        <div className="my-6 border-t" />

        <h2 className="text-xl font-bold mb-4">Add Building Configuration</h2>
        <p className="text-muted-foreground mb-6">
          Add building configuration (floors & rooms) to all existing PGs that don't have it.
        </p>
        
        {buildingSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="text-green-800">Building configs added successfully!</span>
          </div>
        )}

        <Button 
          onClick={handleAddBuildingConfig} 
          disabled={buildingLoading || buildingSuccess}
          className="w-full"
          size="lg"
          variant="secondary"
        >
          {buildingLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {buildingSuccess ? 'Already Added' : 'Add Building Configs to PGs'}
        </Button>

        <p className="text-xs text-muted-foreground mt-4">
          Note: You can delete this page after initialization
        </p>
      </Card>
    </div>
  );
};

export default AdminInit;
