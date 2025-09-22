import React from 'react';
import { motion } from 'framer-motion';
import {
<<<<<<< HEAD
  FileText,
  Truck,
  Navigation,
  CheckCircle,
  Clock,
  MessageSquare,
  AlertTriangle,
  MapPin
} from 'lucide-react';
=======
  DocumentTextIcon,
  TruckIcon,
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid,
  ClockIcon as ClockIconSolid
} from '@heroicons/react/24/solid';
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  timestamp?: string;
  icon: React.ComponentType<any>;
}

interface LoadTimelineProps {
  currentStatus: string;
  loadingDate: string;
  onStatusChange: (status: string) => void;
  onSendMessage: () => void;
<<<<<<< HEAD
  canUpdateStatus?: boolean;
  userRole?: string;
=======
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
}

export const LoadTimeline: React.FC<LoadTimelineProps> = ({
  currentStatus,
  loadingDate,
  onStatusChange,
<<<<<<< HEAD
  onSendMessage,
  canUpdateStatus = false,
  userRole = 'load_provider'
=======
  onSendMessage
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
}) => {
  const getTimelineSteps = (): TimelineStep[] => {
    const steps = [
      {
        id: 'posted',
        title: 'Load Posted',
<<<<<<< HEAD
        description: 'Load has been posted and is available for bidding',
        status: 'completed' as const,
        icon: FileText,
=======
        description: 'Load has been posted and is available for applications',
        status: 'completed' as const,
        icon: DocumentTextIcon,
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
        timestamp: new Date().toISOString()
      },
      {
        id: 'assigned',
        title: 'Vehicle Assigned',
        description: 'A vehicle has been assigned to this load',
<<<<<<< HEAD
        status: currentStatus === 'posted' ? 'pending' as const : 
               currentStatus === 'assigned' ? 'current' as const : 'completed' as const,
        icon: Truck,
=======
        status: currentStatus === 'posted' ? 'pending' as const : 'completed' as const,
        icon: TruckIcon,
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
        timestamp: currentStatus !== 'posted' ? new Date().toISOString() : undefined
      },
      {
        id: 'enroute',
<<<<<<< HEAD
        title: 'En Route to Pickup',
        description: 'Vehicle is on the way to pickup location',
        status: ['posted', 'assigned'].includes(currentStatus) ? 'pending' as const : 
               currentStatus === 'enroute' ? 'current' as const : 'completed' as const,
        icon: Navigation,
=======
        title: 'En Route',
        description: 'Vehicle is on the way to pickup location',
        status: ['posted', 'assigned'].includes(currentStatus) ? 'pending' as const : 
               currentStatus === 'enroute' ? 'current' as const : 'completed' as const,
        icon: MapPinIcon,
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
        timestamp: !['posted', 'assigned', 'enroute'].includes(currentStatus) ? new Date().toISOString() : undefined
      },
      {
        id: 'delivered',
        title: 'Delivered',
        description: 'Load has been delivered to destination',
        status: ['posted', 'assigned', 'enroute'].includes(currentStatus) ? 'pending' as const :
               currentStatus === 'delivered' ? 'current' as const : 'completed' as const,
<<<<<<< HEAD
        icon: MapPin,
=======
        icon: CheckCircleIcon,
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
        timestamp: currentStatus === 'completed' ? new Date().toISOString() : undefined
      },
      {
        id: 'completed',
        title: 'Completed',
        description: 'Load delivery confirmed and payment processed',
        status: currentStatus === 'completed' ? 'completed' as const : 'pending' as const,
<<<<<<< HEAD
        icon: CheckCircle,
=======
        icon: CheckCircleIcon,
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
        timestamp: currentStatus === 'completed' ? new Date().toISOString() : undefined
      }
    ];

    return steps;
  };

  const steps = getTimelineSteps();

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-600 bg-emerald-100 border-emerald-200';
      case 'current': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'pending': return 'text-slate-400 bg-slate-100 border-slate-200';
      default: return 'text-slate-400 bg-slate-100 border-slate-200';
    }
  };

  const getConnectorColor = (index: number) => {
    const currentStep = steps[index];
<<<<<<< HEAD
=======
    const nextStep = steps[index + 1];
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
    
    if (currentStep.status === 'completed') {
      return 'bg-emerald-400';
    } else if (currentStep.status === 'current') {
      return 'bg-gradient-to-b from-emerald-400 to-slate-300';
    }
    return 'bg-slate-300';
  };

