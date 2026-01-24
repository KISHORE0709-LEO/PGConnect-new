// Sample data script for chvsneha2310@gmail.com
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDHJqWKJqWKJqWKJqWKJqWKJqWKJqWKJqW",
  authDomain: "pgconnect-demo.firebaseapp.com",
  projectId: "pgconnect-demo",
  storageBucket: "pgconnect-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const samplePGs = [
  {
    name: "Green Valley PG",
    description: "Modern PG with excellent amenities near tech parks",
    address: "123 Koramangala 5th Block, Bangalore",
    city: "bangalore",
    state: "Karnataka",
    pincode: "560095",
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
    ownerId: "sample-uid-1",
    ownerName: "Sneha",
    ownerEmail: "chvsneha2310@gmail.com",
    ownerPhone: "+91 9876543210",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "active"
  },
  {
    name: "Sunrise Residency",
    description: "Comfortable accommodation for working professionals",
    address: "456 BTM Layout 2nd Stage, Bangalore",
    city: "bangalore",
    state: "Karnataka",
    pincode: "560076",
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
    ownerId: "sample-uid-1",
    ownerName: "Sneha",
    ownerEmail: "chvsneha2310@gmail.com",
    ownerPhone: "+91 9876543210",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "active"
  },
  {
    name: "Elite Heights",
    description: "Premium PG with modern facilities",
    address: "789 Whitefield Main Road, Bangalore",
    city: "bangalore",
    state: "Karnataka",
    pincode: "560066",
    pgType: "female",
    totalRooms: 18,
    availableRooms: 5,
    monthlyRent: 15000,
    nearestCollege: "pesit",
    distance: 1.8,
    amenities: ["WiFi", "AC", "Food Included", "Laundry", "CCTV", "Power Backup"],
    gateOpening: "06:00",
    gateClosing: "22:30",
    smokingAllowed: false,
    drinkingAllowed: false,
    availability: "open",
    ownerId: "sample-uid-1",
    ownerName: "Sneha",
    ownerEmail: "chvsneha2310@gmail.com",
    ownerPhone: "+91 9876543210",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "active"
  }
];

async function addSampleData() {
  try {
    for (const pg of samplePGs) {
      const docRef = await addDoc(collection(db, 'pgs'), pg);
      console.log('PG added with ID:', docRef.id);
    }
    console.log('All sample data added successfully!');
  } catch (error) {
    console.error('Error adding sample data:', error);
  }
}

addSampleData();