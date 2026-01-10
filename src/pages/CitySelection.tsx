import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Navigation, X } from "lucide-react";
import img1 from "@/assets/places/1.svg";
import img2 from "@/assets/places/2.svg";
import img3 from "@/assets/places/3.svg";
import img4 from "@/assets/places/4.svg";
import img5 from "@/assets/places/5.svg";
import img6 from "@/assets/places/6.svg";
import img7 from "@/assets/places/7.svg";
import img8 from "@/assets/places/8.svg";
import img9 from "@/assets/places/9.svg";
import img10 from "@/assets/places/10.svg";

const CitySelection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllCities, setShowAllCities] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");

  const popularCities = [
    { name: "Mumbai", icon: img6 },
    { name: "Delhi-NCR", icon: img5 },
    { name: "Bengaluru", icon: img2 },
    { name: "Hyderabad", icon: img1 },
    { name: "Chennai", icon: img4 },
    { name: "Pune", icon: img3 },
    { name: "Kolkata", icon: img9 },
    { name: "Ahmedabad", icon: img7 },
    { name: "Chandigarh", icon: img8 },
    { name: "Kochi", icon: img10 }
  ];

  const otherCities = [
    "Aalo", "Abohar", "Abu Road", "Achalpur", "Achampet", "Adilabad", "Adimali", "Adoni", "Agar Malwa", "Agartala", "Agra", "Ahore", "Aizawl", "Ajmer", "Akividu", "Akola", "Alangulam", "Alappuzha", "Aluva", "Alwar", "Ambala", "Ambikapur", "Amravati", "Amreli", "Amritsar", "Amroha", "Anand", "Anantapur", "Ankleshwar", "Arrah", "Asansol", "Aurangabad", "Bagalkot", "Bahadurgarh", "Bahraich", "Baidyabati", "Balasore", "Ballari", "Balurghat", "Bankura", "Baramati", "Barasat", "Bardhaman", "Bareilly", "Baripada", "Barmer", "Barnala", "Barpeta", "Batala", "Bathinda", "Beawar", "Begusarai", "Belgaum", "Bellary", "Berhampore", "Berhampur", "Bettiah", "Betul", "Bhadrak", "Bhagalpur", "Bhandara", "Bharatpur", "Bharuch", "Bhatpara", "Bhavnagar", "Bhilai", "Bhilwara", "Bhind", "Bhiwadi", "Bhiwani", "Bhopal", "Bhubaneswar", "Bhuj", "Bhusawal", "Bidar", "Bidhan Nagar", "Bihar Sharif", "Bijnor", "Bikaner", "Bilaspur", "Bokaro", "Bongaigaon", "Budaun", "Bulandshahr", "Burhanpur", "Buxar", "Chamba", "Chandausi", "Chandrapur", "Chapra", "Charkhi Dadri", "Chatra", "Cherthala", "Chhapra", "Chikkaballapur", "Chikkamagaluru", "Chinsurah", "Chitradurga", "Chittoor", "Chittorgarh", "Churu", "Coimbatore", "Coonoor", "Cuddalore", "Cuttack", "Darbhanga", "Darjeeling", "Dasuya", "Datia", "Davanagere", "Deesa", "Dehradun", "Dehri", "Delhi", "Deoghar", "Dewas", "Dhamtari", "Dhanbad", "Dhar", "Dharamshala", "Dharwad", "Dhule", "Dibrugarh", "Dindigul", "Diu", "Dombivli", "Durg", "Durgapur", "Eluru", "English Bazar", "Erode", "Etawah", "Faizabad", "Faridabad", "Faridkot", "Farrukhabad", "Fatehabad", "Fatehgarh Sahib", "Fatehpur", "Fazilka", "Firozabad", "Firozpur", "Gadag", "Gadwal", "Gajraula", "Gandhidham", "Gandhinagar", "Gangtok", "Gaya", "Ghaziabad", "Ghazipur", "Giridih", "Goalpara", "Gobichettipalayam", "Gobindgarh", "Godhra", "Gohana", "Gokak", "Golaghat", "Gonda", "Gondia", "Gopalganj", "Gorakhpur", "Greater Noida", "Gudivada", "Gudur", "Guhagar", "Gulbarga", "Guna", "Guntakal", "Guntur", "Gurdaspur", "Gurgaon", "Guwahati", "Gwalior", "Habra", "Hajipur", "Haldwani", "Hamirpur", "Hansi", "Hanumangarh", "Hapur", "Hardoi", "Haridwar", "Hassan", "Hathras", "Haveri", "Hazaribagh", "Hindupur", "Hisar", "Hoshangabad", "Hoshiarpur", "Hospet", "Howrah", "Hubli", "Ichalkaranji", "Imphal", "Indore", "Jabalpur", "Jagadhri", "Jaipur", "Jaisalmer", "Jalandhar", "Jalgaon", "Jalna", "Jamalpur", "Jammu", "Jamnagar", "Jamshedpur", "Jamuria", "Jaunpur", "Jehanabad", "Jhansi", "Jhunjhunu", "Jind", "Jodhpur", "Jorhat", "Junagadh", "Kadapa", "Kaithal", "Kakinada", "Kalol", "Kalyan", "Kamarhati", "Kanpur", "Kapurthala", "Karaikudi", "Karawal Nagar", "Karimnagar", "Karnal", "Karur", "Kasaragod", "Kashipur", "Katni", "Kattappana", "Kavali", "Kayamkulam", "Khammam", "Khandwa", "Khanna", "Kharagpur", "Khargone", "Kheda", "Kodungallur", "Kohima", "Kolar", "Kolhapur", "Kollam", "Korba", "Kota", "Kothagudem", "Kottayam", "Kozhikode", "Krishnanagar", "Kumbakonam", "Kurnool", "Kurukshetra", "Lakhimpur", "Latur", "Loni", "Lucknow", "Ludhiana", "Machilipatnam", "Madanapalle", "Madhyamgram", "Madurai", "Mahabubnagar", "Maharajganj", "Maheshtala", "Mahoba", "Mainpuri", "Malappuram", "Malegaon", "Malerkotla", "Malkajgiri", "Malout", "Mandi", "Mandya", "Mangalore", "Mango", "Manjeri", "Manmad", "Mansa", "Margao", "Mathura", "Mau", "Medininagar", "Meerut", "Mehsana", "Mira-Bhayandar", "Miraj", "Miryalaguda", "Moga", "Mohali", "Moradabad", "Morbi", "Morena", "Morigaon", "Muktsar", "Munger", "Murwara", "Muzaffarnagar", "Muzaffarpur", "Mysore", "Nabadwip", "Nagarcoil", "Nagaur", "Nagda", "Nagercoil", "Nagpur", "Naihati", "Najibabad", "Nalanda", "Nalbari", "Nalgonda", "Namakkal", "Nanded", "Nandurbar", "Nandyal", "Nangloi Jat", "Narasaraopet", "Nashik", "Navi Mumbai", "Navsari", "Nawada", "Nellore", "New Delhi", "Nizamabad", "Noida", "North Lakhimpur", "Ongole", "Orai", "Osmanabad", "Ottappalam", "Ozhukarai", "Palakkad", "Palanpur", "Pallavaram", "Panchkula", "Panihati", "Panipat", "Panvel", "Parbhani", "Pathankot", "Patiala", "Patna", "Pattukottai", "Pehowa", "Phagwara", "Phaltan", "Pilibhit", "Pilkhuwa", "Pimpri-Chinchwad", "Pithampur", "Pollachi", "Pondicherry", "Ponnani", "Porbandar", "Port Blair", "Proddatur", "Pudukkottai", "Puri", "Purnia", "Puruliya", "Rae Bareli", "Raichur", "Raiganj", "Raigarh", "Raipur", "Rajahmundry", "Rajam", "Rajkot", "Rajnandgaon", "Rajpura", "Ramagundam", "Ramgarh", "Rampur", "Ranchi", "Rangpo", "Ratlam", "Ratnagiri", "Raurkela", "Rewa", "Rewari", "Rishikesh", "Robertsganj", "Rohtak", "Roorkee", "Rourkela", "Rudrapur", "Sagar", "Saharanpur", "Saharsa", "Salem", "Sambalpur", "Sambhal", "Sangli", "Sangrur", "Santipur", "Sasaram", "Satara", "Satna", "Sawai Madhopur", "Secunderabad", "Seoni", "Serampore", "Shahjahanpur", "Shillong", "Shimla", "Shimoga", "Shivpuri", "Sikar", "Siliguri", "Silvassa", "Singrauli", "Sirsa", "Sitapur", "Sivakasi", "Siwan", "Solapur", "Sonipat", "Srikakulam", "Srinagar", "Sujangarh", "Sultanpur", "Surat", "Surendranagar", "Suryapet", "Tadepalligudem", "Tadipatri", "Talcher", "Taliparamba", "Tambaram", "Tezpur", "Thane", "Thanesar", "Thanjavur", "Theni", "Thiruvananthapuram", "Thoothukudi", "Thrissur", "Tinsukia", "Tiruchirapalli", "Tirunelveli", "Tirupati", "Tiruppur", "Tirur", "Tiruvalla", "Tiruvottiyur", "Tonk", "Tuticorin", "Udaipur", "Udupi", "Ujjain", "Ulhasnagar", "Unnao", "Vadodara", "Valsad", "Vapi", "Varanasi", "Vasco da Gama", "Vellore", "Veraval", "Vidisha", "Vijayawada", "Virar", "Visakhapatnam", "Vizianagaram", "Warangal", "Wardha", "Yamunanagar", "Yavatmal", "Yelahanka", "Yemmiganur", "Yerraguntla", "Yevla"
  ];

  const filteredOtherCities = otherCities.filter(city =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    localStorage.setItem('selectedCity', cityName);
    navigate('/student-dashboard');
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => handleCitySelect("Bengaluru"),
        () => alert("Unable to detect location. Please select a city manually.")
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-8 pb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Select Your City</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="hover:bg-gray-100">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for your city"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-3 text-lg border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Detect Location */}
          <Button
            variant="ghost"
            onClick={handleDetectLocation}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto font-normal flex items-center mb-2"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Detect my location
          </Button>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {/* Popular Cities */}
          {!searchQuery && (
            <div className="px-8 pb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-6 text-center">Popular Cities</h3>
              <div className="grid grid-cols-5 gap-6 mb-8">
                {popularCities.map((city) => (
                  <div
                    key={city.name}
                    onClick={() => handleCitySelect(city.name)}
                    className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${
                      selectedCity === city.name 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent'
                    }`}
                  >
                    <img 
                      src={city.icon} 
                      alt={city.name}
                      className="w-20 h-20 object-contain mb-3 transition-all duration-200 hover:scale-110 mix-blend-multiply"
                    />
                    <span className="text-sm font-medium text-gray-700 text-center">{city.name}</span>
                  </div>
                ))}
              </div>
              
              {/* View All Cities Button */}
              <div className="text-center">
                <button
                  onClick={() => setShowAllCities(!showAllCities)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-lg hover:underline transition-colors"
                >
                  {showAllCities ? 'Hide all cities' : 'View All Cities'}
                </button>
              </div>
            </div>
          )}

          {/* Other Cities - Show when expanded or searching */}
          {(showAllCities || searchQuery) && (
            <div className="px-8 pb-8 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-6 mt-6 text-center">
                {searchQuery ? 'Search Results' : 'Other Cities'}
              </h3>
              <div className="grid grid-cols-5 gap-x-8 gap-y-3">
                {(searchQuery ? filteredOtherCities : otherCities).map((city) => (
                  <button
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    className={`text-left p-3 rounded-lg text-sm transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 ${
                      selectedCity === city ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:font-medium'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
              
              {searchQuery && filteredOtherCities.length === 0 && (
                <p className="text-gray-500 text-center py-12 text-lg">No cities found</p>
              )}
              
              {showAllCities && !searchQuery && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowAllCities(false)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-lg hover:underline transition-colors"
                  >
                    Hide all cities
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitySelection;