import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Target, 
  X,
  Sparkles
} from 'lucide-react';
import type { GoalType } from '@/types/goal';

interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  type: GoalType;
  icon: string;
  suggestedTarget: number;
  currency: string;
  suggestedMilestones: Array<{
    title: string;
    target_value: number;
    reward?: string;
  }>;
  category: 'popular' | 'family' | 'adventure' | 'home' | 'education';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedDuration: string;
  tags: string[];
}

interface GoalTemplatesProps {
  onSelectTemplate: (template: GoalTemplate) => void;
  onClose: () => void;
}

const templates: GoalTemplate[] = [
  {
    id: 'family-vacation',
    title: 'Family Vacation Fund',
    description: 'Save up for an amazing family vacation together',
    type: 'vacation',
    icon: '🏖️',
    suggestedTarget: 5000,
    currency: 'USD',
    suggestedMilestones: [
      { title: '25% - Book flights', target_value: 1250 },
      { title: '50% - Reserve hotel', target_value: 2500 },
      { title: '75% - Plan activities', target_value: 3750 },
      { title: '100% - Pack and go!', target_value: 5000, reward: 'Family beach day' }
    ],
    category: 'popular',
    difficulty: 'medium',
    estimatedDuration: '6-12 months',
    tags: ['travel', 'family', 'fun']
  },
  {
    id: 'new-pet',
    title: 'Welcome a New Pet',
    description: 'Prepare for bringing home a new family member',
    type: 'pet',
    icon: '🐕',
    suggestedTarget: 2000,
    currency: 'USD',
    suggestedMilestones: [
      { title: '25% - Pet supplies', target_value: 500 },
      { title: '50% - Vet checkup', target_value: 1000 },
      { title: '75% - Training classes', target_value: 1500 },
      { title: '100% - Welcome home!', target_value: 2000, reward: 'Pet naming ceremony' }
    ],
    category: 'family',
    difficulty: 'easy',
    estimatedDuration: '3-6 months',
    tags: ['pets', 'family', 'responsibility']
  },
  {
    id: 'home-renovation',
    title: 'Kitchen Renovation',
    description: 'Transform your kitchen into the heart of your home',
    type: 'home_upgrade',
    icon: '🏠',
    suggestedTarget: 15000,
    currency: 'USD',
    suggestedMilestones: [
      { title: '20% - Design planning', target_value: 3000 },
      { title: '40% - Demolition', target_value: 6000 },
      { title: '60% - New appliances', target_value: 9000 },
      { title: '80% - Installation', target_value: 12000 },
      { title: '100% - Grand reveal', target_value: 15000, reward: 'Family cooking night' }
    ],
    category: 'home',
    difficulty: 'hard',
    estimatedDuration: '12-18 months',
    tags: ['home', 'renovation', 'improvement']
  },
  {
    id: 'college-fund',
    title: 'College Education Fund',
    description: 'Start saving for your child\'s higher education',
    type: 'education',
    icon: '🎓',
    suggestedTarget: 10000,
    currency: 'USD',
    suggestedMilestones: [
      { title: '25% - First semester', target_value: 2500 },
      { title: '50% - First year', target_value: 5000 },
      { title: '75% - Two years', target_value: 7500 },
      { title: '100% - Four years', target_value: 10000, reward: 'Graduation celebration' }
    ],
    category: 'education',
    difficulty: 'hard',
    estimatedDuration: '5-10 years',
    tags: ['education', 'future', 'investment']
  },
  {
    id: 'family-car',
    title: 'New Family Car',
    description: 'Upgrade to a safer, more reliable family vehicle',
    type: 'purchase',
    icon: '🚗',
    suggestedTarget: 25000,
    currency: 'USD',
    suggestedMilestones: [
      { title: '20% - Down payment', target_value: 5000 },
      { title: '40% - Trade-in value', target_value: 10000 },
      { title: '60% - Loan approval', target_value: 15000 },
      { title: '80% - Final payment', target_value: 20000 },
      { title: '100% - Drive home', target_value: 25000, reward: 'Family road trip' }
    ],
    category: 'family',
    difficulty: 'medium',
    estimatedDuration: '12-24 months',
    tags: ['transportation', 'family', 'safety']
  },
  {
    id: 'emergency-fund',
    title: 'Emergency Fund',
    description: 'Build a safety net for unexpected expenses',
    type: 'other',
    icon: '🛡️',
    suggestedTarget: 10000,
    currency: 'USD',
    suggestedMilestones: [
      { title: '25% - $2,500 saved', target_value: 2500 },
      { title: '50% - $5,000 saved', target_value: 5000 },
      { title: '75% - $7,500 saved', target_value: 7500 },
      { title: '100% - $10,000 saved', target_value: 10000, reward: 'Financial security achieved' }
    ],
    category: 'family',
    difficulty: 'medium',
    estimatedDuration: '12-18 months',
    tags: ['savings', 'security', 'financial']
  }
];

const categories = [
  { id: 'all', label: 'All Templates', icon: '🎯' },
  { id: 'popular', label: 'Popular', icon: '⭐' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { id: 'adventure', label: 'Adventure', icon: '🗺️' },
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'education', label: 'Education', icon: '📚' }
];

const difficulties = [
  { id: 'all', label: 'All Levels', color: 'bg-gray-200' },
  { id: 'easy', label: 'Easy', color: 'bg-mint-green' },
  { id: 'medium', label: 'Medium', color: 'bg-pastel-yellow' },
  { id: 'hard', label: 'Hard', color: 'bg-light-pink' }
];

export function GoalTemplates({ onSelectTemplate, onClose }: GoalTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
    const matchesSearch = searchQuery === '' || 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-mint-green text-text-primary';
      case 'medium':
        return 'bg-pastel-yellow text-text-primary';
      case 'hard':
        return 'bg-light-pink text-text-primary';
      default:
        return 'bg-gray-200 text-text-primary';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      CAD: 'C$',
      AUD: 'A$',
      JPY: '¥',
    };
    return `${symbols[currency] || currency} ${amount.toLocaleString()}`;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-text-primary flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-mint-green" />
            Goal Templates
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            Choose from our curated templates to quickly start your family goal
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-mint-green focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-mint-green focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-mint-green focus:border-transparent"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.id} value={difficulty.id}>
                    {difficulty.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="p-6 bg-white shadow-card hover:shadow-card-hover transition-all duration-300 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-mint-tint rounded-full flex items-center justify-center">
                          <span className="text-2xl">{template.icon}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-text-primary">{template.title}</h3>
                          <Badge className={`${getDifficultyColor(template.difficulty)} text-xs`}>
                            {template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                      {template.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Target</span>
                        <span className="font-semibold text-text-primary">
                          {formatCurrency(template.suggestedTarget, template.currency)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Duration</span>
                        <span className="font-medium text-text-primary">{template.estimatedDuration}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Milestones</span>
                        <span className="font-medium text-text-primary">{template.suggestedMilestones.length}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <Button
                      onClick={() => onSelectTemplate(template)}
                      className="w-full bg-mint-green hover:bg-light-mint text-text-primary"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Use This Template
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-pale-lavender rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-12 w-12 text-text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">No Templates Found</h3>
              <p className="text-text-secondary mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
