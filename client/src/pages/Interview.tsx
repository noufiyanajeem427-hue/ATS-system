import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import {
  Video, Calendar, Clock, MapPin, ExternalLink,
  CheckCircle2, ChevronRight, ChevronLeft,
  Sparkles, Star, AlertCircle, Mic, MicOff, VideoOff, PhoneOff, BookOpen,
  Play, X, Check, User, Building2, Zap, TrendingUp,
  Bell, Phone
} from 'lucide-react';
import { Page } from '../App';
import { fetchInterviewsApi, scheduleInterviewApi, deleteInterviewApi } from '../services/api';

interface InterviewProps {
  onMenuClick?: () => void;
  onNavigate?: (p: Page, job?: any) => void;
}

type TabType = 'upcoming' | 'past';

interface InterviewItem {
  id: number | string;
  role: string;
  company: string;
  companyLogo: string;
  logoBg: string;
  type: string;
  typeColor: string;
  typeBg: string;
  date: string;
  day: string;
  time: string;
  duration: string;
  interviewer: string;
  interviewerTitle: string;
  round: string;
  roundNum: number;
  totalRounds: number;
  mode: 'video' | 'phone' | 'onsite';
  link?: string;
  location?: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
  result?: 'passed' | 'failed' | 'pending';
  feedback?: string;
  score?: number;
}

const toLocalDateStr = (d: Date | string) => {
  const dateObj = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(dateObj.getTime())) return '';
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const getRelativeDate = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return {
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    day: d.toLocaleDateString('en-US', { weekday: 'long' }),
  };
};

const dUpcoming1 = getRelativeDate(2);
const dUpcoming2 = getRelativeDate(4);
const dUpcoming3 = getRelativeDate(7);

const dPast1 = getRelativeDate(-5);
const dPast2 = getRelativeDate(-12);

const upcomingInterviews: InterviewItem[] = [
  {
    id: 1,
    role: 'Senior Product Designer',
    company: 'Netflix',
    companyLogo: 'NF',
    logoBg: 'linear-gradient(135deg,#e50914,#831010)',
    type: 'Technical Round',
    typeColor: '#6c63ff',
    typeBg: '#6c63ff18',
    date: dUpcoming1.date,
    day: dUpcoming1.day,
    time: '10:00 AM – 11:30 AM',
    duration: '90 min',
    interviewer: 'Sarah Chen',
    interviewerTitle: 'Engineering Manager',
    round: 'Round 3',
    roundNum: 3,
    totalRounds: 4,
    mode: 'video',
    link: 'https://meet.google.com/abc-defg-hij',
    status: 'scheduled',
  },
  {
    id: 2,
    role: 'Lead UI Engineer',
    company: 'Nova Capital',
    companyLogo: 'NC',
    logoBg: 'linear-gradient(135deg,#f093fb,#f5576c)',
    type: 'Design Portfolio Review',
    typeColor: '#f59e0b',
    typeBg: '#f59e0b18',
    date: dUpcoming2.date,
    day: dUpcoming2.day,
    time: '2:00 PM – 3:00 PM',
    duration: '60 min',
    interviewer: 'James Park',
    interviewerTitle: 'Creative Director',
    round: 'Round 2',
    roundNum: 2,
    totalRounds: 3,
    mode: 'video',
    link: 'https://zoom.us/j/12345678',
    status: 'scheduled',
  },
  {
    id: 3,
    role: 'UX Research Lead',
    company: 'Verdant Labs',
    companyLogo: 'VL',
    logoBg: 'linear-gradient(135deg,#4facfe,#00f2fe)',
    type: 'Final Round',
    typeColor: '#00c853',
    typeBg: '#00c85318',
    date: dUpcoming3.date,
    day: dUpcoming3.day,
    time: '11:00 AM – 12:30 PM',
    duration: '90 min',
    interviewer: 'Priya Sharma',
    interviewerTitle: 'Head of Product',
    round: 'Round 4',
    roundNum: 4,
    totalRounds: 4,
    mode: 'onsite',
    location: 'Berlin, DE · Floor 5',
    status: 'scheduled',
  },
];

