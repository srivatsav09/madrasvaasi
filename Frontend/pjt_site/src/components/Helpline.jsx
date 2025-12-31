import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Helpline = () => {
  const [helplines, setHelplines] = useState([]);
  const [emergencyHelplines, setEmergencyHelplines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  // Fetch categories and areas on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const [categoriesRes, areasRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/helpline/categories/', config),
          axios.get('http://127.0.0.1:8000/api/tourism/areas/', config)
        ]);
        setCategories(categoriesRes.data);
        setAreas(areasRes.data);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    fetchFilters();
  }, [token]);

  // Fetch emergency helplines
  useEffect(() => {
    const fetchEmergency = async () => {
      try {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const response = await axios.get('http://127.0.0.1:8000/api/helpline/emergency/', config);
        setEmergencyHelplines(response.data);
      } catch (error) {
        console.error('Error fetching emergency helplines:', error);
      }
    };

    fetchEmergency();
  }, [token]);

  // Fetch helplines with filters
  useEffect(() => {
    const fetchHelplines = async () => {
      try {
        setLoading(true);
        setError(null);

        let url = 'http://127.0.0.1:8000/api/helpline/list/';
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category', selectedCategory);
        if (selectedArea) params.append('area', selectedArea);
        if (params.toString()) url += '?' + params.toString();

        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const response = await axios.get(url, config);
        console.log('Helplines received:', response.data);
        console.log('First helpline:', response.data[0]);
        setHelplines(response.data);
      } catch (error) {
        console.error('Error fetching helplines:', error);
        setError('Failed to load helplines. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHelplines();
  }, [token, selectedCategory, selectedArea]);

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-blue-900'>
      <Navbar/>

      <div className='container mx-auto px-8 py-8'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className="text-white text-6xl font-extrabold font-['League Spartan'] mb-2">
            EMERGENCY HELPLINES
          </h1>
          <p className="text-white text-xl font-light">
            Quick access to essential services in Chennai
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {error}
            <button onClick={() => setError(null)} className="ml-4 font-bold">✕</button>
          </div>
        )}

        {/* Emergency Numbers Section */}
        <div className='mb-12'>
          <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
            <span className='text-4xl mr-3'>🚨</span>
            Emergency Numbers (24/7)
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {emergencyHelplines.map((helpline) => (
              <div
                key={helpline.id}
                className='bg-red-600 bg-opacity-90 backdrop-blur-md rounded-xl p-6 hover:bg-opacity-100 transition-all cursor-pointer transform hover:scale-105 shadow-lg'
                onClick={() => handleCall(helpline.phone_number)}
              >
                <div className='flex items-center justify-between mb-3'>
                  <span className='text-4xl'>{helpline.category_icon}</span>
                  {helpline.is_toll_free && (
                    <span className='bg-green-500 text-white text-xs px-2 py-1 rounded'>
                      Toll Free
                    </span>
                  )}
                </div>
                <h3 className='text-white font-bold text-lg mb-2'>{helpline.name}</h3>
                <div className='flex items-center justify-between'>
                  <span className='text-white text-2xl font-bold'>{helpline.phone_number}</span>
                  <button
                    className='bg-white text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCall(helpline.phone_number);
                    }}
                  >
                    📞 Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters Section */}
        <div className='bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 mb-8'>
          <h2 className="text-white text-2xl font-bold mb-4">Find Helpline by Category or Area</h2>
          <div className='flex flex-wrap gap-4'>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='bg-white bg-opacity-20 text-white px-4 py-3 rounded-lg backdrop-blur-md border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white flex-1 min-w-[200px]'
            >
              <option value="" className='bg-gray-800'>All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className='bg-gray-800'>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>

            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className='bg-white bg-opacity-20 text-white px-4 py-3 rounded-lg backdrop-blur-md border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white flex-1 min-w-[200px]'
            >
              <option value="" className='bg-gray-800'>All Areas</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id} className='bg-gray-800'>
                  {area.name}
                </option>
              ))}
            </select>

            {(selectedCategory || selectedArea) && (
              <button
                onClick={() => { setSelectedCategory(''); setSelectedArea(''); }}
                className='bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-bold'
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div className='mb-12'>
          <h2 className="text-white text-3xl font-bold mb-6">Locate Helplines on Map</h2>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl overflow-hidden border border-white border-opacity-30">
            <MapContainer
              center={[13.0827, 80.2707]}
              zoom={12}
              style={{ height: '500px', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {helplines
                .filter(h => {
                  const hasCoords = h.latitude && h.longitude;
                  if (hasCoords) console.log('Rendering marker for:', h.name, h.latitude, h.longitude);
                  return hasCoords;
                })
                .map((helpline) => (
                  <Marker
                    key={helpline.id}
                    position={[parseFloat(helpline.latitude), parseFloat(helpline.longitude)]}
                  >
                    <Popup>
                      <div className="text-gray-900">
                        <div className='flex items-center gap-2 mb-2'>
                          <span className='text-2xl'>{helpline.category_icon}</span>
                          <h3 className="font-bold text-lg">{helpline.name}</h3>
                        </div>
                        <div className="text-sm space-y-1 mb-3">
                          <p><strong>Category:</strong> {helpline.category_name}</p>
                          {helpline.area_name && <p><strong>Area:</strong> {helpline.area_name}</p>}
                          <p className="text-lg font-bold text-blue-600">📞 {helpline.phone_number}</p>
                          {helpline.alternate_number && (
                            <p className="text-sm">Alt: {helpline.alternate_number}</p>
                          )}
                          {helpline.address && <p><strong>Address:</strong> {helpline.address}</p>}
                          {helpline.timings && <p><strong>Timings:</strong> {helpline.timings}</p>}
                          <div className='flex gap-2 mt-2'>
                            {helpline.is_emergency && (
                              <span className='bg-red-500 text-white text-xs px-2 py-1 rounded'>
                                Emergency 24/7
                              </span>
                            )}
                            {helpline.is_toll_free && (
                              <span className='bg-green-500 text-white text-xs px-2 py-1 rounded'>
                                Toll Free
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={`tel:${helpline.phone_number}`}
                            className="inline-block bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition"
                          >
                            📞 Call Now
                          </a>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${helpline.latitude},${helpline.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition"
                          >
                            🗺️ Get Directions
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          </div>
        )}

        {/* Helplines List */}
        {!loading && helplines.length > 0 && (
          <div>
            <h2 className="text-white text-3xl font-bold mb-6">All Helplines</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {helplines.map((helpline) => (
                <div
                  key={helpline.id}
                  className='bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 hover:bg-opacity-20 transition-all'
                >
                  <div className='flex items-start justify-between mb-3'>
                    <div className='flex items-center gap-2'>
                      <span className='text-3xl'>{helpline.category_icon}</span>
                      <div>
                        <h3 className='text-white font-bold text-lg'>{helpline.name}</h3>
                        <p className='text-gray-300 text-sm'>{helpline.category_name}</p>
                      </div>
                    </div>
                  </div>

                  {helpline.area_name && (
                    <div className='flex items-center gap-2 mb-2'>
                      <span className='text-white text-sm'>📍 {helpline.area_name}</span>
                    </div>
                  )}

                  {helpline.address && (
                    <p className='text-gray-300 text-sm mb-3'>{helpline.address}</p>
                  )}

                  <div className='border-t border-white border-opacity-20 pt-3 mt-3'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-white font-bold text-xl'>{helpline.phone_number}</span>
                      <button
                        onClick={() => handleCall(helpline.phone_number)}
                        className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-bold flex items-center gap-2'
                      >
                        📞 Call
                      </button>
                    </div>

                    {helpline.alternate_number && (
                      <div className='flex items-center justify-between text-sm mb-2'>
                        <span className='text-gray-300'>Alt: {helpline.alternate_number}</span>
                        <button
                          onClick={() => handleCall(helpline.alternate_number)}
                          className='text-green-300 hover:text-green-200 transition'
                        >
                          Call
                        </button>
                      </div>
                    )}

                    {helpline.timings && (
                      <div className='flex items-center gap-2 mt-2'>
                        <span className='text-gray-300 text-sm'>🕐 {helpline.timings}</span>
                      </div>
                    )}

                    <div className='flex gap-2 mt-3 mb-3'>
                      {helpline.is_emergency && (
                        <span className='bg-red-500 text-white text-xs px-2 py-1 rounded'>
                          Emergency 24/7
                        </span>
                      )}
                      {helpline.is_toll_free && (
                        <span className='bg-green-500 text-white text-xs px-2 py-1 rounded'>
                          Toll Free
                        </span>
                      )}
                    </div>

                    {(helpline.latitude && helpline.longitude) && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${helpline.latitude},${helpline.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className='block w-full bg-blue-500 text-white text-center py-2.5 rounded-lg text-sm font-bold hover:bg-blue-600 transition mt-2'
                      >
                        🗺️ Get Directions
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && helplines.length === 0 && (
          <div className='text-center text-white py-12'>
            <p className='text-2xl mb-4'>No helplines found with the selected filters</p>
            <button
              onClick={() => { setSelectedCategory(''); setSelectedArea(''); }}
              className='bg-white text-purple-900 px-6 py-3 rounded-lg hover:bg-opacity-90 font-bold'
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Helpline;
