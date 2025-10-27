import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useExportTransactions } from '@/hooks/useTransactions';
import type { ExportOptions } from '@/types/transaction';

const exportSchema = z.object({
  format: z.enum(['csv', 'pdf']),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
});

type ExportFormData = z.infer<typeof exportSchema>;

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters?: {
    date_from?: string;
    date_to?: string;
    goal_id?: string;
    contributor_id?: string;
    type?: string;
    status?: string;
  };
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  currentFilters = {},
}) => {
  const exportMutation = useExportTransactions();

  const { register, handleSubmit, watch, setValue } = useForm<ExportFormData>({
    resolver: zodResolver(exportSchema),
    defaultValues: {
      format: 'csv',
      date_from: currentFilters.date_from || '',
      date_to: currentFilters.date_to || '',
    },
  });

  const watchedFormat = watch('format');

  const onSubmit = (data: ExportFormData) => {
    const exportOptions: ExportOptions = {
      format: data.format,
      ...(data.date_from && { date_from: data.date_from }),
      ...(data.date_to && { date_to: data.date_to }),
      ...(currentFilters.goal_id && { goal_id: currentFilters.goal_id }),
      ...(currentFilters.contributor_id && { contributor_id: currentFilters.contributor_id }),
      ...(currentFilters.type && { type: currentFilters.type as any }),
      ...(currentFilters.status && { status: currentFilters.status as any }),
    };

    exportMutation.mutate(exportOptions, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-mint-green" />
            Export Transactions
          </DialogTitle>
        </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Export Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setValue('format', 'csv')}
                    className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                      watchedFormat === 'csv'
                        ? 'border-mint-green bg-mint-green/10'
                        : 'border-border hover:border-mint-green/50'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <FileSpreadsheet className="h-6 w-6 text-mint-green" />
                      <span className="text-sm font-medium">CSV</span>
                      <span className="text-xs text-muted-foreground">Spreadsheet</span>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setValue('format', 'pdf')}
                    className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                      watchedFormat === 'pdf'
                        ? 'border-mint-green bg-mint-green/10'
                        : 'border-border hover:border-mint-green/50'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <FileText className="h-6 w-6 text-mint-green" />
                      <span className="text-sm font-medium">PDF</span>
                      <span className="text-xs text-muted-foreground">Document</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    From Date
                  </label>
                  <Input
                    {...register('date_from')}
                    type="date"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    To Date
                  </label>
                  <Input
                    {...register('date_to')}
                    type="date"
                    className="w-full"
                  />
                </div>
              </div>

              {Object.keys(currentFilters).length > 0 && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Current filters will be applied:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentFilters.goal_id && (
                      <span className="px-2 py-1 bg-mint-green/20 text-mint-green text-xs rounded-full">
                        Goal Filter
                      </span>
                    )}
                    {currentFilters.contributor_id && (
                      <span className="px-2 py-1 bg-pale-lavender/20 text-pale-lavender text-xs rounded-full">
                        Contributor Filter
                      </span>
                    )}
                    {currentFilters.type && (
                      <span className="px-2 py-1 bg-light-pink/20 text-light-pink text-xs rounded-full">
                        Type Filter
                      </span>
                    )}
                    {currentFilters.status && (
                      <span className="px-2 py-1 bg-pastel-yellow/20 text-pastel-yellow text-xs rounded-full">
                        Status Filter
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={exportMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="btn-primary"
                disabled={exportMutation.isPending}
              >
                {exportMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export {watchedFormat.toUpperCase()}
                  </>
                )}
              </Button>
            </div>
          </form>
      </DialogContent>
    </Dialog>
  );
};