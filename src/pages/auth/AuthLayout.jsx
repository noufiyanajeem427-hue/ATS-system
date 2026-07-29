import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">HR</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">HR Module</h1>
                <p className="text-sm text-gray-500">AI-Powered Recruitment Platform</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600">🤖</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI-Powered Screening</h3>
                  <p className="text-sm text-gray-600">Automatically parse and rank candidates</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-secondary-600">📊</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Smart Analytics</h3>
                  <p className="text-sm text-gray-600">Real-time hiring metrics and insights</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600">⚡</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Streamlined Workflow</h3>
                  <p className="text-sm text-gray-600">End-to-end recruitment lifecycle</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-primary-50 rounded-xl">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">✨ New:</span> AI-powered candidate ranking now available!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Auth Forms */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;