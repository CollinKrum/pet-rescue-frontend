import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, Clock, MapPin, AlertTriangle, Phone, Mail } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL;

// Helper functions (urgency, time formatting)
const getUrgencyColor = (urgency) => { /* same as before */ };
const formatTimeLeft = (days) => { /* same as before */ };

const PetRescueApp = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [filters, setFilters] = useState({ state: '', species: '', urgencyLevel: '', daysUntilEuthanasia: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch pets from backend
  const fetchPets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/pets`);
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      setPets(data);
      setFilteredPets(data);
    } catch (err) {
      console.error('Failed to fetch pets:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch + poll every 60 seconds
  useEffect(() => {
    fetchPets();
    const interval = setInterval(fetchPets, 60000); // 60 sec
    return () => clearInterval(interval);
  }, []);

  // Apply filters
  useEffect(() => {
    const filtered = pets.filter(pet => {
      const matchesSearch =
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesState = !filters.state || pet.state === filters.state;
      const matchesSpecies = !filters.species || pet.species === filters.species;
      const matchesUrgency = !filters.urgencyLevel || pet.urgency_level === filters.urgencyLevel;
      const matchesDaysUntil = !filters.daysUntilEuthanasia ||
        (filters.daysUntilEuthanasia === '1-3' && pet.days_until_euthanasia <= 3) ||
        (filters.daysUntilEuthanasia === '4-7' && pet.days_until_euthanasia >= 4 && pet.days_until_euthanasia <= 7) ||
        (filters.daysUntilEuthanasia === '7+' && pet.days_until_euthanasia > 7) ||
        (filters.daysUntilEuthanasia === 'no-kill' && !pet.days_until_euthanasia);

      return matchesSearch && matchesState && matchesSpecies && matchesUrgency && matchesDaysUntil;
    });

    filtered.sort((a, b) => {
      const urgencyOrder = { critical: 0, moderate: 1, low: 2 };
      return urgencyOrder[a.urgency_level] - urgencyOrder[b.urgency_level];
    });

    setFilteredPets(filtered);
  }, [pets, filters, searchTerm]);

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header & Search */}
      <header>…same as before…</header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div>…same filter UI as before…</div>

        {loading ? (
          <div>Loading pets...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map(pet => (
              <div key={pet.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 flex flex-col">
                <div className="relative">
                  <img
                    src={pet.image_url || 'https://placehold.co/400x300/e2e8f0/718096?text=No+Image'}
                    alt={pet.name}
                    className="w-full h-48 object-cover"
                  />
                  <span className={`absolute top-2 right-2 px-3 py-1 text-xs rounded-full border ${getUrgencyColor(pet.urgency_level)}`}>
                    <AlertTriangle className="w-3 h-3 mr-1" /> {pet.urgency_level}
                  </span>
                  {pet.days_until_euthanasia && (
                    <span className="absolute top-10 right-2 px-3 py-1 text-xs rounded-full border bg-red-100 text-red-800">
                      <Clock className="w-3 h-3 mr-1" /> {formatTimeLeft(pet.days_until_euthanasia)}
                    </span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold">{pet.name}</h3>
                  <p className="text-sm text-gray-600">{pet.breed} • {pet.age}</p>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-2" /> {pet.location}
                  </div>
                  <p className="text-gray-700 flex-1">{pet.description}</p>
                  <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                    <a href={`tel:${pet.contact_phone}`} className="flex-1 bg-blue-600 text-white py-2 rounded-md flex items-center justify-center gap-1">
                      <Phone className="w-4 h-4" /> Call
                    </a>
                    <a href={`mailto:${pet.contact_email}`} className="flex-1 bg-green-600 text-white py-2 rounded-md flex items-center justify-center gap-1">
                      <Mail className="w-4 h-4" /> Email
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PetRescueApp;
