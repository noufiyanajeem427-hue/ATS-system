import React, { useState, useRef, useEffect } from 'react';
import Topbar from '../components/Topbar';
import jsPDF from 'jspdf';
import { ButtonSpinner } from '../components/Loading';
import { fetchUserProfile } from '../services/api';
import {
  MapPin, Mail, Phone, Globe,
  Edit3, Plus, Trash2, Check, X, Camera, Briefcase,
  GraduationCap, Award, Star,
  Download, Sparkles, TrendingUp, Save, Shield,
  Clock, DollarSign, Building2, Heart, Zap, Copy,
  Share2
} from 'lucide-react';
import { Page } from '../App';

interface ProfileProps {
  onMenuClick?: () => void;
  onNavigate?: (p: Page, job?: any) => void;
}

interface Experience {
  id: number; company: string; role: string; period: string;
  location: string; description: string; logo: string; logoBg: string; current: boolean;
}
interface Education {
  id: number; school: string; degree: string; field: string;
  year: string; gpa: string; logo: string; logoBg: string;
}
interface Certification {
  id: number; name: string; issuer: string; year: string; color: string;
}

const Profile: React.FC<ProfileProps> = ({ onMenuClick, onNavigate }) => {
  const [toast, setToast] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info'>('success');
  const [activeTab, setActiveTab] = useState<'about' | 'experience' | 'education' | 'skills'>('about');
  
  // Edit & Modal States
  const [editingBio, setEditingBio] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [editingPrefs, setEditingPrefs] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Images state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  // Profile Data State
  const [profileHeader, setProfileHeader] = useState({
    name: 'Alex Rivera',
    title: 'Staff Product Designer & Design Systems Architect',
    location: 'San Francisco, CA • Remote',
    experienceYears: '8+ Years Exp',
  });

  const [contact, setContact] = useState({
    email: 'alex.rivera@email.com',
    phone: '+1 (415) 555-0192',
    location: 'San Francisco, CA',
    website: 'https://alexrivera.design',
    linkedin: 'linkedin.com/in/alexrivera-design',
    github: 'github.com/alexrivera-ui',
  });

  const [bio, setBio] = useState(
    "Senior Product Designer & Design Systems Architect with 8+ years leading end-to-end design initiatives for AI-driven fintech and enterprise platforms. Specialized in building multi-modal UI frameworks, accessibility standards, and high-conversion candidate tracking workflows. Experienced in scaling design systems across distributed cross-functional engineering teams."
  );

  const [prefs, setPrefs] = useState({
    role: 'Staff / Principal Product Designer',
    type: 'Full-time',
    workMode: 'Remote or Hybrid (SF Bay Area)',
    salary: '$180k - $240k Base + Equity',
    availability: '2 Weeks Notice',
  });

  const [skills, setSkills] = useState([
    { id: 1, name: 'Figma & Design Systems', level: 98, category: 'Design & Craft' },
    { id: 2, name: 'UI Prototyping (ProtoPie)', level: 92, category: 'Design & Craft' },
    { id: 3, name: 'React & Component Specs', level: 85, category: 'Engineering & Tech' },
    { id: 4, name: 'User Research & Usability', level: 88, category: 'Strategy & Research' },
    { id: 5, name: 'Tailwind CSS & Token Systems', level: 90, category: 'Engineering & Tech' },
    { id: 6, name: 'Agentic AI Interface Design', level: 94, category: 'AI & Innovation' },
  ]);

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: 1,
      role: 'Staff Product Designer',
      company: 'Nexus AI Systems',
      period: '2022 — Present (1 yr 10 mos)',
      location: 'San Francisco, CA (Hybrid)',
      description: 'Architected the core AI ATS design tokens used by 45+ enterprise accounts. Reduced recruiter application triage time by 38% through AI matching UI pattern designs.',
      logo: 'NX',
      logoBg: 'linear-gradient(135deg,#6c63ff,#8b5cf6)',
      current: true,
    },
    {
      id: 2,
      role: 'Senior UI/UX Designer',
      company: 'Fintech Flow Labs',
      period: '2019 — 2022 (3 yrs)',
      location: 'New York, NY (Remote)',
      description: 'Led a 5-person design squad managing mobile and desktop payment interfaces processing $2B+ annual volume. Built a multi-brand design system adoption strategy.',
      logo: 'FF',
      logoBg: 'linear-gradient(135deg,#3b82f6,#06b6d4)',
      current: false,
    },
    {
      id: 3,
      role: 'Product Designer',
      company: 'Creative Cloud Interactive',
      period: '2016 — 2019 (3 yrs)',
      location: 'Austin, TX',
      description: 'Designed interactive web dashboards and SaaS workflows. Conducted over 120 user testing sessions to iterate on onboarding flow optimization.',
      logo: 'CC',
      logoBg: 'linear-gradient(135deg,#ec4899,#8b5cf6)',
      current: false,
    },
  ]);

  const [educations, setEducations] = useState<Education[]>([
    {
      id: 1,
      school: 'University of California, Berkeley',
      degree: 'Bachelor of Science (B.S.)',
      field: 'Human-Computer Interaction & Cognitive Science',
      year: '2016',
      gpa: '3.88 / 4.0',
      logo: 'CAL',
      logoBg: 'linear-gradient(135deg,#f59e0b,#d97706)',
    },
  ]);

  const [certifications, setCertifications] = useState<Certification[]>([
    { id: 1, name: 'Certified Design Systems Specialist', issuer: 'Interaction Design Foundation', year: '2023', color: '#6c63ff' },
    { id: 2, name: 'Advanced Human-AI Interface Systems', issuer: 'Stanford Online', year: '2022', color: '#00c853' },
    { id: 3, name: 'Enterprise Accessibility Specialist (WCAG 2.1 AAA)', issuer: 'IAAP', year: '2021', color: '#8b5cf6' },
  ]);

  // Temporary edit form states
  const [bioTemp, setBioTemp] = useState(bio);
  const [contactTemp, setContactTemp] = useState(contact);
  const [prefsTemp, setPrefsTemp] = useState(prefs);
  const [newSkill, setNewSkill] = useState('');
  const [editHeaderTemp, setEditHeaderTemp] = useState(profileHeader);

  useEffect(() => {
    fetchUserProfile().then(data => {
      if (data && data.name) {
        setProfileHeader(prev => ({
          ...prev,
          name: data.name || prev.name,
          title: data.title || prev.title,
        }));
        if (data.email) {
          setContact(prev => ({ ...prev, email: data.email }));
        }
      }
    });
  }, []);

  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToastType(type);
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Image Upload Handlers
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'info');
        return;
      }
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      showToast('Profile photo updated!');
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        showToast('Cover image should be under 8MB', 'info');
        return;
      }
      const url = URL.createObjectURL(file);
      setCoverUrl(url);
      showToast('Banner cover photo updated!');
    }
  };

  // PDF Resume Generation
  const downloadResumePDF = () => {
    setDownloadingPDF(true);
    try {
      const doc = new jsPDF();
      
      // Header banner background
      doc.setFillColor(26, 26, 46);
      doc.rect(0, 0, 210, 45, 'F');
      
      // Header Name & Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text(profileHeader.name, 15, 20);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(167, 139, 250);
      doc.text(profileHeader.title, 15, 28);

      doc.setFontSize(9);
      doc.setTextColor(200, 205, 225);
      doc.text(`${contact.email}  |  ${contact.phone}  |  ${contact.location}`, 15, 36);

      // Section: Professional Summary
      let y = 58;
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(108, 99, 255);
      doc.text('PROFESSIONAL SUMMARY', 15, y);

      y += 6;
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 60);
      const splitBio = doc.splitTextToSize(bio, 180);
      doc.text(splitBio, 15, y);
      y += (splitBio.length * 5) + 8;

      // Section: Experience
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(108, 99, 255);
      doc.text('WORK EXPERIENCE', 15, y);
      y += 8;

      experiences.forEach(exp => {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 30, 40);
        doc.text(`${exp.role} — ${exp.company}`, 15, y);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(120, 120, 140);
        doc.text(`${exp.period} | ${exp.location}`, 15, y + 5);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 75);
        const splitDesc = doc.splitTextToSize(exp.description, 180);
        doc.text(splitDesc, 15, y + 11);

        y += (splitDesc.length * 4.5) + 16;
      });

      // Section: Skills
      y += 4;
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(108, 99, 255);
      doc.text('CORE COMPETENCIES & SKILLS', 15, y);

      y += 7;
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 60);
      const skillText = skills.map(s => `${s.name} (${s.level}%)`).join('  •  ');
      const splitSkills = doc.splitTextToSize(skillText, 180);
      doc.text(splitSkills, 15, y);

      doc.save(`${profileHeader.name.replace(/\s+/g, '_')}_Resume.pdf`);
      showToast('✓ PDF Resume downloaded successfully!');
    } catch (err) {
      showToast('Generating PDF Resume...', 'info');
    } finally {
      setTimeout(() => setDownloadingPDF(false), 500);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    showToast('Profile link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const saveBio = () => {
    setBio(bioTemp);
    setEditingBio(false);
    showToast('About bio section saved successfully!');
  };

  const saveContact = () => {
    setContact(contactTemp);
    setEditingContact(false);
    showToast('Contact details updated!');
  };

  const savePrefs = () => {
    setPrefs(prefsTemp);
    setEditingPrefs(false);
    showToast('Job preferences saved!');
  };

  const saveHeaderEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileHeader(editHeaderTemp);
    setShowEditProfileModal(false);
    showToast('Profile title and location updated!');
  };

  const removeSkill = (id: number) => {
    setSkills(s => s.filter(x => x.id !== id));
    showToast('Skill item removed.');
  };

  const removeExperience = (id: number) => {
    setExperiences(e => e.filter(x => x.id !== id));
    showToast('Experience entry removed.');
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setSkills(s => [...s, { id: Date.now(), name: newSkill.trim(), level: 70, category: 'Other' }]);
    setNewSkill(''); setShowSkillModal(false);
    showToast(`Skill "${newSkill.trim()}" added!`);
  };

  const skillCategories = Array.from(new Set(skills.map(s => s.category)));
  const levelLabel = (l: number) => l >= 90 ? 'Expert' : l >= 75 ? 'Advanced' : l >= 60 ? 'Intermediate' : 'Beginner';
  const levelColor = (l: number) => l >= 90 ? '#00c853' : l >= 75 ? '#6c63ff' : l >= 60 ? '#f59e0b' : '#8890a4';

  const completeness = 87;

  return (
    <div className="flex flex-col min-h-screen w-full lg:w-[calc(100vw-220px)] lg:ml-[220px] bg-[#f4f6fb] dark:bg-[#0b0f19] text-[#1a1a2e] dark:text-[#f8fafc] overflow-x-hidden transition-colors duration-200">
      <Topbar onMenuClick={onMenuClick} onNavigate={onNavigate} />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 text-white px-4 py-3 rounded-xl shadow-2xl border animate-bounce ${toastType === 'success' ? 'bg-[#1a1a2e] border-[#00c853]/40' : 'bg-[#1a1a2e] border-[#6c63ff]/40'}`}>
          <Check size={14} className={toastType === 'success' ? 'text-[#00c853]' : 'text-[#6c63ff]'} />
          <span className="text-xs font-medium">{toast}</span>
          <button onClick={() => setToast(null)} className="text-[#8890a4] hover:text-white bg-transparent border-none cursor-pointer"><X size={12} /></button>
        </div>
      )}

      {/* Hidden file inputs for Avatar and Cover Banner */}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
      <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />

      {/* ── MODALS ── */}

      {/* 1. Add Skill Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111827] border border-[#e4e8f0] dark:border-[#1f2d42] rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc]">Add New Skill</h3>
              <button onClick={() => setShowSkillModal(false)} className="bg-transparent border-none cursor-pointer text-[#8890a4] dark:text-[#94a3b8] hover:text-[#1a1a2e] dark:hover:text-[#f8fafc]"><X size={18} /></button>
            </div>
            <input
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
              placeholder="e.g. Motion Design, SQL..."
              className="w-full px-4 py-3 rounded-xl border border-[#e4e8f0] dark:border-[#1f2d42] bg-[#f8f9fc] dark:bg-[#161e2e] text-[13px] text-[#1a1a2e] dark:text-[#f8fafc] outline-none focus:border-[#6c63ff] mb-4"
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={() => setShowSkillModal(false)} className="flex-1 py-2.5 rounded-xl border border-[#e4e8f0] dark:border-[#1f2d42] text-[13px] font-bold text-[#8890a4] dark:text-[#94a3b8] bg-transparent cursor-pointer hover:text-[#1a1a2e] transition-colors">Cancel</button>
              <button onClick={addSkill} className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white border-none cursor-pointer" style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}>Add Skill</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Share Profile Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111827] border border-[#e4e8f0] dark:border-[#1f2d42] rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Share2 size={18} className="text-[#6c63ff]" />
                <h3 className="text-[16px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc]">Share Profile</h3>
              </div>
              <button onClick={() => setShowShareModal(false)} className="bg-transparent border-none cursor-pointer text-[#8890a4] dark:text-[#94a3b8] hover:text-[#1a1a2e] dark:hover:text-[#f8fafc]"><X size={18} /></button>
            </div>

            <p className="text-[12px] text-[#8890a4] dark:text-[#94a3b8] mb-4">Share your verified Nexus ATS candidate profile with recruiters or hiring managers.</p>

            <div className="flex items-center gap-2 p-2 bg-[#f4f6fb] dark:bg-[#161e2e] rounded-xl border border-[#e4e8f0] dark:border-[#1f2d42] mb-5">
              <input
                readOnly
                value={window.location.href}
                className="flex-1 bg-transparent text-[12px] text-[#4a5068] dark:text-[#cbd5e1] px-2 outline-none"
              />
              <button
                onClick={copyShareLink}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-bold transition-all border-none cursor-pointer ${copiedLink ? 'bg-[#00c853] text-white' : 'bg-[#6c63ff] text-white hover:bg-[#8b5cf6]'}`}
              >
                {copiedLink ? <Check size={13} /> : <Copy size={13} />}
                {copiedLink ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => { copyShareLink(); window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank'); }}
                className="py-2.5 rounded-xl border border-[#e4e8f0] dark:border-[#1f2d42] text-[12px] font-bold text-[#0a66c2] bg-[#0a66c2]/8 hover:bg-[#0a66c2]/15 cursor-pointer border-none"
              >
                LinkedIn
              </button>
              <button
                onClick={() => { copyShareLink(); window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Check out my candidate profile!`, '_blank'); }}
                className="py-2.5 rounded-xl border border-[#e4e8f0] dark:border-[#1f2d42] text-[12px] font-bold text-[#1da1f2] bg-[#1da1f2]/8 hover:bg-[#1da1f2]/15 cursor-pointer border-none"
              >
                Twitter / X
              </button>
              <button
                onClick={() => { window.location.href = `mailto:?subject=Candidate Profile - ${profileHeader.name}&body=View my profile here: ${window.location.href}`; }}
                className="py-2.5 rounded-xl border border-[#e4e8f0] dark:border-[#1f2d42] text-[12px] font-bold text-[#6c63ff] bg-[#6c63ff]/8 hover:bg-[#6c63ff]/15 cursor-pointer border-none"
              >
                Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Edit Profile Header Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111827] border border-[#e4e8f0] dark:border-[#1f2d42] rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#f0f2f8] dark:border-[#1f2d42]">
              <h3 className="text-[18px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc]">Edit Profile Header</h3>
              <button onClick={() => setShowEditProfileModal(false)} className="bg-transparent border-none cursor-pointer text-[#8890a4] dark:text-[#94a3b8] hover:text-[#1a1a2e]"><X size={18} /></button>
            </div>
            
            <form onSubmit={saveHeaderEdit} className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#8890a4] dark:text-[#94a3b8] uppercase mb-1 block">Full Name</label>
                <input
                  value={editHeaderTemp.name}
                  onChange={e => setEditHeaderTemp({ ...editHeaderTemp, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e8f0] dark:border-[#1f2d42] bg-[#f8f9fc] dark:bg-[#161e2e] text-[13px] text-[#1a1a2e] dark:text-[#f8fafc] outline-none focus:border-[#6c63ff]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#8890a4] dark:text-[#94a3b8] uppercase mb-1 block">Professional Headline</label>
                <input
                  value={editHeaderTemp.title}
                  onChange={e => setEditHeaderTemp({ ...editHeaderTemp, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e8f0] dark:border-[#1f2d42] bg-[#f8f9fc] dark:bg-[#161e2e] text-[13px] text-[#1a1a2e] dark:text-[#f8fafc] outline-none focus:border-[#6c63ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#8890a4] dark:text-[#94a3b8] uppercase mb-1 block">Location</label>
                  <input
                    value={editHeaderTemp.location}
                    onChange={e => setEditHeaderTemp({ ...editHeaderTemp, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e8f0] dark:border-[#1f2d42] bg-[#f8f9fc] dark:bg-[#161e2e] text-[13px] text-[#1a1a2e] dark:text-[#f8fafc] outline-none focus:border-[#6c63ff]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#8890a4] dark:text-[#94a3b8] uppercase mb-1 block">Experience Level</label>
                  <input
                    value={editHeaderTemp.experienceYears}
                    onChange={e => setEditHeaderTemp({ ...editHeaderTemp, experienceYears: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e8f0] dark:border-[#1f2d42] bg-[#f8f9fc] dark:bg-[#161e2e] text-[13px] text-[#1a1a2e] dark:text-[#f8fafc] outline-none focus:border-[#6c63ff]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#f0f2f8] dark:border-[#1f2d42] justify-end">
                <button type="button" onClick={() => setShowEditProfileModal(false)} className="px-4 py-2 rounded-xl text-[12px] font-bold text-[#8890a4] dark:text-[#94a3b8] bg-transparent border border-[#e4e8f0] dark:border-[#1f2d42]">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer" style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* ── Banner & Profile Card ── */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-sm border border-[#e4e8f0]/60 dark:border-[#1f2d42] overflow-hidden mb-6">
          
          {/* Cover Banner */}
          <div
            className="h-36 sm:h-48 w-full relative bg-cover bg-center"
            style={{
              background: coverUrl ? `url(${coverUrl}) center/cover` : 'linear-gradient(135deg,#1a1a2e 0%,#2d1b4e 50%,#0f3460 100%)',
            }}
          >
            <button
              onClick={() => coverRef.current?.click()}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold border border-white/30 flex items-center gap-1.5 cursor-pointer transition-all"
              title="Change Banner Photo"
            >
              <Camera size={13} /> Change Cover
            </button>
          </div>

          {/* Avatar & Header Content */}
          <div className="px-6 sm:px-8 pb-6 relative pt-0">
            {/* Avatar Image */}
            <div className="relative -mt-16 sm:-mt-20 mb-4 inline-block">
              <div
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-4 border-white dark:border-[#111827] shadow-xl flex items-center justify-center text-white text-3xl font-black overflow-hidden bg-cover bg-center"
                style={{
                  background: avatarUrl ? `url(${avatarUrl}) center/cover` : 'linear-gradient(135deg,#6c63ff,#a78bfa)',
                }}
              >
                {!avatarUrl && 'AR'}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#6c63ff] flex items-center justify-center border-2 border-white dark:border-[#111827] cursor-pointer hover:bg-[#8b5cf6] transition-all shadow-md"
                title="Change Avatar Photo"
              >
                <Camera size={12} className="text-white" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-[26px] font-black text-[#1a1a2e] dark:text-[#f8fafc] tracking-tight">{profileHeader.name}</h1>
                <p className="text-[14px] text-[#4a5068] dark:text-[#cbd5e1] font-semibold mb-2">{profileHeader.title} · {profileHeader.experienceYears}</p>
                <div className="flex flex-wrap gap-3">
                  <span className="flex items-center gap-1 text-[12px] text-[#8890a4] dark:text-[#94a3b8]"><MapPin size={12} /> {contact.location}</span>
                  <span className="flex items-center gap-1 text-[12px] text-[#8890a4] dark:text-[#94a3b8]"><Mail size={12} /> {contact.email}</span>
                  <span className="flex items-center gap-1 text-[12px] text-[#00c853] font-bold bg-[#00c853]/10 px-2 py-0.5 rounded-full"><Briefcase size={11} /> Open to Work</span>
                </div>
              </div>

              {/* Action Buttons: Resume Download, Share, Edit */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={downloadResumePDF}
                  disabled={downloadingPDF}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-bold text-[#4a5068] dark:text-[#cbd5e1] bg-[#f4f6fb] dark:bg-[#161e2e] border border-[#e4e8f0] dark:border-[#1f2d42] cursor-pointer hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all shadow-xs active:scale-95 disabled:opacity-60"
                  title="Download PDF Resume"
                >
                  {downloadingPDF ? <ButtonSpinner size={14} color="#6c63ff" /> : <Download size={14} className="text-[#6c63ff]" />} Resume PDF
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-bold text-[#4a5068] dark:text-[#cbd5e1] bg-[#f4f6fb] dark:bg-[#161e2e] border border-[#e4e8f0] dark:border-[#1f2d42] cursor-pointer hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all shadow-xs active:scale-95"
                  title="Share Profile Link"
                >
                  <Share2 size={14} className="text-[#6c63ff]" /> Share
                </button>
                <button
                  onClick={() => {
                    setEditHeaderTemp(profileHeader);
                    setBioTemp(bio);
                    setContactTemp(contact);
                    setShowEditProfileModal(true);
                  }}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 4px 14px rgba(108,99,255,0.35)' }}
                >
                  <Edit3 size={14} /> Edit Profile
                </button>
              </div>
            </div>

            {/* Profile Completeness */}
            <div
              onClick={() => {
                setEditHeaderTemp(profileHeader);
                setBioTemp(bio);
                setContactTemp(contact);
                setShowEditProfileModal(true);
              }}
              className="mt-5 p-4 bg-[#f8f9fc] dark:bg-[#161e2e] hover:bg-[#6c63ff]/5 rounded-xl border border-[#e4e8f0] dark:border-[#1f2d42] hover:border-[#6c63ff]/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles size={13} className="text-[#6c63ff]" />
                  <span className="text-[12px] font-bold text-[#1a1a2e] dark:text-[#f8fafc] group-hover:text-[#6c63ff] transition-colors">Profile Completeness</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#6c63ff] dark:text-[#a78bfa] hover:underline">Complete Remaining 13% →</span>
                  <span className="text-[13px] font-black text-[#6c63ff] dark:text-[#a78bfa] bg-[#6c63ff]/10 px-2 py-0.5 rounded-md">{completeness}%</span>
                </div>
              </div>
              <div className="h-2 bg-[#e4e8f0] dark:bg-[#26334d] rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${completeness}%`, background: 'linear-gradient(90deg,#6c63ff,#8b5cf6,#00c853)' }} />
              </div>
              <p className="text-[11px] text-[#8890a4] dark:text-[#94a3b8]">Click here to add your portfolio website, phone number, and 2 more skills to reach 100%.</p>
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">

          {/* ── Left: Tabs + Content ── */}
          <div className="flex flex-col gap-5">

            {/* Tab Bar */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-sm border border-[#e4e8f0]/60 dark:border-[#1f2d42] overflow-hidden">
              <div className="flex border-b border-[#e4e8f0] dark:border-[#1f2d42]">
                {(['about','experience','education','skills'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`flex-1 py-3.5 text-[12px] font-bold capitalize transition-all border-none cursor-pointer ${activeTab === t ? 'text-[#6c63ff] dark:text-[#a78bfa] bg-[#6c63ff]/5' : 'text-[#8890a4] dark:text-[#94a3b8] bg-transparent hover:text-[#4a5068] dark:hover:text-[#cbd5e1]'}`}
                    style={{ borderBottom: activeTab === t ? '2px solid #6c63ff' : '2px solid transparent' }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="p-5">

                {/* ── ABOUT TAB ── */}
                {activeTab === 'about' && (
                  <div className="flex flex-col gap-5">
                    {/* Bio */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[14px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc]">About</h3>
                        <button onClick={() => { setEditingBio(!editingBio); setBioTemp(bio); }} className="text-[11px] font-bold text-[#6c63ff] dark:text-[#a78bfa] bg-transparent border-none cursor-pointer flex items-center gap-1 hover:underline">
                          <Edit3 size={11} /> {editingBio ? 'Cancel' : 'Edit'}
                        </button>
                      </div>
                      {editingBio ? (
                        <div className="flex flex-col gap-2">
                          <textarea value={bioTemp} onChange={e => setBioTemp(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl border border-[#6c63ff] bg-[#f8f9fc] dark:bg-[#161e2e] text-[13px] text-[#4a5068] dark:text-[#cbd5e1] leading-relaxed outline-none resize-none" />
                          <button onClick={saveBio} className="self-end flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer" style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}>
                            <Save size={12} /> Save
                          </button>
                        </div>
                      ) : (
                        <p className="text-[13px] text-[#4a5068] dark:text-[#cbd5e1] leading-relaxed">{bio}</p>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[14px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc]">Contact Info</h3>
                        <button onClick={() => { setEditingContact(!editingContact); setContactTemp(contact); }} className="text-[11px] font-bold text-[#6c63ff] dark:text-[#a78bfa] bg-transparent border-none cursor-pointer flex items-center gap-1 hover:underline">
                          <Edit3 size={11} /> {editingContact ? 'Cancel' : 'Edit'}
                        </button>
                      </div>
                      {editingContact ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(Object.keys(contactTemp) as (keyof typeof contactTemp)[]).map(key => (
                            <div key={key}>
                              <label className="text-[10px] font-bold text-[#b0b8cc] dark:text-[#64748b] uppercase tracking-wider block mb-1">{key}</label>
                              <input value={contactTemp[key]} onChange={e => setContactTemp(c => ({...c, [key]: e.target.value}))} className="w-full px-3 py-2 rounded-xl border border-[#e4e8f0] dark:border-[#1f2d42] bg-[#f8f9fc] dark:bg-[#161e2e] text-[12px] text-[#1a1a2e] dark:text-[#f8fafc] outline-none focus:border-[#6c63ff]" />
                            </div>
                          ))}
                          <div className="col-span-full flex justify-end">
                            <button onClick={saveContact} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer" style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}>
                              <Save size={12} /> Save Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { icon: <Mail size={13} className="text-[#6c63ff]" />, label: 'Email',    value: contact.email },
                            { icon: <Phone size={13} className="text-[#6c63ff]" />, label: 'Phone',  value: contact.phone },
                            { icon: <MapPin size={13} className="text-[#6c63ff]" />, label: 'Location', value: contact.location },
                            { icon: <Globe size={13} className="text-[#6c63ff]" />, label: 'Website', value: contact.website },
                            { icon: <Globe size={13} className="text-[#0a66c2]" />, label: 'LinkedIn', value: contact.linkedin },
                            { icon: <Globe size={13} className="text-[#6c63ff]" />, label: 'GitHub',  value: contact.github },
                          ].map(({ icon, label, value }) => (
                            <div key={label} className="flex items-center gap-2.5 p-3 bg-[#f8f9fc] dark:bg-[#161e2e] rounded-xl border border-[#e4e8f0] dark:border-[#1f2d42]">
                              <div className="w-7 h-7 rounded-lg bg-white dark:bg-[#111827] flex items-center justify-center shadow-sm flex-shrink-0">{icon}</div>
                              <div>
                                <p className="text-[9px] font-bold text-[#b0b8cc] dark:text-[#64748b] uppercase tracking-wider">{label}</p>
                                <p className="text-[12px] font-semibold text-[#4a5068] dark:text-[#cbd5e1] truncate">{value}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Certifications */}
                    <div>
                      <h3 className="text-[14px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc] mb-3">Certifications</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {certifications.map(c => (
                          <div key={c.id} className="flex items-center gap-3 p-3 bg-[#f8f9fc] dark:bg-[#161e2e] rounded-xl border border-[#e4e8f0] dark:border-[#1f2d42] hover:border-[#6c63ff]/30 transition-colors">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${c.color}20` }}>
                              <Award size={16} style={{ color: c.color }} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[12px] font-bold text-[#1a1a2e] dark:text-[#f8fafc] truncate">{c.name}</p>
                              <p className="text-[10px] text-[#8890a4] dark:text-[#94a3b8]">{c.issuer} · {c.year}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── EXPERIENCE TAB ── */}
                {activeTab === 'experience' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[14px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc]">Work Experience</h3>
                      <button onClick={() => showToast('Add experience form opened', 'info')} className="flex items-center gap-1.5 text-[12px] font-bold text-[#6c63ff] dark:text-[#a78bfa] bg-[#6c63ff]/8 px-3 py-2 rounded-xl border-none cursor-pointer hover:bg-[#6c63ff]/15 transition-colors">
                        <Plus size={13} /> Add Experience
                      </button>
                    </div>
                    <div className="flex flex-col gap-1">
                      {experiences.map((exp, idx) => (
                        <div key={exp.id} className="relative pl-6">
                          {idx < experiences.length - 1 && (
                            <div className="absolute left-2.5 top-10 w-0.5 h-full bg-[#e4e8f0] dark:bg-[#1f2d42]" />
                          )}
                          <div className={`absolute left-0 top-3 w-5 h-5 rounded-full border-2 flex items-center justify-center ${exp.current ? 'border-[#6c63ff] bg-[#6c63ff]' : 'border-[#c4c9d4] dark:border-[#26334d] bg-white dark:bg-[#111827]'}`}>
                            {exp.current && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>

                          <div className="bg-[#f8f9fc] dark:bg-[#161e2e] rounded-2xl p-4 mb-4 border border-[#e4e8f0] dark:border-[#1f2d42] hover:border-[#6c63ff]/30 transition-all group">
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-black text-white flex-shrink-0" style={{ background: exp.logoBg }}>{exp.logo}</div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-[14px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc]">{exp.role}</p>
                                    {exp.current && <span className="text-[9px] font-bold bg-[#6c63ff]/10 text-[#6c63ff] dark:text-[#a78bfa] px-2 py-0.5 rounded-full">Current</span>}
                                  </div>
                                  <p className="text-[12px] text-[#8890a4] dark:text-[#94a3b8]">{exp.company} · {exp.location}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => showToast('Edit experience...', 'info')} className="w-7 h-7 rounded-lg bg-white dark:bg-[#111827] flex items-center justify-center border border-[#e4e8f0] dark:border-[#1f2d42] cursor-pointer hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all text-[#8890a4]">
                                  <Edit3 size={12} />
                                </button>
                                <button onClick={() => removeExperience(exp.id)} className="w-7 h-7 rounded-lg bg-white dark:bg-[#111827] flex items-center justify-center border border-[#e4e8f0] dark:border-[#1f2d42] cursor-pointer hover:border-[#ff4d6d] hover:text-[#ff4d6d] transition-all text-[#8890a4]">
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-[#8890a4] dark:text-[#94a3b8] mb-2">
                              <Clock size={11} /> {exp.period}
                            </div>
                            <p className="text-[12px] text-[#4a5068] dark:text-[#cbd5e1] leading-relaxed">{exp.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── EDUCATION TAB ── */}
                {activeTab === 'education' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[14px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc]">Education</h3>
                      <button onClick={() => showToast('Add education opened', 'info')} className="flex items-center gap-1.5 text-[12px] font-bold text-[#6c63ff] dark:text-[#a78bfa] bg-[#6c63ff]/8 px-3 py-2 rounded-xl border-none cursor-pointer hover:bg-[#6c63ff]/15 transition-colors">
                        <Plus size={13} /> Add Education
                      </button>
                    </div>
                    <div className="flex flex-col gap-4">
                      {educations.map(edu => (
                        <div key={edu.id} className="bg-[#f8f9fc] dark:bg-[#161e2e] rounded-2xl p-5 border border-[#e4e8f0] dark:border-[#1f2d42] hover:border-[#6c63ff]/30 transition-all group">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[11px] font-black text-white flex-shrink-0" style={{ background: edu.logoBg }}>{edu.logo}</div>
                              <div>
                                <p className="text-[14px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc]">{edu.degree}</p>
                                <p className="text-[12px] text-[#4a5068] dark:text-[#cbd5e1]">{edu.field}</p>
                                <p className="text-[11px] text-[#8890a4] dark:text-[#94a3b8]">{edu.school}</p>
                              </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => showToast('Edit education...', 'info')} className="w-7 h-7 rounded-lg bg-white dark:bg-[#111827] flex items-center justify-center border border-[#e4e8f0] dark:border-[#1f2d42] cursor-pointer hover:border-[#6c63ff] text-[#8890a4]">
                                <Edit3 size={11} />
                              </button>
                            </div>
                          </div>
                          <div className="flex gap-4 mt-2">
                            <span className="text-[11px] text-[#8890a4] dark:text-[#94a3b8] flex items-center gap-1"><GraduationCap size={11} /> Class of {edu.year}</span>
                            <span className="text-[11px] text-[#8890a4] dark:text-[#94a3b8] flex items-center gap-1"><Star size={11} /> GPA: {edu.gpa}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── SKILLS TAB ── */}
                {activeTab === 'skills' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[14px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc]">Skills & Proficiency</h3>
                      <button onClick={() => setShowSkillModal(true)} className="flex items-center gap-1.5 text-[12px] font-bold text-[#6c63ff] dark:text-[#a78bfa] bg-[#6c63ff]/8 px-3 py-2 rounded-xl border-none cursor-pointer hover:bg-[#6c63ff]/15 transition-colors">
                        <Plus size={13} /> Add Skill
                      </button>
                    </div>
                    {skillCategories.map(cat => (
                      <div key={cat} className="mb-5">
                        <p className="text-[10px] font-bold text-[#b0b8cc] dark:text-[#64748b] uppercase tracking-widest mb-3">{cat}</p>
                        <div className="flex flex-col gap-3">
                          {skills.filter(s => s.category === cat).map(skill => (
                            <div key={skill.id} className="flex items-center gap-3 group">
                              <div className="w-32 flex-shrink-0">
                                <span className="text-[13px] font-semibold text-[#1a1a2e] dark:text-[#f8fafc]">{skill.name}</span>
                              </div>
                              <div className="flex-1 h-2 bg-[#f0f2f8] dark:bg-[#26334d] rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${skill.level}%`, background: `linear-gradient(90deg,${levelColor(skill.level)},${levelColor(skill.level)}aa)` }} />
                              </div>
                              <div className="flex items-center gap-2 w-28 flex-shrink-0">
                                <span className="text-[11px] font-bold" style={{ color: levelColor(skill.level) }}>{levelLabel(skill.level)}</span>
                                <span className="text-[10px] text-[#b0b8cc] dark:text-[#64748b]">{skill.level}%</span>
                              </div>
                              <button onClick={() => removeSkill(skill.id)} className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg bg-[#fff0f3] flex items-center justify-center border-none cursor-pointer hover:bg-[#ff4d6d] text-[#ff4d6d] hover:text-white transition-all">
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="flex flex-col gap-5">

            {/* AI Profile Score */}
            <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-5 overflow-hidden border border-[#1f2d42]">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20 blur-2xl" style={{ background: '#6c63ff' }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#a78bfa] tracking-widest mb-3">
                  <Zap size={11} /> AI PROFILE SCORE
                </div>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-[42px] font-black text-white leading-none">87</span>
                  <span className="text-[14px] text-[#b0b8cc] mb-1">/100</span>
                </div>
                <p className="text-[12px] text-[#b0b8cc] mb-4">Your profile is <span className="text-[#a78bfa] font-bold">above average</span> for Product Designer roles.</p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'Experience',   score: 95, ok: true  },
                    { label: 'Skills',        score: 88, ok: true  },
                    { label: 'Portfolio',     score: 70, ok: false },
                    { label: 'Keywords',      score: 82, ok: true  },
                  ].map(({ label, score, ok }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="text-[11px] text-[#8890a4] w-20">{label}</span>
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${score}%`, background: ok ? '#6c63ff' : '#f59e0b' }} />
                      </div>
                      <span className="text-[10px] font-bold text-[#b0b8cc] w-8 text-right">{score}%</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => onNavigate?.('airesume')} className="w-full mt-4 py-2.5 rounded-xl text-[12px] font-bold text-white border border-[#6c63ff]/50 bg-transparent cursor-pointer hover:bg-[#6c63ff]/20 transition-colors flex items-center justify-center gap-2">
                  <Sparkles size={12} /> Boost with AI →
                </button>
              </div>
            </div>

            {/* Job Preferences */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60 dark:border-[#1f2d42]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Heart size={14} className="text-[#ff4d6d]" />
                  <h3 className="text-[14px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc]">Job Preferences</h3>
                </div>
                <button onClick={() => { setEditingPrefs(!editingPrefs); setPrefsTemp(prefs); }} className="text-[11px] font-bold text-[#6c63ff] dark:text-[#a78bfa] bg-transparent border-none cursor-pointer flex items-center gap-1 hover:underline">
                  <Edit3 size={11} /> {editingPrefs ? 'Cancel' : 'Edit'}
                </button>
              </div>
              {editingPrefs ? (
                <div className="flex flex-col gap-3">
                  {(Object.entries(prefsTemp)).map(([key, val]) => (
                    <div key={key}>
                      <label className="text-[10px] font-bold text-[#b0b8cc] dark:text-[#64748b] uppercase tracking-wider block mb-1">{key.replace(/([A-Z])/g, ' $1')}</label>
                      <input value={val} onChange={e => setPrefsTemp(p => ({...p, [key]: e.target.value}))} className="w-full px-3 py-2 rounded-xl border border-[#e4e8f0] dark:border-[#1f2d42] bg-[#f8f9fc] dark:bg-[#161e2e] text-[12px] text-[#1a1a2e] dark:text-[#f8fafc] outline-none focus:border-[#6c63ff]" />
                    </div>
                  ))}
                  <button onClick={savePrefs} className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer" style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}>
                    <Save size={12} /> Save Preferences
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {[
                    { icon: <Briefcase size={12} className="text-[#6c63ff]" />, label: 'Role', value: prefs.role },
                    { icon: <Clock size={12} className="text-[#f59e0b]" />, label: 'Type', value: prefs.type },
                    { icon: <Building2 size={12} className="text-[#00c853]" />, label: 'Mode', value: prefs.workMode },
                    { icon: <DollarSign size={12} className="text-[#6c63ff]" />, label: 'Salary', value: prefs.salary },
                    { icon: <TrendingUp size={12} className="text-[#00c853]" />, label: 'Available', value: prefs.availability },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-[#f0f2f8] dark:border-[#1f2d42] last:border-0">
                      <div className="flex items-center gap-2">
                        {icon}
                        <span className="text-[11px] text-[#8890a4] dark:text-[#94a3b8]">{label}</span>
                      </div>
                      <span className="text-[12px] font-semibold text-[#4a5068] dark:text-[#cbd5e1] text-right max-w-[120px]">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60 dark:border-[#1f2d42]">
              <h3 className="text-[13px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc] mb-3">Career Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: '8+', label: 'Years Exp', color: '#6c63ff' },
                  { value: '3',  label: 'Companies', color: '#f59e0b' },
                  { value: '10', label: 'Skills',    color: '#00c853' },
                  { value: '4',  label: 'Certs',     color: '#8b5cf6' },
                ].map(({ value, label, color }) => (
                  <div key={label} className="flex flex-col items-center py-3 bg-[#f8f9fc] dark:bg-[#161e2e] rounded-xl border border-[#e4e8f0] dark:border-[#1f2d42]">
                    <span className="text-[24px] font-black leading-none" style={{ color }}>{value}</span>
                    <span className="text-[10px] text-[#8890a4] dark:text-[#94a3b8] mt-1">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60 dark:border-[#1f2d42]">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={14} className="text-[#6c63ff]" />
                <h3 className="text-[13px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc]">Privacy Settings</h3>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Profile Visible to Recruiters', on: true },
                  { label: 'Show Open to Work Badge',       on: true },
                  { label: 'Email Notifications',           on: false },
                ].map(({ label, on: initOn }, i) => (
                  <PrivacyToggleItem key={i} label={label} initOn={initOn} onToast={showToast} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PrivacyToggleItem: React.FC<{ label: string; initOn: boolean; onToast: (msg: string) => void }> = ({ label, initOn, onToast }) => {
  const [on, setOn] = useState(initOn);
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-[#4a5068] dark:text-[#cbd5e1]">{label}</span>
      <button
        onClick={() => { setOn(!on); onToast(`${label}: ${!on ? 'On' : 'Off'}`); }}
        className={`w-10 h-5 rounded-full transition-all cursor-pointer border-none relative flex-shrink-0 ${on ? 'bg-[#6c63ff]' : 'bg-[#e4e8f0] dark:bg-[#26334d]'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${on ? 'left-5' : 'left-0.5'}`} />
      </button>
    </div>
  );
};

export default Profile;
