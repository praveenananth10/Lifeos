import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LifeOSProvider } from './context/LifeOSContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

// Module Shell Pages
import { TasksPage } from './pages/modules/TasksPage';
import { CalendarPage } from './pages/modules/CalendarPage';
import { HabitsPage } from './pages/modules/HabitsPage';
import { FinancePage } from './pages/modules/FinancePage';
import { NotesPage } from './pages/modules/NotesPage';
import { GoalsPage } from './pages/modules/GoalsPage';
import { FocusPage } from './pages/modules/FocusPage';
import { SettingsPage } from './pages/modules/SettingsPage';
import { AssistantPage } from './pages/modules/AssistantPage';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <LifeOSProvider>
            <BrowserRouter>
              <Routes>
              {/* Public Marketing Routes */}
              <Route path="/" element={<LandingPage />} />

              {/* Authentication Routes (Stage 3) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Authenticated Workspace Routes (Stage 4 & Backend Step 2) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <DashboardPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <TasksPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <CalendarPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/habits"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <HabitsPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/finance"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <FinancePage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <NotesPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/goals"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <GoalsPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/focus"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <FocusPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assistant"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <AssistantPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <SettingsPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />

              {/* Design System Spec */}
              <Route
                path="/design-system"
                element={
                  <AppShell>
                    <DesignSystemPage />
                  </AppShell>
                }
              />

              {/* 404 Dedicated Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </LifeOSProvider>
      </AuthProvider>
    </ThemeProvider>
  </ErrorBoundary>
  );
};

export default App;
