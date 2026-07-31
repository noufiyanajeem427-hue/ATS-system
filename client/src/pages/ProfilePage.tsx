import React, { useState, useRef, useEffect } from 'react';
import Topbar from '../components/Topbar';
import jsPDF from 'jspdf';
import { ButtonSpinner, PageSpinner } from '../components/Loading';
import { fetchUserProfile, updateUserProfile } from '../services/api';
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
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [newExp, setNewExp] = useState({
    role: '',
    company: '',
    period: '',
    location: '',
    description: '',
    current: false,
  });
  const [newEdu, setNewEdu] = useState({
    degree: '',
    field: '',
    school: '',
    year: '',
    gpa: '',
  });
  const [newSkill, setNewSkill] = useState({
    name: '',
    level: 85,
    category: 'Technical',
  });
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Images state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  // ── Profile Main Info ───────────────────────────────────────────
  const [loading, setLoading] = useState(true);

  // ── Profile Main Info ───────────────────────────────────────────
  const [profileHeader, setProfileHeader] = useState({
    name: '',
    title: '',
    experienceYears: '',
  });

  const [bio, setBio] = useState('');
  const [bioTemp, setBioTemp] = useState('');

  const [contact, setContact] = useState({
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
  });
  const [contactTemp, setContactTemp] = useState(contact);

  const [prefs, setPrefs] = useState({
    role: '',
    type: '',
    workMode: '',
    salary: '',
    availability: '',
  });
  const [prefsTemp, setPrefsTemp] = useState(prefs);

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [skills, setSkills] = useState<{ id: number; name: string; level: number; category: string }[]>([]);

  const [editHeaderTemp, setEditHeaderTemp] = useState(profileHeader);

  useEffect(() => {
    setLoading(true);
    // 1. Try local storage user
    const localUser = localStorage.getItem('user');
    let defaultName = '';
    let defaultEmail = '';
    if (localUser) {
      try {
        const u = JSON.parse(localUser);
        if (u.name) defaultName = u.name;
        if (u.email) defaultEmail = u.email;
      } catch (e) { }
    }

    // 2. Fetch live user profile from MongoDB
    fetchUserProfile()
      .then(userData => {
        if (userData) {
          const userName = userData.name || defaultName || 'User Profile';
          const userTitle = userData.title || 'Candidate';
          const expLabel = userData.experiences?.length ? `${userData.experiences.length} Position(s)` : 'Candidate Profile';

          setProfileHeader({
            name: userName,
            title: userTitle,
            experienceYears: expLabel,
          });
          setEditHeaderTemp({
            name: userName,
            title: userTitle,
            experienceYears: expLabel,
          });

          const userContact = {
            email: userData.email || defaultEmail || '',
            phone: userData.phone || '',
            location: userData.location || '',
            website: userData.website || '',
            linkedin: userData.linkedin || '',
            github: userData.github || '',
          };
          setContact(userContact);
          setContactTemp(userContact);

          const userBio = userData.bio || '';
          setBio(userBio);
          setBioTemp(userBio);

          if (userData.skills && Array.isArray(userData.skills)) {
            setSkills(userData.skills.map((sk: string, idx: number) => ({
              id: idx + 1,
              name: sk,
              level: 85,
              category: 'Skills'
            })));
          }

          if (userData.experiences && Array.isArray(userData.experiences)) {
            setExperiences(userData.experiences.map((exp: any, idx: number) => ({
              id: idx + 1,
              company: exp.company || '',
              role: exp.role || '',
              period: exp.period || '',
              location: exp.location || '',
              description: exp.description || '',
              logo: (exp.company || 'C')[0].toUpperCase(),
              logoBg: 'linear-gradient(135deg,#6c63ff,#4b50d4)',
              current: exp.current || false,
            })));
          }

          if (userData.education && Array.isArray(userData.education)) {
            setEducations(userData.education.map((edu: any, idx: number) => ({
              id: idx + 1,
              school: edu.school || '',
              degree: edu.degree || '',
              field: edu.field || '',
              year: edu.year || '',
              gpa: edu.gpa || '',
              logo: (edu.school || 'E')[0].toUpperCase(),
              logoBg: 'linear-gradient(135deg,#c41230,#8b0c22)'
            })));
          }

          if (userData.avatarUrl) setAvatarUrl(userData.avatarUrl);
          if (userData.coverUrl) setCoverUrl(userData.coverUrl);

          if (userData.preferences) {
            const userPrefs = {
              role: userData.preferences.role || '',
              type: userData.preferences.type || '',
              workMode: userData.preferences.workMode || '',
              salary: userData.preferences.salary || '',
              availability: userData.preferences.availability || '',
            };
            setPrefs(userPrefs);
            setPrefsTemp(userPrefs);
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const completeness = 87;

  // ── Handlers ─────────────────────────────────────────────────────
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(msg); setToastType(type);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Str = event.target?.result as string;
        setAvatarUrl(base64Str);
        showToast('Profile photo updated & saved!');
        await updateUserProfile({ avatarUrl: base64Str });
      };
      reader.readAsDataURL(file);
    }
  };

  // Cover image upload
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Str = event.target?.result as string;
        setCoverUrl(base64Str);
        showToast('Cover banner updated & saved!');
        await updateUserProfile({ coverUrl: base64Str });
      };
      reader.readAsDataURL(file);
    }
  };

  const [downloadingPDF, setDownloadingPDF] = useState(false);

  // Download Resume PDF
  const downloadResumePDF = () => {
    setDownloadingPDF(true);
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        doc.setFillColor(26, 26, 46);
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text(profileHeader.name, 15, 20);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(167, 139, 250);
        doc.text(`${profileHeader.title} · ${profileHeader.experienceYears}`, 15, 29);

        doc.setFontSize(9);
        doc.setTextColor(200, 200, 220);
        doc.text(`${contact.email}  |  ${contact.phone}  |  ${contact.location}`, 15, 36);

        let y = 50;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(108, 99, 255);
        doc.text('SUMMARY', 15, y);

        y += 6;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 80);
        const splitBio = doc.splitTextToSize(bio, 180);
        doc.text(splitBio, 15, y);

        y += (splitBio.length * 5) + 8;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(108, 99, 255);
        doc.text('WORK EXPERIENCE', 15, y);

        y += 8;
        experiences.forEach((exp) => {
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(26, 26, 46);
          doc.text(`${exp.role} - ${exp.company}`, 15, y);

          doc.setFontSize(9);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(130, 130, 150);
          doc.text(`${exp.period}  |  ${exp.location}`, 15, y + 4.5);

          doc.setFontSize(9.5);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(70, 70, 90);
          const splitDesc = doc.splitTextToSize(exp.description, 180);
          doc.text(splitDesc, 15, y + 10);

          y += (splitDesc.length * 4.5) + 16;
        });

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(108, 99, 255);
        doc.text('SKILLS', 15, y);

        y += 7;
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 70);
        const skillList = skills.map(s => `${s.name} (${s.level}%)`).join('  ·  ');
        const splitSkills = doc.splitTextToSize(skillList, 180);
        doc.text(splitSkills, 15, y);

        doc.save(`${profileHeader.name.replace(/\s+/g, '_')}_Resume.pdf`);
        showToast('Resume PDF generated and downloaded!');
      } catch (err) {
        showToast('Downloading resume PDF...');
      } finally {
        setDownloadingPDF(false);
      }
    }, 600);
  };

  // Copy share link
  const copyShareLink = () => {
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl);
    setCopiedLink(true);
    showToast('Profile link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Save Full Profile Modal
  const saveFullProfileModal = async () => {
    setProfileHeader(editHeaderTemp);
    setBio(bioTemp);
    setContact(contactTemp);
    setShowEditProfileModal(false);
    showToast('Profile updated successfully!');
    const res = await updateUserProfile({
      name: editHeaderTemp.name,
      title: editHeaderTemp.title,
      bio: bioTemp,
      email: contactTemp.email,
      phone: contactTemp.phone,
      location: contactTemp.location,
      website: contactTemp.website,
      linkedin: contactTemp.linkedin,
      github: contactTemp.github,
    });
    if (res && res.user) {
      if (res.user.bio !== undefined) {
        setBio(res.user.bio);
        setBioTemp(res.user.bio);
      }
      if (res.user.name || res.user.title) {
        setProfileHeader(p => ({
          ...p,
          name: res.user.name || p.name,
          title: res.user.title || p.title,
        }));
      }
    }
  };

  const saveContact = () => {
    setContact(contactTemp);
    setEditingContact(false);
    showToast('Contact info saved!');
    updateUserProfile({
      email: contactTemp.email,
      phone: contactTemp.phone,
      location: contactTemp.location,
      website: contactTemp.website,
      linkedin: contactTemp.linkedin,
      github: contactTemp.github,
    });
  };

  const saveBio = async () => {
    const newBioText = bioTemp;
    setBio(newBioText);
    setEditingBio(false);
    showToast('Bio updated!');
    const res = await updateUserProfile({ bio: newBioText });
    if (res && res.user && res.user.bio !== undefined) {
      setBio(res.user.bio);
      setBioTemp(res.user.bio);
    }
  };

  const savePrefs = () => {
    setPrefs(prefsTemp);
    setEditingPrefs(false);
    showToast('Preferences saved!');
    updateUserProfile({ preferences: prefsTemp });
  };

  const removeExperience = (id: number) => {
    const updated = experiences.filter(x => x.id !== id);
    setExperiences(updated);
    showToast('Experience removed.', 'info');
    updateUserProfile({ experiences: updated });
  };

  const removeSkill = (id: number) => {
    const updated = skills.filter(x => x.id !== id);
    setSkills(updated);
    updateUserProfile({ skills: updated.map(s => s.name) });
  };

  const addSkill = async () => {
    if (!newSkill.name.trim()) {
      showToast('Please enter a skill name.', 'info');
      return;
    }
    const skillLevel = Number(newSkill.level) || 85;
    const newSkillObj = {
      id: Date.now(),
      name: newSkill.name.trim(),
      level: skillLevel,
      category: newSkill.category.trim() || 'Technical',
    };
    const updated = [...skills, newSkillObj];
    setSkills(updated);
    setNewSkill({ name: '', level: 85, category: 'Technical' });
    setShowSkillModal(false);
    showToast(`Skill "${newSkillObj.name}" (${skillLevel}%) added!`);
    await updateUserProfile({ skills: updated.map(s => s.name) });
  };

  const addExperience = async () => {
    if (!newExp.role.trim() || !newExp.company.trim()) {
      showToast('Please enter both Job Title and Company name.', 'info');
      return;
    }
    const expObj: Experience = {
      id: Date.now(),
      role: newExp.role.trim(),
      company: newExp.company.trim(),
      period: newExp.period.trim() || 'Present',
      location: newExp.location.trim() || 'Remote',
      description: newExp.description.trim() || '',
      logo: (newExp.company.trim() || 'C')[0].toUpperCase(),
      logoBg: 'linear-gradient(135deg,#6c63ff,#4b50d4)',
      current: newExp.current,
    };
    const updated = [...experiences, expObj];
    setExperiences(updated);
    setShowExperienceModal(false);
    setNewExp({ role: '', company: '', period: '', location: '', description: '', current: false });
    showToast(`Experience at ${expObj.company} added!`);
    await updateUserProfile({ experiences: updated });
  };

  const addEducation = async () => {
    if (!newEdu.school.trim() || !newEdu.degree.trim()) {
      showToast('Please enter both Degree and School/University name.', 'info');
      return;
    }
    const eduObj: Education = {
      id: Date.now(),
      degree: newEdu.degree.trim(),
      field: newEdu.field.trim() || 'General',
      school: newEdu.school.trim(),
      year: newEdu.year.trim() || '2024',
      gpa: newEdu.gpa.trim() || 'N/A',
      logo: (newEdu.school.trim() || 'E')[0].toUpperCase(),
      logoBg: 'linear-gradient(135deg,#c41230,#8b0c22)',
    };
    const updated = [...educations, eduObj];
    setEducations(updated);
    setShowEducationModal(false);
    setNewEdu({ degree: '', field: '', school: '', year: '', gpa: '' });
    showToast(`Education at ${eduObj.school} added!`);
    await updateUserProfile({ education: updated });
  };

  const skillCategories = Array.from(new Set(skills.map(s => s.category)));
  const levelLabel = (l: number) => l >= 90 ? 'Expert' : l >= 75 ? 'Advanced' : l >= 60 ? 'Intermediate' : 'Beginner';
  const levelColor = (l: number) => l >= 90 ? '#00c853' : l >= 75 ? '#6c63ff' : l >= 60 ? '#f59e0b' : '#8890a4';

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen w-full lg:w-[calc(100vw-220px)] lg:ml-[220px] bg-[#f4f6fb] overflow-x-hidden">
        <Topbar onMenuClick={onMenuClick} onNavigate={onNavigate} />
        <PageSpinner label="Fetching user profile data from database..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full lg:w-[calc(100vw-220px)] lg:ml-[220px] bg-[#f4f6fb] overflow-x-hidden">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-extrabold text-[#1a1a2e]">Add New Skill</h3>
              <button onClick={() => setShowSkillModal(false)} className="bg-transparent border-none cursor-pointer text-[#8890a4] hover:text-[#1a1a2e]"><X size={18} /></button>
            </div>

            <div className="flex flex-col gap-3.5 mb-4">
              <div>
                <label className="text-[11px] font-bold text-[#4a5068] uppercase block mb-1">Skill Name *</label>
                <input
                  value={newSkill.name}
                  onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
                  placeholder="e.g. React, Python, UI Design..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] outline-none focus:border-[#6c63ff]"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#4a5068] uppercase block mb-1">Category</label>
                <select
                  value={newSkill.category}
                  onChange={e => setNewSkill({ ...newSkill, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] outline-none focus:border-[#6c63ff] bg-white"
                >
                  <option value="Technical">Technical</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-[#4a5068] uppercase">Proficiency Level (%)</label>
                  <span className="text-[12px] font-extrabold text-[#6c63ff]">{newSkill.level}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={newSkill.level}
                  onChange={e => setNewSkill({ ...newSkill, level: Number(e.target.value) })}
                  className="w-full accent-[#6c63ff] cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowSkillModal(false)} className="flex-1 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] font-bold text-[#8890a4] bg-transparent cursor-pointer hover:text-[#1a1a2e] transition-colors">Cancel</button>
              <button onClick={addSkill} className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white border-none cursor-pointer" style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}>Add Skill</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Education Modal */}
      {showEducationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap size={18} className="text-[#6c63ff]" />
                <h3 className="text-[16px] font-extrabold text-[#1a1a2e]">Add Education</h3>
              </div>
              <button onClick={() => setShowEducationModal(false)} className="bg-transparent border-none cursor-pointer text-[#8890a4] hover:text-[#1a1a2e]"><X size={18} /></button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#4a5068] uppercase block mb-1">Degree / Qualification *</label>
                <input
                  value={newEdu.degree}
                  onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })}
                  placeholder="e.g. Bachelor of Technology / B.Sc"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] outline-none focus:border-[#6c63ff]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#4a5068] uppercase block mb-1">School / University *</label>
                <input
                  value={newEdu.school}
                  onChange={e => setNewEdu({ ...newEdu, school: e.target.value })}
                  placeholder="e.g. University of Mumbai"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] outline-none focus:border-[#6c63ff]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#4a5068] uppercase block mb-1">Field of Study</label>
                <input
                  value={newEdu.field}
                  onChange={e => setNewEdu({ ...newEdu, field: e.target.value })}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] outline-none focus:border-[#6c63ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#4a5068] uppercase block mb-1">Passing Year</label>
                  <input
                    value={newEdu.year}
                    onChange={e => setNewEdu({ ...newEdu, year: e.target.value })}
                    placeholder="e.g. 2024"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] outline-none focus:border-[#6c63ff]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#4a5068] uppercase block mb-1">GPA / Score</label>
                  <input
                    value={newEdu.gpa}
                    onChange={e => setNewEdu({ ...newEdu, gpa: e.target.value })}
                    placeholder="e.g. 8.5 CGPA or 85%"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] outline-none focus:border-[#6c63ff]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#f0f2f8]">
                <button onClick={() => setShowEducationModal(false)} className="flex-1 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] font-bold text-[#8890a4] bg-transparent cursor-pointer hover:text-[#1a1a2e]">Cancel</button>
                <button onClick={addEducation} className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white border-none cursor-pointer" style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}>Add Education</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Experience Modal */}
      {showExperienceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase size={18} className="text-[#6c63ff]" />
                <h3 className="text-[16px] font-extrabold text-[#1a1a2e]">Add Work Experience</h3>
              </div>
              <button onClick={() => setShowExperienceModal(false)} className="bg-transparent border-none cursor-pointer text-[#8890a4] hover:text-[#1a1a2e]"><X size={18} /></button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#4a5068] uppercase block mb-1">Job Title *</label>
                <input
                  value={newExp.role}
                  onChange={e => setNewExp({ ...newExp, role: e.target.value })}
                  placeholder="e.g. Senior Frontend Developer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] outline-none focus:border-[#6c63ff]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#4a5068] uppercase block mb-1">Company Name *</label>
                <input
                  value={newExp.company}
                  onChange={e => setNewExp({ ...newExp, company: e.target.value })}
                  placeholder="e.g. Google, Microsoft..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] outline-none focus:border-[#6c63ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#4a5068] uppercase block mb-1">Period</label>
                  <input
                    value={newExp.period}
                    onChange={e => setNewExp({ ...newExp, period: e.target.value })}
                    placeholder="e.g. 2022 - Present"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] outline-none focus:border-[#6c63ff]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#4a5068] uppercase block mb-1">Location</label>
                  <input
                    value={newExp.location}
                    onChange={e => setNewExp({ ...newExp, location: e.target.value })}
                    placeholder="e.g. Remote / NYC"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] outline-none focus:border-[#6c63ff]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#4a5068] uppercase block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newExp.description}
                  onChange={e => setNewExp({ ...newExp, description: e.target.value })}
                  placeholder="Key responsibilities and achievements..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] outline-none focus:border-[#6c63ff] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#f0f2f8]">
                <button onClick={() => setShowExperienceModal(false)} className="flex-1 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] font-bold text-[#8890a4] bg-transparent cursor-pointer hover:text-[#1a1a2e]">Cancel</button>
                <button onClick={addExperience} className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white border-none cursor-pointer" style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}>Add Experience</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Share Profile Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Share2 size={18} className="text-[#6c63ff]" />
                <h3 className="text-[16px] font-extrabold text-[#1a1a2e]">Share Profile</h3>
              </div>
              <button onClick={() => setShowShareModal(false)} className="bg-transparent border-none cursor-pointer text-[#8890a4] hover:text-[#1a1a2e]"><X size={18} /></button>
            </div>

            <p className="text-[12px] text-[#8890a4] mb-4">Share your verified Nexus ATS candidate profile with recruiters or hiring managers.</p>

            <div className="flex items-center gap-2 p-2 bg-[#f4f6fb] rounded-xl border border-[#e4e8f0] mb-5">
              <input
                readOnly
                value={window.location.href}
                className="flex-1 bg-transparent text-[12px] text-[#4a5068] px-2 outline-none"
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
                className="py-2.5 rounded-xl border border-[#e4e8f0] text-[12px] font-bold text-[#0a66c2] bg-[#0a66c2]/8 hover:bg-[#0a66c2]/15 cursor-pointer border-none"
              >
                LinkedIn
              </button>
              <button
                onClick={() => { copyShareLink(); window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Check out my candidate profile!`, '_blank'); }}
                className="py-2.5 rounded-xl border border-[#e4e8f0] text-[12px] font-bold text-[#1da1f2] bg-[#1da1f2]/8 hover:bg-[#1da1f2]/15 cursor-pointer border-none"
              >
                Twitter / X
              </button>
              <button
                onClick={() => { window.location.href = `mailto:?subject=Candidate Profile - ${profileHeader.name}&body=View my profile here: ${window.location.href}`; }}
                className="py-2.5 rounded-xl border border-[#e4e8f0] text-[12px] font-bold text-[#6c63ff] bg-[#6c63ff]/8 hover:bg-[#6c63ff]/15 cursor-pointer border-none"
              >
                Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Edit Full Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8">
          <div className="bg-white rounded-2xl p-6 sm:p-7 w-full max-w-lg mx-4 shadow-2xl my-auto">
            <div className="flex items-center justify-between mb-5 border-b border-[#f0f2f8] pb-3">
              <div className="flex items-center gap-2">
                <Edit3 size={18} className="text-[#6c63ff]" />
                <h3 className="text-[17px] font-extrabold text-[#1a1a2e]">Edit Candidate Profile</h3>
              </div>
              <button onClick={() => setShowEditProfileModal(false)} className="bg-transparent border-none cursor-pointer text-[#8890a4] hover:text-[#1a1a2e]"><X size={18} /></button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1">Full Name</label>
                  <input
                    value={editHeaderTemp.name}
                    onChange={e => setEditHeaderTemp({ ...editHeaderTemp, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] outline-none focus:border-[#6c63ff]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1">Professional Title</label>
                  <input
                    value={editHeaderTemp.title}
                    onChange={e => setEditHeaderTemp({ ...editHeaderTemp, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] outline-none focus:border-[#6c63ff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1">Location</label>
                  <input
                    value={contactTemp.location}
                    onChange={e => setContactTemp({ ...contactTemp, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] outline-none focus:border-[#6c63ff]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1">Email</label>
                  <input
                    value={contactTemp.email}
                    onChange={e => setContactTemp({ ...contactTemp, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] outline-none focus:border-[#6c63ff]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1">About Bio</label>
                <textarea
                  rows={4}
                  value={bioTemp}
                  onChange={e => setBioTemp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] outline-none focus:border-[#6c63ff] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-[#f0f2f8]">
                <button
                  onClick={() => setShowEditProfileModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] font-bold text-[#8890a4] bg-transparent cursor-pointer hover:text-[#1a1a2e]"
                >
                  Cancel
                </button>
                <button
                  onClick={saveFullProfileModal}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white border-none cursor-pointer"
                  style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* ── Profile Header Card ── */}
        <div className="relative bg-white rounded-2xl shadow-sm border border-[#e4e8f0]/60 overflow-hidden mb-6">
          {/* Cover banner */}
          <div
            className="h-32 w-full relative bg-cover bg-center transition-all"
            style={{
              background: coverUrl ? `url(${coverUrl}) center/cover no-repeat` : 'linear-gradient(135deg,#1a1a2e 0%,#16213e 40%,#6c63ff 100%)',
            }}
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={() => coverRef.current?.click()}
                className="flex items-center gap-1.5 text-[11px] font-bold text-white/90 bg-black/40 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-xl cursor-pointer hover:bg-black/60 transition-all shadow-md"
              >
                <Camera size={13} /> {coverUrl ? 'Change Cover' : 'Upload Banner'}
              </button>
            </div>
          </div>

          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="relative inline-block -mt-12 mb-3">
              <div
                className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center text-[30px] font-black text-white overflow-hidden bg-cover bg-center"
                style={{
                  background: avatarUrl ? `url(${avatarUrl}) center/cover no-repeat` : 'linear-gradient(135deg,#6c63ff,#8b5cf6)',
                }}
              >
                {!avatarUrl && profileHeader.name.split(' ').map(n => n[0]).join('')}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#6c63ff] flex items-center justify-center border-2 border-white cursor-pointer hover:bg-[#8b5cf6] transition-all shadow-md"
                title="Change Avatar Photo"
              >
                <Camera size={12} className="text-white" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-[26px] font-black text-[#1a1a2e] tracking-tight">{profileHeader.name}</h1>
                <p className="text-[14px] text-[#4a5068] font-semibold mb-2">{profileHeader.title} · {profileHeader.experienceYears}</p>
                <div className="flex flex-wrap gap-3">
                  <span className="flex items-center gap-1 text-[12px] text-[#8890a4]"><MapPin size={12} /> {contact.location}</span>
                  <span className="flex items-center gap-1 text-[12px] text-[#8890a4]"><Mail size={12} /> {contact.email}</span>
                  <span className="flex items-center gap-1 text-[12px] text-[#00c853] font-bold bg-[#00c853]/10 px-2 py-0.5 rounded-full"><Briefcase size={11} /> Open to Work</span>
                </div>
              </div>

              {/* Action Buttons: Resume Download, Share, Edit */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={downloadResumePDF}
                  disabled={downloadingPDF}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-bold text-[#4a5068] bg-[#f4f6fb] border border-[#e4e8f0] cursor-pointer hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all shadow-xs active:scale-95 disabled:opacity-60"
                  title="Download PDF Resume"
                >
                  {downloadingPDF ? <ButtonSpinner size={14} color="#6c63ff" /> : <Download size={14} className="text-[#6c63ff]" />} Resume PDF
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-bold text-[#4a5068] bg-[#f4f6fb] border border-[#e4e8f0] cursor-pointer hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all shadow-xs active:scale-95"
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
              className="mt-5 p-4 bg-[#f8f9fc] hover:bg-[#6c63ff]/5 rounded-xl border border-[#e4e8f0] hover:border-[#6c63ff]/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles size={13} className="text-[#6c63ff]" />
                  <span className="text-[12px] font-bold text-[#1a1a2e] group-hover:text-[#6c63ff] transition-colors">Profile Completeness</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#6c63ff] hover:underline">Complete Remaining 13% →</span>
                  <span className="text-[13px] font-black text-[#6c63ff] bg-[#6c63ff]/10 px-2 py-0.5 rounded-md">{completeness}%</span>
                </div>
              </div>
              <div className="h-2 bg-[#e4e8f0] rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${completeness}%`, background: 'linear-gradient(90deg,#6c63ff,#8b5cf6,#00c853)' }} />
              </div>
              <p className="text-[11px] text-[#8890a4]">Click here to add your portfolio website, phone number, and 2 more skills to reach 100%.</p>
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">

          {/* ── Left: Tabs + Content ── */}
          <div className="flex flex-col gap-5">

            {/* Tab Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e4e8f0]/60 overflow-hidden">
              <div className="flex border-b border-[#e4e8f0]">
                {(['about', 'experience', 'education', 'skills'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`flex-1 py-3.5 text-[12px] font-bold capitalize transition-all border-none cursor-pointer ${activeTab === t ? 'text-[#6c63ff] bg-[#6c63ff]/5' : 'text-[#8890a4] bg-transparent hover:text-[#4a5068]'}`}
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
                        <h3 className="text-[14px] font-extrabold text-[#1a1a2e]">About</h3>
                        <button onClick={() => { setEditingBio(!editingBio); setBioTemp(bio); }} className="text-[11px] font-bold text-[#6c63ff] bg-transparent border-none cursor-pointer flex items-center gap-1 hover:underline">
                          <Edit3 size={11} /> {editingBio ? 'Cancel' : 'Edit'}
                        </button>
                      </div>
                      {editingBio ? (
                        <div className="flex flex-col gap-2">
                          <textarea value={bioTemp} onChange={e => setBioTemp(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl border border-[#6c63ff] text-[13px] text-[#4a5068] leading-relaxed outline-none resize-none" placeholder="Write your professional summary..." />
                          <button onClick={saveBio} className="self-end flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer" style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}>
                            <Save size={12} /> Save
                          </button>
                        </div>
                      ) : (
                        <p className="text-[13px] text-[#4a5068] leading-relaxed">
                          {bio || <span className="text-[#8890a4] italic">No bio added yet. Click 'Edit' to write your profile summary.</span>}
                        </p>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[14px] font-extrabold text-[#1a1a2e]">Contact Info</h3>
                        <button onClick={() => { setEditingContact(!editingContact); setContactTemp(contact); }} className="text-[11px] font-bold text-[#6c63ff] bg-transparent border-none cursor-pointer flex items-center gap-1 hover:underline">
                          <Edit3 size={11} /> {editingContact ? 'Cancel' : 'Edit'}
                        </button>
                      </div>
                      {editingContact ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(Object.keys(contactTemp) as (keyof typeof contactTemp)[]).map(key => (
                            <div key={key}>
                              <label className="text-[10px] font-bold text-[#b0b8cc] uppercase tracking-wider block mb-1">{key}</label>
                              <input value={contactTemp[key]} onChange={e => setContactTemp(c => ({ ...c, [key]: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-[#e4e8f0] text-[12px] outline-none focus:border-[#6c63ff]" />
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
                            { icon: <Mail size={13} className="text-[#6c63ff]" />, label: 'Email', value: contact.email || 'Not provided' },
                            { icon: <Phone size={13} className="text-[#6c63ff]" />, label: 'Phone', value: contact.phone || 'Not provided' },
                            { icon: <MapPin size={13} className="text-[#6c63ff]" />, label: 'Location', value: contact.location || 'Not provided' },
                            { icon: <Globe size={13} className="text-[#6c63ff]" />, label: 'Website', value: contact.website || 'Not provided' },
                            { icon: <Globe size={13} className="text-[#0a66c2]" />, label: 'LinkedIn', value: contact.linkedin || 'Not provided' },
                            { icon: <Globe size={13} className="text-[#1a1a2e]" />, label: 'GitHub', value: contact.github || 'Not provided' },
                          ].map(({ icon, label, value }) => (
                            <div key={label} className="flex items-center gap-2.5 p-3 bg-[#f8f9fc] rounded-xl border border-[#e4e8f0]">
                              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0">{icon}</div>
                              <div>
                                <p className="text-[9px] font-bold text-[#b0b8cc] uppercase tracking-wider">{label}</p>
                                <p className="text-[12px] font-semibold text-[#4a5068] truncate">{value}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Certifications */}
                    <div>
                      <h3 className="text-[14px] font-extrabold text-[#1a1a2e] mb-3">Certifications</h3>
                      {certifications.length === 0 ? (
                        <p className="text-[12px] text-[#8890a4] italic p-3 bg-[#f8f9fc] rounded-xl border border-[#e4e8f0]">No certifications added yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {certifications.map(c => (
                            <div key={c.id} className="flex items-center gap-3 p-3 bg-[#f8f9fc] rounded-xl border border-[#e4e8f0] hover:border-[#6c63ff]/30 transition-colors">
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${c.color}20` }}>
                                <Award size={16} style={{ color: c.color }} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[12px] font-bold text-[#1a1a2e] truncate">{c.name}</p>
                                <p className="text-[10px] text-[#8890a4]">{c.issuer} · {c.year}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── EXPERIENCE TAB ── */}
                {activeTab === 'experience' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[14px] font-extrabold text-[#1a1a2e]">Work Experience</h3>
                      <button onClick={() => setShowExperienceModal(true)} className="flex items-center gap-1.5 text-[12px] font-bold text-[#6c63ff] bg-[#6c63ff]/8 px-3 py-2 rounded-xl border-none cursor-pointer hover:bg-[#6c63ff]/15 transition-colors">
                        <Plus size={13} /> Add Experience
                      </button>
                    </div>
                    {experiences.length === 0 ? (
                      <div className="text-center py-8 bg-[#f8f9fc] rounded-2xl border border-dashed border-[#e4e8f0]">
                        <Briefcase size={24} className="mx-auto text-[#b0b8cc] mb-2" />
                        <p className="text-[13px] font-bold text-[#4a5068]">No Work Experience Added Yet</p>
                        <p className="text-[11px] text-[#8890a4] mt-1 mb-3">Add your previous roles to showcase your career journey.</p>
                        <button onClick={() => setShowExperienceModal(true)} className="px-4 py-2 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer" style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}>
                          Add Experience
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {experiences.map((exp, idx) => (
                          <div key={exp.id} className="relative pl-6">
                            {idx < experiences.length - 1 && (
                              <div className="absolute left-2.5 top-10 w-0.5 h-full bg-[#e4e8f0]" />
                            )}
                            <div className={`absolute left-0 top-3 w-5 h-5 rounded-full border-2 flex items-center justify-center ${exp.current ? 'border-[#6c63ff] bg-[#6c63ff]' : 'border-[#c4c9d4] bg-white'}`}>
                              {exp.current && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>

                            <div className="bg-[#f8f9fc] rounded-2xl p-4 mb-4 border border-[#e4e8f0] hover:border-[#6c63ff]/30 transition-all group">
                              <div className="flex items-start justify-between gap-2 mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-black text-white flex-shrink-0" style={{ background: exp.logoBg }}>{exp.logo}</div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="text-[14px] font-extrabold text-[#1a1a2e]">{exp.role}</p>
                                      {exp.current && <span className="text-[9px] font-bold bg-[#6c63ff]/10 text-[#6c63ff] px-2 py-0.5 rounded-full">Current</span>}
                                    </div>
                                    <p className="text-[12px] text-[#8890a4]">{exp.company} · {exp.location}</p>
                                  </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => removeExperience(exp.id)} className="w-7 h-7 rounded-lg bg-white flex items-center justify-center border border-[#e4e8f0] cursor-pointer hover:border-red-500 text-red-500">
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] text-[#8890a4] mb-2">
                                <Clock size={11} /> {exp.period}
                              </div>
                              <p className="text-[12px] text-[#4a5068] leading-relaxed">{exp.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── EDUCATION TAB ── */}
                {activeTab === 'education' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[14px] font-extrabold text-[#1a1a2e]">Education</h3>
                      <button onClick={() => setShowEducationModal(true)} className="flex items-center gap-1.5 text-[12px] font-bold text-[#6c63ff] bg-[#6c63ff]/8 px-3 py-2 rounded-xl border-none cursor-pointer hover:bg-[#6c63ff]/15 transition-colors">
                        <Plus size={13} /> Add Education
                      </button>
                    </div>
                    {educations.length === 0 ? (
                      <div className="text-center py-8 bg-[#f8f9fc] rounded-2xl border border-dashed border-[#e4e8f0]">
                        <GraduationCap size={24} className="mx-auto text-[#b0b8cc] mb-2" />
                        <p className="text-[13px] font-bold text-[#4a5068]">No Education Details Added Yet</p>
                        <p className="text-[11px] text-[#8890a4] mt-1 mb-3">Add your academic background and degrees.</p>
                        <button onClick={() => setShowEducationModal(true)} className="px-4 py-2 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer" style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}>
                          Add Education
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {educations.map(edu => (
                          <div key={edu.id} className="bg-[#f8f9fc] rounded-2xl p-5 border border-[#e4e8f0] hover:border-[#6c63ff]/30 transition-all group">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[11px] font-black text-white flex-shrink-0" style={{ background: edu.logoBg }}>{edu.logo}</div>
                                <div>
                                  <p className="text-[14px] font-extrabold text-[#1a1a2e]">{edu.degree}</p>
                                  <p className="text-[12px] text-[#4a5068]">{edu.field}</p>
                                  <p className="text-[11px] text-[#8890a4]">{edu.school}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-4 mt-2">
                              <span className="text-[11px] text-[#8890a4] flex items-center gap-1"><GraduationCap size={11} /> Class of {edu.year}</span>
                              <span className="text-[11px] text-[#8890a4] flex items-center gap-1"><Star size={11} /> GPA: {edu.gpa}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── SKILLS TAB ── */}
                {activeTab === 'skills' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[14px] font-extrabold text-[#1a1a2e]">Skills & Proficiency</h3>
                      <button onClick={() => setShowSkillModal(true)} className="flex items-center gap-1.5 text-[12px] font-bold text-[#6c63ff] bg-[#6c63ff]/8 px-3 py-2 rounded-xl border-none cursor-pointer hover:bg-[#6c63ff]/15 transition-colors">
                        <Plus size={13} /> Add Skill
                      </button>
                    </div>
                    {skillCategories.map(cat => (
                      <div key={cat} className="mb-5">
                        <p className="text-[10px] font-bold text-[#b0b8cc] uppercase tracking-widest mb-3">{cat}</p>
                        <div className="flex flex-col gap-3">
                          {skills.filter(s => s.category === cat).map(skill => (
                            <div key={skill.id} className="flex items-center gap-3 group">
                              <div className="w-32 flex-shrink-0">
                                <span className="text-[13px] font-semibold text-[#1a1a2e]">{skill.name}</span>
                              </div>
                              <div className="flex-1 h-2 bg-[#f0f2f8] rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${skill.level}%`, background: `linear-gradient(90deg,${levelColor(skill.level)},${levelColor(skill.level)}aa)` }} />
                              </div>
                              <div className="flex items-center gap-2 w-28 flex-shrink-0">
                                <span className="text-[11px] font-bold" style={{ color: levelColor(skill.level) }}>{levelLabel(skill.level)}</span>
                                <span className="text-[10px] text-[#b0b8cc]">{skill.level}%</span>
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
            <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-5 overflow-hidden">
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
                    { label: 'Experience', score: 95, ok: true },
                    { label: 'Skills', score: 88, ok: true },
                    { label: 'Portfolio', score: 70, ok: false },
                    { label: 'Keywords', score: 82, ok: true },
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
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Heart size={14} className="text-[#ff4d6d]" />
                  <h3 className="text-[14px] font-extrabold text-[#1a1a2e]">Job Preferences</h3>
                </div>
                <button onClick={() => { setEditingPrefs(!editingPrefs); setPrefsTemp(prefs); }} className="text-[11px] font-bold text-[#6c63ff] bg-transparent border-none cursor-pointer flex items-center gap-1 hover:underline">
                  <Edit3 size={11} /> {editingPrefs ? 'Cancel' : 'Edit'}
                </button>
              </div>
              {editingPrefs ? (
                <div className="flex flex-col gap-3">
                  {(Object.entries(prefsTemp)).map(([key, val]) => (
                    <div key={key}>
                      <label className="text-[10px] font-bold text-[#b0b8cc] uppercase tracking-wider block mb-1">{key.replace(/([A-Z])/g, ' $1')}</label>
                      <input value={val} onChange={e => setPrefsTemp(p => ({ ...p, [key]: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-[#e4e8f0] text-[12px] outline-none focus:border-[#6c63ff]" />
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
                    <div key={label} className="flex items-center justify-between py-2 border-b border-[#f0f2f8] last:border-0">
                      <div className="flex items-center gap-2">
                        {icon}
                        <span className="text-[11px] text-[#8890a4]">{label}</span>
                      </div>
                      <span className="text-[12px] font-semibold text-[#4a5068] text-right max-w-[120px]">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60">
              <h3 className="text-[13px] font-extrabold text-[#1a1a2e] mb-3">Career Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: '8+', label: 'Years Exp', color: '#6c63ff' },
                  { value: '3', label: 'Companies', color: '#f59e0b' },
                  { value: '10', label: 'Skills', color: '#00c853' },
                  { value: '4', label: 'Certs', color: '#8b5cf6' },
                ].map(({ value, label, color }) => (
                  <div key={label} className="flex flex-col items-center py-3 bg-[#f8f9fc] rounded-xl border border-[#e4e8f0]">
                    <span className="text-[24px] font-black leading-none" style={{ color }}>{value}</span>
                    <span className="text-[10px] text-[#8890a4] mt-1">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={14} className="text-[#6c63ff]" />
                <h3 className="text-[13px] font-extrabold text-[#1a1a2e]">Privacy Settings</h3>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Profile Visible to Recruiters', on: true },
                  { label: 'Show Open to Work Badge', on: true },
                  { label: 'Email Notifications', on: false },
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
      <span className="text-[12px] text-[#4a5068]">{label}</span>
      <button
        onClick={() => { setOn(!on); onToast(`${label}: ${!on ? 'On' : 'Off'}`); }}
        className={`w-10 h-5 rounded-full transition-all cursor-pointer border-none relative flex-shrink-0 ${on ? 'bg-[#6c63ff]' : 'bg-[#e4e8f0]'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${on ? 'left-5' : 'left-0.5'}`} />
      </button>
    </div>
  );
};

export default Profile;
