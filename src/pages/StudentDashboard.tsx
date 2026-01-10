import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  MapPin, 
  IndianRupee, 
  Users, 
  Wifi, 
  Utensils,
  Star,
  Filter,
  Eye,
  Zap,
  Bath,
  AirVent,
  Shirt,
  Heart,
  Coffee,
  Moon,
  Sun,
  Volume2,
  Sparkles,
  UserCheck,
  Home,
  Calendar,
  Gamepad2,
  Music,
  Camera,
  Dumbbell,
  Book,
  Palette,
  ChevronRight,
  ChevronLeft,
  Map
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [pgs, setPgs] = useState([]);
  const [allPgs, setAllPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchingInProgress, setMatchingInProgress] = useState(false);
  const [matchResults, setMatchResults] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [showMapView, setShowMapView] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    name: '',
    email: '',
    phone: '',
    foodHabits: '',
    sleepSchedule: '',
    cleanliness: 5,
    noiseTolerance: 5,
    smokingHabits: '',
    drinkingHabits: '',
    budget: { min: 5000, max: 15000 },
    preferredLocation: '',
    sharingPreference: '',
    personality: '',
    hobbies: [],
    studyHabits: '',
    socialLevel: 5,
    petFriendly: false,
    guestPolicy: '',
    workSchedule: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    // Get selected city from localStorage
    const city = localStorage.getItem('selectedCity');
    if (!city) {
      // If no city selected, redirect to city selection
      navigate('/city-selection');
      return;
    }
    setSelectedCity(city);

    const fetchPGs = async () => {
      try {
        setError(null);
        // Fetch from Firebase
        const { db } = await import('@/config/firebase');
        const { collection, getDocs } = await import('firebase/firestore');

        const querySnapshot = await getDocs(collection(db, 'pgs'));
        const firebasePGs = [];

        console.log('Firebase query result:', querySnapshot.size, 'documents found');

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log('PG document:', doc.id, data);

          const placeholderImages = [
            "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400"
          ];

        const genderMap = {
          'male': 'boys',
          'female': 'girls',
          'unisex': 'any'
        };

        const pgGender = genderMap[(data.pgType || 'any').toLowerCase()] || (data.pgType || 'any').toLowerCase();

        const normalizedAmenities = (data.amenities || ['WiFi']).map(a => {
          const lower = a.toLowerCase().trim();
          if (lower === 'wi-fi') return 'WiFi';
          if (lower === 'food') return 'Food Included';
          return a.trim();
        });

        let sharingTypes = [];
        if (data.sharing) {
          const parts = data.sharing.split(',').map(p => p.trim().toLowerCase());
          parts.forEach(part => {
            if (part.includes('single') || part === 'private') sharingTypes.push('Private');
            if (part.includes('double') || part.includes('2')) sharingTypes.push('2 Sharing');
            if (part.includes('triple') || part.includes('3')) sharingTypes.push('3 Sharing');
            if (part.includes('quad') || part.includes('4') || part.includes('more')) sharingTypes.push('More than 3');
          });
        }
        if (sharingTypes.length === 0) sharingTypes = ['2 Sharing'];

        firebasePGs.push({
          id: doc.id,
          name: data.name || 'Unnamed PG',
          location: `${data.address || ''}, Bangalore`,
          price: data.monthlyRent || 8500,
          sharing: data.sharing || '2 Sharing',
          gender: pgGender,
          rating: data.rating || 4.5,
          amenities: normalizedAmenities,
          availability: data.availableRooms || 5,
          nearestCollege: data.nearestCollege || 'Others',
          distance: data.distance || 0,
          sharingTypes,
          reviews: data.reviews || 28,
          image: data.images && data.images.length > 0 ? data.images[0] : placeholderImages[Math.floor(Math.random() * placeholderImages.length)]
        });
        });

        console.log('Processed Firebase PGs:', firebasePGs);

        setAllPgs(firebasePGs);
        setPgs(firebasePGs);
      } catch (error) {
        console.error('Error fetching PGs from Firebase:', error);
        setError('Failed to load PG data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPGs();
  }, []);
  const [college, setCollege] = useState("");
  const [colleges, setColleges] = useState(['NMIT', 'RVCE', 'IISc', 'BMSIT', 'RNSIT', 'GITAM', 'Others']);
  const [distance, setDistance] = useState("");
  const [gender, setGender] = useState("any");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [sharingType, setSharingType] = useState([]);

  useEffect(() => {
    if (user) {
      setUserPreferences(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        phone: user.phone
      }));
    }
  }, [user]);

  const handleAmenityToggle = (amenity: string) => {
    setAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSharingToggle = (sharing: string) => {
    setSharingType(prev =>
      prev.includes(sharing)
        ? prev.filter(s => s !== sharing)
        : [...prev, sharing]
    );
  };

  const handleSearch = () => {
    let filtered = allPgs;

    // Filter by college
    if (college) {
      filtered = filtered.filter(pg =>
        pg.nearestCollege?.toLowerCase().includes(college.toLowerCase())
      );
    }

    // Filter by distance
    if (distance) {
      filtered = filtered.filter(pg => pg.distance <= parseFloat(distance));
    }

    // Filter by gender
    if (gender && gender !== 'any') {
      filtered = filtered.filter(pg =>
        pg.gender?.toLowerCase() === gender || pg.gender?.toLowerCase() === 'any'
      );
    }

    // Filter by sharing type
    if (sharingType.length > 0) {
      filtered = filtered.filter(pg =>
        sharingType.some(sharing => pg.sharingTypes?.includes(sharing))
      );
    }

    // Filter by price range
    if (minPrice) {
      filtered = filtered.filter(pg => pg.price >= parseInt(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(pg => pg.price <= parseInt(maxPrice));
    }

    // Filter by amenities
    if (amenities.length > 0) {
      filtered = filtered.filter(pg =>
        amenities.every(amenity => pg.amenities.includes(amenity))
      );
    }

    setPgs(filtered);
  };

  const handlePreferenceChange = (field, value) => {
    setUserPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleHobbyToggle = (hobby) => {
    setUserPreferences(prev => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby)
        ? prev.hobbies.filter(h => h !== hobby)
        : [...prev.hobbies, hobby]
    }));
  };

  const calculateCompatibility = (user1Prefs, user2Prefs) => {
    let totalScore = 0;
    let weights = {
      food: 25,
      sleep: 20, 
      cleanliness: 15,
      noise: 15,
      social: 10,
      hobbies: 10,
      habits: 5
    };

    if (user1Prefs.foodHabits === user2Prefs.foodHabits) {
      totalScore += weights.food;
    } else if (user1Prefs.foodHabits === 'both' || user2Prefs.foodHabits === 'both') {
      totalScore += weights.food * 0.8;
    } else {
      totalScore += weights.food * 0.3;
    }

    if (user1Prefs.sleepSchedule === user2Prefs.sleepSchedule) {
      totalScore += weights.sleep;
    } else {
      const sleepMap = { early: 1, normal: 2, night: 3 };
      const diff = Math.abs(sleepMap[user1Prefs.sleepSchedule] - sleepMap[user2Prefs.sleepSchedule]);
      totalScore += weights.sleep * Math.max(0, (3 - diff) / 3);
    }

    const cleanDiff = Math.abs(user1Prefs.cleanliness - user2Prefs.cleanliness);
    totalScore += weights.cleanliness * Math.max(0, (10 - cleanDiff) / 10);

    const noiseDiff = Math.abs(user1Prefs.noiseTolerance - user2Prefs.noiseTolerance);
    totalScore += weights.noise * Math.max(0, (10 - noiseDiff) / 10);

    const socialDiff = Math.abs(user1Prefs.socialLevel - user2Prefs.socialLevel);
    totalScore += weights.social * Math.max(0, (10 - socialDiff) / 10);

    const commonHobbies = user1Prefs.hobbies.filter(h => user2Prefs.hobbies.includes(h));
    const hobbyScore = Math.min(1, commonHobbies.length / Math.max(user1Prefs.hobbies.length, user2Prefs.hobbies.length, 1));
    totalScore += weights.hobbies * hobbyScore;

    let habitScore = 0;
    if (user1Prefs.smokingHabits === user2Prefs.smokingHabits) habitScore += 0.5;
    if (user1Prefs.drinkingHabits === user2Prefs.drinkingHabits) habitScore += 0.5;
    totalScore += weights.habits * habitScore;

    return Math.round(totalScore);
  };

  const generateRoommateProfiles = () => {
    const profiles = [
      {
        id: 1, name: 'Aarav Singh', age: 19, college: 'NMIT', course: 'Computer Science',
        bio: 'Tech enthusiast who loves coding and Netflix. Looking for a chill roommate!',
        contact: '+91 98765 43210',
        preferences: {
          foodHabits: 'veg', sleepSchedule: 'normal', cleanliness: 8, noiseTolerance: 6,
          socialLevel: 7, hobbies: ['reading', 'gaming', 'music'], smokingHabits: 'no', drinkingHabits: 'no'
        },
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
      },
      {
        id: 2, name: 'Ananya Sharma', age: 18, college: 'NMIT', course: 'Information Science', 
        bio: 'Bookworm and coffee addict. Love peaceful vibes and good conversations.',
        contact: '+91 87654 32109',
        preferences: {
          foodHabits: 'veg', sleepSchedule: 'early', cleanliness: 9, noiseTolerance: 4,
          socialLevel: 5, hobbies: ['cooking', 'yoga', 'movies'], smokingHabits: 'no', drinkingHabits: 'no'
        },
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
      },
      {
        id: 3, name: 'Rohan Patel', age: 20, college: 'NMIT', course: 'Mechanical Engineering',
        bio: 'Fitness enthusiast and adventure seeker. Always up for new experiences!',
        contact: '+91 76543 21098', 
        preferences: {
          foodHabits: 'both', sleepSchedule: 'night', cleanliness: 6, noiseTolerance: 8,
          socialLevel: 9, hobbies: ['sports', 'travel', 'photography'], smokingHabits: 'no', drinkingHabits: 'social'
        },
        image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150'
      },
      {
        id: 4, name: 'Diya Gupta', age: 19, college: 'NMIT', course: 'Electronics',
        bio: 'Creative soul who loves art and music. Looking for someone who appreciates creativity!',
        contact: '+91 65432 10987',
        preferences: {
          foodHabits: 'both', sleepSchedule: 'normal', cleanliness: 7, noiseTolerance: 7,
          socialLevel: 6, hobbies: ['art', 'music', 'dancing'], smokingHabits: 'no', drinkingHabits: 'social'
        },
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      },
      {
        id: 5, name: 'Arjun Mehta', age: 18, college: 'NMIT', course: 'Civil Engineering',
        bio: 'Early bird who loves morning workouts. Disciplined but fun-loving!',
        contact: '+91 54321 09876',
        preferences: {
          foodHabits: 'non-veg', sleepSchedule: 'early', cleanliness: 8, noiseTolerance: 5,
          socialLevel: 7, hobbies: ['sports', 'technology', 'reading'], smokingHabits: 'no', drinkingHabits: 'no'
        },
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
      }
    ];
    return profiles;
  };

  const findMatches = () => {
    setMatchingInProgress(true);
    
    setTimeout(() => {
      const allProfiles = generateRoommateProfiles();
      
      const matchesWithScores = allProfiles.map(profile => {
        const compatibility = calculateCompatibility(userPreferences, profile.preferences);
        
        const reasons = [];
        if (userPreferences.foodHabits === profile.preferences.foodHabits) reasons.push('Same food preferences');
        if (userPreferences.sleepSchedule === profile.preferences.sleepSchedule) reasons.push('Compatible sleep schedule');
        if (Math.abs(userPreferences.cleanliness - profile.preferences.cleanliness) <= 2) reasons.push('Similar cleanliness standards');
        if (userPreferences.hobbies.some(h => profile.preferences.hobbies.includes(h))) reasons.push('Shared interests');
        if (userPreferences.smokingHabits === profile.preferences.smokingHabits) reasons.push('Same lifestyle habits');
        if (Math.abs(userPreferences.socialLevel - profile.preferences.socialLevel) <= 2) reasons.push('Compatible social levels');

        return { ...profile, compatibility, matchReasons: reasons.slice(0, 3) };
      }).sort((a, b) => b.compatibility - a.compatibility).slice(0, 3);

      setMatchResults(matchesWithScores);
      setMatchingInProgress(false);
    }, 3000);
  };

  const handleConnect = (profile) => {
    setConnectedUsers(prev => [...prev, profile.id]);
    alert(`Connection request sent to ${profile.name}! 🎉\n\nYou can now contact them at: ${profile.contact}`);
  };

  const handleViewProfile = (profile) => {
    setSelectedProfile(profile);
    setShowProfileModal(true);
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!userPreferences.foodHabits || !userPreferences.sleepSchedule || 
            !userPreferences.smokingHabits || !userPreferences.drinkingHabits) {
          alert('⚠ Please fill all lifestyle preferences before continuing!');
          return false;
        }
        break;
      case 2:
        if (!userPreferences.studyHabits) {
          alert('⚠ Please select your study habits before continuing!');
          return false;
        }
        break;
      case 3:
        if (!userPreferences.personality || userPreferences.hobbies.length === 0) {
          alert('⚠ Please select your personality type and at least one hobby!');
          return false;
        }
        break;
      case 4:
        if (!userPreferences.sharingPreference || !userPreferences.guestPolicy) {
          alert('⚠ Please complete all additional preferences!');
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      findMatches();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50 backdrop-blur-lg bg-card/95">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <h1 className="text-2xl font-bold hover:text-primary/80 transition-colors">PG<span className="text-primary">Connect</span></h1>
            <Badge variant="secondary">Student</Badge>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white" onClick={() => setShowMatchModal(true)}>
            <Zap className="h-4 w-4 mr-2" />
            Find My Match
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-80 flex-shrink-0">
            <Card className="p-6 sticky top-24 overflow-y-auto max-h-[calc(100vh-8rem)]">
              <h2 className="text-xl font-bold mb-6">Find PGs Near Your College</h2>

              <div className="space-y-6">
                {/* Find PGs Near Your College */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Find PGs Near Your College</Label>
                  <div className="text-xs text-gray-500 mb-2">Location</div>
                  <select
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select College</option>
                    {colleges.map((col) => (
                      <option key={col} value={col.toLowerCase()}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Distance */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Distance (km)</Label>
                  <Input
                    placeholder="Enter distance in km"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    type="number"
                  />
                </div>

                {/* Gender */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Gender</Label>
                  <div className="space-y-2">
                    {[{value: 'boys', label: 'Boys'}, {value: 'girls', label: 'Girls'}, {value: 'any', label: 'Any'}].map((g) => (
                      <div key={g.value} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={g.value}
                          name="gender"
                          checked={gender === g.value}
                          onChange={() => setGender(g.value)}
                          className="w-4 h-4"
                        />
                        <Label htmlFor={g.value} className="cursor-pointer">{g.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Price Range (₹)</Label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Min:</Label>
                        <Input
                          placeholder="Min"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          type="number"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Max:</Label>
                        <Input
                          placeholder="Max"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Amenities</Label>
                  <div className="space-y-2">
                    {[
                      'WiFi',
                      'Power Backup',
                      'Food Included',
                      'Attached Bathroom',
                      'AC',
                      'Laundry'
                    ].map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={amenity}
                          checked={amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="w-4 h-4"
                        />
                        <Label htmlFor={amenity} className="cursor-pointer">{amenity}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sharing Type */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Sharing Type</Label>
                  <div className="space-y-2">
                    {['Private', '2 Sharing', '3 Sharing', 'More than 3'].map((sharing) => (
                      <div key={sharing} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={sharing}
                          checked={sharingType.includes(sharing)}
                          onChange={() => handleSharingToggle(sharing)}
                          className="w-4 h-4"
                        />
                        <Label htmlFor={sharing} className="cursor-pointer">{sharing}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Search Button */}
                <Button size="lg" className="w-full" onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Search PGs
                </Button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {loading ? 'Loading...' : `Showing ${pgs.length} properties in ${selectedCity}`}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{selectedCity}</span>
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={() => navigate('/city-selection')}
                    className="p-0 h-auto text-primary"
                  >
                    Change City
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={!showMapView ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setShowMapView(false)}
                >
                  Grid View
                </Button>
                <Button 
                  variant={showMapView ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setShowMapView(true)}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Map View
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-semibold mb-2">Error Loading PGs</h3>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              </div>
            )}

            {/* PG Cards or Map View */}
            {!loading && !error && (
              showMapView ? (
                <div className="h-[600px] bg-gray-100 rounded-lg relative overflow-hidden">
                  {/* Map Container */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                    {/* Map Background */}
                    <div className="w-full h-full relative">
                      <div className="absolute inset-0 opacity-20">
                        <svg viewBox="0 0 800 600" className="w-full h-full">
                          <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                      </div>
                      
                      {/* PG Markers */}
                      {pgs.map((pg, index) => {
                        const positions = [
                          { x: 15, y: 20 }, { x: 65, y: 35 }, { x: 25, y: 60 }, { x: 75, y: 25 },
                          { x: 45, y: 45 }, { x: 85, y: 70 }, { x: 35, y: 80 }, { x: 55, y: 15 }
                        ];
                        const pos = positions[index % positions.length];
                        
                        return (
                          <div
                            key={pg.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                            onClick={() => navigate(`/student/pg/${pg.id}`)}
                          >
                            {/* Marker Pin */}
                            <div className="relative">
                              <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                              </div>
                              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-red-500"></div>
                            </div>
                            
                            {/* Info Card on Hover */}
                            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              <Card className="p-3 w-64 shadow-xl border-2">
                                <div className="flex gap-3">
                                  <img src={pg.image} alt={pg.name} className="w-16 h-16 rounded object-cover" />
                                  <div className="flex-1">
                                    <h4 className="font-bold text-sm">{pg.name}</h4>
                                    <p className="text-xs text-muted-foreground mb-1">{pg.location}</p>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center text-primary font-bold">
                                        <IndianRupee className="h-3 w-3" />
                                        <span className="text-sm">{pg.price.toLocaleString()}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-primary text-primary" />
                                        <span className="text-xs">{pg.rating}</span>
                                      </div>
                                    </div>
                                    <div className="flex gap-1 mt-1">
                                      <Badge variant="secondary" className="text-xs px-1 py-0">{pg.gender}</Badge>
                                      <Badge variant="outline" className="text-xs px-1 py-0">{pg.sharing}</Badge>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Map Legend */}
                      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
                        <h4 className="font-semibold text-sm mb-2">Map Legend</h4>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                          <span>PG Location</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Click markers to view details</p>
                      </div>
                      
                      {/* Area Labels */}
                      <div className="absolute top-4 left-4 bg-blue-100 px-2 py-1 rounded text-xs font-medium">Jayanagar</div>
                      <div className="absolute top-4 right-4 bg-green-100 px-2 py-1 rounded text-xs font-medium">Koramangala</div>
                      <div className="absolute bottom-20 left-4 bg-yellow-100 px-2 py-1 rounded text-xs font-medium">BTM Layout</div>
                      <div className="absolute bottom-20 right-4 bg-purple-100 px-2 py-1 rounded text-xs font-medium">Electronic City</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pgs.map((pg) => (
                  <Card
                    key={pg.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={pg.image}
                        alt={pg.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 right-3 bg-success">
                        {pg.availability} rooms available
                      </Badge>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{pg.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            {pg.location}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="font-semibold">{pg.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <Badge variant="secondary">{pg.nearestCollege}</Badge>
                        <Badge variant="outline">{pg.gender}</Badge>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{pg.sharing}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {pg.amenities.map((amenity) => (
                          <Badge key={amenity} variant="secondary" className="text-xs">
                            {amenity === "WiFi" && <Wifi className="h-3 w-3 mr-1" />}
                            {amenity === "Food" && <Utensils className="h-3 w-3 mr-1" />}
                            {amenity}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-2xl font-bold text-primary">
                          <IndianRupee className="h-5 w-5" />
                          {pg.price.toLocaleString()}
                          <span className="text-sm text-muted-foreground font-normal ml-1">/month</span>
                        </div>
                        <Button size="sm" onClick={() => navigate(`/student/pg/${pg.id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  </Card>
                  ))}
                </div>
              )
            )}

            {/* Empty State */}
            {!loading && !error && pgs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold mb-2">No PGs found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters to find more options.
                </p>
                <Button onClick={() => setPgs(allPgs)}>
                  Show All PGs
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Find My Match Modal */}
      <Dialog open={showMatchModal} onOpenChange={setShowMatchModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {matchingInProgress ? '🤖 AI Matching in Progress' : 
               matchResults.length > 0 ? '🎯 Your Perfect Matches' : 
               '🏠 Find Your Ideal Roommate'}
            </DialogTitle>
          </DialogHeader>
          
          {matchingInProgress ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-4"></div>
              <p className="text-lg font-medium">Analyzing compatibility...</p>
              <p className="text-sm text-muted-foreground mt-2">Using AI to find your perfect roommate match</p>
            </div>
          ) : matchResults.length > 0 ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">🎉 Top Roommate Matches Found!</h3>
                <p className="text-muted-foreground">Based on lifestyle compatibility and preferences</p>
              </div>
              
              <div className="grid gap-4">
                {matchResults.map((match, index) => (
                  <Card key={match.id} className="p-4 border-2 border-primary/20">
                    <div className="flex items-start gap-4">
                      <img 
                        src={match.image} 
                        alt={match.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="text-lg font-bold">{match.name}</h4>
                            <p className="text-sm text-muted-foreground">{match.age} years • {match.course}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">
                            {match.compatibility}% Match
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <MapPin className="h-4 w-4 mr-1" />
                          {match.college}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {match.matchReasons.map((reason, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              ✓ {reason}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1" 
                            onClick={() => handleConnect(match)}
                            disabled={connectedUsers.includes(match.id)}
                          >
                            {connectedUsers.includes(match.id) ? 'Connected ✓' : 'Connect'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewProfile(match)}
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="text-center pt-4">
                <Button variant="outline" onClick={() => setShowMatchModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Progress Indicator */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-3">
                  {[
                    { num: 1, icon: Coffee, label: 'Lifestyle' },
                    { num: 2, icon: Home, label: 'Living' },
                    { num: 3, icon: Heart, label: 'Interests' },
                    { num: 4, icon: Sparkles, label: 'Extras' }
                  ].map((step, index) => (
                    <div key={step.num} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                          step.num <= currentStep 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-110' 
                            : step.num === currentStep + 1
                            ? 'bg-blue-100 text-blue-600 border-2 border-blue-300'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <step.icon className="h-5 w-5" />
                        </div>
                        <span className={`text-xs mt-1 font-medium ${
                          step.num <= currentStep ? 'text-blue-600' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                      {index < 3 && (
                        <div className={`w-12 h-1 mx-2 rounded-full transition-all duration-300 ${
                          step.num < currentStep ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: Basic Lifestyle */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Coffee className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Lifestyle Preferences</h3>
                    <p className="text-muted-foreground mt-2">Tell us about your daily habits and preferences</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <Card className="p-6 border-2 hover:border-blue-300 transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <Utensils className="h-5 w-5 text-blue-600 mr-2" />
                        <Label className="text-lg font-semibold">Food Habits</Label>
                      </div>
                      <RadioGroup value={userPreferences.foodHabits} onValueChange={(value) => handlePreferenceChange('foodHabits', value)} className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="veg" id="veg" />
                          <Label htmlFor="veg" className="cursor-pointer flex-1">🥗 Vegetarian</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="non-veg" id="non-veg" />
                          <Label htmlFor="non-veg" className="cursor-pointer flex-1">🍖 Non-Vegetarian</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="both" id="both" />
                          <Label htmlFor="both" className="cursor-pointer flex-1">🍽 Both (Flexible)</Label>
                        </div>
                      </RadioGroup>
                    </Card>

                    <Card className="p-6 border-2 hover:border-blue-300 transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <Moon className="h-5 w-5 text-blue-600 mr-2" />
                        <Label className="text-lg font-semibold">Sleep Schedule</Label>
                      </div>
                      <RadioGroup value={userPreferences.sleepSchedule} onValueChange={(value) => handlePreferenceChange('sleepSchedule', value)} className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-yellow-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="early" id="early" />
                          <Label htmlFor="early" className="cursor-pointer flex-1">🌅 Early Bird (Sleep by 10 PM)</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="normal" id="normal" />
                          <Label htmlFor="normal" className="cursor-pointer flex-1">🌙 Normal (Sleep by 11-12 PM)</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="night" id="night" />
                          <Label htmlFor="night" className="cursor-pointer flex-1">🦉 Night Owl (Sleep after 12 PM)</Label>
                        </div>
                      </RadioGroup>
                    </Card>

                    <Card className="p-6 border-2 hover:border-blue-300 transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <AirVent className="h-5 w-5 text-blue-600 mr-2" />
                        <Label className="text-lg font-semibold">Smoking Habits</Label>
                      </div>
                      <RadioGroup value={userPreferences.smokingHabits} onValueChange={(value) => handlePreferenceChange('smokingHabits', value)} className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="no" id="no-smoke" />
                          <Label htmlFor="no-smoke" className="cursor-pointer flex-1">🚫 Non-Smoker</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-yellow-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="occasional" id="occasional-smoke" />
                          <Label htmlFor="occasional-smoke" className="cursor-pointer flex-1">😬 Occasional</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="regular" id="regular-smoke" />
                          <Label htmlFor="regular-smoke" className="cursor-pointer flex-1">😬 Regular</Label>
                        </div>
                      </RadioGroup>
                    </Card>

                    <Card className="p-6 border-2 hover:border-blue-300 transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <Coffee className="h-5 w-5 text-blue-600 mr-2" />
                        <Label className="text-lg font-semibold">Drinking Habits</Label>
                      </div>
                      <RadioGroup value={userPreferences.drinkingHabits} onValueChange={(value) => handlePreferenceChange('drinkingHabits', value)} className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="no" id="no-drink" />
                          <Label htmlFor="no-drink" className="cursor-pointer flex-1">🚫 Non-Drinker</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="social" id="social-drink" />
                          <Label htmlFor="social-drink" className="cursor-pointer flex-1">🍻 Social Drinker</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="regular" id="regular-drink" />
                          <Label htmlFor="regular-drink" className="cursor-pointer flex-1">🥃 Regular</Label>
                        </div>
                      </RadioGroup>
                    </Card>
                  </div>
                </div>
              )}

              {/* Step 2: Living Standards */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Home className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Living Standards</h3>
                    <p className="text-muted-foreground mt-2">Help us understand your living preferences</p>
                  </div>
                  
                  <div className="space-y-8">
                    <Card className="p-6 border-2 hover:border-blue-300 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
                          <Label className="text-lg font-semibold">Cleanliness Level</Label>
                        </div>
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                          {userPreferences.cleanliness}/10
                        </Badge>
                      </div>
                      <Slider
                        value={[userPreferences.cleanliness]}
                        onValueChange={(value) => handlePreferenceChange('cleanliness', value[0])}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full mb-3"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>🤷 Messy</span>
                        <span>✨ Very Clean</span>
                      </div>
                    </Card>

                    <Card className="p-6 border-2 hover:border-blue-300 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Volume2 className="h-5 w-5 text-blue-600 mr-2" />
                          <Label className="text-lg font-semibold">Noise Tolerance</Label>
                        </div>
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                          {userPreferences.noiseTolerance}/10
                        </Badge>
                      </div>
                      <Slider
                        value={[userPreferences.noiseTolerance]}
                        onValueChange={(value) => handlePreferenceChange('noiseTolerance', value[0])}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full mb-3"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>🤫 Need Quiet</span>
                        <span>🎵 Loud OK</span>
                      </div>
                    </Card>

                    <Card className="p-6 border-2 hover:border-blue-300 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-blue-600 mr-2" />
                          <Label className="text-lg font-semibold">Social Level</Label>
                        </div>
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                          {userPreferences.socialLevel}/10
                        </Badge>
                      </div>
                      <Slider
                        value={[userPreferences.socialLevel]}
                        onValueChange={(value) => handlePreferenceChange('socialLevel', value[0])}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full mb-3"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>🤐 Introvert</span>
                        <span>🎉 Extrovert</span>
                      </div>
                    </Card>

                    <Card className="p-6 border-2 hover:border-blue-300 transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <Book className="h-5 w-5 text-blue-600 mr-2" />
                        <Label className="text-lg font-semibold">Study Habits</Label>
                      </div>
                      <RadioGroup value={userPreferences.studyHabits} onValueChange={(value) => handlePreferenceChange('studyHabits', value)} className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="quiet" id="quiet-study" />
                          <Label htmlFor="quiet-study" className="cursor-pointer flex-1">🤫 Need complete silence</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="background" id="background-study" />
                          <Label htmlFor="background-study" className="cursor-pointer flex-1">🎵 Background noise OK</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-yellow-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="group" id="group-study" />
                          <Label htmlFor="group-study" className="cursor-pointer flex-1">👥 Prefer group study</Label>
                        </div>
                      </RadioGroup>
                    </Card>
                  </div>
                </div>
              )}

              {/* Step 3: Interests & Hobbies */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Interests & Hobbies</h3>
                    <p className="text-muted-foreground mt-2">What do you love to do in your free time?</p>
                  </div>
                  
                  <Card className="p-6 border-2 hover:border-blue-300 transition-all duration-300">
                    <Label className="text-lg font-semibold mb-4 block flex items-center">
                      <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
                      Select your hobbies (multiple allowed)
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { name: 'Reading', icon: '📚', color: 'hover:bg-blue-50' },
                        { name: 'Gaming', icon: '🎮', color: 'hover:bg-blue-50' },
                        { name: 'Music', icon: '🎵', color: 'hover:bg-pink-50' },
                        { name: 'Sports', icon: '⚽', color: 'hover:bg-green-50' },
                        { name: 'Cooking', icon: '👨‍🍳', color: 'hover:bg-orange-50' },
                        { name: 'Movies', icon: '🎬', color: 'hover:bg-red-50' },
                        { name: 'Travel', icon: '✈', color: 'hover:bg-cyan-50' },
                        { name: 'Photography', icon: '📸', color: 'hover:bg-yellow-50' },
                        { name: 'Yoga', icon: '🧘', color: 'hover:bg-indigo-50' },
                        { name: 'Dancing', icon: '💃', color: 'hover:bg-pink-50' },
                        { name: 'Art', icon: '🎨', color: 'hover:bg-blue-50' },
                        { name: 'Technology', icon: '💻', color: 'hover:bg-gray-50' }
                      ].map((hobby) => (
                        <div key={hobby.name} className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                          userPreferences.hobbies.includes(hobby.name.toLowerCase()) 
                            ? 'border-blue-300 bg-blue-50' 
                            : 'border-gray-200 ' + hobby.color
                        }`} onClick={() => handleHobbyToggle(hobby.name.toLowerCase())}>
                          <Checkbox
                            id={hobby.name}
                            checked={userPreferences.hobbies.includes(hobby.name.toLowerCase())}
                            onCheckedChange={() => handleHobbyToggle(hobby.name.toLowerCase())}
                          />
                          <Label htmlFor={hobby.name} className="cursor-pointer text-sm flex items-center">
                            <span className="mr-2">{hobby.icon}</span>
                            {hobby.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6 border-2 hover:border-blue-300 transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <UserCheck className="h-5 w-5 text-blue-600 mr-2" />
                      <Label className="text-lg font-semibold">Personality Type</Label>
                    </div>
                    <RadioGroup value={userPreferences.personality} onValueChange={(value) => handlePreferenceChange('personality', value)} className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                        <RadioGroupItem value="calm" id="calm" />
                        <Label htmlFor="calm" className="cursor-pointer flex-1">😌 Calm & Peaceful</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer">
                        <RadioGroupItem value="energetic" id="energetic" />
                        <Label htmlFor="energetic" className="cursor-pointer flex-1">⚡ Energetic & Active</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors cursor-pointer">
                        <RadioGroupItem value="balanced" id="balanced" />
                        <Label htmlFor="balanced" className="cursor-pointer flex-1">⚖ Balanced</Label>
                      </div>
                    </RadioGroup>
                  </Card>
                </div>
              )}

              {/* Step 4: Additional Preferences */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Final Touches</h3>
                    <p className="text-muted-foreground mt-2">Just a few more details to perfect your match!</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-6 border-2 hover:border-blue-300 transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <Home className="h-5 w-5 text-blue-600 mr-2" />
                        <Label className="text-lg font-semibold">Sharing Preference</Label>
                      </div>
                      <RadioGroup value={userPreferences.sharingPreference} onValueChange={(value) => handlePreferenceChange('sharingPreference', value)} className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="single" id="single" />
                          <Label htmlFor="single" className="cursor-pointer flex-1">🏠 Single Room</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="double" id="double" />
                          <Label htmlFor="double" className="cursor-pointer flex-1">👥 Double Sharing</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-yellow-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="triple" id="triple" />
                          <Label htmlFor="triple" className="cursor-pointer flex-1">👨‍👩‍👦 Triple Sharing</Label>
                        </div>
                      </RadioGroup>
                    </Card>

                    <Card className="p-6 border-2 hover:border-blue-300 transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <Users className="h-5 w-5 text-blue-600 mr-2" />
                        <Label className="text-lg font-semibold">Guest Policy</Label>
                      </div>
                      <RadioGroup value={userPreferences.guestPolicy} onValueChange={(value) => handlePreferenceChange('guestPolicy', value)} className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="no" id="no-guests" />
                          <Label htmlFor="no-guests" className="cursor-pointer flex-1">🚫 No Guests</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-yellow-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="occasional" id="occasional-guests" />
                          <Label htmlFor="occasional-guests" className="cursor-pointer flex-1">👋 Occasional Guests OK</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="frequent" id="frequent-guests" />
                          <Label htmlFor="frequent-guests" className="cursor-pointer flex-1">🎉 Frequent Guests OK</Label>
                        </div>
                      </RadioGroup>
                    </Card>

                    <Card className="md:col-span-2 p-6 border-2 hover:border-blue-300 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🐶</span>
                          </div>
                          <div>
                            <Label htmlFor="pet-friendly" className="cursor-pointer text-lg font-semibold block">Pet Friendly</Label>
                            <p className="text-sm text-muted-foreground">Are you okay with pets in the accommodation?</p>
                          </div>
                        </div>
                        <Checkbox
                          id="pet-friendly"
                          checked={userPreferences.petFriendly}
                          onCheckedChange={(checked) => handlePreferenceChange('petFriendly', checked)}
                          className="w-6 h-6"
                        />
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button 
                  onClick={nextStep}
                  className={`flex items-center gap-2 ${
                    currentStep === 4 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' 
                      : ''
                  }`}
                >
                  {currentStep === 4 ? (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Find My Perfect Match
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              👤 Profile Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedProfile && (
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <img 
                  src={selectedProfile.image} 
                  alt={selectedProfile.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{selectedProfile.name}</h3>
                  <p className="text-muted-foreground">{selectedProfile.age} years • {selectedProfile.course}</p>
                  <p className="text-sm text-muted-foreground">{selectedProfile.college}</p>
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    {selectedProfile.compatibility}% Match
                  </Badge>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">About</h4>
                <p className="text-sm">{selectedProfile.bio}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Lifestyle</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Food:</span>
                      <span className="font-medium">{selectedProfile.preferences.foodHabits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sleep:</span>
                      <span className="font-medium">{selectedProfile.preferences.sleepSchedule}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Smoking:</span>
                      <span className="font-medium">{selectedProfile.preferences.smokingHabits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Drinking:</span>
                      <span className="font-medium">{selectedProfile.preferences.drinkingHabits}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Preferences</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Cleanliness:</span>
                      <span className="font-medium">{selectedProfile.preferences.cleanliness}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Noise Tolerance:</span>
                      <span className="font-medium">{selectedProfile.preferences.noiseTolerance}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Social Level:</span>
                      <span className="font-medium">{selectedProfile.preferences.socialLevel}/10</span>
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Hobbies & Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProfile.preferences.hobbies.map((hobby, idx) => (
                    <Badge key={idx} variant="secondary">{hobby}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Why you match</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProfile.matchReasons.map((reason, idx) => (
                    <Badge key={idx} className="bg-green-100 text-green-800">
                      ✓ {reason}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  className="flex-1" 
                  onClick={() => {
                    handleConnect(selectedProfile);
                    setShowProfileModal(false);
                  }}
                  disabled={connectedUsers.includes(selectedProfile.id)}
                >
                  {connectedUsers.includes(selectedProfile.id) ? 'Connected ✓' : 'Connect Now'}
                </Button>
                <Button variant="outline" onClick={() => setShowProfileModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentDashboard;
