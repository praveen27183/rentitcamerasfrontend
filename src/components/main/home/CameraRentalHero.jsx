import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Camera, Lightbulb, Mic, Grid3X3, Calendar, Search, X, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { addDays, format, isAfter, isBefore, isSameDay } from 'date-fns';

const CameraRentalHero = ({ setRentalDays }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [pickupTime, setPickupTime] = useState('09:00');
  const [returnTime, setReturnTime] = useState('21:00');
  const [activeField, setActiveField] = useState('delivery');
  const [dateError, setDateError] = useState('');
  const [isDateSelected, setIsDateSelected] = useState(false);
  const categories = [
    {
      icon: Camera,
      title: 'Cameras',
      count: '50+ Items',
      color: 'bg-teal-600'
    },
    {
      icon: Lightbulb,
      title: 'Lights',
      count: '30+ Items',
      color: 'bg-teal-500'
    },
    {
      icon: Mic,
      title: 'Audio',
      count: '25+ Items',
      color: 'bg-teal-600'
    },
    {
      icon: Grid3X3,
      title: 'Props',
      count: '40+ Items',
      color: 'bg-teal-500'
    }
  ];

  const calculateRentalDays = (start, end) => {
    if (!start || !end) return 0;
    // Calculate full days between dates
    const diffTime = Math.abs(end - start);
    const fullDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Add 1 to include both start and end dates
    return fullDays + 1;
  };

  const days = returnDate && pickupDate ? calculateRentalDays(returnDate, pickupDate) : 0;

  useEffect(() => {
    if (pickupDate && returnDate) {
      if (isBefore(returnDate, pickupDate)) {
        setDateError('Return date must be after pickup date');
        setIsDateSelected(false);
      } else if (isSameDay(pickupDate, returnDate)) {
        // If same day, check times
        const [pickupHour, pickupMinute] = pickupTime.split(':').map(Number);
        const [returnHour, returnMinute] = returnTime.split(':').map(Number);
        
        if (returnHour < pickupHour || (returnHour === pickupHour && returnMinute <= pickupMinute)) {
          setDateError('Return time must be after pickup time');
          setIsDateSelected(false);
        } else {
          setDateError('');
          setIsDateSelected(true);
        }
      } else {
        setDateError('');
        setIsDateSelected(true);
      }
    } else {
      setDateError('');
      setIsDateSelected(false);
    }
  }, [pickupDate, returnDate, pickupTime, returnTime]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-teal-50 relative overflow-hidden pt-16">
      {/* Background decorative circles */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-teal-200/30 rounded-full blur-xl"></div>
      <div className="absolute top-40 right-32 w-40 h-40 bg-teal-300/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gray-300/40 rounded-full blur-lg"></div>
      <div className="absolute bottom-20 right-20 w-36 h-36 bg-teal-200/25 rounded-full blur-xl"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 leading-tight">
            Professional Camera Gear
          </h1>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A97A9] mb-8 leading-tight">
            Rental Made Easy
          </h2>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            Stop buying expensive equipment. Rent professional cameras, lenses, lights, and 
            audio gear for your next project at unbeatable prices.
          </p>

          {/* Primary CTA Button */}
          <div className="mb-16">
            <button className="inline-flex items-center space-x-3 bg-[#1A97A9] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#166a78] hover:text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              <Camera className="w-6 h-6" />
              <span>Stop Buying, Rent It!</span>
            </button>
          </div>

          {/* Secondary action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <button
              className="flex items-center space-x-3 bg-[#1A97A9] text-white px-6 py-3 rounded-full font-medium hover:bg-[#166a78] transition-all duration-200 shadow-md hover:shadow-lg"
              onClick={() => setShowModal(true)}
            >
              <Calendar className="w-5 h-5" />
              <span>Check Available Rentals</span>
            </button>
            <button
              className="flex items-center space-x-3 bg-white text-[#1A97A9] px-6 py-3 rounded-full font-medium hover:bg-[#1A97A9] hover:text-white transition-all duration-200 shadow-md hover:shadow-lg border border-teal-200"
              onClick={() => navigate('/equipments')}
            >
              <Search className="w-5 h-5" />
              <span>Browse All Equipment</span>
            </button>
          </div>

          {/* Modal for Check Available Rentals */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-0 relative animate-fade-in flex flex-col md:flex-row overflow-hidden max-h-[80vh] overflow-y-auto">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
                {/* Left Column */}
                <div className="flex-1 p-2 flex flex-col justify-between min-w-[260px]">
                  <div>
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-teal-600" />
                      Select your Dates and time
                    </h2>
                    
                      <div className="mb-2">
                        <label className="block text-xs font-semibold mb-1">Pickup Date & Time <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="relative">
                            <input
                              type="text"
                              value={pickupDate ? format(pickupDate, 'EEEE, MMM d, yyyy') : ''}
                              onFocus={() => setActiveField('pickup')}
                              readOnly
                              placeholder="Select pickup date"
                              className={`w-full border rounded-lg px-3 py-2 text-sm cursor-pointer bg-white pr-10 ${activeField === 'pickup' ? 'ring-2 ring-teal-500 border-teal-500' : ''}`}
                            />
                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          </div>
                          <div className="relative">
                          <select
  value={returnTime}
  onChange={(e) => setReturnTime(e.target.value)}
  className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
>
  {Array.from({ length: 29 }, (_, i) => {
    const totalMinutes = 8 * 60 + i * 30;
    const hour24 = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const period = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    const displayTime = `${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
    const valueTime = `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    return (
      <option key={`return-${valueTime}`} value={valueTime}>
        {displayTime}
      </option>
    );
  })}
</select>

                          </div>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span>Pickup available: 8:00 am - 10:00 pm</span>
                        </div>
                      </div>
                      <div className="mb-2">
                      <div className="mb-2">
                        <label className="block text-xs font-semibold mb-1">Return Date & Time <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="relative">
                            <input
                              type="text"
                              value={returnDate ? format(returnDate, 'EEEE, MMM d, yyyy') : ''}
                              onFocus={() => setActiveField('return')}
                              readOnly
                              placeholder="Select return date"
                              className={`w-full border rounded-lg px-3 py-2 text-sm cursor-pointer bg-white pr-10 ${activeField === 'return' ? 'ring-2 ring-teal-500 border-teal-500' : ''}`}
                            />
                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          </div>
                          <div className="relative">
                          <select
  value={returnTime}
  onChange={(e) => setReturnTime(e.target.value)}
  className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
>
  {Array.from({ length: 29 }, (_, i) => {
    const totalMinutes = 8 * 60 + i * 30;
    const hour24 = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const period = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    const displayTime = `${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
    const valueTime = `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    return (
      <option key={`return-${valueTime}`} value={valueTime}>
        {displayTime}
      </option>
    );
  })}
</select>


                          </div>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span>Return before:  8:00 am - 10:00 pm</span>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold mb-2 text-sm text-gray-700">Your Rental Period</div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-3xl font-mono font-bold bg-white rounded-lg px-3 py-2 shadow-inner border border-gray-200">
                          {days}
                        </div>
                        <div className="text-base text-gray-700">
                          {days === 1 ? 'Day' : 'Days'}
                          {isDateSelected && (
                            <div className="text-xs text-teal-600 font-medium flex items-center mt-1">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Valid selection
                            </div>
                          )}
                        </div>
                      </div>
                      {dateError && (
                        <div className="text-xs text-red-500 flex items-start gap-1 mt-1">
                          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>{dateError}</span>
                        </div>
                      )}
                    </div>
                    <div className="bg-gray-900 text-lime-300 rounded-lg p-2 mb-2">
                      <div className="font-bold text-base mb-1 flex items-center gap-2">
                        <span className="inline-block bg-lime-400 text-gray-900 rounded-full px-2 py-1 text-xs font-bold mr-2">!</span>
                        How to select dates?
                      </div>
                      
                      <ol className="list-decimal pl-5 text-white text-xs space-y-0.5">
  <li>22-hour rental cycle (e.g., pick up at 10 AM, return by 8 AM next day).</li>
  <li>Longer rentals mean lower daily rates—plan based on your shoot schedule.</li>
  <li>Delivery and return days are free—choose dates accordingly.</li>
</ol>




                    </div>
                  </div>
                  <button
                    className={`w-full font-semibold py-3 rounded-lg text-base transition-all duration-200 ${
                      isDateSelected && !dateError
                        ? 'bg-teal-600 text-white hover:bg-teal-700 cursor-pointer transform hover:scale-[1.02] shadow-md'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!isDateSelected || !!dateError}
                    onClick={() => {
                      const handleContinue = () => {
                        if (days > 0 && isDateSelected && !dateError) {
                          setRentalDays(days);
                          setShowModal(false);
                          navigate(`/equipments?rentalDays=${days}`);
                        }
                      };
                      handleContinue();
                    }}
                  >
                    {isDateSelected ? (
                      <span className="flex items-center justify-center">
                        <span>Continue with {days} {days === 1 ? 'Day' : 'Days'}</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    ) : (
                      'Select Dates to Continue'
                    )}
                  </button>
                </div>
                {/* Right Column: Inline Calendar */}
                <div className="flex-1 bg-white p-5 flex flex-col items-center justify-center min-w-[300px] border-l border-gray-200">
                  <div className="w-full max-w-xs">
                    <DatePicker
                      inline
                      selected={activeField === 'pickup' ? pickupDate : returnDate}
                      onChange={date => {
                        if (activeField === 'return') {
                          setReturnDate(date);
                          setActiveField('pickup');
                        } else {
                          setPickupDate(date);
                          setActiveField('return');
                        }
                      }}
                      selectsStart={activeField === 'return'}
                      selectsEnd={activeField === 'pickup'}
                      startDate={returnDate}
                      endDate={pickupDate}
                      minDate={new Date()}
                      maxDate={addDays(new Date(), 90)}
                      dateFormat="MMMM d, yyyy"
                      calendarClassName="border-0 shadow-none"
                      dayClassName={date => {
                        if (returnDate && pickupDate && date >= returnDate && date <= pickupDate) {
                          return 'bg-teal-100 text-teal-900';
                        }
                        return '';
                      }}
                      renderDayContents={(day, date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const isPast = date < today;
                        return (
                          <div className={`day-wrapper ${isPast ? 'text-gray-300' : ''}`}>
                            {date.getDate()}
                          </div>
                        );
                      }}
                    />
                    <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-teal-600 rounded-sm mr-1"></div>
                        <span>Selected Range</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-white border border-gray-200 rounded-sm mr-1"></div>
                        <span>Available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Category cards */}
          {/* Brand Logos Carousel */}
          <div className="bg-white rounded-2xl shadow p-6 max-w-5xl mx-auto my-12">
            <Slider
              dots={false}
              infinite={true}
              speed={3000}
              slidesToShow={4}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={0}
              cssEase="linear"
              pauseOnHover={false}
              arrows={false}
              variableWidth={false}
              centerMode={false}
              className="brand-carousel"
              responsive={[
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 3,
                    speed: 1800,
                  }
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 2,
                    speed: 1600,
                  }
                },
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 1,
                    speed: 1400,
                  }
                }
              ]}
            ><div className="flex justify-center items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg" alt="Sony - Premium camera equipment brand" className="h-12 w-auto object-contain mx-auto" />
          </div>
          <div className="flex justify-center items-center">
            <img src="data:image/png;base64,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" alt="insta 360  - Professional camera and equipment brand" className="h-12 w-auto object-contain mx-auto" />
          </div>
          <div className="flex justify-center items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/79/Godox_Logo.png" alt="Godox - Professional lighting equipment brand" className="h-12 w-auto object-contain mx-auto" />
          </div>
          <div className="flex justify-center items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/DJI_Innovations_logo.svg" alt="DJI - Professional drone and camera equipment brand" className="h-12 w-auto object-contain mx-auto" />
          </div>
          <div className="flex justify-center items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f3/Nikon_Logo.svg" alt="Nikon - Professional camera and lens manufacturer" className="h-12 w-auto object-contain mx-auto" />
          </div>
          <div className="flex justify-center items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/8d/Canon_logo.svg" alt="Canon - Professional photography and imaging equipment" className="h-12 w-auto object-contain mx-auto" />
          </div>
          <div className="flex justify-center items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Go_Pro_FMR.png" alt="GoPro - Action camera and accessories" className="h-12 w-auto object-contain mx-auto" />
          </div>
          </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CameraRentalHero;