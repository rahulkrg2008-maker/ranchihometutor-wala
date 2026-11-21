/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storageService';
import { 
  TuitionRequirement, 
  Tutor, 
  Review, 
  ServiceItem, 
  WebsiteSettings,
  DemoAssignment
} from './types';

// Public Components
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { FindTuitionModal } from './components/public/FindTuitionModal';
import { BecomeTutorModal } from './components/public/BecomeTutorModal';
import { WhyChooseUs } from './components/public/WhyChooseUs';
import { HowItWorks } from './components/public/HowItWorks';
import { ServicesSection } from './components/public/ServicesSection';
import { PublicReviews } from './components/public/PublicReviews';
import { ContactSection } from './components/public/ContactSection';
import { PrivacyPolicyView } from './components/public/PrivacyPolicyView';
import { TermsConditionsView } from './components/public/TermsConditionsView';
import { SafetyPolicyView } from './components/public/SafetyPolicyView';
import { SafetySection } from './components/public/SafetySection';
import { CtaSection } from './components/public/CtaSection';
import { Footer } from './components/public/Footer';
import { FloatingContact } from './components/public/FloatingContact';
import { WebsiteBackground } from './components/public/WebsiteBackground';

// Admin Components
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminPortalView } from './components/admin/AdminPortalView';

