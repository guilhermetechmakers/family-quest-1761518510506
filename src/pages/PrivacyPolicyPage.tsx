import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Download, 
  Shield, 
  Calendar,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Mail,
  Phone,
  User,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { usePrivacyPolicy, useContactForm, useLogPrivacyView, useDownloadPrivacyPDF } from '@/hooks/usePrivacy';

// Contact form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  inquiry_type: z.enum(['general', 'data_request', 'complaint', 'other'])
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function PrivacyPolicyPage() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  const [showContactForm, setShowContactForm] = useState(false);

  // Hooks
  const { isLoading, error } = usePrivacyPolicy();
  const contactFormMutation = useContactForm();
  const logViewMutation = useLogPrivacyView();
  const downloadPDFMutation = useDownloadPrivacyPDF();

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema)
  });

  // Log page view on mount
  useEffect(() => {
    logViewMutation.mutate();
  }, []);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleContactSubmit = (data: ContactFormData) => {
    contactFormMutation.mutate(data, {
      onSuccess: () => {
        reset();
        setShowContactForm(false);
      }
    });
  };

  const handleDownloadPDF = () => {
    downloadPDFMutation.mutate();
  };

  const handlePrint = () => {
    window.print();
  };

  // Mock data for development - in production this would come from the API
  const mockSections = [
    {
      id: 'overview',
      title: '1. Overview and Information We Collect',
      content: `Family Quest ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our family goal-tracking application.

**Information We Collect:**
- Account information (name, email, family relationships)
- Goal and contribution data
- Payment information (processed securely through Stripe)
- Usage analytics and app interactions
- Device information and technical data
- Communications with our support team

We collect this information to provide, maintain, and improve our Service, process transactions, and communicate with you.`
    },
    {
      id: 'data-usage',
      title: '2. How We Use Your Information',
      content: `We use the information we collect for the following purposes:

**Service Provision:**
- Create and manage family accounts and goal tracking
- Process contributions and payments
- Provide customer support and respond to inquiries
- Send important updates about your account or our Service

**Service Improvement:**
- Analyze usage patterns to improve our application
- Develop new features and functionality
- Conduct research and analytics
- Monitor and prevent fraud and abuse

**Communication:**
- Send notifications about goal progress and milestones
- Provide customer support
- Send marketing communications (with your consent)
- Share important legal or policy updates

**Legal Compliance:**
- Comply with applicable laws and regulations
- Respond to legal requests and court orders
- Protect our rights and the rights of our users`
    },
    {
      id: 'data-sharing',
      title: '3. Information Sharing and Disclosure',
      content: `We do not sell, trade, or rent your personal information to third parties. We may share your information in the following limited circumstances:

**Within Your Family:**
- Family members can see shared goals, contributions, and progress
- Parents/guardians can view their children's activities
- Family administrators can manage member permissions

**Service Providers:**
- Payment processors (Stripe) for secure transaction processing
- Cloud storage providers for data hosting
- Analytics services for app improvement
- Customer support tools for assistance

**Legal Requirements:**
- When required by law or legal process
- To protect our rights, property, or safety
- To prevent fraud or abuse
- In connection with a business transfer or acquisition

**With Your Consent:**
- When you explicitly authorize sharing
- For specific features you choose to use
- When participating in surveys or research`
    },
    {
      id: 'data-security',
      title: '4. Data Security and Protection',
      content: `We implement appropriate technical and organizational measures to protect your personal information:

**Technical Safeguards:**
- Encryption in transit and at rest
- Secure data centers with physical security
- Regular security audits and assessments
- Access controls and authentication systems
- Secure coding practices and vulnerability management

**Organizational Measures:**
- Employee training on data protection
- Limited access to personal information
- Regular privacy impact assessments
- Incident response procedures
- Data minimization principles

**Children\'s Data:**
- Special protections for children under 13
- Parental consent requirements
- Limited data collection for minors
- Parental access and control rights
- COPPA compliance measures

While we strive to protect your information, no method of transmission over the internet or electronic storage is 100% secure.`
    },
    {
      id: 'data-retention',
      title: '5. Data Retention and Deletion',
      content: `We retain your information for as long as necessary to provide our Service and fulfill the purposes outlined in this Privacy Policy:

**Retention Periods:**
- Account data: Until account deletion or 3 years of inactivity
- Transaction records: 7 years for tax and legal compliance
- Support communications: 3 years from last contact
- Analytics data: 2 years in anonymized form
- Marketing data: Until consent withdrawal

**Deletion Rights:**
- You can request deletion of your account at any time
- We will delete personal information within 30 days of request
- Some data may be retained for legal or technical reasons
- Anonymized data may be retained for research purposes

**Data Portability:**
- You can export your data in a machine-readable format
- We provide tools to download your information
- Data export includes goals, contributions, and family information`
    },
    {
      id: 'user-rights',
      title: '6. Your Rights and Choices',
      content: `Depending on your location, you may have the following rights regarding your personal information:

**Access and Portability:**
- Request access to your personal information
- Receive a copy of your data in a portable format
- Know what information we have about you

**Correction and Updates:**
- Correct inaccurate or incomplete information
- Update your account information
- Modify your privacy preferences

**Deletion and Restriction:**
- Request deletion of your personal information
- Restrict processing of your data
- Object to certain uses of your information

**Consent Withdrawal:**
- Withdraw consent for marketing communications
- Opt out of data processing for analytics
- Change your privacy settings

**Complaint Rights:**
- File a complaint with supervisory authorities
- Contact our Data Protection Officer
- Seek legal remedies for privacy violations

To exercise these rights, contact us at privacy@familyquest.com or use the contact form below.`
    },
    {
      id: 'cookies-tracking',
      title: '7. Cookies and Tracking Technologies',
      content: `We use cookies and similar technologies to enhance your experience and analyze usage:

**Types of Cookies:**
- Essential cookies: Required for basic app functionality
- Analytics cookies: Help us understand app usage
- Preference cookies: Remember your settings and choices
- Marketing cookies: Enable personalized content (with consent)

**Third-Party Services:**
- Google Analytics for usage insights
- Stripe for payment processing
- Cloudflare for security and performance
- Intercom for customer support

**Your Choices:**
- Manage cookie preferences in app settings
- Disable non-essential cookies
- Clear cookies through your browser
- Opt out of analytics tracking

**Mobile App Tracking:**
- Device identifiers for app functionality
- Push notification tokens
- Location data (if enabled and necessary)
- App usage analytics`
    },
    {
      id: 'international-transfers',
      title: '8. International Data Transfers',
      content: `Your information may be transferred to and processed in countries other than your own:

**Transfer Mechanisms:**
- Adequacy decisions by relevant authorities
- Standard contractual clauses for data protection
- Binding corporate rules for multinational transfers
- Your explicit consent for specific transfers

**Safeguards:**
- Data protection agreements with service providers
- Regular audits of international data handling
- Compliance with applicable data protection laws
- Notification of significant changes to transfers

**Your Rights:**
- Information about where your data is processed
- Safeguards in place for international transfers
- Right to object to certain transfers
- Compensation for privacy violations`
    },
    {
      id: 'children-privacy',
      title: '9. Children\'s Privacy Protection',
      content: `We take special care to protect children's privacy and comply with applicable laws:

**COPPA Compliance:**
- We do not knowingly collect personal information from children under 13
- Parental consent required for children's accounts
- Limited data collection for child users
- Parental access and control over children's data

**Parental Rights:**
- Review, modify, or delete child's information
- Control child's participation in features
- Receive notifications about child's activities
- Withdraw consent at any time

**Child-Specific Protections:**
- No behavioral advertising to children
- No sharing of child data with third parties
- Special security measures for child data
- Regular review of child data practices

**Reporting Concerns:**
- Report inappropriate content or behavior
- Contact us about child privacy concerns
- File complaints with relevant authorities`
    },
    {
      id: 'changes-updates',
      title: '10. Changes to This Privacy Policy',
      content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements:

**Notification Methods:**
- Email notification to your registered address
- In-app notification when you next use the Service
- Prominent notice on our website
- Push notification for significant changes

**Your Rights:**
- Review changes before they take effect
- Continue using the Service (acceptance of changes)
- Discontinue use if you disagree with changes
- Request clarification about changes

**Effective Date:**
- Changes take effect 30 days after notification
- Emergency changes may take effect immediately
- Previous versions available upon request
- Archive of policy versions maintained

**Significant Changes:**
- New data collection practices
- Changes to data sharing policies
- New user rights or choices
- Changes to retention periods`
    },
    {
      id: 'contact-info',
      title: '11. Contact Information and Data Protection Officer',
      content: `If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

**Data Protection Officer:**
Sarah Johnson, Chief Privacy Officer
Email: privacy@familyquest.com
Phone: (555) 123-PRIVACY
Address: 123 Privacy Lane, San Francisco, CA 94105

**General Privacy Inquiries:**
Email: privacy@familyquest.com
Support: support@familyquest.com
Legal: legal@familyquest.com

**Response Times:**
- General inquiries: Within 48 hours
- Data subject requests: Within 30 days
- Complaints: Within 7 business days
- Emergency issues: Within 24 hours

**Supervisory Authority:**
If you are not satisfied with our response, you may contact your local data protection supervisory authority.`
    }
  ];

  const mockContactInfo = {
    contact_id: 'dpo-001',
    officer_name: 'Sarah Johnson',
    email: 'privacy@familyquest.com',
    phone_number: '(555) 123-PRIVACY'
  };

  const versionHistory = [
    {
      version: '3.0',
      date: 'December 15, 2024',
      changes: 'Updated for new features, enhanced children\'s privacy protections, clarified data sharing practices'
    },
    {
      version: '2.5',
      date: 'October 1, 2024',
      changes: 'Added international data transfer information, updated cookie policy, enhanced user rights section'
    },
    {
      version: '2.0',
      date: 'August 20, 2024',
      changes: 'Major update: Added family sharing features, updated data retention policies, enhanced security measures'
    },
    {
      version: '1.0',
      date: 'June 1, 2024',
      changes: 'Initial Privacy Policy for Family Quest launch'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-mint-green rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="h-8 w-8 text-text-primary" />
          </div>
          <p className="text-text-secondary">Loading Privacy Policy...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">Error Loading Privacy Policy</h2>
          <p className="text-text-secondary mb-4">Unable to load the privacy policy at this time.</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-lg font-semibold text-text-primary">Privacy Policy</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadPDF}
                disabled={downloadPDFMutation.isPending}
              >
                <Download className="h-4 w-4 mr-2" />
                {downloadPDFMutation.isPending ? 'Downloading...' : 'Download PDF'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePrint}
              >
                Print
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="w-16 h-16 bg-mint-green rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-text-secondary mb-6">
            Last updated: December 15, 2024
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-text-tertiary">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Version 3.0
            </div>
            <div className="h-4 w-px bg-border" />
            <div>Effective December 15, 2024</div>
          </div>
        </div>

        {/* Table of Contents */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {mockSections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-left p-2 rounded-lg hover:bg-mint-green/10 transition-colors duration-200 text-text-secondary hover:text-text-primary"
              >
                {section.title}
              </button>
            ))}
          </div>
        </Card>

        {/* Privacy Policy Sections */}
        <div className="space-y-6">
          {mockSections.map((section, index) => (
            <Card 
              key={section.id} 
              id={section.id}
              className="overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-6 text-left hover:bg-mint-green/5 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-text-primary">
                    {section.title}
                  </h2>
                  {expandedSections.has(section.id) ? (
                    <ChevronUp className="h-5 w-5 text-text-secondary" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-text-secondary" />
                  )}
                </div>
              </button>
              
              {expandedSections.has(section.id) && (
                <div className="px-6 pb-6 border-t border-border">
                  <div className="pt-6 prose prose-sm max-w-none">
                    <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Contact Information Section */}
        <Card className="mt-12 p-6 bg-mint-tint border-mint-green/20">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-mint-green rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-6 w-6 text-text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Data Protection Officer Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-text-secondary" />
                  <div>
                    <p className="font-medium text-text-primary">{mockContactInfo.officer_name}</p>
                    <p className="text-sm text-text-secondary">Chief Privacy Officer</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-text-secondary" />
                  <a 
                    href={`mailto:${mockContactInfo.email}`}
                    className="text-mint-green hover:text-light-mint transition-colors duration-200"
                  >
                    {mockContactInfo.email}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-text-secondary" />
                  <a 
                    href={`tel:${mockContactInfo.phone_number}`}
                    className="text-mint-green hover:text-light-mint transition-colors duration-200"
                  >
                    {mockContactInfo.phone_number}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-text-secondary" />
                  <button
                    onClick={() => setShowContactForm(!showContactForm)}
                    className="text-mint-green hover:text-light-mint transition-colors duration-200"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Form */}
        {showContactForm && (
          <Card className="mt-6 p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Contact Data Protection Officer
            </h3>
            <form onSubmit={handleSubmit(handleContactSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    {...register('name')}
                    className="w-full"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="w-full"
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="inquiry_type" className="block text-sm font-medium text-text-primary mb-1">
                  Inquiry Type *
                </label>
                <Select onValueChange={(value) => register('inquiry_type').onChange({ target: { value } })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select inquiry type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Privacy Question</SelectItem>
                    <SelectItem value="data_request">Data Access Request</SelectItem>
                    <SelectItem value="complaint">Privacy Complaint</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.inquiry_type && (
                  <p className="text-sm text-red-500 mt-1">{errors.inquiry_type.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-1">
                  Subject *
                </label>
                <Input
                  id="subject"
                  {...register('subject')}
                  className="w-full"
                  placeholder="Brief description of your inquiry"
                />
                {errors.subject && (
                  <p className="text-sm text-red-500 mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-1">
                  Message *
                </label>
                <Textarea
                  id="message"
                  {...register('message')}
                  className="w-full min-h-[120px]"
                  placeholder="Please provide details about your privacy inquiry..."
                />
                {errors.message && (
                  <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  type="submit" 
                  disabled={contactFormMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {contactFormMutation.isPending ? 'Sending...' : 'Send Message'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowContactForm(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Version History */}
        <Card className="mt-12 p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-6">Version History</h2>
          <div className="space-y-4">
            {versionHistory.map((version) => (
              <div key={version.version} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-mint-green/5 transition-colors duration-200">
                <div className="w-8 h-8 bg-pale-lavender rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-text-primary">{version.version}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-text-primary">Version {version.version}</span>
                    <span className="text-sm text-text-tertiary">•</span>
                    <span className="text-sm text-text-tertiary">{version.date}</span>
                  </div>
                  <p className="text-sm text-text-secondary">{version.changes}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Acknowledgment Section */}
        <Card className="mt-8 p-6 bg-mint-tint border-mint-green/20">
          <div className="flex items-start space-x-4">
            <CheckCircle className="h-6 w-6 text-mint-green flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Your Privacy Matters
              </h3>
              <p className="text-text-secondary mb-4">
                We are committed to protecting your privacy and being transparent about how we handle your data. 
                If you have any questions or concerns about this Privacy Policy, please don\'t hesitate to contact our Data Protection Officer.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/signup">
                  <Button className="w-full sm:w-auto">
                    I Understand - Create Account
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="w-full sm:w-auto">
                    I Understand - Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-text-secondary">
              <Link to="/terms" className="hover:text-mint-green transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/about" className="hover:text-mint-green transition-colors duration-200">
                About Us
              </Link>
              <Link to="/contact" className="hover:text-mint-green transition-colors duration-200">
                Contact Support
              </Link>
            </div>
            <div className="text-sm text-text-tertiary">
              © 2024 Family Quest Inc. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}