const pastInterviews: InterviewItem[] = [
  {
    id: 4,
    role: 'Product Design Lead',
    company: 'Airbnb',
    companyLogo: 'AB',
    logoBg: 'linear-gradient(135deg,#ff5a5f,#d70466)',
    type: 'Behavioral Round',
    typeColor: '#6c63ff',
    typeBg: '#6c63ff18',
    date: dPast1.date,
    day: dPast1.day,
    time: '4:00 PM – 5:00 PM',
    duration: '60 min',
    interviewer: 'Mike Torres',
    interviewerTitle: 'HR Manager',
    round: 'Round 1',
    roundNum: 1,
    totalRounds: 3,
    mode: 'phone',
    status: 'completed',
    result: 'passed',
    feedback: 'Great communication skills. Strong design background.',
    score: 88,
  },
  {
    id: 5,
    role: 'Senior UX Designer',
    company: 'Stripe',
    companyLogo: 'ST',
    logoBg: 'linear-gradient(135deg,#6772e5,#4b50d4)',
    type: 'Technical Assessment',
    typeColor: '#8890a4',
    typeBg: '#e4e8f0',
    date: dPast2.date,
    day: dPast2.day,
    time: '1:00 PM – 2:30 PM',
    duration: '90 min',
    interviewer: 'Anna Kim',
    interviewerTitle: 'Principal Designer',
    round: 'Round 2',
    roundNum: 2,
    totalRounds: 3,
    mode: 'video',
    status: 'completed',
    result: 'passed',
    feedback: 'Exceptional portfolio. Excellent systems thinking.',
    score: 94,
  },
];

const prepChecklist = [
  { id: 1, task: 'Research company culture & recent news', done: true },
  { id: 2, task: 'Prepare STAR-format stories for behavioral questions', done: true },
  { id: 3, task: 'Review Netflix Design System case studies', done: false },
  { id: 4, task: 'Test audio/video setup for the call', done: false },
  { id: 5, task: 'Prepare 3 thoughtful questions to ask', done: false },
];

const aiTips = [
  { icon: <Sparkles size={14} className="text-[#6c63ff]" />, tip: 'Mention your Design System impact at Meta — Netflix values systematic thinking.' },
  { icon: <TrendingUp size={14} className="text-[#00c853]" />, tip: 'Sarah Chen focuses on cross-functional collaboration. Highlight your PM partnerships.' },
  { icon: <Star size={14} className="text-[#f59e0b]" />, tip: 'Round 3 is typically the toughest. Expect deep dives on past decisions.' },
];

const formatBackendInterview = (item: any): InterviewItem => {
  const d = item.interviewDate ? new Date(item.interviewDate) : new Date();
  const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const dayStr = d.toLocaleDateString('en-US', { weekday: 'long' });
  const companyName = item.application?.job?.company || item.company || 'Tech Corp';
  const roleName = item.application?.job?.title || item.role || 'Software Engineer';
  const logoText = companyName.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase() || 'TC';

  const rawStatus = (item.status || 'scheduled').toLowerCase();
  const status: 'scheduled' | 'completed' | 'cancelled' = 
    rawStatus === 'completed' ? 'completed' : rawStatus === 'cancelled' ? 'cancelled' : 'scheduled';

  return {
    id: item._id,
    role: roleName,
    company: companyName,
    companyLogo: logoText,
    logoBg: 'linear-gradient(135deg,#6c63ff,#8b5cf6)',
    type: item.type || 'Technical Round',
    typeColor: '#6c63ff',
    typeBg: '#6c63ff18',
    date: dateStr,
    day: dayStr,
    time: item.interviewTime || '10:00 AM – 11:00 AM',
    duration: '60 min',
    interviewer: item.recruiter?.name || 'Hiring Manager',
    interviewerTitle: 'Recruiter',
    round: 'Round 1',
    roundNum: 1,
    totalRounds: 3,
    mode: 'video',
    link: item.meetingLink || 'https://meet.google.com',
    status: status,
  };
};

