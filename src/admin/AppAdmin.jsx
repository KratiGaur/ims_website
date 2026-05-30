import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import HomepageCMSPage from './pages/HomepageCMS';
import AboutCMSPage from './pages/AboutCMS';
import InvitationCMSPage from './pages/InvitationCMS';
import CommitteeManagementPage from './pages/CommitteeManagement';
import MediaManagementPage from './pages/MediaManagement';
import GalleryManagementPage from './pages/GalleryManagement';
import AbstractManagementPage from './pages/AbstractManagement';
import RegistrationManagementPage from './pages/RegistrationManagement';
import SEOManagementPage from './pages/SEOManagement';
import UserManagementPage from './pages/UserManagement';
import SystemSettingsPage from './pages/SystemSettings';
import NotFoundPage from './pages/NotFound';
import './styles/admin.css';

function AppAdmin() {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="admin-loading">Loading admin panel...</div>}>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="homepage" element={<HomepageCMSPage />} />
            <Route path="about" element={<AboutCMSPage />} />
            <Route path="invitation" element={<InvitationCMSPage />} />
            <Route path="committee" element={<CommitteeManagementPage />} />
            <Route path="media" element={<MediaManagementPage />} />
            <Route path="gallery" element={<GalleryManagementPage />} />
            <Route path="abstracts" element={<AbstractManagementPage />} />
            <Route path="registrations" element={<RegistrationManagementPage />} />
            <Route path="seo" element={<SEOManagementPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="settings" element={<SystemSettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="*" element={<Navigate to="login" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default AppAdmin;
