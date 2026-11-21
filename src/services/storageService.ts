import { 
  TuitionRequirement, 
  Tutor, 
  Review, 
  ServiceItem, 
  WebsiteSettings, 
  DemoAssignment, 
  DemoStatus 
} from '../types';
import { 
  INITIAL_SETTINGS, 
  INITIAL_REQUIREMENTS, 
  INITIAL_TUTORS, 
  INITIAL_SERVICES, 
  INITIAL_REVIEWS,
  INITIAL_DEMO_ASSIGNMENTS
} from '../data/initialData';

const STORAGE_KEYS = {
  SETTINGS: 'rht_settings_v3',
  REQUIREMENTS: 'rht_requirements_v3',
  TUTORS: 'rht_tutors_v3',
  DEMOS: 'rht_demos_v3',
  SERVICES: 'rht_services_v3',
  REVIEWS: 'rht_reviews_v3',
  ADMIN_TOKEN: 'rht_admin_session_token_v3',
  ADMIN_USER: 'rht_admin_user_v3',
};

// Demo/seed records are only used in local development, never in a production build
const IS_DEV = import.meta.env.DEV;

export const DATA_CHANGE_EVENT = 'rht_data_changed';

function emitChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(DATA_CHANGE_EVENT));
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = inMemoryState.adminToken || (typeof window !== 'undefined' ? sessionStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) || '' : '');
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

// In-memory runtime data cache: strictly sanitized for public visitors
let inMemoryState = {
  requirements: [] as TuitionRequirement[],
  tutors: [] as Tutor[],
  demos: [] as DemoAssignment[],
  reviews: IS_DEV ? [...INITIAL_REVIEWS] : ([] as Review[]),
  services: [...INITIAL_SERVICES],
  settings: { ...INITIAL_SETTINGS },
  adminToken: typeof window !== 'undefined' ? (sessionStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) || '') : '',
  adminUser: typeof window !== 'undefined' ? (sessionStorage.getItem(STORAGE_KEYS.ADMIN_USER) || '') : '',
};

