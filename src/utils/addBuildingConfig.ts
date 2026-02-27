import { db } from '@/config/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const generateDefaultBuildingConfig = (totalRooms: number, baseRent: number) => {
  const floors = [];
  const floorsCount = Math.ceil(totalRooms / 4);
  
  for (let floorIndex = 0; floorIndex < floorsCount; floorIndex++) {
    const roomsInFloor = Math.min(4, totalRooms - (floorIndex * 4));
    const rooms = [];
    
    for (let roomIndex = 1; roomIndex <= roomsInFloor; roomIndex++) {
      const roomNumber = `${floorIndex}${roomIndex.toString().padStart(2, '0')}${roomIndex}`;
      const sharing = Math.floor(Math.random() * 3) + 1;
      
      rooms.push({
        id: roomNumber,
        number: roomNumber,
        rent: baseRent,
        status: 'available',
        sharing,
        occupied: 0,
        capacity: sharing,
        occupants: []
      });
    }
    
    floors.push({
      id: floorIndex === 0 ? 'ground' : `floor-${floorIndex}`,
      name: floorIndex === 0 ? 'Ground Floor' : `Floor ${floorIndex}`,
      rooms
    });
  }
  
  return {
    floors,
    totalFloors: floorsCount,
    totalRooms,
    configuredAt: new Date().toISOString()
  };
};

export const addBuildingConfigToAllPGs = async () => {
  try {
    const pgsSnapshot = await getDocs(collection(db, 'pgs'));
    let updated = 0;
    
    for (const pgDoc of pgsSnapshot.docs) {
      const data = pgDoc.data();
      
      // Skip if already has building configuration
      if (data.buildingConfiguration?.floors) {
        console.log(`Skipping ${data.name} - already has config`);
        continue;
      }
      
      const totalRooms = data.totalRooms || 10;
      const baseRent = data.monthlyRent || 5000;
      
      const buildingConfig = generateDefaultBuildingConfig(totalRooms, baseRent);
      
      await updateDoc(doc(db, 'pgs', pgDoc.id), {
        buildingConfiguration: buildingConfig,
        updatedAt: new Date().toISOString()
      });
      
      console.log(`✅ Added building config to: ${data.name}`);
      updated++;
    }
    
    console.log(`\n🎉 Successfully updated ${updated} PGs with building configuration!`);
    return { success: true, updated };
  } catch (error) {
    console.error('Error adding building config:', error);
    return { success: false, error };
  }
};
