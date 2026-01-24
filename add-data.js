import { db } from './src/config/firebase.js';
import { collection, addDoc } from 'firebase/firestore';

const samplePGs = [
  {
    name: "Green Valley PG",
    description: "Modern PG with excellent amenities near tech parks",
    address: "123 Koramangala 5th Block, Bangalore",
    city: "bangalore",
    pgType: "any",
    totalRooms: 15,
    availableRooms: 3,
    monthlyRent: 12000,
    nearestCollege: "christ",
    distance: 2.5,
    amenities: ["WiFi", "AC", "Food Included", "Laundry", "CCTV"],
    gateOpening: "06:00",
    gateClosing: "22:00",
    smokingAllowed: false,
    drinkingAllowed: false,
    availability: "open",
    ownerName: "Sneha",
    ownerEmail: "chvsneha2310@gmail.com",
    ownerPhone: "+91 9876543210",
    buildingLayout: {
      floors: 3,
      roomsPerFloor: 5,
      rooms: [
        {
          id: "101",
          number: "101",
          floorId: 0,
          rent: 12000,
          capacity: 2,
          occupied: 2,
          status: "occupied",
          occupants: [
            { name: "Rahul Sharma", college: "Christ University", year: "3rd Year" },
            { name: "Amit Kumar", college: "Christ University", year: "2nd Year" }
          ],
          amenities: ["WiFi", "AC", "Attached Bathroom"],
          sharingType: "Double"
        }
      ]
    },
    createdAt: new Date().toISOString(),
    status: "active"
  },
  {
    name: "Sunrise Residency",
    description: "Comfortable accommodation for working professionals",
    address: "456 BTM Layout 2nd Stage, Bangalore",
    city: "bangalore",
    pgType: "male",
    totalRooms: 12,
    availableRooms: 2,
    monthlyRent: 10500,
    nearestCollege: "rvce",
    distance: 3.2,
    amenities: ["WiFi", "Power Backup", "Attached Bathroom", "Parking"],
    gateOpening: "06:00",
    gateClosing: "23:00",
    smokingAllowed: false,
    drinkingAllowed: false,
    availability: "open",
    ownerName: "Sneha",
    ownerEmail: "chvsneha2310@gmail.com",
    ownerPhone: "+91 9876543210",
    createdAt: new Date().toISOString(),
    status: "active"
  }
];

async function addSampleData() {
  try {
    for (const pg of samplePGs) {
      const docRef = await addDoc(collection(db, 'pgs'), pg);
      console.log('PG added with ID:', docRef.id);
    }
    console.log('All sample data added!');
  } catch (error) {
    console.error('Error:', error);
  }
}

addSampleData();