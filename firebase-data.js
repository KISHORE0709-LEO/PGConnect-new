// Run this in browser console on your Firebase project
// Or add manually to Firestore

const sampleData = {
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
      },
      {
        id: "102",
        number: "102",
        floorId: 0,
        rent: 10000,
        capacity: 3,
        occupied: 0,
        status: "available",
        occupants: [],
        amenities: ["WiFi", "Attached Bathroom"],
        sharingType: "Triple"
      }
    ]
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: "active"
};

// Add this to Firestore collection 'pgs'
console.log('Add this data to Firebase:', JSON.stringify(sampleData, null, 2));