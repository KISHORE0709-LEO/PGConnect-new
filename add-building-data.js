// Sample script to add building layout data to existing PGs
// Run this in browser console on your app

const addSampleBuildingData = async () => {
  try {
    const { db } = await import('./src/config/firebase');
    const { collection, getDocs, doc, updateDoc } = await import('firebase/firestore');
    
    // Get all PGs
    const pgsSnapshot = await getDocs(collection(db, 'pgs'));
    
    pgsSnapshot.forEach(async (pgDoc) => {
      const pgData = pgDoc.data();
      const totalRooms = pgData.totalRooms || 12;
      const baseRent = pgData.monthlyRent || 8500;
      
      // Generate sample room layout
      const floors = Math.ceil(totalRooms / 6);
      const rooms = [];
      
      for (let floor = 0; floor < floors; floor++) {
        const roomsInFloor = Math.min(6, totalRooms - (floor * 6));
        
        for (let room = 1; room <= roomsInFloor; room++) {
          const roomNumber = `${floor + 1}${room.toString().padStart(2, '0')}`;
          const capacity = Math.floor(Math.random() * 3) + 1;
          const occupied = Math.floor(Math.random() * (capacity + 1));
          const statusOptions = ['available', 'occupied', 'sold'];
          const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
          
          rooms.push({
            id: roomNumber,
            number: roomNumber,
            floorId: floor,
            rent: baseRent + (Math.floor(Math.random() * 4) * 100) - 200,
            capacity,
            occupied: status === 'available' ? 0 : occupied,
            status,
            occupants: Array.from({ length: status === 'available' ? 0 : occupied }, (_, k) => ({
              name: `Student ${k + 1}`,
              college: ["RVCE", "PESIT", "Christ", "IIT", "IISc"][Math.floor(Math.random() * 5)],
              year: ["1st Year", "2nd Year", "3rd Year", "4th Year"][Math.floor(Math.random() * 4)]
            })),
            amenities: ["WiFi", "AC", "Attached Bathroom", "Balcony"].slice(0, Math.floor(Math.random() * 4) + 1),
            sharingType: capacity === 1 ? "Single" : capacity === 2 ? "Double" : "Triple"
          });
        }
      }
      
      // Update PG with building layout
      const buildingLayout = {
        floors: floors,
        roomsPerFloor: 6,
        rooms: rooms
      };
      
      await updateDoc(doc(db, 'pgs', pgDoc.id), {
        buildingLayout: buildingLayout,
        updatedAt: new Date().toISOString()
      });
      
      console.log(`Updated PG ${pgData.name} with building layout`);
    });
    
    console.log('All PGs updated with building layout data!');
  } catch (error) {
    console.error('Error updating PGs:', error);
  }
};

// Call the function
addSampleBuildingData();