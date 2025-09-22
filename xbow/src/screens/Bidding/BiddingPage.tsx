import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
import {
  Clock,
  Truck,
  MapPin,
  IndianRupee,
  User,
  CheckCircle,
  Star,
  Calendar,
  Scale
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import { biddingAPI, loadAPI, vehicleAPI } from '../../services/api';
import type { Load, BiddingSession, Bid, Vehicle } from '../../types';
<<<<<<< HEAD
=======
=======
import { 
  ArrowLeftIcon,
  TruckIcon,
  StarIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  PhoneIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  ScaleIcon,
  ClockIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import type { Vehicle, Load } from '../../types/index';
>>>>>>> 1667499bf92cea8b02211dbceb461822a9ce5ec0
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
import { Button } from '../../components/common/CustomButton';
import { Input } from '../../components/common/CustomInput';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
import toast from 'react-hot-toast';

export const BiddingPage: React.FC = () => {
  const { loadId } = useParams<{ loadId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { joinBiddingRoom, leaveBiddingRoom, onNewBid, onBiddingClosed, offNewBid, offBiddingClosed } = useSocket();

  const [load, setLoad] = useState<Load | null>(null);
  const [biddingSession, setBiddingSession] = useState<BiddingSession | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [myVehicles, setMyVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [bidMessage, setBidMessage] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [isPlaceBidModalOpen, setIsPlaceBidModalOpen] = useState(false);
  const [isTransportRequestModalOpen, setIsTransportRequestModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [transportMessage, setTransportMessage] = useState<string>('');
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    if (loadId) {
      fetchData();
    }
  }, [loadId]);

  useEffect(() => {
    if (biddingSession) {
      joinBiddingRoom(biddingSession._id);

      onNewBid(handleNewBid);
      onBiddingClosed(handleBiddingClosed);

      return () => {
        leaveBiddingRoom(biddingSession._id);
        offNewBid();
        offBiddingClosed();
      };
    }
  }, [biddingSession]);

  useEffect(() => {
    if (biddingSession && biddingSession.status === 'active') {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const endTime = new Date(biddingSession.endTime).getTime();
        const remaining = Math.max(0, endTime - now);

        setTimeRemaining(remaining);

        if (remaining === 0) {
          setBiddingSession(prev => prev ? { ...prev, status: 'closed' } : null);
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [biddingSession]);

  const fetchData = async () => {
    if (!loadId) return;

    try {
      setLoading(true);

      const loadResponse = await loadAPI.getLoad(loadId);
      if (loadResponse.data.success) {
        setLoad(loadResponse.data.data);
      }

      const sessionResponse = await biddingAPI.getBiddingSessionByLoad(loadId);
      if (sessionResponse.data.success) {
        setBiddingSession(sessionResponse.data.data);

        const bidsResponse = await biddingAPI.getBidsForSession(sessionResponse.data.data._id);
        if (bidsResponse.data.success) {
          setBids(bidsResponse.data.data);
        }
      }

      if (user?.role === 'vehicle_owner') {
        const vehiclesResponse = await vehicleAPI.getMyVehicles();
        if (vehiclesResponse.data.success) {
          setMyVehicles(vehiclesResponse.data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching bidding data:', error);
      toast.error('Failed to load bidding information');
<<<<<<< HEAD
=======
=======
import { MessageModal } from '../../components/MessageModal';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface MatchedVehicle extends Vehicle {
  bidPrice: number;
  matchScore: number;
  estimatedDeliveryTime: string;
  contactInfo: {
    phone: string;
    email: string;
    whatsapp: string;
  };
  ownerMessage: string;
  distanceFromPickup: number;
}

interface BiddingPageProps {
  load: Load;
  onBack: () => void;
  onVehicleSelect: (vehicleId: string) => void;
}

export const BiddingPage: React.FC<BiddingPageProps> = ({ 
  load, 
  onBack, 
  onVehicleSelect 
}) => {
  const [vehicles, setVehicles] = useState<MatchedVehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<MatchedVehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'distance'>('price');
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  useEffect(() => {
    fetchMatchedVehicles();
  }, [load._id]);

  const fetchMatchedVehicles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/matchVehicles/${load._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch matched vehicles');
      }

      const data = await response.json();
      setVehicles(data.vehicles);
    } catch (error) {
      console.error('Error fetching matched vehicles:', error);
      toast.error('Failed to load matched vehicles');
      
      // Fallback to mock data for demo
      // const mockVehicles: MatchedVehicle[] = [
      //   {
      //     id: '1',
      //     ownerId: 'owner1',
      //     ownerName: 'Rajesh Kumar',
      //     vehicleType: '10-wheel',
      //     vehicleNumber: 'MH12AB1234',
      //     passingLimit: 25,
      //     vehicleSize: 20,
      //     vehicleWeight: 15,
      //     availability: 'immediate',
      //     isOpen: true,
      //     tarpaulin: true,
      //     preferredOperatingArea: {
      //       state: 'Maharashtra',
      //       district: 'Mumbai',
      //       place: 'Andheri'
      //     },
      //     dimensions: { length: 20, width: 8.5 , height: 9 },
      //     trailerType: 'none',
      //     photos: [{ type: 'front', url: 'https://images.pexels.com/photos/1198171/pexels-photo-1198171.jpeg', id: '1' }],
      //     status: 'available',
      //     rating: 4.5,
      //     totalTrips: 150,
      //     isApproved: true,
      //     createdAt: new Date().toISOString(),
      //     bidPrice: 45000,
      //     matchScore: 95,
      //     estimatedDeliveryTime: '2-3 days',
      //     contactInfo: {
      //       phone: '+91 98765 43210',
      //       email: 'rajesh.kumar@email.com',
      //       whatsapp: '919876543210'
      //     },
      //     ownerMessage: 'Experienced driver with 10+ years. Vehicle is well-maintained and ready for immediate dispatch.',
      //     distanceFromPickup: 15
      //   },
      //   {
      //     id: '2',
      //     ownerId: 'owner2',
      //     ownerName: 'Suresh Patel',
      //     vehicleType: '12-wheel',
      //     vehicleNumber: 'GJ05CD5678',
      //     passingLimit: 30,
      //     vehicleSize: 22,
      //     vehicleWeight: 18,
      //     availability: 'today',
      //     isOpen: false,
      //     tarpaulin: false,
      //     preferredOperatingArea: {
      //       state: 'Gujarat',
      //       district: 'Ahmedabad',
      //       place: 'Bopal'
      //     },
      //     dimensions: { length: 22, width: 8.5 , height: 9 },
      //     trailerType: 'lowbed',
      //     photos: [{ type: 'front', url: 'https://images.pexels.com/photos/1198171/pexels-photo-1198171.jpeg', _id: '2' }],
      //     status: 'available',
      //     rating: 4.8,
      //     totalTrips: 200,
      //     isApproved: true,
      //     createdAt: new Date().toISOString(),
      //     bidPrice: 52000,
      //     matchScore: 88,
      //     estimatedDeliveryTime: '1-2 days',
      //     contactInfo: {
      //       phone: '+91 87654 32109',
      //       email: 'suresh.patel@email.com',
      //       whatsapp: '918765432109'
      //     },
      //     ownerMessage: 'Premium service with GPS tracking. Specialized in heavy machinery transport.',
      //     distanceFromPickup: 25
      //   }
      // ];
      // setVehicles(mockVehicles);
>>>>>>> 1667499bf92cea8b02211dbceb461822a9ce5ec0
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
  const handleNewBid = useCallback((newBid: Bid) => {
    setBids(prev => {
      const existingIndex = prev.findIndex(bid => bid._id === newBid._id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newBid;
        return updated.sort((a, b) => b.bidAmount - a.bidAmount);
      } else {
        return [newBid, ...prev].sort((a, b) => b.bidAmount - a.bidAmount);
      }
    });
  }, []);
<<<<<<< HEAD

  const handleBiddingClosed = useCallback((sessionId: string) => {
    if (biddingSession?._id === sessionId) {
      setBiddingSession(prev => prev ? { ...prev, status: 'closed' } : null);
      toast('Bidding session has ended');
    }
  }, [biddingSession]);

=======
=======
  const sortVehicles = (vehicles: MatchedVehicle[], sortType: string) => {
    return [...vehicles].sort((a, b) => {
      switch (sortType) {
        case 'price':
          return b.bidPrice - a.bidPrice; // High to low
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'distance':
          return a.distanceFromPickup - b.distanceFromPickup;
        default:
          return 0;
      }
    });
  };

  const filterVehicles = (vehicles: MatchedVehicle[]) => {
    if (priceFilter === 'all') return vehicles;
    
    const prices = vehicles.map(v => v.bidPrice).sort((a, b) => a - b);
    const low = prices[Math.floor(prices.length * 0.33)];
    const high = prices[Math.floor(prices.length * 0.67)];

    switch (priceFilter) {
      case 'low':
        return vehicles.filter(v => v.bidPrice <= low);
      case 'medium':
        return vehicles.filter(v => v.bidPrice > low && v.bidPrice <= high);
      case 'high':
        return vehicles.filter(v => v.bidPrice > high);
      default:
        return vehicles;
    }
  };
>>>>>>> 1667499bf92cea8b02211dbceb461822a9ce5ec0

  const handleBiddingClosed = useCallback((sessionId: string) => {
    if (biddingSession?._id === sessionId) {
      setBiddingSession(prev => prev ? { ...prev, status: 'closed' } : null);
      toast('Bidding session has ended');
    }
  }, [biddingSession]);

>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
  const handlePlaceBid = async () => {
    if (!biddingSession || !selectedVehicle || !bidAmount) {
      toast.error('Please select a vehicle and enter bid amount');
      return;
    }

    try {
      setPlacing(true);
      const response = await biddingAPI.placeBid(
        biddingSession._id,
        selectedVehicle._id,
        Number(bidAmount),
        bidMessage.trim() || undefined
      );

      if (response.data.success) {
        toast.success('Bid placed successfully!');
        setIsPlaceBidModalOpen(false);
        setBidAmount('');
        setBidMessage('');
        setSelectedVehicle(null);
      }
    } catch (error: any) {
      console.error('Error placing bid:', error);
      toast.error(error.response?.data?.message || 'Failed to place bid');
    } finally {
      setPlacing(false);
    }
  };

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
  const handleSendTransportRequest = async () => {
    if (!selectedBid) return;

    try {
      const response = await biddingAPI.sendTransportRequest(
        selectedBid._id,
        transportMessage.trim() || undefined
      );

      if (response.data.success) {
        toast.success('Transport request sent successfully!');
        setIsTransportRequestModalOpen(false);
        setTransportMessage('');
        setSelectedBid(null);
      }
    } catch (error: any) {
      console.error('Error sending transport request:', error);
      toast.error(error.response?.data?.message || 'Failed to send transport request');
    }
  };

  const formatTimeRemaining = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const canPlaceBid = () => {
    return user?.role === 'vehicle_owner' &&
      biddingSession?.status === 'active' &&
      timeRemaining > 0 &&
      myVehicles.length > 0;
  };

  const canSelectWinner = () => {
    return user?.role === 'load_provider' &&
      user?.id === load?.loadProviderId &&
      biddingSession?.status === 'closed' &&
      bids.length > 0;
  };

  const getMyBid = () => {
    return bids.find(bid => bid.vehicleOwnerId === user?.id);
  };
<<<<<<< HEAD
=======
=======
  const handleContactOwner = (vehicle: MatchedVehicle) => {
    setSelectedVehicle(vehicle);
    setIsMessageModalOpen(true);
  };

  const handleSelectVehicle = (vehicleId: string) => {
    onVehicleSelect(vehicleId);
    toast.success('Vehicle selected successfully!');
  };

  const processedVehicles = filterVehicles(sortVehicles(vehicles, sortBy));
>>>>>>> 1667499bf92cea8b02211dbceb461822a9ce5ec0
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!load || !biddingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Bidding Session Not Found</h2>
          <p className="text-slate-600 mb-4">The bidding session for this load could not be found.</p>
          <Button onClick={() => navigate('/live-bidding')}>
            Back to Live Bidding
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Live Bidding</h1>
              <p className="text-slate-600">
                {load.loadingLocation.place} → {load.unloadingLocation.place}
              </p>
            </div>
            <Button
              onClick={() => navigate('/live-bidding')}
              variant="outline"
            >
              Back to Marketplace
            </Button>
<<<<<<< HEAD
          </div>
        </motion.div>

        {/* Bidding Status & Timer */}
=======
          </div>
        </motion.div>

        {/* Bidding Status & Timer */}
=======
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="ghost"
                icon={<ArrowLeftIcon className="h-5 w-5" />}
              >
                Back to Load
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Vehicle Bidding</h1>
                <p className="text-slate-600">
                  {vehicles.length} vehicles matched for your load • Route: {load.loadingLocation.place} → {load.unloadingLocation.place}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters & Controls */}
>>>>>>> 1667499bf92cea8b02211dbceb461822a9ce5ec0
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
          className={`rounded-2xl shadow-lg border p-6 mb-8 ${biddingSession.status === 'active'
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
              : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
            }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Clock className="h-8 w-8" />
              <div>
                <h2 className="text-xl font-bold">
                  {biddingSession.status === 'active' ? 'Bidding Active' : 'Bidding Closed'}
                </h2>
                <p className="opacity-90">
                  {biddingSession.status === 'active'
                    ? `Ends: ${new Date(biddingSession.endTime).toLocaleString()}`
                    : `Ended: ${new Date(biddingSession.endTime).toLocaleString()}`
                  }
                </p>
                <div className="flex items-center mt-1">
                  <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-300' : 'bg-red-300'}`} />
                  <span className="text-xs opacity-75">
                    {isConnected ? 'Live connection' : 'Disconnected'}
                  </span>
                </div>
              </div>
            </div>

            {biddingSession.status === 'active' && (
              <div className="text-right">
                <div className="text-3xl font-bold font-mono">
                  {formatTimeRemaining(timeRemaining)}
                </div>
                <p className="text-sm opacity-90">Time Remaining</p>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Load Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Load Details</h3>

              {/* Route */}
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-slate-900">{load.loadingLocation.place}</span>
                    </div>
                    <p className="text-sm text-slate-600">{load.loadingLocation.state}</p>
<<<<<<< HEAD
                  </div>
                  <Truck className="h-5 w-5 text-slate-400" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      <span className="font-semibold text-slate-900">{load.unloadingLocation.place}</span>
                    </div>
                    <p className="text-sm text-slate-600">{load.unloadingLocation.state}</p>
=======
                  </div>
                  <Truck className="h-5 w-5 text-slate-400" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      <span className="font-semibold text-slate-900">{load.unloadingLocation.place}</span>
                    </div>
                    <p className="text-sm text-slate-600">{load.unloadingLocation.state}</p>
=======
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-slate-700">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'price' | 'rating' | 'distance')}
                  className="px-4 py-2 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none"
                >
                  <option value="price">Price (High to Low)</option>
                  <option value="rating">Rating</option>
                  <option value="distance">Distance</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-slate-700">Price Range:</span>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value as 'all' | 'low' | 'medium' | 'high')}
                  className="px-4 py-2 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">All Prices</option>
                  <option value="low">Budget Friendly</option>
                  <option value="medium">Mid Range</option>
                  <option value="high">Premium</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-slate-600">
              Showing {processedVehicles.length} of {vehicles.length} vehicles
            </div>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { 
              label: 'Total Vehicles', 
              value: vehicles.length, 
              color: 'blue', 
              icon: TruckIcon,
              description: 'Available vehicles'
            },
            { 
              label: 'Average Price', 
              value: `₹${Math.round(vehicles.reduce((sum, v) => sum + v.bidPrice, 0) / vehicles.length).toLocaleString()}`, 
              color: 'emerald', 
              icon: CurrencyRupeeIcon,
              description: 'Market average'
            },
            { 
              label: 'Best Price', 
              value: `₹${Math.min(...vehicles.map(v => v.bidPrice)).toLocaleString()}`, 
              color: 'green', 
              icon: CheckCircleIcon,
              description: 'Lowest bid'
            },
            { 
              label: 'Avg Rating', 
              value: `${(vehicles.reduce((sum, v) => sum + (v.rating || 0), 0) / vehicles.length).toFixed(1)}/5`, 
              color: 'yellow', 
              icon: StarIcon,
              description: 'Service quality'
            }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`h-12 w-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-slate-500 text-xs">{stat.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Vehicles Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {processedVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Vehicle Image with Overlays */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={vehicle.photos[0]?.url || 'https://images.pexels.com/photos/1198171/pexels-photo-1198171.jpeg'}
                    alt={`${vehicle.vehicleType} - ${vehicle.vehicleNumber}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                  
                  {/* Price Badge - Top Right */}
                  <div className="absolute top-4 right-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg backdrop-blur-sm"
                    >
                      ₹{vehicle.bidPrice.toLocaleString()}
                    </motion.div>
                  </div>

                  {/* Availability Badge - Top Left */}
                  <div className="absolute top-4 left-4">
                    <div className={`px-3 py-1 rounded-full border text-xs font-medium backdrop-blur-sm ${getAvailabilityColor(vehicle.availability)}`}>
                      {vehicle.availability.charAt(0).toUpperCase() + vehicle.availability.slice(1)}
                    </div>
                  </div>

                  {/* Match Score - Bottom Left */}
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white bg-opacity-90 backdrop-blur-sm px-3 py-2 rounded-full border border-slate-200">
                      <span className="text-sm font-bold text-slate-700">
                        {vehicle.matchScore}% Match
                      </span>
                    </div>
                  </div>

                  {/* Vehicle Number - Bottom Right */}
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
                      <span className="text-sm font-bold">{vehicle.vehicleNumber}</span>
                    </div>
                  </div>

                  {/* Distance Badge - Bottom Center */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 bg-opacity-90 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                      {vehicle.distanceFromPickup} km away
                    </div>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="p-6">
                  {/* Owner Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{vehicle.ownerName}</h3>
                      <p className="text-sm text-slate-600 flex items-center">
                        <UserIcon className="h-4 w-4 mr-1" />
                        Vehicle Owner
                      </p>
                    </div>
                    <div className="text-right">
                      {renderStars(vehicle.rating)}
                      <p className="text-xs text-slate-600 mt-1">{vehicle.totalTrips} completed trips</p>
                    </div>
                  </div>

                  {/* Contact Information Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-emerald-50 border border-blue-200 rounded-xl p-4 mb-4">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      Contact Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600">Phone:</span>
                        <a 
                          href={`tel:${vehicle.contactInfo.phone}`}
                          className="font-medium text-blue-800 hover:text-blue-900 transition-colors hover:underline"
                        >
                          {vehicle.contactInfo.phone}
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600">Email:</span>
                        <a 
                          href={`mailto:${vehicle.contactInfo.email}`}
                          className="font-medium text-blue-800 hover:text-blue-900 transition-colors hover:underline text-xs"
                        >
                          {vehicle.contactInfo.email}
                        </a>
                      </div>
                      {vehicle.contactInfo.whatsapp && (
                        <div className="flex items-center justify-between">
                          <span className="text-blue-600">WhatsApp:</span>
                          <a 
                            href={`https://wa.me/${vehicle.contactInfo.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-800 hover:text-blue-900 transition-colors hover:underline"
                          >
                            Chat Now
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Specs */}
                  <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <h4 className="font-medium text-slate-900 mb-3 flex items-center">
                      <TruckIcon className="h-4 w-4 mr-2 text-slate-600" />
                      Vehicle Specifications
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-slate-600">Type:</span>
                        <p className="font-semibold text-slate-900">{vehicle.vehicleType}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Size:</span>
                        <p className="font-semibold text-slate-900">{vehicle.vehicleSize} ft</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Capacity:</span>
                        <p className="font-semibold text-slate-900">{vehicle.passingLimit}T</p>
                      </div>
                      <div>
                        <span className="text-slate-600">ETA:</span>
                        <p className="font-semibold text-emerald-600">{vehicle.estimatedDeliveryTime}</p>
                      </div>
                    </div>
                  </div>

                  {/* Owner Message */}
                  {vehicle.ownerMessage && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
                      <h4 className="font-semibold text-emerald-800 mb-2 flex items-center">
                        <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                        Message from Owner
                      </h4>
                      <p className="text-sm text-emerald-700 italic">"{vehicle.ownerMessage}"</p>
                    </div>
                  )}

                  {/* Location */}
                  <div className="flex items-center space-x-2 mb-6">
                    <MapPinIcon className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      {vehicle.preferredOperatingArea.place}, {vehicle.preferredOperatingArea.state}
                    </span>
                    <span className="text-xs text-slate-500">• {vehicle.distanceFromPickup} km from pickup</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setIsModalOpen(true);
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      icon={<EyeIcon className="h-4 w-4" />}
                    >
                      Details
                    </Button>
                    <Button
                      onClick={() => handleContactOwner(vehicle)}
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      icon={<ChatBubbleLeftRightIcon className="h-4 w-4" />}
                    >
                      Message
                    </Button>
                    <Button
                      onClick={() => handleSelectVehicle(vehicle.id)}
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      icon={<CheckCircleIcon className="h-4 w-4" />}
                    >
                      Select
                    </Button>
                  </div>
                </div>

                {/* Premium Footer */}
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Competitive Bid</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm opacity-90">Delivery in {vehicle.estimatedDeliveryTime}</span>
                      <span className="text-xl font-bold">₹{vehicle.bidPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {processedVehicles.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <TruckIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Vehicles Match Your Criteria</h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your filters or check back later for new vehicle listings.
            </p>
            <Button 
              onClick={() => {
                setSortBy('price');
                setPriceFilter('all');
              }}
              variant="outline"
            >
              Reset Filters
            </Button>
          </motion.div>
        )}

        {/* Vehicle Details Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title=""
          size="2xl"
        >
          {selectedVehicle && (
            <div className="space-y-6">
              {/* Header with Vehicle Info */}
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white p-6 -m-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{selectedVehicle.vehicleNumber}</h3>
                    <p className="text-blue-100">
                      {selectedVehicle.vehicleType} • {selectedVehicle.vehicleSize}ft • {selectedVehicle.passingLimit}T capacity
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold mb-1">₹{selectedVehicle.bidPrice.toLocaleString()}</div>
                    <p className="text-blue-100 text-sm">Competitive bid price</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Images Gallery */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-4">Vehicle Photos</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedVehicle.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo.url}
                        alt={photo.type}
                        className="w-full h-32 object-cover rounded-xl border border-slate-200 group-hover:opacity-80 transition-opacity cursor-pointer"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-xl flex items-center justify-center">
                        <EyeIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6" />
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <span className="text-xs bg-black bg-opacity-70 text-white px-2 py-1 rounded text-center block capitalize">
                          {photo.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Owner & Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="font-bold text-blue-800 mb-4 flex items-center">
                    <UserIcon className="h-5 w-5 mr-2" />
                    Owner Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-blue-600 text-sm">Name:</span>
                      <p className="font-semibold text-blue-900 text-lg">{selectedVehicle.ownerName}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 text-sm">Rating:</span>
                      {renderStars(selectedVehicle.rating)}
                    </div>
                    <div>
                      <span className="text-blue-600 text-sm">Experience:</span>
                      <p className="font-medium text-blue-900">{selectedVehicle.totalTrips} completed trips</p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                  <h4 className="font-bold text-emerald-800 mb-4 flex items-center">
                    <PhoneIcon className="h-5 w-5 mr-2" />
                    Contact Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-600 text-sm">Phone:</span>
                      <a 
                        href={`tel:${selectedVehicle.contactInfo.phone}`}
                        className="font-medium text-emerald-800 hover:text-emerald-900 transition-colors hover:underline"
                      >
                        {selectedVehicle.contactInfo.phone}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-600 text-sm">Email:</span>
                      <a 
                        href={`mailto:${selectedVehicle.contactInfo.email}`}
                        className="font-medium text-emerald-800 hover:text-emerald-900 transition-colors hover:underline text-sm"
                      >
                        {selectedVehicle.contactInfo.email}
                      </a>
                    </div>
                    {selectedVehicle.contactInfo.whatsapp && (
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-600 text-sm">WhatsApp:</span>
                        <a 
                          href={`https://wa.me/${selectedVehicle.contactInfo.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-green-600 transition-colors"
                        >
                          Chat Now
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Complete Vehicle Specifications */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h4 className="font-bold text-slate-900 mb-4">Complete Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h5 className="font-semibold text-slate-700 mb-3">Basic Details</h5>
                    <div className="space-y-2 text-sm text-slate-600">
                      <p>Vehicle Number: <span className="font-semibold text-slate-900">{selectedVehicle.vehicleNumber}</span></p>
                      <p>Type: <span className="font-semibold text-slate-900">{selectedVehicle.vehicleType}</span></p>
                      <p>Size: <span className="font-semibold text-slate-900">{selectedVehicle.vehicleSize} ft</span></p>
                      <p>Weight: <span className="font-semibold text-slate-900">{selectedVehicle.vehicleWeight} tons</span></p>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-slate-700 mb-3">Capacity & Dimensions</h5>
                    <div className="space-y-2 text-sm text-slate-600">
                      <p>Length: <span className="font-semibold text-slate-900">{selectedVehicle.dimensions.length} ft</span></p>
                      <p>Breadth: <span className="font-semibold text-slate-900">{selectedVehicle.dimensions.width} ft</span></p>
                      <p>Passing Limit: <span className="font-semibold text-slate-900">{selectedVehicle.passingLimit} tons</span></p>
                      <p>Body Type: <span className="font-semibold text-slate-900">{selectedVehicle.isOpen ? 'Open' : 'Closed'}</span></p>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-slate-700 mb-3">Features & Availability</h5>
                    <div className="space-y-2 text-sm text-slate-600">
                      <p>Tarpaulin: <span className="font-semibold text-slate-900 capitalize">{selectedVehicle.tarpaulin}</span></p>
                      <p>Trailer: <span className="font-semibold text-slate-900 capitalize">{selectedVehicle.trailerType.replace('-', ' ')}</span></p>
                      <p>Availability: <span className="font-semibold text-emerald-600 capitalize">{selectedVehicle.availability}</span></p>
                      <p>Distance: <span className="font-semibold text-blue-600">{selectedVehicle.distanceFromPickup} km</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner Message */}
              {selectedVehicle.ownerMessage && (
                <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 rounded-xl p-6">
                  <h4 className="font-bold text-emerald-800 mb-3 flex items-center">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                    Personal Message from {selectedVehicle.ownerName}
                  </h4>
                  <blockquote className="text-emerald-700 italic text-lg leading-relaxed">
                    "{selectedVehicle.ownerMessage}"
                  </blockquote>
                </div>
              )}

              {/* Final Action Section */}
              <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl p-6 -mx-6 -mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xl mb-2">Ready to Book?</h4>
                    <p className="text-blue-100">
                      Contact {selectedVehicle.ownerName} to finalize the deal at ₹{selectedVehicle.bidPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => window.open(`tel:${selectedVehicle.contactInfo.phone}`)}
                      variant="outline"
                      className="bg-white bg-opacity-20 border-white border-opacity-30 text-white hover:bg-opacity-30"
                      icon={<PhoneIcon className="h-4 w-4" />}
                    >
                      Call Now
                    </Button>
                    <Button
                      onClick={() => handleSelectVehicle(selectedVehicle.id)}
                      className="bg-white text-emerald-600 hover:bg-gray-100"
                      icon={<CheckCircleIcon className="h-4 w-4" />}
                    >
                      Book Vehicle
                    </Button>
>>>>>>> 1667499bf92cea8b02211dbceb461822a9ce5ec0
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
                  </div>
                </div>
              </div>

              {/* Key Details */}
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Vehicle Required</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    {load.vehicleRequirement.size}ft {load.vehicleRequirement.vehicleType}
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Scale className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800">Total Weight</span>
                  </div>
                  <p className="text-sm text-emerald-700">
                    {load.materials?.reduce((sum, material) => sum + material.totalWeight, 0)} kg
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">Loading Date</span>
                  </div>
                  <p className="text-sm text-orange-700">
                    {new Date(load.loadingDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <IndianRupee className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Payment Terms</span>
                  </div>
                  <p className="text-sm text-purple-700 uppercase">{load.paymentTerms}</p>
                </div>
              </div>

              {/* Action Button */}
              {canPlaceBid() && (
                <div className="mt-6">
                  <Button
                    onClick={() => setIsPlaceBidModalOpen(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700"
                    icon={<IndianRupee className="h-4 w-4" />}
                  >
                    {getMyBid() ? 'Update Bid' : 'Place Bid'}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Bidding Table */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  Live Bids ({bids.length})
                </h3>
                {bids.length > 0 && (
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Highest Bid</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      ₹{bids[0]?.bidAmount.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {bids.length === 0 ? (
                <div className="text-center py-12">
                  <IndianRupee className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">No Bids Yet</h4>
                  <p className="text-slate-600">Be the first to place a bid on this load!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {bids.map((bid, index) => (
                      <motion.div
                        key={bid._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className={`border rounded-xl p-4 ${index === 0
                            ? 'border-emerald-200 bg-emerald-50'
                            : bid.vehicleOwnerId === user?.id
                              ? 'border-blue-200 bg-blue-50'
                              : 'border-slate-200 bg-slate-50'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${index === 0 ? 'bg-emerald-100' : 'bg-slate-100'
                              }`}>
                              {index === 0 ? (
                                <Star className="h-5 w-5 text-emerald-600" />
                              ) : (
                                <User className="h-5 w-5 text-slate-600" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900">
                                {bid.vehicleOwnerName}
                                {bid.vehicleOwnerId === user?.id && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                    Your Bid
                                  </span>
                                )}
                              </h4>
                              <p className="text-sm text-slate-600">
                                {new Date(bid.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center space-x-4">
                              <div>
                                <p className={`text-2xl font-bold ${index === 0 ? 'text-emerald-600' : 'text-slate-900'
                                  }`}>
                                  ₹{bid.bidAmount.toLocaleString()}
                                </p>
                                {index === 0 && (
                                  <p className="text-xs text-emerald-600 font-medium">Highest</p>
                                )}
                              </div>

                              {canSelectWinner() && (
                                <Button
                                  onClick={() => {
                                    setSelectedBid(bid);
                                    setIsTransportRequestModalOpen(true);
                                  }}
                                  size="sm"
                                  className="bg-emerald-600 hover:bg-emerald-700"
                                  icon={<CheckCircle className="h-4 w-4" />}
                                >
                                  Select
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>

                        {bid.message && (
                          <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200">
                            <p className="text-sm text-slate-700">"{bid.message}"</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Place Bid Modal */}
        <Modal
          isOpen={isPlaceBidModalOpen}
          onClose={() => setIsPlaceBidModalOpen(false)}
          title="Place Your Bid"
          size="md"
        >
          <div className="space-y-6">
            {/* Vehicle Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Select Vehicle
              </label>
              <div className="grid grid-cols-1 gap-3">
                {myVehicles.map((vehicle) => (
                  <motion.div
                    key={vehicle._id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedVehicle(vehicle)}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedVehicle?._id === vehicle._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900">{vehicle.vehicleNumber}</h4>
                        <p className="text-sm text-slate-600">
                          {vehicle.vehicleType} • {vehicle.vehicleSize}ft • {vehicle.passingLimit}T
                        </p>
                      </div>
                      {selectedVehicle?._id === vehicle._id && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bid Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Bid Amount (₹) *
              </label>
              <Input
                type="number"
                placeholder="Enter your bid amount"
                value={bidAmount}
                onChange={setBidAmount}
              />
              {bids.length > 0 && (
                <p className="text-xs text-slate-500 mt-1">
                  Current highest bid: ₹{bids[0]?.bidAmount.toLocaleString()}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={bidMessage}
                onChange={(e) => setBidMessage(e.target.value)}
                placeholder="Add any additional information..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <Button
                onClick={() => setIsPlaceBidModalOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePlaceBid}
                loading={placing}
                disabled={!selectedVehicle || !bidAmount}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                icon={<IndianRupee className="h-4 w-4" />}
              >
                {getMyBid() ? 'Update Bid' : 'Place Bid'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Transport Request Modal */}
        <Modal
          isOpen={isTransportRequestModalOpen}
          onClose={() => setIsTransportRequestModalOpen(false)}
          title="Send Transport Request"
          size="md"
        >
          {selectedBid && (
            <div className="space-y-6">
              {/* Winner Details */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <Star className="h-8 w-8 text-emerald-600" />
                  <div>
                    <h3 className="font-semibold text-emerald-800">Selected Winner</h3>
                    <p className="text-emerald-700">{selectedBid.vehicleOwnerName}</p>
                    <p className="text-emerald-600 font-bold text-lg">
                      ₹{selectedBid.bidAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Message to Vehicle Owner (Optional)
                </label>
                <textarea
                  value={transportMessage}
                  onChange={(e) => setTransportMessage(e.target.value)}
                  placeholder="Congratulations! You've won the bid. Please confirm your availability..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <Button
                  onClick={() => setIsTransportRequestModalOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendTransportRequest}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  icon={<CheckCircle className="h-4 w-4" />}
                >
                  Send Request
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Message Modal */}
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          loadProviderName={selectedVehicle?.ownerName || ''}
          loadId={load._id}
          onSendMessage={(message) => {
            toast.success('Message sent to vehicle owner!');
            setIsMessageModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};