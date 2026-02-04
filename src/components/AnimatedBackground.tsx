import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" style={{ background: '#f8fafc', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
      {/* Primary animated gradient */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '60%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
        }}
      />

      {/* Secondary animated gradient */}
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          position: 'absolute',
          bottom: '0%',
          right: '0%',
          width: '50%',
          height: '50%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
        }}
      />

      {/* Floating particles/blobs */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: 'absolute',
          top: '40%',
          right: '15%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.04) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
        }}
      />

      {/* Modern Particles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              opacity: Math.random() * 0.3,
              scale: Math.random() * 0.4 + 0.3
            }}
            animate={{ 
              y: [null, (Math.random() * -80 - 40) + 'px'],
              opacity: [null, 0]
            }}
            transition={{ 
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
            style={{
              position: 'absolute',
              width: '3px',
              height: '3px',
              background: '#10b981',
              borderRadius: '50%',
              opacity: 0.1
            }}
          />
        ))}
      </div>
      
      {/* Subtle Noise texture overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.015,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        pointerEvents: 'none',
      }} />
    </div>
  );
};

export default AnimatedBackground;
