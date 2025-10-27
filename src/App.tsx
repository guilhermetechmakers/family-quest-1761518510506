import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { LandingPage } from "@/pages/LandingPage";
import { AuthPage } from "@/pages/AuthPage";
import { EmailVerificationPage } from "@/pages/EmailVerificationPage";
import { PasswordResetPage } from "@/pages/PasswordResetPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { GoalDetailPage } from "@/pages/GoalDetailPage";
import { CreateGoalPage } from "@/pages/CreateGoalPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ActivityFeedPage } from "@/pages/ActivityFeedPage";
import { NotificationsPage } from "@/pages/NotificationsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { TermsOfServicePage } from "@/pages/TermsOfServicePage";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";

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
          <Route path="/forgot-password" element={<PasswordResetPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          
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
          <Route path="/settings" element={
            <ResponsiveLayout unreadNotifications={3} user={mockUser}>
              <SettingsPage />
            </ResponsiveLayout>
          } />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