<<<<<<< HEAD
  const getNextStatus = (currentId: string) => {
    const statusFlow = {
      'assigned': 'enroute',
      'enroute': 'delivered',
      'delivered': 'completed'
    };
    return statusFlow[currentId as keyof typeof statusFlow];
  };

  const getActionButtonText = (stepId: string) => {
    switch (stepId) {
      case 'assigned': return 'Start Journey';
      case 'enroute': return 'Mark Delivered';
      case 'delivered': return 'Complete Load';
      default: return 'Update Status';
    }
  };

  const getActionButtonColor = (stepId: string) => {
    switch (stepId) {
      case 'assigned': return 'bg-blue-600 hover:bg-blue-700';
      case 'enroute': return 'bg-purple-600 hover:bg-purple-700';
      case 'delivered': return 'bg-emerald-600 hover:bg-emerald-700';
      default: return 'bg-slate-600 hover:bg-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Load Progress Timeline</h3>
          <p className="text-sm text-slate-600 mt-1">
            Track the progress of your load from posting to completion
          </p>
        </div>
=======
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Load Progress</h3>
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
        <button
          onClick={onSendMessage}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
<<<<<<< HEAD
          <MessageSquare className="h-4 w-4" />
          <span className="text-sm font-medium">
            {userRole === 'load_provider' ? 'Message Vehicle Owner' : 'Message Load Provider'}
          </span>
        </button>
      </div>

      {/* Permission Notice for Vehicle Owners */}
      {userRole === 'vehicle_owner' && !canUpdateStatus && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              You can update the load status once a vehicle is assigned to this load.
            </p>
          </div>
        </div>
      )}

=======
          <ChatBubbleLeftRightIcon className="h-4 w-4" />
          <span className="text-sm font-medium">Message Provider</span>
        </button>
      </div>

>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
      <div className="relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;
<<<<<<< HEAD
          const nextStatus = getNextStatus(step.id);
=======
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
          
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start"
            >
              {/* Connector Line */}
              {!isLast && (
<<<<<<< HEAD
                <div className="absolute left-6 top-12 w-0.5 h-20 -ml-px">
=======
                <div className="absolute left-6 top-12 w-0.5 h-16 -ml-px">
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
                  <div className={`w-full h-full ${getConnectorColor(index)} transition-all duration-500`}></div>
                </div>
              )}

              {/* Step Icon */}
              <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${getStepColor(step.status)} transition-all duration-300`}>
                {step.status === 'completed' ? (
<<<<<<< HEAD
                  <CheckCircle className="h-6 w-6" />
                ) : step.status === 'current' ? (
                  <Clock className="h-6 w-6 animate-pulse" />
=======
                  <CheckCircleIconSolid className="h-6 w-6" />
                ) : step.status === 'current' ? (
                  <ClockIconSolid className="h-6 w-6 animate-pulse" />
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
                ) : (
                  <Icon className="h-6 w-6" />
                )}
              </div>

              {/* Step Content */}
              <div className="ml-6 pb-8 flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold ${
                    step.status === 'completed' ? 'text-emerald-800' :
                    step.status === 'current' ? 'text-blue-800' :
                    'text-slate-500'
                  }`}>
                    {step.title}
                  </h4>
                  {step.timestamp && (
                    <span className="text-xs text-slate-500">
<<<<<<< HEAD
                      {new Date(step.timestamp).toLocaleDateString()} {new Date(step.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                <p className={`text-sm mb-3 ${
=======
                      {new Date(step.timestamp).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className={`text-sm ${
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
                  step.status === 'pending' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {step.description}
                </p>

<<<<<<< HEAD
                {/* Status-specific Information */}
                {step.status === 'current' && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Current Status</span>
                    </div>
                    <p className="text-xs text-blue-700">
                      {step.id === 'assigned' && 'Vehicle owner should start the journey to pickup location'}
                      {step.id === 'enroute' && 'Vehicle is traveling to pickup/delivery location'}
                      {step.id === 'delivered' && 'Load has been delivered, awaiting confirmation'}
                    </p>
                  </div>
                )}

                {/* Action Buttons for Vehicle Owners */}
                {step.status === 'current' && 
                 canUpdateStatus && 
                 userRole === 'vehicle_owner' && 
                 nextStatus && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onStatusChange(nextStatus)}
                      className={`px-4 py-2 text-white text-sm rounded-lg transition-colors ${getActionButtonColor(step.id)}`}
                    >
                      {getActionButtonText(step.id)}
                    </button>
                  </div>
                )}

                {/* Information for Load Providers */}
                {step.status === 'current' && userRole === 'load_provider' && (
                  <div className="text-xs text-slate-500">
                    Waiting for vehicle owner to update status...
=======
                {/* Action Buttons for Current Step */}
                {step.status === 'current' && step.id !== 'posted' && (
                  <div className="mt-3 flex space-x-2">
                    {step.id === 'assigned' && (
                      <button
                        onClick={() => onStatusChange('enroute')}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Mark En Route
                      </button>
                    )}
                    {step.id === 'enroute' && (
                      <button
                        onClick={() => onStatusChange('delivered')}
                        className="px-3 py-1 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Mark Delivered
                      </button>
                    )}
                    {step.id === 'delivered' && (
                      <button
                        onClick={() => onStatusChange('completed')}
                        className="px-3 py-1 bg-slate-600 text-white text-xs rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        Mark Completed
                      </button>
                    )}
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Overall Progress</span>
          <span className="text-sm text-slate-600">
            {Math.round((steps.filter(s => s.status === 'completed').length / steps.length) * 100)}%
          </span>
        </div>
<<<<<<< HEAD
        <div className="w-full bg-slate-200 rounded-full h-3">
=======
        <div className="w-full bg-slate-200 rounded-full h-2">
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: `${(steps.filter(s => s.status === 'completed').length / steps.length) * 100}%` 
            }}
            transition={{ duration: 1, ease: "easeOut" }}
<<<<<<< HEAD
            className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          </motion.div>
        </div>
      </div>

      {/* Load Summary */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-600">Expected Loading</p>
            <p className="font-semibold text-slate-900">
              {new Date(loadingDate).toLocaleDateString()}
            </p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-600">Current Status</p>
            <p className="font-semibold text-slate-900 capitalize">{currentStatus}</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-600">Progress</p>
            <p className="font-semibold text-slate-900">
              {steps.filter(s => s.status === 'completed').length}/{steps.length} Steps
            </p>
          </div>
=======
            className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full"
          />
>>>>>>> 17500d54e634740c8c7d5455bf576f6c41b42ed1
        </div>
      </div>
    </div>
  );
};