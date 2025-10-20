import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export default function ModernUIPack() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-gray-800 text-white flex flex-col items-center justify-center gap-10 p-10">
      {/* Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 w-full max-w-sm shadow-2xl"
      >
        <h2 className="text-2xl font-semibold mb-4">Glassmorphism Login</h2>
        <Input placeholder="Email" className="mb-3 bg-white/20 border-none placeholder:text-gray-200" />
        <Input placeholder="Password" type="password" className="mb-4 bg-white/20 border-none placeholder:text-gray-200" />
        <Button className="w-full bg-indigo-500 hover:bg-indigo-400 transition-all">Login</Button>
      </motion.div>

      {/* Neumorphic Toggle */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 p-6 rounded-3xl shadow-[8px_8px_16px_#0f0f0f,_-8px_-8px_16px_#2b2b2b] flex items-center gap-4"
      >
        <span>Dark Mode</span>
        <Switch />
      </motion.div>

      {/* Animated Product Card */}
      <Card className="max-w-sm rounded-3xl overflow-hidden shadow-2xl">
        <CardHeader>
          <CardTitle>AI Smart Speaker</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.img
            src="https://images.unsplash.com/photo-1585386959984-a41552231693"
            alt="AI Speaker"
            className="rounded-2xl mb-3"
            whileHover={{ scale: 1.05 }}
          />
          <p className="text-sm text-gray-300 mb-3">Voice controlled, wireless, and elegant.</p>
          <Button className="bg-pink-500 hover:bg-pink-400 transition-all w-full">Add to Cart</Button>
        </CardContent>
      </Card>
    </div>
  );
}