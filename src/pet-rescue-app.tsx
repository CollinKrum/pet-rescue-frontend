import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, Clock, MapPin, AlertTriangle, Phone, Mail } from 'lucide-react';

// The URL for your backend API, loaded from the environment variables.
// This is the correct way to access environment variables in a Create React App environment.
const API_URL = process.env.REACT_APP_API_URL;

// Function to get the urgency color based on the urgency level
const getUrgencyColor = (urgency) => {
  switch (urgency) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'moderate':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Function to format the days left until euthanasia
const formatTimeLeft = (days) => {
  if (!days) return null;
  if (days === 1) return "1 day left";
  return `${days} days left`;
};

const PetRescueApp = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [filters, setFilters] = useState({
    state: '',
    species: '',
    urgencyLevel: '',
    daysInShelter: '',
    daysUntilEuthanasia: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // useEffect to fetch data from the backend on component mount
  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/pets`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPets(data);
        setFilteredPets(data);
      } catch (error) {
        console.error("Failed to fetch pets:", error);
        // Fallback to mock data or display an error message
        setPets([]);
        setFilteredPets([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Call the fetch function
    fetchPets();
  }, []); // Empty dependency array means this runs once when the component mounts

  // useEffect to apply filters whenever the pets, searchTerm, or filters change
  useEffect(() => {
    let filtered = pets.filter(pet => {
      const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) || pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) || pet.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesState = !filters.state || pet.state === filters.state;
      const matchesSpecies = !filters.species || pet.species === filters.species;
      const matchesUrgency = !filters.urgencyLevel || pet.urgencyLevel === filters.urgencyLevel;
      const matchesDaysInShelter = !filters.daysInShelter || (filters.daysInShelter === "1-30" && pet.daysInShelter <= 30) || (filters.daysInShelter === "30+" && pet.daysInShelter > 30);
      const matchesDaysUntilEuthanasia = !filters.daysUntilEuthanasia || (filters.daysUntilEuthanasia === "1-3" && pet.daysUntilEuthanasia && pet.daysUntilEuthanasia <= 3) || (filters.daysUntilEuthanasia === "4-7" && pet.daysUntilEuthanasia && pet.daysUntilEuthanasia >= 4 && pet.daysUntilEuthanasia <= 7) || (filters.daysUntilEuthanasia === "7+" && pet.daysUntilEuthanasia && pet.daysUntilEuthanasia > 7) || (filters.daysUntilEuthanasia === "no-kill" && !pet.daysUntilEuthanasia);
      return matchesSearch && matchesState && matchesSpecies && matchesUrgency && matchesDaysInShelter && matchesDaysUntilEuthanasia;
    });

    // Sort by urgency
    filtered.sort((a, b) => {
      const urgencyOrder = { critical: 0, moderate: 1, low: 2 };
      return urgencyOrder[a.urgencyLevel] - urgencyOrder[b.urgencyLevel];
    });

    setFilteredPets(filtered);
  }, [pets, searchTerm, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">Pet Rescue Finder</h1>
          </div>
          <div className="mt-4 md:mt-0 flex flex-grow max-w-lg">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, breed, or location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
          <div className="flex items-center gap-2 text-gray-700 mb-4">
            <Filter className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Filter Options</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
              <select
                id="state"
                onChange={(e) => handleFilterChange('state', e.target.value)}
                value={filters.state}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All States</option>
                <option value="TX">Texas</option>
                <option value="FL">Florida</option>
                <option value="CA">California</option>
                <option value="PA">Pennsylvania</option>
              </select>
            </div>
            <div>
              <label htmlFor="species" className="block text-sm font-medium text-gray-700">Species</label>
              <select
                id="species"
                onChange={(e) => handleFilterChange('species', e.target.value)}
                value={filters.species}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Species</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
              </select>
            </div>
            <div>
              <label htmlFor="urgencyLevel" className="block text-sm font-medium text-gray-700">Urgency</label>
              <select
                id="urgencyLevel"
                onChange={(e) => handleFilterChange('urgencyLevel', e.target.value)}
                value={filters.urgencyLevel}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Urgency Levels</option>
                <option value="critical">Critical</option>
                <option value="moderate">Moderate</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label htmlFor="daysUntilEuthanasia" className="block text-sm font-medium text-gray-700">Days Until Euthanasia</label>
              <select
                id="daysUntilEuthanasia"
                onChange={(e) => handleFilterChange('daysUntilEuthanasia', e.target.value)}
                value={filters.daysUntilEuthanasia}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All</option>
                <option value="no-kill">No-Kill Shelter</option>
                <option value="1-3">1-3 Days Left</option>
                <option value="4-7">4-7 Days Left</option>
                <option value="7+">7+ Days Left</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-4 text-gray-600">Loading pets...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPets.map((pet) => (
                <div key={pet.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 flex flex-col">
                  <div className="relative">
                    <img
                      src={pet.image}
                      alt={`A photo of ${pet.name}`}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/400x300/e2e8f0/718096?text=Image+Not+Found";
                      }}
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(pet.urgencyLevel)}`}>
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {pet.urgencyLevel}
                      </span>
                      {pet.daysUntilEuthanasia && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTimeLeft(pet.daysUntilEuthanasia)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{pet.name}</h3>
                      <p className="text-sm font-medium text-gray-600 mb-2">{pet.breed} • {pet.age}</p>
                      <div className="flex items-center text-gray-500 text-sm mb-4">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{pet.location}</span>
                      </div>
                      <p className="text-gray-700 text-sm mb-4 line-clamp-3">{pet.description}</p>
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="flex gap-2">
                        <a
                          href={`tel:${pet.contact.phone}`}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </a>
                        <a
                          href={`mailto:${pet.contact.email}`}
                          className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <Mail className="w-4 h-4" />
                          Email
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPets.length === 0 && (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pets found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default PetRescueApp;

