import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Target, 
  Users, 
  Share2, 
  CreditCard, 
  Star, 
  ArrowRight,
  CheckCircle,
  Play
} from 'lucide-react';

export function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Target,
      title: "Goal Boards",
      description: "Create and track family goals with beautiful visual progress boards",
      color: "bg-mint-green"
    },
    {
      icon: Users,
      title: "Family Milestones",
      description: "Celebrate achievements together with milestone tracking and rewards",
      color: "bg-pale-lavender"
    },
    {
      icon: Share2,
      title: "Share Cards",
      description: "Generate beautiful shareable cards for social media and family updates",
      color: "bg-light-pink"
    },
    {
      icon: CreditCard,
      title: "Smart Payments",
      description: "Secure contribution tracking with integrated payment processing",
      color: "bg-pastel-yellow"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Mother of 3",
      content: "Family Quest has brought our family closer together. We finally saved up for our dream vacation!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Father of 2",
      content: "The kids love earning their contributions through chores. It's teaching them valuable life skills.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Single Parent",
      content: "Managing family goals has never been easier. The app is intuitive and fun for all ages.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-text-primary">Family Quest</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
                Turn Family Dreams Into
                <span className="text-mint-green block">Reality Together</span>
              </h1>
              <p className="text-xl text-text-secondary mb-8 leading-relaxed">
                Family Quest transforms your family goals into collaborative missions. 
                Track progress, celebrate milestones, and build lasting memories together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Your Family Quest
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="bg-gradient-to-br from-mint-green to-light-mint rounded-3xl p-8 shadow-2xl">
                  <div className="bg-white rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-text-primary">Family Vacation Fund</h3>
                      <span className="status-tag status-in-progress">In Progress</span>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-text-secondary mb-2">
                        <span>$2,450 raised</span>
                        <span>$5,000 goal</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-mint-green h-3 rounded-full" style={{ width: '49%' }}></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="w-8 h-8 bg-pale-lavender rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold">
                            {i}
                          </div>
                        ))}
                      </div>
                      <span className="text-sm text-text-secondary">+2 more contributing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Everything You Need to Achieve Together
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Our comprehensive platform makes family goal-setting fun, engaging, and successful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`p-6 text-center hover:shadow-card-hover transition-all duration-300 cursor-pointer ${
                  activeFeature === index ? 'ring-2 ring-mint-green' : ''
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="h-8 w-8 text-text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-primary-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              How Family Quest Works
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Get started in three simple steps and watch your family dreams come true.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Your Goal",
                description: "Set up a family goal with milestones, target amount, and timeline.",
                icon: Target
              },
              {
                step: "2",
                title: "Invite Family Members",
                description: "Add family members and set contribution permissions for each person.",
                icon: Users
              },
              {
                step: "3",
                title: "Track & Celebrate",
                description: "Monitor progress, celebrate milestones, and achieve your dreams together.",
                icon: Star
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-mint-green rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-text-primary">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">
                  {step.title}
                </h3>
                <p className="text-text-secondary">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Loved by Families Everywhere
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              See what real families are saying about their Family Quest experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-text-secondary mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-text-primary">{testimonial.name}</p>
                  <p className="text-sm text-text-tertiary">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-primary-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Start free and upgrade when you're ready to unlock advanced features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-text-primary mb-4">Free Plan</h3>
              <div className="text-4xl font-bold text-text-primary mb-6">$0<span className="text-lg text-text-secondary">/month</span></div>
              <ul className="space-y-3 mb-8">
                {[
                  "Up to 3 family members",
                  "2 active goals",
                  "Basic progress tracking",
                  "Email support"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-mint-green mr-3" />
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">Get Started Free</Button>
            </Card>

            <Card className="p-8 border-2 border-mint-green relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-mint-green text-text-primary px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">Family Plan</h3>
              <div className="text-4xl font-bold text-text-primary mb-6">$9.99<span className="text-lg text-text-secondary">/month</span></div>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited family members",
                  "Unlimited goals",
                  "Advanced analytics",
                  "Share cards & social features",
                  "Priority support",
                  "Custom milestones & rewards"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-mint-green mr-3" />
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full">Start Family Plan</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-mint-green to-light-mint">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
            Ready to Start Your Family Quest?
          </h2>
          <p className="text-xl text-text-secondary mb-8">
            Join thousands of families who are already achieving their dreams together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Create Your First Goal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Family Quest</h3>
              <p className="text-text-secondary">
                Making family dreams come true, one goal at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Product</h4>
              <ul className="space-y-2 text-text-secondary">
                <li><a href="#" className="hover:text-mint-green">Features</a></li>
                <li><a href="#" className="hover:text-mint-green">Pricing</a></li>
                <li><a href="#" className="hover:text-mint-green">How it Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Support</h4>
              <ul className="space-y-2 text-text-secondary">
                <li><Link to="/help" className="hover:text-mint-green">Help Center</Link></li>
                <li><a href="#" className="hover:text-mint-green">Contact Us</a></li>
                <li><Link to="/terms" className="hover:text-mint-green">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-mint-green">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Company</h4>
              <ul className="space-y-2 text-text-secondary">
                <li><a href="#" className="hover:text-mint-green">About</a></li>
                <li><a href="#" className="hover:text-mint-green">Blog</a></li>
                <li><a href="#" className="hover:text-mint-green">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-text-secondary">
            <p>&copy; 2024 Family Quest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}