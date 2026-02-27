import { db } from '@/config/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { CITIES, COLLEGES_BY_CITY } from '@/config/citiesAndColleges';

export const initializeCitiesAndColleges = async () => {
  try {
    // Create a single document with all cities and colleges data
    const configRef = doc(db, 'config', 'citiesAndColleges');
    await setDoc(configRef, {
      cities: CITIES,
      collegesByCity: COLLEGES_BY_CITY,
      updatedAt: new Date().toISOString()
    });
    
    console.log('Cities and colleges data initialized in Firebase');
    return true;
  } catch (error) {
    console.error('Error initializing cities and colleges:', error);
    return false;
  }
};

// Call this function once to initialize the data
// You can run this from browser console: 
// import { initializeCitiesAndColleges } from './utils/initializeFirebaseData';
// initializeCitiesAndColleges();
