import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Calendar,
  ChevronDown,
  ChevronUp,
  CheckCircle
} from 'lucide-react';

export function TermsOfServicePage() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const sections = [
    {
      id: 'overview',
      title: '1. Overview and Acceptance',
      content: `These Terms of Service ("Terms") govern your use of Family Quest ("Service"), operated by Family Quest Inc. ("Company", "we", "us", or "our"). By accessing or using our Service, you agree to be bound by these Terms.

If you disagree with any part of these terms, then you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.`
    },
    {
      id: 'definitions',
      title: '2. Definitions',
      content: `For the purposes of these Terms of Service:

- "Service" refers to the Family Quest application, website, and all related services.
- "User" or "you" refers to any individual who accesses or uses our Service.
- "Family" refers to a group of users connected through our Service for collaborative goal tracking.
- "Content" refers to all information, data, text, software, music, sound, photographs, graphics, video, messages, or other materials.
- "Account" refers to your personal account with Family Quest.
- "Contributions" refers to monetary or non-monetary contributions made toward family goals.`
    },
    {
      id: 'user-accounts',
      title: '3. User Accounts and Registration',
      content: `To use our Service, you must create an account. You agree to:

- Provide accurate, current, and complete information during registration
- Maintain and update your account information to keep it accurate and current
- Maintain the security of your password and account
- Accept responsibility for all activities under your account
- Notify us immediately of any unauthorized use of your account
- Be at least 13 years old to create an account (with parental consent required for users under 18)

We reserve the right to refuse service, terminate accounts, or remove content at our sole discretion.`
    },
    {
      id: 'family-membership',
      title: '4. Family Membership and Roles',
      content: `Family Quest supports different user roles within family groups:

- **Parent/Guardian**: Full access to create goals, manage family members, approve contributions, and access payment features
- **Child**: Limited access to contribute to goals, view progress, and participate in family activities (with parental oversight)
- **Guest Contributor**: Limited access to contribute to specific goals as invited by family members

Parents/Guardians are responsible for:
- Managing family member permissions and access
- Approving monetary contributions from children
- Ensuring appropriate use of the Service by minors
- Maintaining accurate family member information

Children under 13 may only use the Service with explicit parental consent and supervision.`
    },
    {
      id: 'acceptable-use',
      title: '5. Acceptable Use Policy',
      content: `You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:

- Use the Service for any illegal or unauthorized purpose
- Violate any laws in your jurisdiction
- Transmit any worms, viruses, or any code of a destructive nature
- Attempt to gain unauthorized access to any portion of the Service
- Interfere with or disrupt the Service or servers connected to the Service
- Use the Service to harass, abuse, or harm others
- Post inappropriate, offensive, or harmful content
- Impersonate any person or entity
- Use automated systems to access the Service without permission

We reserve the right to terminate accounts that violate these terms.`
    },
    {
      id: 'payments',
      title: '6. Payments and Billing',
      content: `**Payment Processing:**
- We use secure third-party payment processors (Stripe) for all monetary transactions
- All payment information is encrypted and processed securely
- We do not store your complete payment card information

**Contributions:**
- Monetary contributions are processed through our secure payment system
- All contributions are final unless there is a technical error on our part
- Refunds may be issued at our discretion for technical issues

**Subscription Fees:**
- Free Plan: $0/month with limited features
- Family Plan: $9.99/month with full features
- Billing occurs monthly in advance
- You may cancel your subscription at any time
- No refunds for partial months of service

**Currency and Taxes:**
- All prices are in USD unless otherwise specified
- You are responsible for any applicable taxes
- We may change our pricing with 30 days' notice`
    },
    {
      id: 'privacy-data',
      title: '7. Privacy and Data Protection',
      content: `Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service.

**Data Collection:**
- We collect information you provide directly (account info, family data, goals)
- We automatically collect certain information (usage data, device information)
- We use cookies and similar technologies to enhance your experience

**Data Security:**
- We implement appropriate security measures to protect your data
- We use encryption for sensitive data transmission and storage
- We regularly review our security practices

**Children's Privacy:**
- We comply with COPPA and other applicable children's privacy laws
- We obtain parental consent before collecting personal information from children
- Parents can review, modify, or delete their child's information

**Data Sharing:**
- We do not sell your personal information
- We may share information with service providers who assist us
- We may share information if required by law or to protect our rights`
    },
    {
      id: 'intellectual-property',
      title: '8. Intellectual Property Rights',
      content: `**Our Content:**
- The Service and its original content, features, and functionality are owned by Family Quest Inc.
- Our content is protected by copyright, trademark, and other intellectual property laws
- You may not copy, modify, distribute, or create derivative works without permission

**Your Content:**
- You retain ownership of content you create and share through the Service
- By using the Service, you grant us a license to use, display, and distribute your content
- This license is necessary for us to provide the Service to you and your family

**User-Generated Content:**
- You are responsible for any content you post or share
- We may remove content that violates these Terms
- We are not responsible for content posted by other users`
    },
    {
      id: 'disclaimers',
      title: '9. Disclaimers and Limitations',
      content: `**Service Availability:**
- We strive to provide continuous service but cannot guarantee 100% uptime
- We may temporarily suspend the Service for maintenance or updates
- We are not liable for any downtime or service interruptions

**Limitation of Liability:**
- The Service is provided "as is" without warranties of any kind
- We disclaim all warranties, express or implied
- Our liability is limited to the amount you paid for the Service in the past 12 months
- We are not liable for any indirect, incidental, or consequential damages

**Third-Party Services:**
- We may integrate with third-party services (payment processors, social media)
- We are not responsible for third-party services or their content
- Your use of third-party services is subject to their terms and conditions`
    },
    {
      id: 'termination',
      title: '10. Termination',
      content: `**Termination by You:**
- You may stop using the Service at any time
- You may delete your account through the Service settings
- Canceling your subscription stops future billing

**Termination by Us:**
- We may terminate or suspend your account for violations of these Terms
- We may discontinue the Service with reasonable notice
- We will provide notice of termination when possible

**Effect of Termination:**
- Your right to use the Service ceases immediately
- We may delete your account and data after termination
- Some provisions of these Terms survive termination`
    },
    {
      id: 'governing-law',
      title: '11. Governing Law and Disputes',
      content: `**Governing Law:**
- These Terms are governed by the laws of the State of California
- Any disputes will be resolved in California courts

**Dispute Resolution:**
- We encourage resolving disputes through direct communication
- For formal disputes, we prefer binding arbitration over court proceedings
- You may opt out of arbitration within 30 days of accepting these Terms

**Class Action Waiver:**
- You agree to resolve disputes individually
- You waive the right to participate in class action lawsuits`
    },
    {
      id: 'changes',
      title: '12. Changes to Terms',
      content: `**Modifications:**
- We may update these Terms from time to time
- We will notify users of significant changes via email or in-app notification
- Continued use of the Service after changes constitutes acceptance

**Notification Methods:**
- Email notification to your registered email address
- In-app notification when you next use the Service
- Posting on our website with effective date

**Your Rights:**
- You may review changes before they take effect
- You may discontinue use if you disagree with changes
- Some changes may require explicit acceptance`
    },
    {
      id: 'contact',
      title: '13. Contact Information',
      content: `If you have questions about these Terms of Service, please contact us:

**Family Quest Inc.**
Email: legal@familyquest.com
Address: 123 Family Street, San Francisco, CA 94105
Phone: (555) 123-FAMILY

**Support Hours:**
Monday - Friday: 9:00 AM - 6:00 PM PST
Saturday: 10:00 AM - 4:00 PM PST
Sunday: Closed

**Legal Inquiries:**
For legal matters, please email legal@familyquest.com with "Legal Inquiry" in the subject line.`
    }
  ];

  const versionHistory = [
    {
      version: '2.1',
      date: 'December 15, 2024',
      changes: 'Updated payment processing terms, added guest contributor role, enhanced privacy protections'
    },
    {
      version: '2.0',
      date: 'October 1, 2024',
      changes: 'Major update: Added family roles, enhanced security measures, updated subscription pricing'
    },
    {
      version: '1.5',
      date: 'August 20, 2024',
      changes: 'Added children\'s privacy protections, updated data retention policies'
    },
    {
      version: '1.0',
      date: 'June 1, 2024',
      changes: 'Initial Terms of Service for Family Quest launch'
    }
  ];

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
              <h1 className="text-lg font-semibold text-text-primary">Terms of Service</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="w-16 h-16 bg-mint-green rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="h-8 w-8 text-text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-text-secondary mb-6">
            Last updated: December 15, 2024
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-text-tertiary">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Version 2.1
            </div>
            <div className="h-4 w-px bg-border" />
            <div>Effective December 15, 2024</div>
          </div>
        </div>

        {/* Table of Contents */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sections.map((section) => (
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

        {/* Terms Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
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
                Acknowledgment
              </h3>
              <p className="text-text-secondary mb-4">
                By using Family Quest, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our Service.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/signup">
                  <Button className="w-full sm:w-auto">
                    I Agree - Create Account
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="w-full sm:w-auto">
                    I Agree - Sign In
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
              <Link to="/privacy" className="hover:text-mint-green transition-colors duration-200">
                Privacy Policy
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