import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { TruckIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/CustomButton';
import { Input } from '../../components/common/CustomInput';
import toast from 'react-hot-toast';
import logo from '../../assets/logo.png'

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            className="mx-auto   flex items-center justify-center shadow-xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img src={logo} alt="XBOW" className='h-20 w-50'  />
          </motion.div>
          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">XBOW</span>
          </h2>
          <p className="mt-2 text-lg text-slate-600">
            Sign in to your logistics account
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Enter your email"
              leftIcon={<EnvelopeIcon className="w-5 h-5" />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              leftIcon={<LockClosedIcon className="w-5 h-5" />}
              required
            />

            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
              className="mt-8"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>

        
        </motion.div>
      </div>
    </div>
  );
};