export const StorageService = {
  getAuthHeaders,

  // Synchronize data directly from Supabase via backend API
  async syncFromBackend(): Promise<void> {
    try {
      const authHeaders = getAuthHeaders();
      const hasAuth = !!authHeaders.Authorization;

      // 1. Fetch requirements (Only if coordinator authenticated)
      if (hasAuth) {
        try {
          const reqRes = await fetch('/api/requirements', { headers: authHeaders });
          if (reqRes.ok) {
            const cloudReqs: TuitionRequirement[] = await reqRes.json();
            if (Array.isArray(cloudReqs)) {
              inMemoryState.requirements = cloudReqs.length > 0 ? cloudReqs : (IS_DEV ? [...INITIAL_REQUIREMENTS] : []);
            }
          } else if (inMemoryState.requirements.length === 0) {
            inMemoryState.requirements = (IS_DEV ? [...INITIAL_REQUIREMENTS] : []);
          }
        } catch {
          if (inMemoryState.requirements.length === 0) inMemoryState.requirements = (IS_DEV ? [...INITIAL_REQUIREMENTS] : []);
        }
      } else {
        inMemoryState.requirements = [];
      }

      // 2. Fetch tutors (Only if coordinator authenticated)
      if (hasAuth) {
        try {
          const tutorsRes = await fetch('/api/tutors', { headers: authHeaders });
          if (tutorsRes.ok) {
            const cloudTutors: Tutor[] = await tutorsRes.json();
            if (Array.isArray(cloudTutors)) {
              inMemoryState.tutors = cloudTutors.length > 0 ? cloudTutors : (IS_DEV ? [...INITIAL_TUTORS] : []);
            }
          } else if (inMemoryState.tutors.length === 0) {
            inMemoryState.tutors = (IS_DEV ? [...INITIAL_TUTORS] : []);
          }
        } catch {
          if (inMemoryState.tutors.length === 0) inMemoryState.tutors = (IS_DEV ? [...INITIAL_TUTORS] : []);
        }
      } else {
        inMemoryState.tutors = [];
      }

      // 3. Fetch demo assignments (Only if coordinator authenticated)
      if (hasAuth) {
        try {
          const demoRes = await fetch('/api/demo-assignments', { headers: authHeaders });
          if (demoRes.ok) {
            const cloudDemos: DemoAssignment[] = await demoRes.json();
            if (Array.isArray(cloudDemos)) {
              inMemoryState.demos = cloudDemos.length > 0 ? cloudDemos : (IS_DEV ? [...INITIAL_DEMO_ASSIGNMENTS] : []);
            }
          } else if (inMemoryState.demos.length === 0) {
            inMemoryState.demos = (IS_DEV ? [...INITIAL_DEMO_ASSIGNMENTS] : []);
          }
        } catch {
          if (inMemoryState.demos.length === 0) inMemoryState.demos = (IS_DEV ? [...INITIAL_DEMO_ASSIGNMENTS] : []);
        }
      } else {
        inMemoryState.demos = [];
      }

      // 4. Fetch settings (Public)
      const settingsRes = await fetch('/api/settings');
      if (settingsRes.ok) {
        const cloudSettings = await settingsRes.json();
        if (cloudSettings && cloudSettings.websiteName) {
          inMemoryState.settings = { ...INITIAL_SETTINGS, ...cloudSettings };
        }
      }

      // 5. Fetch reviews (Public)
      // (coordinators receive every review for moderation, visitors only approved ones)
      const reviewsRes = await fetch('/api/reviews', { headers: authHeaders });
      if (reviewsRes.ok) {
        const cloudReviews = await reviewsRes.json();
        if (Array.isArray(cloudReviews) && (cloudReviews.length > 0 || !IS_DEV)) {
          inMemoryState.reviews = cloudReviews;
        }
      }

      // 6. Fetch services (Public). null => nothing saved yet, keep defaults
      const servicesRes = await fetch('/api/services');
      if (servicesRes.ok) {
        const cloudServices = await servicesRes.json();
        if (Array.isArray(cloudServices) && cloudServices.length > 0) {
          inMemoryState.services = cloudServices;
        }
      }

      emitChange();
    } catch (e) {
      console.warn('Backend sync skipped or offline:', e);
    }
  },

  // Supabase synchronization alias
  async syncFromSupabase(): Promise<void> {
    return this.syncFromBackend();
  },

  // SETTINGS
  getSettings(): WebsiteSettings {
    return inMemoryState.settings || INITIAL_SETTINGS;
  },

  saveSettings(settings: WebsiteSettings): void {
    inMemoryState.settings = settings;
    emitChange();

    fetch('/api/settings', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(settings),
    }).catch((err) => console.warn('Error saving settings to backend:', err));
  },

  updateSettings(settings: WebsiteSettings): void {
    this.saveSettings(settings);
  },

  // TUITION REQUIREMENTS (Unified Table: tuition_requirements)
  getRequirements(): TuitionRequirement[] {
    return inMemoryState.requirements || [];
  },

  saveRequirements(requirements: TuitionRequirement[]): void {
    inMemoryState.requirements = requirements;
    emitChange();
  },

  // The server assigns the form code (HW01, HW02…) so it is unique across all visitors.
  async addRequirement(data: Omit<TuitionRequirement, 'id' | 'reqCode' | 'status' | 'createdAt'>): Promise<TuitionRequirement> {
    const res = await fetch('/api/requirements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || 'Could not submit your requirement. Please try again.');
    const saved = body as TuitionRequirement;
    if (inMemoryState.adminToken) {
      inMemoryState.requirements = [saved, ...inMemoryState.requirements];
      emitChange();
    }
    return saved;
  },

  updateRequirement(id: string, updates: Partial<TuitionRequirement>): TuitionRequirement | null {
    const all = this.getRequirements();
    const index = all.findIndex((r) => r.id === id || r.reqCode === id);
    if (index === -1) return null;

    all[index] = { ...all[index], ...updates };
    inMemoryState.requirements = [...all];
    emitChange();

    // Persist updates to Supabase backend
    fetch(`/api/requirements/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(updates),
    }).catch((err) => console.warn('Error updating requirement in Supabase:', err));

    return all[index];
  },

  deleteRequirement(id: string): void {
    inMemoryState.requirements = inMemoryState.requirements.filter((r) => r.id !== id);
    emitChange();

    fetch(`/api/requirements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).catch((err) => console.warn('Error deleting requirement:', err));
  },

  // TUTORS (STRICTLY PRIVATE - ADMIN ONLY)
  getTutors(): Tutor[] {
    return inMemoryState.tutors || [];
  },

  saveTutors(tutors: Tutor[]): void {
    inMemoryState.tutors = tutors;
    emitChange();
  },

  // The server assigns the tutor ID (RHT-0001…) and forces status "Pending" for public sign-ups.
  async addTutor(data: Omit<Tutor, 'id' | 'status' | 'isHidden' | 'registeredAt' | 'assignedRequirementsCount'>): Promise<Tutor> {
    const res = await fetch('/api/tutors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || 'Could not complete registration. Please try again.');
    const saved = body as Tutor;
    if (inMemoryState.adminToken) {
      inMemoryState.tutors = [saved, ...inMemoryState.tutors];
      emitChange();
    }
    return saved;
  },

  updateTutor(id: string, updates: Partial<Tutor>): Tutor | null {
    const all = this.getTutors();
    const index = all.findIndex((t) => t.id === id);
    if (index === -1) return null;

    all[index] = { ...all[index], ...updates };
    inMemoryState.tutors = [...all];
    emitChange();

    // Persist updates to Supabase backend (Requires Admin Authorization)
    fetch(`/api/tutors/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(updates),
    }).catch((err) => console.warn('Error updating tutor in Supabase:', err));

    return all[index];
  },

  deleteTutor(id: string): void {
    inMemoryState.tutors = inMemoryState.tutors.filter((t) => t.id !== id);
    emitChange();

    fetch(`/api/tutors/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).catch((err) => console.warn('Error deleting tutor:', err));
  },

  // DEMO ASSIGNMENTS (Demo Class Workflow)
  getDemoAssignments(): DemoAssignment[] {
    return inMemoryState.demos || [];
  },

  addDemoAssignment(data: Omit<DemoAssignment, 'id' | 'createdAt' | 'updatedAt'>): DemoAssignment {
    const all = this.getDemoAssignments();
    const nextId = `DEMO-${String(1000 + all.length + 1)}`;
    const newDemo: DemoAssignment = {
      ...data,
      id: nextId,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    inMemoryState.demos = [newDemo, ...all];
    emitChange();

    // Also update parent requirement status to 'Demo Scheduled'
    if (data.requirementId) {
      this.updateRequirement(data.requirementId, {
        status: 'Demo Scheduled',
        assignedTutorId: data.tutorId,
        assignedTutorName: data.tutorName,
      });
    }

    // Persist to Supabase backend (Requires Admin Authorization)
    fetch('/api/demo-assignments', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(newDemo),
    }).catch((err) => console.warn('Error saving demo assignment to Supabase:', err));

    return newDemo;
  },

  updateDemoAssignment(id: string, updates: Partial<DemoAssignment>): DemoAssignment | null {
    const all = this.getDemoAssignments();
    const index = all.findIndex((d) => d.id === id);
    if (index === -1) return null;

    all[index] = {
      ...all[index],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    inMemoryState.demos = [...all];
    emitChange();

    // If Parent Approved, update requirement to 'Tuition Started'
    if (updates.status === 'PARENT_APPROVED' && all[index].requirementId) {
      this.updateRequirement(all[index].requirementId, { status: 'Tuition Started' });
    } else if (updates.status === 'CHANGE_TUTOR' && all[index].requirementId) {
      this.updateRequirement(all[index].requirementId, { status: 'Searching' });
    }

    // Persist to Supabase backend (Requires Admin Authorization)
    fetch(`/api/demo-assignments/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(updates),
    }).catch((err) => console.warn('Error updating demo assignment in Supabase:', err));

    return all[index];
  },

  deleteDemoAssignment(id: string): void {
    inMemoryState.demos = inMemoryState.demos.filter((d) => d.id !== id);
    emitChange();

    fetch(`/api/demo-assignments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).catch((err) => console.warn('Error deleting demo assignment:', err));
  },

  // REVIEWS
  getReviews(): Review[] {
    return inMemoryState.reviews || [];
  },

  getApprovedReviews(): Review[] {
    return this.getReviews().filter((r) => r.status === 'Approved');
  },

  saveReviews(reviews: Review[]): void {
    inMemoryState.reviews = reviews;
    emitChange();
  },

  // Public reviews are stored as "Pending" by the server until a coordinator approves them.
  async addReview(data: Omit<Review, 'id' | 'status' | 'date'>): Promise<Review> {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || 'Could not submit your review. Please try again.');
    const saved = body as Review;
    if (inMemoryState.adminToken) {
      inMemoryState.reviews = [saved, ...inMemoryState.reviews];
      emitChange();
    }
    return saved;
  },

  updateReviewStatus(id: string, status: Review['status']): void {
    this.updateReview(id, { status });
  },

  deleteReview(id: string): void {
    inMemoryState.reviews = inMemoryState.reviews.filter((r) => r.id !== id);
    emitChange();
    fetch(`/api/reviews/${id}`, { method: 'DELETE', headers: getAuthHeaders() })
      .catch((err) => console.warn('Error deleting review:', err));
  },

  updateReview(id: string, updates: Partial<Review>): Review | null {
    const all = this.getReviews();
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...updates };
    inMemoryState.reviews = [...all];
    emitChange();
    fetch(`/api/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(updates),
    }).catch((err) => console.warn('Error updating review:', err));
    return all[idx];
  },

  // SERVICES
  getServices(): ServiceItem[] {
    return inMemoryState.services || [];
  },

  getVisibleServices(): ServiceItem[] {
    return this.getServices().filter((s) => s.isVisible);
  },

  persistServices(): void {
    fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(inMemoryState.services),
    }).catch((err) => console.warn('Error saving services:', err));
  },

  saveServices(services: ServiceItem[]): void {
    inMemoryState.services = services;
    emitChange();
    this.persistServices();
  },

  addService(data: Omit<ServiceItem, 'id'>): ServiceItem {
    const all = this.getServices();
    const newService: ServiceItem = {
      ...data,
      id: `srv-${Date.now().toString().slice(-4)}`,
    };
    inMemoryState.services = [...all, newService];
    emitChange();
    this.persistServices();
    return newService;
  },

  updateService(id: string, updates: Partial<ServiceItem>): ServiceItem | null {
    const all = this.getServices();
    const idx = all.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...updates };
    inMemoryState.services = [...all];
    emitChange();
    this.persistServices();
    return all[idx];
  },

  deleteService(id: string): void {
    inMemoryState.services = inMemoryState.services.filter((s) => s.id !== id);
    emitChange();
    this.persistServices();
  },

  // ==========================================
  // ADMIN AUTHENTICATION (SECURE SERVER-VERIFIED)
  // ==========================================
  // No passwords or secret keys stored in source code!
  // Uses backend API for authentication and session verification.

  async loginAdmin(emailInput: string, passwordInput: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim(), password: passwordInput.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.ok && data.token) {
        inMemoryState.adminToken = data.token;
        inMemoryState.adminUser = JSON.stringify(data.user);
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, data.token);
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(data.user));
        // Immediately load authenticated coordinator data
        await this.syncFromBackend();
        emitChange();
        return { success: true };
      }

      return { success: false, error: data.error || 'Invalid credentials' };
    } catch (err: any) {
      return { success: false, error: 'Could not connect to authentication service.' };
    }
  },

  isAdminLoggedIn(): boolean {
    return !!inMemoryState.adminToken;
  },

  isAdminAuthenticated(): boolean {
    return !!inMemoryState.adminToken;
  },

  async verifyAdminSession(): Promise<boolean> {
    const token = inMemoryState.adminToken || sessionStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
    if (!token) return false;

    try {
      const res = await fetch('/api/auth/session', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          // If inMemoryState is not yet synced, sync now
          if (inMemoryState.tutors.length === 0) {
            await this.syncFromBackend();
          }
          return true;
        }
      }
    } catch {}

    // Invalidate local token if server rejected it
    this.logoutAdmin();
    return false;
  },

  logoutAdmin(): void {
    const token = inMemoryState.adminToken;
    inMemoryState.adminToken = '';
    inMemoryState.adminUser = '';
    // Wipe all sensitive private records immediately from client memory
    inMemoryState.requirements = [];
    inMemoryState.tutors = [];
    inMemoryState.demos = [];
    inMemoryState.reviews = inMemoryState.reviews.filter((r) => r.status === 'Approved');
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
    emitChange();

    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  },

  getAdminUser(): { email?: string; name?: string; role?: string } | null {
    try {
      if (inMemoryState.adminUser) {
        return JSON.parse(inMemoryState.adminUser);
      }
    } catch {}
    return null;
  },

  // DATA BACKUP & RESTORE
  exportBackupJson(): string {
    const data = {
      settings: this.getSettings(),
      requirements: this.getRequirements(),
      tutors: this.getTutors(),
      demos: this.getDemoAssignments(),
      services: this.getServices(),
      reviews: this.getReviews(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  },

  importBackupJson(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.requirements)) inMemoryState.requirements = data.requirements;
      if (Array.isArray(data.tutors)) inMemoryState.tutors = data.tutors;
      if (Array.isArray(data.demos)) inMemoryState.demos = data.demos;
      if (Array.isArray(data.services)) inMemoryState.services = data.services;
      if (Array.isArray(data.reviews)) inMemoryState.reviews = data.reviews;
      if (data.settings) inMemoryState.settings = { ...INITIAL_SETTINGS, ...data.settings };
      emitChange();
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },

  resetToDefaults(): void {
    inMemoryState.settings = { ...INITIAL_SETTINGS };
    inMemoryState.requirements = (IS_DEV ? [...INITIAL_REQUIREMENTS] : []);
    inMemoryState.tutors = (IS_DEV ? [...INITIAL_TUTORS] : []);
    inMemoryState.demos = (IS_DEV ? [...INITIAL_DEMO_ASSIGNMENTS] : []);
    inMemoryState.services = [...INITIAL_SERVICES];
    inMemoryState.reviews = IS_DEV ? [...INITIAL_REVIEWS] : [];
    emitChange();
  },
};

// ==========================================
// WHATSAPP URL & MESSAGE HELPERS
// ==========================================

export function getWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  // Default to 91 country code for Ranchi, India if 10 digits
  const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${targetPhone}?text=${encoded}`;
}

export function formatPreferredTimingText(timeFrom: string, timeTo: string): string {
  if (!timeFrom && !timeTo) return 'Flexible';
  const fromClean = (timeFrom || '').trim();
  const toClean = (timeTo || '').trim();

  // If already contains slot name
  if (fromClean.includes('Morning') || fromClean.includes('Midday') || fromClean.includes('Evening')) {
    return toClean ? `${fromClean} – ${toClean}` : fromClean;
  }

  // Morning check (7 AM to 10 AM)
  if ((fromClean.includes('7:00') || fromClean.includes('7 AM') || fromClean.includes('07:00')) && 
      (toClean.includes('10:00') || toClean.includes('10 AM'))) {
    return 'Morning (7 AM to 10 AM)';
  }

  // Midday/Noon check (11 AM to 3 PM)
  if ((fromClean.includes('11:00') || fromClean.includes('11 AM')) && 
      (toClean.includes('3:00') || toClean.includes('03:00') || toClean.includes('3 PM'))) {
    return 'Midday/Noon (11 AM To 3 PM)';
  }

  // Evening check (3:00 PM – 8:00 PM)
  if ((fromClean.includes('3:00') || fromClean.includes('03:00') || fromClean.includes('3 PM') || fromClean.includes('after 3')) && 
      (toClean.includes('8:00') || toClean.includes('08:00') || toClean.includes('8 PM') || toClean.includes('7:00'))) {
    return 'Evening (3:00 PM – 8:00 PM)';
  }

  if (fromClean && toClean) {
    return `${fromClean} – ${toClean}`;
  }
  return fromClean || toClean || 'Flexible';
}

export function formatParentRequirementWhatsAppText(req: TuitionRequirement): string {
  const timing = formatPreferredTimingText(req.timeFrom, req.timeTo);

  return `*NEW TUITION REQUIREMENT*

Requirement ID: ${req.reqCode || req.id}

Parent: ${req.parentName}
Student: ${req.studentName}

Class: ${req.classes.join(', ')}
Subjects: ${req.subjects.join(', ')}

Area: ${req.area}

Classes per week: ${req.classesPerWeek || 5}

Preferred time: ${timing}

Tutor preference: ${req.preferredTutor || 'Any'}

Budget: ${req.budget || 'Negotiable'}

Additional requirement:
${req.additionalRequirements || 'None'}

Please contact me regarding this tuition requirement.`;
}

export function formatChannelTutorBroadcastText(req: TuitionRequirement, adminWhatsApp: string): string {
  const timing = formatPreferredTimingText(req.timeFrom, req.timeTo);

  return `📢 *NEW HOME TUITION REQUIREMENT (Ranchi)*

📌 *Requirement Code:* ${req.reqCode}
📚 *Class:* ${req.classes.join(', ')}
📖 *Subjects:* ${req.subjects.join(', ')}
📍 *Area / Location:* ${req.area}
🗓️ *Classes Per Week:* ${req.classesPerWeek} days/week
⏰ *Preferred Time:* ${timing}
👤 *Tutor Preference:* ${req.preferredTutor}
💰 *Estimated Budget:* ${req.budget}
📝 *Remarks:* ${req.additionalRequirements || 'Regular syllabus & test revision required.'}

Interested verified tutors, please send your *Tutor ID* and availability directly to Admin on WhatsApp: *${adminWhatsApp}*.

_Ranchi HomeTutor Wala — Learn Today, Lead Tomorrow_`;
}

export function formatDemoConfirmationWhatsAppText(demo: DemoAssignment, adminWhatsApp: string): string {
  return `🎓 *HOME TUITION DEMO CLASS SCHEDULED*

📌 *Demo Ref:* ${demo.id}
📝 *Requirement:* ${demo.requirementId}
👨‍🏫 *Assigned Tutor:* ${demo.tutorName} (ID: ${demo.tutorId})
👨‍👩‍👦 *Student / Parent:* ${demo.studentName} (${demo.parentName})
📚 *Subjects:* ${demo.subjects.join(', ')} (${demo.classes.join(', ')})
📅 *Date:* ${demo.demoDate}
⏰ *Time:* ${demo.demoTime}
📍 *Location:* ${demo.demoLocation}

Coordinator Desk: *${adminWhatsApp}*
_Ranchi HomeTutor Wala — 1-to-1 Learning in Ranchi_`;
}
