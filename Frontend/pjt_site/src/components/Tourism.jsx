import { useState, useEffect } from 'react';
import touris from '../assets/touris.jpg';
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

const Tourism = () => {
  const [attractions, setAttractions] = useState([]);
  const [featuredAttractions, setFeaturedAttractions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const { token } = useAuth();

  // Fetch categories and areas on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesRes, areasRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/tourism/categories/', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://127.0.0.1:8000/api/tourism/areas/', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setCategories(categoriesRes.data);
        setAreas(areasRes.data);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    if (token) {
      fetchFilters();
    }
  }, [token]);

  // Fetch featured attractions
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/tourism/featured/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFeaturedAttractions(response.data);
      } catch (error) {
        console.error('Error fetching featured attractions:', error);
      }
    };

    if (token) {
      fetchFeatured();
    }
  }, [token]);

  // Fetch attractions with filters
  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        setLoading(true);
        setError(null);

        let url = 'http://127.0.0.1:8000/api/tourism/attractions/';
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category', selectedCategory);
        if (selectedArea) params.append('area', selectedArea);
        if (params.toString()) url += '?' + params.toString();

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAttractions(response.data);
      } catch (error) {
        console.error('Error fetching attractions:', error);
        setError('Failed to load attractions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAttractions();
    }
  }, [token, selectedCategory, selectedArea]);

  const displayedAttractions = showAll ? attractions : attractions.slice(0, 8);

  return (
    <div className='outer-bg min-h-screen overflow-hidden'>
      <div className="bg-cover bg-center bg-gradient-to-r from-purple-900 to-indigo-800 pb-20 min-h-screen" style={{ backgroundImage: `URL(${touris})`, backgroundRepeat: "no-repeat" }}>
        <Navbar/>

        {/* Error Message */}
        {error && (
          <div className="mx-12 mt-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {error}
            <button onClick={() => setError(null)} className="ml-4 font-bold">✕</button>
          </div>
        )}

        {/* Featured Section */}
        <div className="text-white text-[40px] pl-[4rem] pt-[2rem] font-extrabold font-['League Spartan']">
          EXPLORE FEATURED ATTRACTIONS
        </div>
        <div className="text-white text-[20px] pl-[4rem] font-extralight font-['League Spartan']">
          Discover Chennai's most popular destinations
        </div>

        <div className='grid grid-cols-3 gap-6 px-16 mt-8'>
          {featuredAttractions.slice(0, 3).map((attraction) => (
            <div key={attraction.id} className='bg-white bg-opacity-10 backdrop-blur-md rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer'>
              <div className='h-48 bg-cover bg-center' style={{
                backgroundImage: attraction.image_url ? `url(${attraction.image_url})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}></div>
              <div className='p-4'>
                <h3 className='text-white font-bold text-xl mb-2'>{attraction.name}</h3>
                <p className='text-gray-200 text-sm mb-2'>{attraction.short_description}</p>
                <div className='flex items-center gap-2 text-white text-xs'>
                  <span className='bg-white bg-opacity-20 px-2 py-1 rounded'>{attraction.category_name}</span>
                  {attraction.area_name && (
                    <span className='bg-white bg-opacity-20 px-2 py-1 rounded'>{attraction.area_name}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map Section */}
        <div className="text-white text-[40px] pl-[4rem] pt-[3rem] font-extrabold font-['League Spartan']">
          EXPLORE ON MAP
        </div>
        <div className="text-white text-[20px] pl-[4rem] font-extralight font-['League Spartan']">
          View all attractions on an interactive map
        </div>

        <div className="px-16 mt-6">
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
              {attractions
                .filter(attr => attr.latitude && attr.longitude)
                .map((attraction) => (
                  <Marker
                    key={attraction.id}
                    position={[parseFloat(attraction.latitude), parseFloat(attraction.longitude)]}
                  >
                    <Popup>
                      <div className="text-gray-900">
                        <h3 className="font-bold text-lg mb-1">{attraction.name}</h3>
                        <p className="text-sm mb-2">{attraction.short_description}</p>
                        <div className="text-xs space-y-1 mb-2">
                          <p><strong>Category:</strong> {attraction.category_name}</p>
                          {attraction.area_name && <p><strong>Area:</strong> {attraction.area_name}</p>}
                          {attraction.entry_fee && <p><strong>Entry Fee:</strong> ₹{attraction.entry_fee}</p>}
                          {attraction.timings && <p><strong>Timings:</strong> {attraction.timings}</p>}
                        </div>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${attraction.latitude},${attraction.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition"
                        >
                          🗺️ Get Directions
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </div>
        </div>

        {/* Filters Section */}
        <div className="text-white text-[40px] pl-[4rem] pt-[3rem] font-extrabold font-['League Spartan']">
          ALL ATTRACTIONS IN CHENNAI
        </div>

        <div className='flex gap-4 px-16 mt-6'>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className='bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg backdrop-blur-md border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white'
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
            className='bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg backdrop-blur-md border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white'
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
              className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition'
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center mt-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          </div>
        )}

        {/* Attractions Grid */}
        {!loading && (
          <div className='grid grid-cols-4 justify-items-center gap-6 px-12 mt-8'>
            {displayedAttractions.map((attraction) => (
              <div key={attraction.id} className='w-full bg-white bg-opacity-10 backdrop-blur-md rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer'>
                <div className='h-40 bg-cover bg-center' style={{
                  backgroundImage: attraction.image_url ? `url(${attraction.image_url})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}></div>
                <div className='p-4'>
                  <h3 className='text-white font-bold text-lg mb-1 truncate'>{attraction.name}</h3>
                  <p className='text-gray-200 text-xs mb-2 line-clamp-2'>{attraction.short_description}</p>
                  <div className='flex flex-col gap-1 text-white text-xs mb-3'>
                    <span>{attraction.category_name}</span>
                    {attraction.entry_fee && (
                      <span className='text-green-300'>₹ {attraction.entry_fee}</span>
                    )}
                    {attraction.timings && (
                      <span className='text-gray-300 text-xs truncate'>{attraction.timings}</span>
                    )}
                  </div>
                  {attraction.latitude && attraction.longitude && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${attraction.latitude},${attraction.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className='block w-full bg-blue-600 text-white text-center py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition'
                    >
                      🗺️ Get Directions
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show More Button */}
        {!loading && attractions.length > 8 && (
          <div className='flex justify-center mt-8'>
            <button
              onClick={() => setShowAll(!showAll)}
              className='bg-white text-purple-900 px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition'
            >
              {showAll ? 'Show Less' : `See All ${attractions.length} Attractions`}
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && attractions.length === 0 && (
          <div className='text-center text-white mt-12'>
            <p className='text-2xl'>No attractions found with the selected filters</p>
            <button
              onClick={() => { setSelectedCategory(''); setSelectedArea(''); }}
              className='mt-4 bg-white text-purple-900 px-6 py-2 rounded-lg hover:bg-opacity-90'
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tourism;