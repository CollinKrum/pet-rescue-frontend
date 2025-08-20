import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, Clock, MapPin, AlertTriangle, Phone, Mail } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);

  // Mock data - in real app, this would come from your API
  const mockPets = [
    {
      id: 1,
      name: "Buddy",
      species: "Dog",
      breed: "Golden Retriever Mix",
      age: "3 years",
      location: "Austin Animal Center, TX",
      state: "TX",
      daysInShelter: 15,
      daysUntilEuthanasia: 3,
      urgencyLevel: "critical",
      description: "Friendly, house-trained, great with kids",
      contact: { phone: "(512) 978-0500", email: "info@austinpetsalive.org" },
      source: "Petfinder",
      image: "https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Buddy",
      posted: "2024-08-15"
    },
    {
      id: 2,
      name: "Luna",
      species: "Cat",
      breed: "Domestic Shorthair",
      age: "2 years",
      location: "SPCA of Central Florida, FL",
      state: "FL",
      daysInShelter: 8,
      daysUntilEuthanasia: 7,
      urgencyLevel: "moderate",
      description: "Sweet, shy, needs patient home",
      contact: { phone: "(407) 351-7722", email: "adoption@spcaorlando.org" },
      source: "Facebook Group",
      image: "https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Luna",
      posted: "2024-08-10"
    },
    {
      id: 3,
      name: "Max",
      species: "Dog",
      breed: "German Shepherd",
      age: "5 years",
      location: "Best Friends Animal Sanctuary, CA",
      state: "CA",
      daysInShelter: 45,
      daysUntilEuthanasia: null,
      urgencyLevel: "low",
      description: "Trained, loyal, good with other dogs",
      contact: { phone: "(435) 644-2001", email: "info@bestfriends.org" },
      source: "Adopt-a-Pet",
      image: "https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Max",
      posted: "2024-07-04"
    },
    {
      id: 4,
      name: "Whiskers",
      species: "Cat",
      breed: "Persian Mix",
      age: "7 years",
      location: "Animal Rescue League, PA",
      state: "PA",
      daysInShelter: 22,
      daysUntilEuthanasia: 1,
      urgencyLevel: "critical",
      description: "Senior cat, very affectionate, medical needs",
      contact: { phone: "(412) 661-6452", email: "adopt@animalrescueleague.org" },
      source: "Rescue Group Website",
      image: "https://via.placeholder.com/300x200/F7DC6F/000000?text=Whiskers",
      posted: "2024-07-27"
    }
  ];

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    setTimeout(() => {
      setPets(mockPets);
      setFilteredPets(mockPets);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = pets.filter(pet => {
      const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pet.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesState = !filters.state || pet.state === filters.state;
      const matchesSpecies = !filters.species || pet.species === filters.species;
      const matchesUrgency = !filters.urgencyLevel || pet.urgencyLevel === filters.urgencyLevel;
      
      const matchesDaysInShelter = !filters.daysInShelter || 
        (filters.daysInShelter === "0-7" && pet.daysInShelter <= 7) ||
        (filters.daysInShelter === "8-30" && pet.daysInShelter >= 8 && pet.daysInShelter <= 30) ||
        (filters.daysInShelter === "30+" && pet.daysInShelter > 30);
      
      const matchesDaysUntilEuthanasia = !filters.daysUntilEuthanasia ||
        (filters.daysUntilEuthanasia === "1-3" && pet.daysUntilEuthanasia && pet.daysUntilEuthanasia <= 3) ||
        (filters.daysUntilEuthanasia === "4-7" && pet.daysUntilEuthanasia && pet.daysUntilEuthanasia >= 4 && pet.daysUntilEuthanasia <= 7) ||
        (filters.daysUntilEuthanasia === "7+" && pet.daysUntilEuthanasia && pet.daysUntilEuthanasia > 7) ||
        (filters.daysUntilEuthanasia === "no-kill" && !pet.daysUntilEuthanasia);

      return matchesSearch && matchesState && matchesSpecies && matchesUrgency && 
             matchesDaysInShelter && matchesDaysUntilEuthanasia;
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

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeLeft = (days) => {
    if (!days) return null;
    if (days === 1) return "1 day left";
    return `${days} days left`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">Pet Rescue Finder</h1>
          </div>
          <p className="text-gray-600 mt-2">Helping pets find homes before time runs out</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, breed, or location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
            >
              <option value="">All States</option>
              <option value="TX">Texas</option>
              <option value="FL">Florida</option>
              <option value="CA">California</option>
              <option value="PA">Pennsylvania</option>
            </select>

            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              value={filters.species}
              onChange={(e) => handleFilterChange('species', e.target.value)}
            >
              <option value="">All Species</option>
              <option value="Dog">Dogs</option>
              <option value="Cat">Cats</option>
            </select>

            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              value={filters.urgencyLevel}
              onChange={(e) => handleFilterChange('urgencyLevel', e.target.value)}
            >
              <option value="">All Urgency Levels</option>
              <option value="critical">Critical</option>
              <option value="moderate">Moderate</option>
              <option value="low">Low</option>
            </select>

            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              value={filters.daysInShelter}
              onChange={(e) => handleFilterChange('daysInShelter', e.target.value)}
            >
              <option value="">Days in Shelter</option>
              <option value="0-7">0-7 days</option>
              <option value="8-30">8-30 days</option>
              <option value="30+">30+ days</option>
            </select>

            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              value={filters.daysUntilEuthanasia}
              onChange={(e) => handleFilterChange('daysUntilEuthanasia', e.target.value)}
            >
              <option value="">Time Until Euthanasia</option>
              <option value="1-3">1-3 days</option>
              <option value="4-7">4-7 days</option>
              <option value="7+">7+ days</option>
              <option value="no-kill">No-kill shelter</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading pets...</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Found {filteredPets.length} pets • {filteredPets.filter(p => p.urgencyLevel === 'critical').length} critical cases
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPets.map((pet) => (
                <div key={pet.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <img src={pet.image} alt={pet.name} className="w-full h-48 object-cover" />
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{pet.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(pet.urgencyLevel)}`}>
                        {pet.urgencyLevel}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-2">{pet.breed} • {pet.age}</p>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{pet.location}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{pet.daysInShelter} days in shelter</span>
                      </div>
                      {pet.daysUntilEuthanasia && (
                        <div className="flex items-center text-red-600">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          <span className="font-medium">{formatTimeLeft(pet.daysUntilEuthanasia)}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-700 mb-4 text-sm">{pet.description}</p>

                    <div className="border-t pt-4">
                      <p className="text-xs text-gray-500 mb-2">Source: {pet.source}</p>
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
      </div>
    </div>
  );
};

export default PetRescueApp;
