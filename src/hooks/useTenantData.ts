import { useState, useEffect } from 'react';
import { db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface Occupant {
  name: string;
  email: string;
  phone?: string;
  rentPaid: boolean;
}

interface Room {
  roomNo: string;
  floorNo?: number;
  occupants: Occupant[];
}

interface Floor {
  floorNo: number;
  rooms: Room[];
}

interface BuildingData {
  floors: Floor[];
}

export const useTenantData = (pgId: string | undefined, refreshTrigger?: number) => {
  const [buildingData, setBuildingData] = useState<BuildingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pgId) {
      setLoading(false);
      return;
    }

    const fetchTenantData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch PG document
        const pgRef = doc(db, 'pgs', pgId);
        const pgSnap = await getDoc(pgRef);

        if (!pgSnap.exists()) {
          setError('PG not found');
          setLoading(false);
          return;
        }

        const pgData = pgSnap.data();
        const buildingConfig = pgData.buildingConfiguration;

        if (!buildingConfig || !buildingConfig.floors) {
          setError('No building configuration found');
          setLoading(false);
          return;
        }

        // Transform building configuration to expected format
        const floors: Floor[] = buildingConfig.floors.map((floor: any, index: number) => ({
          floorNo: floor.number || index,
          rooms: floor.rooms.map((room: any) => ({
            roomNo: room.number || room.id,
            floorNo: floor.number || index,
            occupants: room.occupants?.map((occ: any) => ({
              name: occ.name,
              email: occ.email,
              phone: occ.phone,
              rentPaid: occ.rentPaid || occ.rentStatus || false,
            })) || [],
          }))
        }));

        setBuildingData({ floors });
      } catch (err) {
        console.error('Error fetching tenant data:', err);
        setError('Failed to load tenant data');
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [pgId, refreshTrigger]);

  return { buildingData, loading, error };
};
