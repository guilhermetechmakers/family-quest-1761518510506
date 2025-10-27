import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles } from 'lucide-react';

interface CreateGoalButtonProps {
  onCreateGoal?: () => void;
}

export function CreateGoalButton({ onCreateGoal }: CreateGoalButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        onClick={onCreateGoal}
        className="bg-mint-green hover:bg-light-mint text-text-primary px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Plus className="h-5 w-5 mr-2" />
        Create New Goal
        <Sparkles className="h-4 w-4 ml-2" />
      </Button>
    </motion.div>
  );
}