export default function App() {
  // App view state: supports separate URL domain/admin directly
  const [viewMode, setViewMode] = useState<'public' | 'admin' | 'admin-portal'>(() => {
    // Decide synchronously from the URL so /admin never flashes the public site
    if (typeof window === 'undefined') return 'public';
    const p = window.location.pathname;
    const isAdmin = p.startsWith('/admin') || window.location.hash === '#admin' || new URLSearchParams(window.location.search).has('admin');
    if (!isAdmin) return 'public';
    return StorageService.isAdminAuthenticated() ? 'admin' : 'admin-portal';
  });
  const [publicPage, setPublicPage] = useState<'home' | 'services' | 'contact' | 'privacy' | 'terms' | 'safety'>('home');

  // Core data states
  const [settings, setSettings] = useState<WebsiteSettings>(StorageService.getSettings());
  const [requirements, setRequirements] = useState<TuitionRequirement[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [demos, setDemos] = useState<DemoAssignment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);

  // Modals
  const [isTuitionModalOpen, setIsTuitionModalOpen] = useState(false);
  const [isTutorModalOpen, setIsTutorModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Dark mode theme state (default to true for rich Dark Blue aesthetic)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ranchi_tutor_theme');
      if (saved === 'light') return false;
      return true;
    }
    return true;
  });

  useEffect(() => {
    // If not explicitly set to light, activate dark blue theme
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ranchi_tutor_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ranchi_tutor_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    // Switch off all transitions for one frame pair so the whole page repaints once (no lag on phones)
    const root = document.documentElement;
    root.classList.add('theme-switching');
    setIsDarkMode((prev) => !prev);
    window.setTimeout(() => root.classList.remove('theme-switching'), 120);
  };

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Sync data from Storage
  const loadAllData = () => {
    setSettings(StorageService.getSettings());
    setRequirements(StorageService.getRequirements());
    setTutors(StorageService.getTutors());
    setDemos(StorageService.getDemoAssignments());
    setReviews(StorageService.getReviews());
    setServices(StorageService.getServices());
  };

  useEffect(() => {
    loadAllData();
    // Synchronize data from Supabase backend
    StorageService.syncFromBackend().then(() => {
      loadAllData();
    });

    // Dedicated Admin Route check: direct support for domain/admin, #admin, ?admin=true, or Alt+A
    const checkAdminRoute = async () => {
      const hash = window.location.hash;
      const search = new URLSearchParams(window.location.search);
      const path = window.location.pathname;
      const isAdminPath = path === '/admin' || path === '/admin/' || path.startsWith('/admin') || hash === '#admin' || search.has('admin');

      if (isAdminPath) {
        if (StorageService.isAdminAuthenticated()) {
          const isValid = await StorageService.verifyAdminSession();
          if (isValid) {
            setViewMode('admin');
          } else {
            setViewMode('admin-portal');
          }
        } else {
          setViewMode('admin-portal');
        }
      } else {
        setViewMode((curr) => {
          if (curr === 'admin-portal' || (curr === 'admin' && !StorageService.isAdminAuthenticated())) {
            return 'public';
          }
          return curr;
        });
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('popstate', checkAdminRoute);

    // Coordinator shortcut: Alt + A or Ctrl + Shift + A to open separate admin panel
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        if (window.location.pathname !== '/admin') {
          window.history.pushState(null, '', '/admin');
        }
        if (StorageService.isAdminAuthenticated()) {
          setViewMode('admin');
        } else {
          setViewMode('admin-portal');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const handleDataChange = () => {
      loadAllData();
    };

    window.addEventListener('rht_data_changed', handleDataChange);
    return () => {
      window.removeEventListener('rht_data_changed', handleDataChange);
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleAdminLoginSuccess = () => {
    setViewMode('admin');
    if (window.location.pathname !== '/admin') {
      window.history.pushState(null, '', '/admin');
    }
  };

  const handleAdminLogout = () => {
    StorageService.logoutAdmin();
    if (window.location.pathname.startsWith('/admin')) {
      setViewMode('admin-portal');
    } else {
      setViewMode('public');
      window.history.pushState(null, '', '/');
    }
    showNotification('Logged out of Admin Control Center.');
  };

  const handleExitAdminToPublic = () => {
    setViewMode('public');
    window.history.pushState(null, '', '/');
  };

  const handleNavigateTab = (tab: string) => {
    if (tab === 'safety') {
      if (publicPage !== 'home') {
        setPublicPage('home');
        setTimeout(() => {
          const el = document.getElementById('safety-section') || document.getElementById('safety-policy');
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        const el = document.getElementById('safety-section') || document.getElementById('safety-policy');
        el?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    if (tab === 'contact') {
      if (publicPage !== 'home') {
        setPublicPage('home');
        setTimeout(() => {
          const el = document.getElementById('contact-section') || document.getElementById('contact');
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        const el = document.getElementById('contact-section') || document.getElementById('contact');
        el?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    if (tab === 'services') {
      if (publicPage !== 'home') {
        setPublicPage('home');
        setTimeout(() => {
          const el = document.getElementById('services-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        const el = document.getElementById('services-section');
        el?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    setPublicPage(tab as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark text-slate-100' : 'text-slate-900'} ${viewMode === 'public' ? 'bg-transparent' : (isDarkMode ? 'bg-slate-950' : 'bg-slate-50')} font-sans selection:bg-sky-500 selection:text-white`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-sky-400/50 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-sky-400 animate-ping shrink-0" />
          <p className="text-xs font-semibold text-slate-200">{toastMessage}</p>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-auto text-slate-400 hover:text-white text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* SEPARATE ADMIN PANEL (domain/admin) */}
      {viewMode === 'admin' ? (
        <AdminLayout
          settings={settings}
          requirements={requirements}
          tutors={tutors}
          demos={demos}
          reviews={reviews}
          services={services}
          onLogout={handleAdminLogout}
          onExitToPublic={handleExitAdminToPublic}
          onShowNotification={showNotification}
        />
      ) : viewMode === 'admin-portal' ? (
        <AdminPortalView
          onLoginSuccess={handleAdminLoginSuccess}
          onExitToPublic={handleExitAdminToPublic}
          onShowNotification={showNotification}
        />
      ) : (
        /* PUBLIC WEBSITE VIEW MODE */
        <div className="flex flex-col min-h-screen relative">
          {/* Notebook Paper & Education Background Structure */}
          <WebsiteBackground />
          
          {/* Main Top Navigation */}
          <Navbar
            settings={settings}
            activeTab={publicPage}
            setActiveTab={handleNavigateTab}
            onOpenTuitionForm={() => setIsTuitionModalOpen(true)}
            onOpenTutorRegister={() => setIsTutorModalOpen(true)}
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
          />

          {/* Dynamic Page Views */}
          <main className="flex-1">
            {publicPage === 'safety' ? (
              <SafetyPolicyView
                settings={settings}
                onBackToHome={() => setPublicPage('home')}
              />
            ) : publicPage === 'privacy' ? (
              <PrivacyPolicyView
                settings={settings}
                onBackToHome={() => setPublicPage('home')}
              />
            ) : publicPage === 'terms' ? (
              <TermsConditionsView
                settings={settings}
                onBackToHome={() => setPublicPage('home')}
              />
            ) : (
              <>
                {/* Hero Section */}
                <Hero
                  settings={settings}
                  onOpenTuitionForm={() => setIsTuitionModalOpen(true)}
                  onOpenTutorRegister={() => setIsTutorModalOpen(true)}
                />

                {/* How It Works (Simple 4 Step Process) */}
                <HowItWorks onOpenTuitionForm={() => setIsTuitionModalOpen(true)} />

                {/* Why Choose Us (Trusted & Convenient - 6 Practical Cards) */}
                <WhyChooseUs />

                {/* Classes & Subjects (Learn for Every Stage) */}
                <ServicesSection
                  services={services}
                  onOpenTuitionForm={() => setIsTuitionModalOpen(true)}
                  onOpenTutorRegister={() => setIsTutorModalOpen(true)}
                />

                {/* Parent Reviews */}
                <PublicReviews
                  reviews={reviews}
                  onShowNotification={showNotification}
                />

                {/* Safety Section (Your Child's Safety is Our Priority) */}
                <SafetySection
                  settings={settings}
                  onOpenTuitionForm={() => setIsTuitionModalOpen(true)}
                  onOpenTutorRegister={() => setIsTutorModalOpen(true)}
                  onViewFullPolicy={() => setPublicPage('safety')}
                />

                {/* Strong Curved Dark Blue CTA Section */}
                <CtaSection
                  onOpenTuitionForm={() => setIsTuitionModalOpen(true)}
                  whatsappNumber={settings.whatsappNumber}
                />

                {/* Contact Us Section */}
                <ContactSection
                  settings={settings}
                  onShowNotification={showNotification}
                />
              </>
            )}
          </main>

          {/* Footer */}
          <Footer
            settings={settings}
            activeTab={publicPage}
            setActiveTab={handleNavigateTab}
            onOpenTuitionForm={() => setIsTuitionModalOpen(true)}
            onOpenTutorRegister={() => setIsTutorModalOpen(true)}
          />

          {/* Sticky WhatsApp Floating Action Button & Quick Action with Night Mode positioned directly above WhatsApp */}
          <FloatingContact
            settings={settings}
            onOpenTuitionForm={() => setIsTuitionModalOpen(true)}
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
          />

        </div>
      )}

      {/* Find Home Tuition Modal (Auto Form No. HW01, HW02, WhatsApp 7520907126) */}
      <FindTuitionModal
        isOpen={isTuitionModalOpen}
        onClose={() => setIsTuitionModalOpen(false)}
        settings={settings}
        onSuccessNotification={showNotification}
      />

      {/* Become a Tutor Modal (Strictly Private, ID RHT-0001, KYC Consent) */}
      <BecomeTutorModal
        isOpen={isTutorModalOpen}
        onClose={() => setIsTutorModalOpen(false)}
        settings={settings}
        onSuccessNotification={showNotification}
      />

      {/* Admin Login Modal (Coordinator Supabase Authenticated Session) */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
        onShowNotification={showNotification}
      />

    </div>
  );
}
