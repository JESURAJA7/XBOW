import React from 'react';
import { motion } from 'framer-motion';
import {
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
}

export const LoadTimeline: React.FC<LoadTimelineProps> = ({
  currentStatus,
  loadingDate,
  onStatusChange,
  onSendMessage
}) => {
  const getTimelineSteps = (): TimelineStep[] => {
    const steps = [
      {
        id: 'posted',
        title: 'Load Posted',
        description: 'Load has been posted and is available for applications',
        status: 'completed' as const,
        icon: DocumentTextIcon,
        timestamp: new Date().toISOString()
      },
      {
        id: 'assigned',
        title: 'Vehicle Assigned',
        description: 'A vehicle has been assigned to this load',
        status: currentStatus === 'posted' ? 'pending' as const : 'completed' as const,
        icon: TruckIcon,
        timestamp: currentStatus !== 'posted' ? new Date().toISOString() : undefined
      },
      {
        id: 'enroute',
        title: 'En Route',
        description: 'Vehicle is on the way to pickup location',
        status: ['posted', 'assigned'].includes(currentStatus) ? 'pending' as const : 
               currentStatus === 'enroute' ? 'current' as const : 'completed' as const,
        icon: MapPinIcon,
        timestamp: !['posted', 'assigned', 'enroute'].includes(currentStatus) ? new Date().toISOString() : undefined
      },
      {
        id: 'delivered',
        title: 'Delivered',
        description: 'Load has been delivered to destination',
        status: ['posted', 'assigned', 'enroute'].includes(currentStatus) ? 'pending' as const :
               currentStatus === 'delivered' ? 'current' as const : 'completed' as const,
        icon: CheckCircleIcon,
        timestamp: currentStatus === 'completed' ? new Date().toISOString() : undefined
      },
      {
        id: 'completed',
        title: 'Completed',
        description: 'Load delivery confirmed and payment processed',
        status: currentStatus === 'completed' ? 'completed' as const : 'pending' as const,
        icon: CheckCircleIcon,
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
    const nextStep = steps[index + 1];
    
    if (currentStep.status === 'completed') {
      return 'bg-emerald-400';
    } else if (currentStep.status === 'current') {
      return 'bg-gradient-to-b from-emerald-400 to-slate-300';
    }
    return 'bg-slate-300';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Load Progress</h3>
        <button
          onClick={onSendMessage}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <ChatBubbleLeftRightIcon className="h-4 w-4" />
          <span className="text-sm font-medium">Message Provider</span>
        </button>
      </div>

      <div className="relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;
          
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
                <div className="absolute left-6 top-12 w-0.5 h-16 -ml-px">
                  <div className={`w-full h-full ${getConnectorColor(index)} transition-all duration-500`}></div>
                </div>
              )}

              {/* Step Icon */}
              <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${getStepColor(step.status)} transition-all duration-300`}>
                {step.status === 'completed' ? (
                  <CheckCircleIconSolid className="h-6 w-6" />
                ) : step.status === 'current' ? (
                  <ClockIconSolid className="h-6 w-6 animate-pulse" />
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
                      {new Date(step.timestamp).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className={`text-sm ${
                  step.status === 'pending' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {step.description}
                </p>

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
        <div className="w-full bg-slate-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: `${(steps.filter(s => s.status === 'completed').length / steps.length) * 100}%` 
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};