import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  FileText, 
  ChevronRight,
  Search,
  Filter,
  Download,
  ExternalLink,
  CheckCircle,
  Clock,
  Users,
  Target,
  CreditCard,
  Shield,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { useFAQs, useFAQCategories, useGuides, useCreateSupportRequest } from '@/hooks/useHelp';

// Form validation schema
const supportRequestSchema = z.object({
  category: z.enum(['general', 'technical', 'billing', 'feature_request', 'bug_report']),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  attachment: z.any().optional(),
});

type SupportRequestForm = z.infer<typeof supportRequestSchema>;

export function AboutHelpPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGuides, setExpandedGuides] = useState<Set<string>>(new Set());

  // Data fetching
  const { data: faqs = [], isLoading: faqsLoading } = useFAQs();
  const { data: faqCategories = [] } = useFAQCategories();
  const { data: guides = [], isLoading: guidesLoading } = useGuides();
  const createSupportRequest = useCreateSupportRequest();

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<SupportRequestForm>({
    resolver: zodResolver(supportRequestSchema),
    defaultValues: {
      category: 'general',
    },
  });

  // Filter FAQs by category and search
  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter guides by search
  const filteredGuides = guides.filter(guide =>
    searchQuery === '' ||
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form submission
  const onSubmit = async (data: SupportRequestForm) => {
    try {
      await createSupportRequest.mutateAsync({
        category: data.category,
        subject: data.subject,
        message: data.message,
        attachment: data.attachment?.[0],
      });
      reset();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  // Toggle guide expansion
  const toggleGuide = (guideId: string) => {
    const newExpanded = new Set(expandedGuides);
    if (newExpanded.has(guideId)) {
      newExpanded.delete(guideId);
    } else {
      newExpanded.add(guideId);
    }
    setExpandedGuides(newExpanded);
  };

  const policyLinks = [
    { name: 'Terms of Service', href: '/terms', icon: FileText },
    { name: 'Privacy Policy', href: '/privacy', icon: Shield },
    { name: 'Cookie Policy', href: '/cookies', icon: FileText },
    { name: 'Refund Policy', href: '/refunds', icon: CreditCard },
  ];

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'support@familyquest.com', href: 'mailto:support@familyquest.com' },
    { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: MapPin, label: 'Address', value: '123 Family Street, Quest City, QC 12345', href: '#' },
  ];

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-2 text-sm text-text-secondary mb-4">
            <Link to="/" className="hover:text-mint-green transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-text-primary">Help & Support</span>
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl">
            Find answers to common questions, learn how to use Family Quest, or get in touch with our support team.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" />
              <Input
                placeholder="Search help articles, guides, and FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>

            {/* FAQ Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary flex items-center">
                  <HelpCircle className="h-6 w-6 mr-3 text-mint-green" />
                  Frequently Asked Questions
                </h2>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-text-tertiary" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {faqCategories.map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          {category.name} ({category.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {faqsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-6 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Accordion type="single" collapsible className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id} className="border-0">
                      <Card className="hover:shadow-card-hover transition-all duration-300">
                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                          <div className="text-left">
                            <h3 className="text-lg font-semibold text-text-primary mb-2">
                              {faq.question}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {faq.category}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                          <div className="prose prose-sm max-w-none">
                            <p className="text-text-secondary leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </AccordionContent>
                      </Card>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}

              {filteredFAQs.length === 0 && !faqsLoading && (
                <Card className="p-8 text-center">
                  <HelpCircle className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    No FAQs found
                  </h3>
                  <p className="text-text-secondary">
                    Try adjusting your search or filter criteria.
                  </p>
                </Card>
              )}
            </section>

            {/* Guides Section */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
                <BookOpen className="h-6 w-6 mr-3 text-pale-lavender" />
                Getting Started Guides
              </h2>

              {guidesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="p-6 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredGuides.map((guide) => (
                    <Card 
                      key={guide.id} 
                      className="p-6 hover:shadow-card-hover transition-all duration-300 cursor-pointer"
                      onClick={() => toggleGuide(guide.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-text-primary">
                          {guide.title}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto"
                        >
                          <ChevronRight 
                            className={`h-4 w-4 transition-transform ${
                              expandedGuides.has(guide.id) ? 'rotate-90' : ''
                            }`} 
                          />
                        </Button>
                      </div>
                      <p className="text-text-secondary mb-4">
                        {guide.description}
                      </p>
                      {expandedGuides.has(guide.id) && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="prose prose-sm max-w-none">
                            <p className="text-text-secondary leading-relaxed">
                              {guide.content || 'Guide content will be loaded here...'}
                            </p>
                          </div>
                          {guide.content_url && (
                            <Button variant="outline" size="sm" className="mt-4">
                              <Download className="h-4 w-4 mr-2" />
                              Download Guide
                            </Button>
                          )}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}

              {filteredGuides.length === 0 && !guidesLoading && (
                <Card className="p-8 text-center">
                  <BookOpen className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    No guides found
                  </h3>
                  <p className="text-text-secondary">
                    Try adjusting your search criteria.
                  </p>
                </Card>
              )}
            </section>

            {/* Contact Support Form */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
                <MessageCircle className="h-6 w-6 mr-3 text-light-pink" />
                Contact Support
              </h2>

              <Card className="p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Category
                      </label>
                      <Select 
                        value={watch('category')} 
                        onValueChange={(value) => setValue('category', value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Question</SelectItem>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="billing">Billing & Payments</SelectItem>
                          <SelectItem value="feature_request">Feature Request</SelectItem>
                          <SelectItem value="bug_report">Bug Report</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Subject
                      </label>
                      <Input
                        {...register('subject')}
                        placeholder="Brief description of your issue"
                        className={errors.subject ? 'border-red-500' : ''}
                      />
                      {errors.subject && (
                        <p className="text-sm text-red-500 mt-1">{errors.subject.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Message
                    </label>
                    <Textarea
                      {...register('message')}
                      placeholder="Please provide as much detail as possible about your question or issue..."
                      rows={6}
                      className={errors.message ? 'border-red-500' : ''}
                    />
                    {errors.message && (
                      <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Attachment (Optional)
                    </label>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                      onChange={(e) => setValue('attachment', e.target.files)}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-mint-green file:text-text-primary hover:file:bg-light-mint"
                    />
                    <p className="text-sm text-text-tertiary mt-1">
                      Supported formats: PDF, DOC, DOCX, TXT, PNG, JPG, JPEG (Max 10MB)
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center text-sm text-text-secondary">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>We typically respond within 24 hours</span>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-8"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </form>
              </Card>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Links */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Quick Links
              </h3>
              <div className="space-y-3">
                <Link 
                  to="/dashboard" 
                  className="flex items-center text-text-secondary hover:text-mint-green transition-colors"
                >
                  <Target className="h-4 w-4 mr-3" />
                  Dashboard
                </Link>
                <Link 
                  to="/goals/create" 
                  className="flex items-center text-text-secondary hover:text-mint-green transition-colors"
                >
                  <Target className="h-4 w-4 mr-3" />
                  Create Goal
                </Link>
                <Link 
                  to="/settings" 
                  className="flex items-center text-text-secondary hover:text-mint-green transition-colors"
                >
                  <Users className="h-4 w-4 mr-3" />
                  Settings
                </Link>
                <Link 
                  to="/transactions" 
                  className="flex items-center text-text-secondary hover:text-mint-green transition-colors"
                >
                  <CreditCard className="h-4 w-4 mr-3" />
                  Transactions
                </Link>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start">
                    <info.icon className="h-5 w-5 text-mint-green mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-text-primary">{info.label}</p>
                      <a 
                        href={info.href}
                        className="text-sm text-text-secondary hover:text-mint-green transition-colors"
                      >
                        {info.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Policy Links */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Legal & Policies
              </h3>
              <div className="space-y-3">
                {policyLinks.map((policy, index) => (
                  <Link
                    key={index}
                    to={policy.href}
                    className="flex items-center text-text-secondary hover:text-mint-green transition-colors"
                  >
                    <policy.icon className="h-4 w-4 mr-3" />
                    {policy.name}
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </Link>
                ))}
              </div>
            </Card>

            {/* Status */}
            <Card className="p-6 bg-mint-tint">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 text-mint-green mr-2" />
                <span className="text-sm font-semibold text-text-primary">All Systems Operational</span>
              </div>
              <p className="text-sm text-text-secondary">
                Our services are running smoothly. No known issues at this time.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}