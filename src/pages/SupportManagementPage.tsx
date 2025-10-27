import { useState } from 'react';
import { motion } from 'framer-motion';
import { SupportTicketManagement } from '@/components/admin/SupportTicketManagement';
import { SupportTicketDetail } from '@/components/admin/SupportTicketDetail';
import { CreateSupportTicketModal } from '@/components/admin/CreateSupportTicketModal';
import type { SupportTicket } from '@/types/support';

export function SupportManagementPage() {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
  };

  const handleBackToList = () => {
    setSelectedTicket(null);
  };

  const handleCreateTicket = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  if (selectedTicket) {
    return (
      <SupportTicketDetail
        ticketId={selectedTicket.id}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SupportTicketManagement
            onViewTicket={handleViewTicket}
            onCreateTicket={handleCreateTicket}
          />
        </motion.div>
      </div>

      {showCreateModal && (
        <CreateSupportTicketModal
          onClose={handleCloseCreateModal}
        />
      )}
    </div>
  );
}