import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, CreditCard } from 'lucide-react';

const BookingPage = () => {
  const { serviceId } = useParams(); // Get serviceId from URL
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');

  // Fetch service data when component mounts
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`http://localhost:9000/services/${serviceId}`);
        if (response.ok) {
          const data = await response.json();
          setService(data);
        } else {
          console.error('Failed to fetch service');
        }
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  // Generate time slots (every hour from 8AM to 8PM)
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8;
    return `${hour < 10 ? '0' + hour : hour}:00`;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:9000/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: service._id,
          providerId: service.providerId,
          date,
          time,
          address,
          instructions,
          price: service.price
        }),
      });

      if (response.ok) {
        const booking = await response.json();
        window.location.href = `/payment/${booking._id}`;
      }
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  // Show loading state while fetching data
  if (loading) {
    return <div className="max-w-4xl mx-auto py-8 px-4">Loading service details...</div>;
  }

  // Show error if service not found
  if (!service) {
    return <div className="max-w-4xl mx-auto py-8 px-4">Service not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Book {service.title}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="border rounded-lg overflow-hidden">
              <img 
                src={service.image} 
                alt={service.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{service.title}</h3>
                <p className="text-gray-600">{service.category}</p>
                <div className="flex items-center mt-2">
                  <span className="font-bold text-lg">${service.price}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="inline mr-2 h-4 w-4" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border rounded-md"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                
                {/* Time Slot Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Clock className="inline mr-2 h-4 w-4" />
                    Select Time
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  >
                    <option value="">Select a time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
                
                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="inline mr-2 h-4 w-4" />
                    Service Address
                  </label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your address"
                    required
                  />
                </div>
                
                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="inline mr-2 h-4 w-4" />
                    Special Instructions
                  </label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Any special requests or instructions"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={!date || !time || !address}
                  className="w-full bg-[#68b5c2] hover:bg-[#4a9ba8] text-white py-3 rounded-md font-medium disabled:opacity-50"
                >
                  <CreditCard className="inline mr-2 h-4 w-4" />
                  Continue to Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;