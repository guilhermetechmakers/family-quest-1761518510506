import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { LandingPage } from "@/pages/LandingPage";
import { AuthPage } from "@/pages/AuthPage";
import { EmailVerificationPage } from "@/pages/EmailVerificationPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { GoalDetailPage } from "@/pages/GoalDetailPage";
import { EditGoalPage } from "@/pages/EditGoalPage";
import { CreateGoalPage } from "@/pages/CreateGoalPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ActivityFeedPage } from "@/pages/ActivityFeedPage";
import { NotificationsPage } from "@/pages/NotificationsPage";
import { RemindersPage } from "@/pages/RemindersPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ServerErrorPage } from "@/pages/ServerErrorPage";
import { TermsOfServicePage } from "@/pages/TermsOfServicePage";
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage";
import { CookiePolicyPage } from "@/pages/CookiePolicyPage";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
import { TransactionHistoryPage } from "@/pages/TransactionHistoryPage";
import { ContributionsPage } from "@/pages/ContributionsPage";
import { AboutHelpPage } from "@/pages/AboutHelpPage";
import { ErrorTestPage } from "@/pages/ErrorTestPage";
import { SearchPage } from "@/pages/SearchPage";
import { ShareableCardsPage } from "@/pages/ShareableCardsPage";
import { PublicCardPage } from "@/pages/PublicCardPage";
import { PerformancePage } from "@/pages/PerformancePage";
import { CacheManagementPage } from "@/pages/CacheManagementPage";
import { ProgressTrackingPage } from "@/pages/ProgressTrackingPage";

// React Query client with optimal defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Mock user data - in a real app this would come from auth context
const mockUser = {
  full_name: "John Doe",
  avatar_url: undefined,
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes without layout */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/cookies" element={<CookiePolicyPage />} />
          <Route path="/help" element={<AboutHelpPage />} />
          <Route path="/share/:shareToken" element={<PublicCardPage />} />
          
          {/* Protected routes with responsive layout */}
          <Route path="/dashboard" element={
            <ResponsiveLayout unreadNotifications={3} user={mockUser}>
              <DashboardPage />
            </ResponsiveLayout>
          } />
          <Route path="/goals/:id" element={
            <ResponsiveLayout unreadNotifications={3} user={mockUser}>
              <GoalDetailPage />
            </ResponsiveLayout>
          } />
          <Route path="/goals/:id/edit" element={
            <ResponsiveLayout unreadNotifications={3} user={mockUser}>
              <EditGoalPage />
            </ResponsiveLayout>
          } />
          <Route path="/goals/create" element={
            <ResponsiveLayout unreadNotifications={3} user={mockUser}>
              <CreateGoalPage />
            </ResponsiveLayout>
          } />
          <Route path="/profile" element={
            <ResponsiveLayout unreadNotifications={3} user={mockUser}>
              <ProfilePage />
            </ResponsiveLayout>
          } />
          <Route path="/activity" element={
            <ResponsiveLayout unreadNotifications={3} user={mockUser}>
              <ActivityFeedPage />
            </ResponsiveLayout>
          } />
          <Route path="/notifications" element={
            <ResponsiveLayout unreadNotifications={3} user={mockUser}>
              <NotificationsPage />
            </ResponsiveLayout>
          } />
          <Route path="/reminders" element={
            <ResponsiveLayout unreadNotifications={3} user={mockUser}>
              <RemindersPage />
            </ResponsiveLayout>
          } />
          <Route path="/settings" element={
            <ResponsiveLayout unreadNotifications={3} user={mockUser}>
              <SettingsPage />
            </ResponsiveLayout>
          } />
          <Route path="/transactions" element={
            <ResponsiveLayout unreadNotifications={3} user={mockUser}>
              <TransactionHistoryPage />
            </ResponsiveLayout>
          } />
          <Route path="/contributions" element={
            <ResponsiveLayout unreadNotifications={3} user={mockUser}>
              <ContributionsPage />
            </ResponsiveLayout>
          } />
          <Route path="/search" element={
            <ResponsiveLayout unreadNotifications={3} user={mockUser}>
              <SearchPage />
            </ResponsiveLayout>
          } />
          <Route path="/cards" element={
            <ResponsiveLayout unreadNotifications={3} user={mockUser}>
              <ShareableCardsPage />
            </ResponsiveLayout>
          } />
          <Route path="/performance" element={
            <ResponsiveLayout unreadNotifications={3} user={mockUser}>
              <PerformancePage />
            </ResponsiveLayout>
          } />
          <Route path="/cache" element={
            <ResponsiveLayout unreadNotifications={3} user={mockUser}>
              <CacheManagementPage />
            </ResponsiveLayout>
          } />
          <Route path="/progress/:id" element={
            <ResponsiveLayout unreadNotifications={3} user={mockUser}>
              <ProgressTrackingPage />
            </ResponsiveLayout>
          } />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/overview" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminDashboardPage />} />
          <Route path="/admin/moderation" element={<AdminDashboardPage />} />
          <Route path="/admin/transactions" element={<AdminDashboardPage />} />
          <Route path="/admin/analytics" element={<AdminDashboardPage />} />
          <Route path="/admin/support" element={<AdminDashboardPage />} />
          <Route path="/admin/broadcast" element={<AdminDashboardPage />} />
          <Route path="/admin/health" element={<AdminDashboardPage />} />
          <Route path="/admin/security" element={<AdminDashboardPage />} />
          <Route path="/admin/audit" element={<AdminDashboardPage />} />
          <Route path="/admin/settings" element={<AdminDashboardPage />} />
          
          {/* Error pages */}
          <Route path="/500" element={<ServerErrorPage />} />
          <Route path="/server-error" element={<ServerErrorPage />} />
          
          {/* Development/Testing pages */}
          <Route path="/test-errors" element={<ErrorTestPage />} />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
