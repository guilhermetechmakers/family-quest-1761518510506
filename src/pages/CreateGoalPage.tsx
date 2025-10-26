import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GoalWizard } from '@/components/goal-wizard/GoalWizard';
import { ArrowLeft } from 'lucide-react';

export function CreateGoalPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" className="mb-4" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <GoalWizard />
      </div>
    </div>
  );
}