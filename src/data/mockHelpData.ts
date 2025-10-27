import type { FAQ, Guide, FAQCategory } from '@/types/help';

export const mockFAQs: FAQ[] = [
  {
    id: '1',
    category: 'Getting Started',
    question: 'How do I create my first family goal?',
    answer: 'To create your first family goal, click the "Create Goal" button on your dashboard or use the plus icon in the navigation. Follow the step-by-step wizard to set up your goal details, milestones, and invite family members.',
    order: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    category: 'Getting Started',
    question: 'How do I invite family members to join?',
    answer: 'You can invite family members by going to your Profile page and clicking "Invite Family Member". Enter their email address and choose their role (Parent, Child, or Guest). They will receive an email invitation to join your family.',
    order: 2,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    category: 'Payments',
    question: 'How do I add a payment method?',
    answer: 'Go to your Profile page and click on "Payment Methods". You can add credit cards, debit cards, or connect your bank account. All payment information is securely encrypted and processed through our trusted payment partners.',
    order: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    category: 'Payments',
    question: 'Is my payment information secure?',
    answer: 'Yes, absolutely. We use bank-level encryption and never store your full payment details. All transactions are processed through PCI-compliant payment processors. Your financial data is protected with the same security standards used by major banks.',
    order: 2,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    category: 'Goals',
    question: 'Can I edit a goal after creating it?',
    answer: 'Yes, you can edit most aspects of your goal by clicking on the goal and selecting "Edit Goal". You can modify the title, description, target amount, and milestones. However, some changes may require approval from other family members.',
    order: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '6',
    category: 'Goals',
    question: 'What happens when a goal is completed?',
    answer: 'When a goal is completed, all family members will receive a notification. You can celebrate the achievement, generate shareable milestone cards, and optionally archive the goal. Completed goals remain visible in your history for reference.',
    order: 2,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '7',
    category: 'Technical',
    question: 'The app is running slowly. What should I do?',
    answer: 'Try refreshing the page or clearing your browser cache. If the issue persists, check your internet connection. You can also try logging out and logging back in. If problems continue, please contact our support team.',
    order: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '8',
    category: 'Technical',
    question: 'I forgot my password. How do I reset it?',
    answer: 'Click "Forgot Password" on the login page and enter your email address. You will receive a secure reset link via email. Follow the instructions in the email to create a new password. The reset link expires after 24 hours for security.',
    order: 2,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

export const mockFAQCategories: FAQCategory[] = [
  { name: 'Getting Started', count: 2, icon: '🚀' },
  { name: 'Payments', count: 2, icon: '💳' },
  { name: 'Goals', count: 2, icon: '🎯' },
  { name: 'Technical', count: 2, icon: '🔧' },
];

export const mockGuides: Guide[] = [
  {
    id: '1',
    title: 'Getting Started with Family Quest',
    description: 'Learn the basics of setting up your family account and creating your first goal.',
    content: `# Getting Started with Family Quest

Welcome to Family Quest! This guide will help you set up your family account and create your first goal.

## Step 1: Create Your Family Account
1. Sign up with your email address
2. Verify your email through the confirmation link
3. Set up your profile information

## Step 2: Create Your First Goal
1. Click "Create Goal" on your dashboard
2. Choose a goal type (vacation, purchase, home improvement, etc.)
3. Set your target amount and timeline
4. Add milestones to track progress

## Step 3: Invite Family Members
1. Go to your Profile page
2. Click "Invite Family Member"
3. Enter their email and choose their role
4. They'll receive an invitation to join

## Step 4: Start Contributing
1. Family members can contribute money or complete chores
2. Track progress in real-time
3. Celebrate milestones together
4. Share achievements with others

## Tips for Success
- Set realistic goals that everyone can contribute to
- Celebrate small wins along the way
- Use the family feed to stay connected
- Regularly check in on progress

Need more help? Contact our support team anytime!`,
    category: 'Getting Started',
    order: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Understanding Family Roles and Permissions',
    description: 'Learn about different family member roles and what each can do in the app.',
    content: `# Family Roles and Permissions

Family Quest supports different roles to ensure appropriate access and control for all family members.

## Parent Role
Parents have full access to all features:
- Create and manage goals
- Invite and remove family members
- Manage payment methods
- Approve child contributions
- Access all family data and settings

## Child Role
Children have limited access for safety:
- View family goals and progress
- Contribute through chores and tasks
- Add manual contributions (with parent approval)
- View their own contribution history
- Cannot access payment information

## Guest Role
Guests can contribute to specific goals:
- View goals they're invited to
- Make monetary contributions
- View goal progress
- Cannot create goals or invite others

## Setting Up Roles
1. Go to your Profile page
2. Click "Family Members"
3. Select a member and choose their role
4. Set specific permissions for each goal

## Safety Features
- All child activities are monitored by parents
- Payment actions require parent approval
- Guest access is limited to specific goals
- All changes are logged for accountability`,
    category: 'Family Management',
    order: 2,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    title: 'Managing Payments and Contributions',
    description: 'Everything you need to know about adding payment methods and making contributions.',
    content: `# Managing Payments and Contributions

Learn how to securely manage payments and track contributions in Family Quest.

## Adding Payment Methods
1. Go to Profile > Payment Methods
2. Click "Add Payment Method"
3. Enter your card or bank details
4. Verify the information
5. Set as default if desired

## Making Contributions
### Monetary Contributions
1. Go to any active goal
2. Click "Contribute"
3. Enter the amount
4. Select payment method
5. Confirm the contribution

### Chore Contributions
1. Go to the goal page
2. Click "Complete Chore"
3. Select the chore type
4. Add a description
5. Submit for approval (if required)

## Payment Security
- All data is encrypted in transit and at rest
- We never store full card numbers
- PCI DSS compliant processing
- Regular security audits

## Tracking Contributions
- View all contributions in the Activity Feed
- Check individual contribution history
- Export data for tax purposes
- Set up contribution reminders

## Troubleshooting Payments
- Check your payment method is valid
- Ensure sufficient funds
- Contact your bank if needed
- Reach out to support for help`,
    category: 'Payments',
    order: 3,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    title: 'Creating Effective Family Goals',
    description: 'Tips and strategies for setting goals that bring your family together.',
    content: `# Creating Effective Family Goals

Learn how to create goals that motivate your family and achieve success together.

## Choosing the Right Goal
### Good Goal Examples
- Family vacation to Disney World
- New family pet and supplies
- Home improvement project
- Educational fund for children
- Emergency fund for family

### Avoid These Pitfalls
- Goals that only benefit one person
- Unrealistic timelines
- Goals that create financial stress
- Vague or unclear objectives

## Setting Up Milestones
1. Break large goals into smaller steps
2. Set realistic milestone amounts
3. Celebrate each milestone reached
4. Adjust timeline as needed

## Engaging Family Members
- Let everyone contribute ideas
- Assign specific responsibilities
- Create friendly competition
- Share progress regularly
- Celebrate achievements together

## Goal Categories
- **Vacation & Travel**: Family trips and experiences
- **Home & Garden**: Improvements and purchases
- **Education**: Learning and skill development
- **Health & Fitness**: Wellness and activities
- **Emergency**: Safety nets and preparedness

## Best Practices
- Start with smaller, achievable goals
- Set clear deadlines
- Make contributions visible
- Use the family feed for updates
- Adjust goals as circumstances change`,
    category: 'Goal Setting',
    order: 4,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];