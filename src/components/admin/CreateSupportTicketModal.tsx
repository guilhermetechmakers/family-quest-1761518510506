import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Paperclip, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateSupportTicket } from '@/hooks/useSupport';
import type { CreateSupportTicketInput } from '@/types/support';

interface CreateSupportTicketModalProps {
  onClose: () => void;
}

export function CreateSupportTicketModal({ onClose }: CreateSupportTicketModalProps) {
  const [formData, setFormData] = useState<CreateSupportTicketInput>({
    subject: '',
    description: '',
    category: 'technical',
    priority: 'medium',
    attachments: [],
  });

  const createTicketMutation = useCreateSupportTicket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.description.trim()) {
      return;
    }

    createTicketMutation.mutate(formData, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: files,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-card-hover"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">Create Support Ticket</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Subject *
              </label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Brief description of the issue"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Category *
              </label>
              <Select
                value={formData.category}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="account">Account</SelectItem>
                  <SelectItem value="feature_request">Feature Request</SelectItem>
                  <SelectItem value="bug_report">Bug Report</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Priority *
            </label>
            <Select
              value={formData.priority}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Description *
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Please provide detailed information about the issue..."
              rows={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Attachments
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                multiple
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button type="button" variant="outline" size="sm">
                <Paperclip className="h-4 w-4 mr-2" />
                Browse
              </Button>
            </div>
            {formData.attachments && formData.attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {formData.attachments?.map((file, index) => (
                  <div key={index} className="text-sm text-text-secondary">
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.subject.trim() || !formData.description.trim() || createTicketMutation.isPending}
              className="bg-mint-green hover:bg-mint-green/90 text-text-primary"
            >
              {createTicketMutation.isPending ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Create Ticket
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}