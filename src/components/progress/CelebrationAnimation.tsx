import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Star, Trophy, Sparkles } from 'lucide-react';

interface CelebrationAnimationProps {
  isVisible: boolean;
  type: 'milestone' | 'goal_completed' | 'contribution';
  message: string;
  onComplete?: () => void;
}

export function CelebrationAnimation({ 
  isVisible, 
  type, 
  message, 
  onComplete 
}: CelebrationAnimationProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  const getIcon = () => {
    switch (type) {
      case 'milestone':
        return <Trophy className="h-16 w-16 text-pastel-yellow" />;
      case 'goal_completed':
        return <CheckCircle className="h-16 w-16 text-mint-green" />;
      case 'contribution':
        return <Star className="h-16 w-16 text-pale-lavender" />;
      default:
        return <Sparkles className="h-16 w-16 text-pastel-yellow" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'milestone':
        return ['#FFE9A7', '#B9F5D0', '#E2D7FB'];
      case 'goal_completed':
        return ['#B9F5D0', '#A7F3D0', '#ECFDF5'];
      case 'contribution':
        return ['#E2D7FB', '#C4B5FD', '#F7E1F5'];
      default:
        return ['#FFE9A7', '#B9F5D0', '#E2D7FB'];
    }
  };

  const colors = getColors();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          {/* Confetti */}
          {showConfetti && (
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: colors[i % colors.length],
                    left: `${Math.random() * 100}%`,
                    top: '0%',
                  }}
                  initial={{ y: -10, rotate: 0 }}
                  animate={{
                    y: window.innerHeight + 10,
                    rotate: 360,
                    x: (Math.random() - 0.5) * 200,
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    delay: Math.random() * 0.5,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}

          {/* Main celebration content */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md mx-4"
          >
            {/* Icon with pulsing animation */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: 2,
                ease: "easeInOut",
              }}
              className="mb-4"
            >
              {getIcon()}
            </motion.div>

            {/* Message */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-text-primary mb-2"
            >
              {type === 'milestone' && '🎉 Milestone Achieved!'}
              {type === 'goal_completed' && '🏆 Goal Completed!'}
              {type === 'contribution' && '✨ Great Contribution!'}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-text-secondary mb-6"
            >
              {message}
            </motion.p>

            {/* Sparkle effects */}
            <div className="relative">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-pastel-yellow rounded-full"
                  style={{
                    left: `${20 + i * 10}%`,
                    top: '50%',
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.5 + i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                />
              ))}
            </div>

            {/* Progress bar animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6"
            >
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-mint-green to-light-mint h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}