const Interview: React.FC<InterviewProps> = ({ onMenuClick, onNavigate }) => {
  const [tab, setTab] = useState<TabType>('upcoming');
  const [checklist, setChecklist] = useState(prepChecklist);
  const [toast, setToast] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | string | null>(1);
  const [liveInterviews, setLiveInterviews] = useState<InterviewItem[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    type: 'Technical Round',
    interviewDate: new Date().toISOString().split('T')[0],
    interviewTime: '10:00 AM – 11:30 AM',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
  });

  // Live Camera & Mic Video Room State
  const [activeInterviewRoom, setActiveInterviewRoom] = useState<InterviewItem | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [callSeconds, setCallSeconds] = useState<number>(0);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const startVideoCall = async (interview: InterviewItem) => {
    setActiveInterviewRoom(interview);
    setMediaError(null);
    setIsMicOn(true);
    setIsVideoOn(true);
    setCallSeconds(0);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setMediaStream(stream);
      } else {
        setMediaError('Camera / Microphone API is not supported in this browser.');
      }
    } catch (err: any) {
      console.error('Camera/Mic permission error:', err);
      setMediaError('Could not access camera or microphone. Please allow camera & microphone permissions in your browser.');
    }
  };

  const stopVideoCall = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    setActiveInterviewRoom(null);
    setMediaError(null);
  };

  useEffect(() => {
    if (activeInterviewRoom && videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [activeInterviewRoom, mediaStream]);

  useEffect(() => {
    let timer: any;
    if (activeInterviewRoom) {
      timer = setInterval(() => {
        setCallSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeInterviewRoom]);

  const toggleMic = () => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
        setIsMicOn(!isMicOn);
      }
    } else {
      setIsMicOn(!isMicOn);
    }
  };

  const toggleVideo = () => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    } else {
      setIsVideoOn(!isVideoOn);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Selected Date Filter State
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  // Dynamic Real Week State
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const todayDate = new Date();
    const dayOfWeek = todayDate.getDay();
    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(todayDate);
    monday.setDate(todayDate.getDate() + distanceToMonday);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const prevWeek = () => {
    setCurrentWeekStart(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const nextWeek = () => {
    setCurrentWeekStart(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  const loadInterviews = async () => {
    try {
      const data = await fetchInterviewsApi();
      if (Array.isArray(data)) {
        const formatted = data.map(formatBackendInterview);
        setLiveInterviews(formatted);
      }
    } catch (err) {
      console.error('Error fetching interviews:', err);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await scheduleInterviewApi({
        role: formData.role || 'Software Engineer',
        company: formData.company || 'Tech Corp',
        type: formData.type,
        interviewDate: formData.interviewDate,
        interviewTime: formData.interviewTime,
        meetingLink: formData.meetingLink,
      });
      showToast('Interview scheduled successfully!');
      setShowScheduleModal(false);
      setFormData({
        role: '',
        company: '',
        type: 'Technical Round',
        interviewDate: new Date().toISOString().split('T')[0],
        interviewTime: '10:00 AM – 11:30 AM',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
      });
      loadInterviews();
    } catch (err) {
      showToast('Failed to schedule interview');
    }
  };

  const handleDeleteInterview = async (id: string | number) => {
    if (typeof id === 'string') {
      try {
        await deleteInterviewApi(id);
        showToast('Interview cancelled');
        loadInterviews();
      } catch (err) {
        showToast('Error deleting interview');
      }
    } else {
      showToast('Interview cancelled');
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleCheck = (id: number) => {
    setChecklist(c => c.map(i => i.id === id ? { ...i, done: !i.done } : i));
  };

  const doneCount = checklist.filter(c => c.done).length;
  const prepPct = Math.round((doneCount / checklist.length) * 100);

  const modeIcon = (mode: InterviewItem['mode']) => {
    if (mode === 'video')  return <Video size={13} className="text-[#6c63ff]" />;
    if (mode === 'phone')  return <Phone size={13} className="text-[#f59e0b]" />;
    return <MapPin size={13} className="text-[#00c853]" />;
  };

  const liveUpcoming = liveInterviews.filter(i => i.status === 'scheduled');
  const livePast = liveInterviews.filter(i => i.status === 'completed' || i.status === 'cancelled');

  const allUpcoming = [...liveUpcoming, ...upcomingInterviews];
  const allPast = [...livePast, ...pastInterviews];

  const baseInterviews = tab === 'upcoming' ? allUpcoming : allPast;
  const interviews = selectedDateStr
    ? baseInterviews.filter(iv => iv.date && toLocalDateStr(iv.date) === selectedDateStr)
    : baseInterviews;
  const nextInterview = allUpcoming[0];

  // Calculate 7 days for active week (Mon - Sun)
  const todayStr = toLocalDateStr(new Date());

  const weekDays = Array.from({ length: 7 }).map((_, idx) => {
    const dayDate = new Date(currentWeekStart);
    dayDate.setDate(currentWeekStart.getDate() + idx);
    const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = dayDate.getDate();
    const fullDateStr = toLocalDateStr(dayDate);
    const isToday = fullDateStr === todayStr;

    // Find matching interview for this day
    const matchingInterview = allUpcoming.find(iv => {
      if (iv.date) {
        return toLocalDateStr(iv.date) === fullDateStr;
      }
      return false;
    });

    return {
      day: dayName,
      dateNum: dayNum,
      fullDateStr,
      isToday,
      hasInterview: !!matchingInterview,
      company: matchingInterview?.company || '',
    };
  });

  const formatMonthYear = () => {
    const endOfWeek = new Date(currentWeekStart);
    endOfWeek.setDate(currentWeekStart.getDate() + 6);
    const startMonth = currentWeekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const endMonth = endOfWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (startMonth === endMonth) return startMonth;
    return `${currentWeekStart.toLocaleDateString('en-US', { month: 'short' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
  };

  return (
    <div className="flex flex-col min-h-screen w-full lg:w-[calc(100vw-220px)] lg:ml-[220px] bg-[#f4f6fb] overflow-x-hidden">
      <Topbar onMenuClick={onMenuClick} onNavigate={onNavigate} />

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-[#1a1a2e] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#6c63ff]/30">
          <Check size={15} className="text-[#00c853]" />
          <span className="text-xs font-medium">{toast}</span>
          <button onClick={() => setToast(null)} className="text-[#8890a4] hover:text-white ml-1 bg-transparent border-none cursor-pointer"><X size={12} /></button>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-[#e4e8f0]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1a1a2e]">Schedule New Interview</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-[#8890a4] hover:text-[#1a1a2e] bg-transparent border-none cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-[#4a5068] mb-1 block">Job Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#e4e8f0] focus:outline-none focus:border-[#6c63ff]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#4a5068] mb-1 block">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#e4e8f0] focus:outline-none focus:border-[#6c63ff]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#4a5068] mb-1 block">Round / Type</label>
                <input
                  type="text"
                  placeholder="e.g. Technical Round 1"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#e4e8f0] focus:outline-none focus:border-[#6c63ff]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#4a5068] mb-1 block">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.interviewDate}
                    onChange={e => setFormData({ ...formData, interviewDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#e4e8f0] focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#4a5068] mb-1 block">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:00 AM - 11:30 AM"
                    value={formData.interviewTime}
                    onChange={e => setFormData({ ...formData, interviewTime: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#e4e8f0] focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#4a5068] mb-1 block">Meeting Link</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={formData.meetingLink}
                  onChange={e => setFormData({ ...formData, meetingLink: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#e4e8f0] focus:outline-none focus:border-[#6c63ff]"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#4a5068] bg-[#f4f6fb] rounded-xl border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white rounded-xl border-none cursor-pointer"
                  style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}
                >
                  Schedule Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── LIVE CAMERA & MIC INTERVIEW ROOM OVERLAY ── */}
      {activeInterviewRoom && (
        <div className="fixed inset-0 z-50 bg-[#0f0f1a] text-white flex flex-col overflow-hidden animate-in fade-in duration-300">
          {/* Top Bar */}
          <div className="h-16 bg-[#16162a]/90 backdrop-blur-md border-b border-[#2a2a4a] px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-white" style={{ background: activeInterviewRoom.logoBg }}>
                {activeInterviewRoom.companyLogo}
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  {activeInterviewRoom.role}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6c63ff]/20 text-[#a78bfa] border border-[#6c63ff]/30 font-medium">
                    {activeInterviewRoom.type}
                  </span>
                </h2>
                <p className="text-[11px] text-[#8890a4]">{activeInterviewRoom.company} · Live Interview Session</p>
              </div>
            </div>

            {/* Live Indicator & Timer */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#ff4d6d]/15 border border-[#ff4d6d]/30 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#ff4d6d] animate-ping" />
                <span className="text-xs font-bold text-[#ff4d6d]">LIVE</span>
                <span className="text-xs font-mono text-white/90 ml-1">{formatTimer(callSeconds)}</span>
              </div>

              <button
                onClick={stopVideoCall}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all border-none cursor-pointer"
              >
                <PhoneOff size={14} /> End Interview
              </button>
            </div>
          </div>

          {/* Main Call View */}
          <div className="flex-1 relative p-4 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 bg-[#0a0a14]">
            {/* Main Stage */}
            <div className="relative rounded-2xl bg-[#141424] border border-[#2a2a4a] overflow-hidden flex flex-col items-center justify-center">
              
              {/* Interviewer View (Simulated Live Recruiter Stream) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1a36] to-[#0f0f24]">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#6c63ff] to-[#8b5cf6] flex items-center justify-center text-3xl font-black text-white shadow-2xl border-4 border-[#6c63ff]/40 animate-pulse">
                    {activeInterviewRoom.interviewer ? activeInterviewRoom.interviewer.charAt(0) : 'S'}
                  </div>
                  <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#00c853] border-2 border-[#141424]" />
                </div>
                <h3 className="text-base font-bold text-white mt-4">{activeInterviewRoom.interviewer || 'Sarah Chen'}</h3>
                <p className="text-xs text-[#8890a4] mt-0.5">{activeInterviewRoom.interviewerTitle || 'Senior Hiring Manager'} · {activeInterviewRoom.company}</p>
                <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-[#6c63ff]/10 border border-[#6c63ff]/20 text-xs text-[#a78bfa]">
                  <Sparkles size={13} /> AI Assistant Active · Camera & Microphone Live
                </div>
              </div>

              {/* Candidate Camera Feed Box (Picture-in-Picture / Floating Self View) */}
              <div className="absolute bottom-6 right-6 w-56 sm:w-72 aspect-video bg-[#0a0a14] rounded-2xl border-2 border-[#6c63ff]/50 shadow-2xl overflow-hidden transition-all hover:scale-105">
                {isVideoOn && !mediaError ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#1a1a2e] text-[#8890a4]">
                    <VideoOff size={28} className="text-[#ff4d6d] mb-1" />
                    <span className="text-[11px] font-medium text-white/70">Camera Off</span>
                  </div>
                )}

                {/* Candidate Name Tag */}
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isMicOn ? 'bg-[#00c853]' : 'bg-[#ff4d6d]'}`} />
                  You (Candidate)
                </div>
              </div>

              {/* Media Error Alert Banner */}
              {mediaError && (
                <div className="absolute top-6 left-6 right-6 z-20 bg-red-950/90 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-xs flex items-center gap-2 shadow-xl backdrop-blur-md">
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                  <span>{mediaError}</span>
                </div>
              )}
            </div>

            {/* Sidebar Notes & Prep */}
            <div className="hidden lg:flex flex-col gap-3 bg-[#141424] border border-[#2a2a4a] rounded-2xl p-4 overflow-y-auto">
              <div className="flex items-center gap-2 pb-3 border-b border-[#2a2a4a]">
                <Sparkles size={15} className="text-[#6c63ff]" />
                <h3 className="text-xs font-bold text-white tracking-wide uppercase">AI Interview Copilot</h3>
              </div>

              <div className="flex flex-col gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#1d1d36] border border-[#2a2a4a]">
                  <p className="font-bold text-[#a78bfa] mb-1">Key Tip for Round</p>
                  <p className="text-[#b0b8cc] leading-relaxed text-[11px]">
                    Use the STAR framework (Situation, Task, Action, Result) to structure your responses effectively.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#1d1d36] border border-[#2a2a4a]">
                  <p className="font-bold text-white mb-2">Live Mic Level</p>
                  <div className="flex items-center gap-1 h-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all ${
                          isMicOn ? 'bg-[#00c853]' : 'bg-[#2a2a4a]'
                        }`}
                        style={{
                          height: isMicOn ? `${Math.floor(Math.random() * 80) + 20}%` : '20%',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#1d1d36] border border-[#2a2a4a]">
                  <p className="font-bold text-[#00c853] mb-1">Meeting Link</p>
                  <a
                    href={activeInterviewRoom.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#6c63ff] hover:underline break-all text-[11px]"
                  >
                    {activeInterviewRoom.link}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Controls Bar */}
          <div className="h-20 bg-[#16162a] border-t border-[#2a2a4a] px-6 flex items-center justify-center gap-4">
            {/* Mic Toggle */}
            <button
              onClick={toggleMic}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border-none cursor-pointer ${
                isMicOn
                  ? 'bg-[#2a2a4a] text-white hover:bg-[#383860]'
                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
              }`}
              title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            {/* Video Toggle */}
            <button
              onClick={toggleVideo}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border-none cursor-pointer ${
                isVideoOn
                  ? 'bg-[#2a2a4a] text-white hover:bg-[#383860]'
                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
              }`}
              title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>

            {/* End Call Button */}
            <button
              onClick={stopVideoCall}
              className="w-14 h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all border-none cursor-pointer shadow-lg shadow-red-600/30"
              title="Leave Room"
            >
              <PhoneOff size={22} />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Page Header */}
        <div className="flex items-start justify-between mb-7 flex-wrap gap-3">
          <div>
            <h1 className="text-[26px] sm:text-[32px] font-black text-[#1a1a2e] tracking-tight">Interviews</h1>
            <p className="text-sm text-[#8890a4] mt-1">You have <span className="font-bold text-[#6c63ff]">{allUpcoming.length} upcoming</span> interviews scheduled.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => showToast('Interview reminder set!')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold text-[#4a5068] bg-white border border-[#e4e8f0] hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all cursor-pointer">
              <Bell size={14} /> Set Reminder
            </button>
            <button onClick={() => setShowScheduleModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 4px 14px rgba(108,99,255,0.35)' }}>
              <Calendar size={14} /> + Schedule Interview
            </button>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
          {[
            { label: 'Upcoming',  value: upcomingInterviews.length, icon: <Calendar size={16} className="text-[#6c63ff]" />, color: '#6c63ff', bg: '#6c63ff12' },
            { label: 'Completed', value: pastInterviews.length,     icon: <CheckCircle2 size={16} className="text-[#00c853]" />, color: '#00c853', bg: '#00c85312' },
            { label: 'Pass Rate', value: '100%',                    icon: <TrendingUp size={16} className="text-[#f59e0b]" />,   color: '#f59e0b', bg: '#f59e0b12' },
            { label: 'Avg Score', value: '91%',                     icon: <Star size={16} className="text-[#8b5cf6]" />,          color: '#8b5cf6', bg: '#8b5cf612' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-[#e4e8f0]/60 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                {s.icon}
              </div>
              <div>
                <div className="text-[22px] font-black leading-none" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[11px] text-[#8890a4] font-medium mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

          {/* ── Left Column ── */}
          <div className="flex flex-col gap-5">

            {/* Dynamic Mini Calendar Strip */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[15px] font-extrabold text-[#1a1a2e]">{formatMonthYear()}</h3>
                <div className="flex gap-1">
                  <button onClick={prevWeek} className="w-7 h-7 rounded-lg bg-[#f4f6fb] flex items-center justify-center border-none cursor-pointer hover:bg-[#6c63ff]/10 text-[#4a5068]" title="Previous Week"><ChevronLeft size={14} /></button>
                  <button onClick={nextWeek} className="w-7 h-7 rounded-lg bg-[#f4f6fb] flex items-center justify-center border-none cursor-pointer hover:bg-[#6c63ff]/10 text-[#4a5068]" title="Next Week"><ChevronRight size={14} /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map(d => {
                  const isSelected = selectedDateStr === d.fullDateStr;
                  return (
                    <div
                      key={d.fullDateStr}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'ring-2 ring-[#6c63ff] bg-[#6c63ff]/15 shadow-md'
                          : d.isToday
                          ? 'text-white shadow-md'
                          : d.hasInterview
                          ? 'bg-[#6c63ff]/8 hover:bg-[#6c63ff]/15'
                          : 'hover:bg-[#f4f6fb]'
                      }`}
                      style={d.isToday && !isSelected ? { background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' } : {}}
                      onClick={() => {
                        if (selectedDateStr === d.fullDateStr) {
                          setSelectedDateStr(null);
                          showToast('Showing all interviews');
                        } else {
                          setSelectedDateStr(d.fullDateStr);
                          const dateFormatted = new Date(d.fullDateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                          showToast(`Filtering for ${dateFormatted}`);
                        }
                      }}
                    >
                      <span className={`text-[10px] font-bold ${d.isToday && !isSelected ? 'text-white/80' : isSelected ? 'text-[#6c63ff]' : 'text-[#b0b8cc]'}`}>{d.day}</span>
                      <span className={`text-[16px] font-extrabold ${d.isToday && !isSelected ? 'text-white' : isSelected ? 'text-[#6c63ff]' : d.hasInterview ? 'text-[#6c63ff]' : 'text-[#1a1a2e]'}`}>{d.dateNum}</span>
                      {d.hasInterview && !d.isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6c63ff]" />
                      )}
                      {d.isToday && <span className="w-1.5 h-1.5 rounded-full bg-white/70" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tab Bar & Date Filter Banner */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e4e8f0]/60 overflow-hidden">
              <div className="flex border-b border-[#e4e8f0]">
                {(['upcoming', 'past'] as TabType[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-3.5 text-[13px] font-bold capitalize transition-all border-none cursor-pointer ${
                      tab === t ? 'text-[#6c63ff] bg-[#6c63ff]/5' : 'text-[#8890a4] bg-transparent hover:text-[#4a5068]'
                    }`}
                    style={{ borderBottom: tab === t ? '2px solid #6c63ff' : '2px solid transparent' }}
                  >
                    {t === 'upcoming' ? `Upcoming (${allUpcoming.length})` : `Past (${allPast.length})`}
                  </button>
                ))}
              </div>

              {/* Selected Date Filter Banner */}
              {selectedDateStr && (
                <div className="flex items-center justify-between px-5 py-3.5 bg-[#6c63ff]/8 border-b border-[#6c63ff]/20">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#6c63ff]">
                    <Calendar size={14} />
                    <span>Schedule for {new Date(selectedDateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} ({interviews.length} interview(s))</span>
                  </div>
                  <button onClick={() => setSelectedDateStr(null)} className="text-[11px] font-bold text-[#6c63ff] hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1">
                    Show All <X size={12} />
                  </button>
                </div>
              )}

              {/* Interview Cards */}
              <div className="divide-y divide-[#f0f2f8]">
                {interviews.length === 0 ? (
                  <div className="p-8 text-center bg-[#f8f9fc]">
                    <Calendar size={28} className="mx-auto text-[#b0b8cc] mb-2" />
                    <p className="text-[13px] font-bold text-[#4a5068]">No Interviews Scheduled For This Day</p>
                    <p className="text-[11px] text-[#8890a4] mt-1 mb-3">There are no interviews scheduled on this selected date.</p>
                    <button onClick={() => setSelectedDateStr(null)} className="px-4 py-2 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer" style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}>
                      Show All Interviews
                    </button>
                  </div>
                ) : interviews.map(iv => (
                  <div key={iv.id} className="p-5">
                    {/* Card Header */}
                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[13px] font-black text-white flex-shrink-0" style={{ background: iv.logoBg }}>
                        {iv.companyLogo}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <h3 className="text-[15px] font-extrabold text-[#1a1a2e]">{iv.role}</h3>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="flex items-center gap-1 text-[12px] text-[#8890a4]">
                                <Building2 size={11} /> {iv.company}
                              </span>
                              <span className="text-[#e4e8f0]">•</span>
                              <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{ color: iv.typeColor, background: iv.typeBg }}
                              >
                                {iv.type}
                              </span>
                            </div>
                          </div>

                          {/* Round badge */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#8890a4] bg-[#f4f6fb] px-2.5 py-1 rounded-full">
                              {iv.round} of {iv.totalRounds}
                            </span>
                            {tab === 'past' && iv.result && (
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${iv.result === 'passed' ? 'bg-[#00c853]/10 text-[#00a843]' : 'bg-[#ff4d6d]/10 text-[#ff4d6d]'}`}>
                                {iv.result === 'passed' ? '✓ Passed' : '✗ Failed'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Date/Time/Mode */}
                        <div className="flex flex-wrap gap-4 mt-3">
                          <div className="flex items-center gap-1.5 text-[12px] text-[#4a5068]">
                            <Calendar size={13} className="text-[#8890a4]" />
                            {iv.day}, {iv.date}
                          </div>
                          <div className="flex items-center gap-1.5 text-[12px] text-[#4a5068]">
                            <Clock size={13} className="text-[#8890a4]" />
                            {iv.time} · {iv.duration}
                          </div>
                          <div className="flex items-center gap-1.5 text-[12px] text-[#4a5068]">
                            {modeIcon(iv.mode)}
                            {iv.mode === 'video' ? 'Video Call' : iv.mode === 'phone' ? 'Phone Call' : iv.location || 'On-site'}
                          </div>
                        </div>

                        {/* Interviewer */}
                        <div className="flex items-center gap-2 mt-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6c63ff] to-[#8b5cf6] flex items-center justify-center text-[9px] font-black text-white">
                            {iv.interviewer.charAt(0)}
                          </div>
                          <span className="text-[11px] text-[#4a5068]">
                            <span className="font-semibold">{iv.interviewer}</span> · {iv.interviewerTitle}
                          </span>
                        </div>

                        {/* Past feedback */}
                        {tab === 'past' && iv.feedback && (
                          <div className="mt-3 px-3 py-2.5 bg-[#f8f9fc] rounded-xl border border-[#e4e8f0] text-[11px] text-[#4a5068] italic">
                            "{iv.feedback}"
                            {iv.score && (
                              <span className="not-italic font-bold text-[#6c63ff] ml-2">— Score: {iv.score}/100</span>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-4 flex-wrap">
                          {tab === 'upcoming' && iv.link && (
                            <button
                              onClick={() => startVideoCall(iv)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95"
                              style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 3px 10px rgba(108,99,255,0.3)' }}
                            >
                              <Play size={12} /> Join Interview
                            </button>
                          )}
                          {tab === 'upcoming' && (
                            <button
                              onClick={() => setExpandedId(expandedId === iv.id ? null : iv.id)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-[#4a5068] bg-[#f4f6fb] border-none cursor-pointer hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all"
                            >
                              <BookOpen size={12} /> Prep Guide
                            </button>
                          )}
                          {tab === 'past' && (
                            <button
                              onClick={() => showToast('Opening interview debrief...')}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-[#4a5068] bg-[#f4f6fb] border-none cursor-pointer hover:text-[#6c63ff] transition-all"
                            >
                              <BookOpen size={12} /> View Debrief
                            </button>
                          )}
                          <button onClick={() => handleDeleteInterview(iv.id)} title="Cancel Interview" className="w-8 h-8 rounded-xl bg-[#f4f6fb] flex items-center justify-center border-none cursor-pointer hover:bg-red-50 hover:text-red-500 transition-colors text-[#8890a4]">
                            <X size={15} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Round progress dots */}
                    <div className="flex items-center gap-1.5 mt-4 ml-16">
                      {Array.from({ length: iv.totalRounds }, (_, i) => i + 1).map(n => (
                        <div
                          key={n}
                          className="h-1.5 rounded-full transition-all"
                          style={{
                            width: n <= iv.roundNum ? '24px' : '8px',
                            background: n < iv.roundNum ? '#00c853' : n === iv.roundNum ? '#6c63ff' : '#e4e8f0',
                          }}
                        />
                      ))}
                      <span className="text-[10px] text-[#b0b8cc] ml-1">{iv.roundNum}/{iv.totalRounds} rounds</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="flex flex-col gap-5">

            {/* Next Interview Countdown */}
            <div
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{ background: 'linear-gradient(145deg,#1a1a2e,#16213e)' }}
            >
              <div className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-20 blur-2xl" style={{ background: '#6c63ff' }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#a78bfa] tracking-widest mb-3">
                  <Zap size={11} /> NEXT INTERVIEW
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black text-white" style={{ background: nextInterview?.logoBg || 'linear-gradient(135deg,#e50914,#831010)' }}>
                    {nextInterview?.companyLogo || 'TC'}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-white">{nextInterview?.role || 'Senior Product Designer'}</p>
                    <p className="text-[11px] text-[#b0b8cc]">{nextInterview?.company || 'Company'} · {nextInterview?.type || 'Technical Round'}</p>
                  </div>
                </div>
                <div className="bg-white/8 rounded-xl p-3 mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] text-[#b0b8cc] flex items-center gap-1"><Calendar size={10} /> {nextInterview?.date || 'Oct 24'}, {nextInterview?.day || 'Wednesday'}</span>
                    <span className="text-[10px] font-bold text-[#6c63ff] bg-[#6c63ff]/20 px-2 py-0.5 rounded-full">Upcoming</span>
                  </div>
                  <div className="text-[13px] text-white flex items-center gap-1.5"><Clock size={12} className="text-[#b0b8cc]" /> {nextInterview?.time || '10:00 AM – 11:30 AM'}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[['02', 'Hrs'], ['45', 'Min'], ['30', 'Sec']].map(([v, l]) => (
                    <div key={l} className="bg-white/10 rounded-xl py-2.5 text-center">
                      <div className="text-[22px] font-black text-white leading-none">{v}</div>
                      <div className="text-[9px] text-[#b0b8cc] mt-0.5">{l}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    if (nextInterview) {
                      startVideoCall(nextInterview);
                    } else {
                      showToast('No upcoming interview scheduled');
                    }
                  }}
                  className="w-full py-3 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2 border-none cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 4px 14px rgba(108,99,255,0.4)' }}
                >
                  <ExternalLink size={14} /> Join Now
                </button>
              </div>
            </div>

            {/* Prep Checklist */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#6c63ff]/10 flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-[#6c63ff]" />
                  </div>
                  <h3 className="text-[14px] font-extrabold text-[#1a1a2e]">Prep Checklist</h3>
                </div>
                <span className="text-[12px] font-bold text-[#6c63ff]">{prepPct}%</span>
              </div>
              <div className="h-1.5 bg-[#f0f2f8] rounded-full mb-4 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${prepPct}%`, background: 'linear-gradient(90deg,#6c63ff,#8b5cf6)' }} />
              </div>

              <div className="flex flex-col gap-2.5">
                {checklist.map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="flex items-start gap-3 text-left bg-transparent border-none cursor-pointer p-0 group"
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${item.done ? 'bg-[#00c853]' : 'border-2 border-[#d1d5db] group-hover:border-[#6c63ff]'}`}>
                      {item.done && <Check size={11} strokeWidth={3} className="text-white" />}
                    </div>
                    <span className={`text-[12px] leading-relaxed transition-colors ${item.done ? 'text-[#b0b8cc] line-through' : 'text-[#4a5068] group-hover:text-[#1a1a2e]'}`}>
                      {item.task}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Interview Tips */}
            <div className="bg-gradient-to-br from-[#f0efff] to-[#e8f4ff] rounded-2xl p-5 border border-[#6c63ff]/15">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-[#6c63ff]/15 flex items-center justify-center">
                  <Sparkles size={13} className="text-[#6c63ff]" />
                </div>
                <h3 className="text-[14px] font-extrabold text-[#1a1a2e]">AI Interview Tips</h3>
              </div>
              <div className="flex flex-col gap-3">
                {aiTips.map((t, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 bg-white/70 rounded-xl border border-[#6c63ff]/10">
                    <div className="flex-shrink-0 mt-0.5">{t.icon}</div>
                    <p className="text-[11px] text-[#4a5068] leading-relaxed">{t.tip}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => showToast('Generating personalized interview script...')}
                className="w-full mt-4 py-2.5 rounded-xl text-[12px] font-bold text-[#6c63ff] bg-white border border-[#6c63ff]/30 cursor-pointer hover:bg-[#6c63ff] hover:text-white transition-all"
              >
                Generate Full Prep Script →
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60">
              <h3 className="text-[13px] font-extrabold text-[#1a1a2e] mb-3">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                {[
                  { icon: <Mic size={13} className="text-[#6c63ff]" />, label: 'Practice with AI Mock Interview' },
                  { icon: <BookOpen size={13} className="text-[#f59e0b]" />, label: 'Review Common Questions' },
                  { icon: <User size={13} className="text-[#00c853]" />, label: 'Research Your Interviewer' },
                  { icon: <AlertCircle size={13} className="text-[#ff4d6d]" />, label: 'Request Reschedule' },
                ].map((a, i) => (
                  <button
                    key={i}
                    onClick={() => showToast(`Opening: ${a.label}`)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#f8f9fc] border border-[#e4e8f0] text-[12px] font-semibold text-[#4a5068] hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all cursor-pointer text-left"
                  >
                    {a.icon}
                    {a.label}
                    <ChevronRight size={12} className="ml-auto text-[#c4c9d4]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default Interview;
