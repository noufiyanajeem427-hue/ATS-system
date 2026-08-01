import React, { useState, useEffect, useRef } from 'react';
import Topbar from '../components/Topbar';
import {
  Video, Calendar, Clock, MapPin, ExternalLink,
  CheckCircle2, ChevronRight, ChevronLeft,
  Sparkles, Star, AlertCircle, Mic, MicOff, VideoOff, PhoneOff, BookOpen,
  Play, X, Check, User, Building2, Zap, TrendingUp,
  Bell, Phone, Search, Filter, Plus, Trash2, Monitor, Copy,
  MessageSquare, Award, RotateCcw, FileText, SlidersHorizontal
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
  notes?: string;
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
    feedback: 'Great communication skills. Strong design background and STAR framework alignment.',
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
    feedback: 'Exceptional portfolio presentation. Excellent systems thinking and API architecture knowledge.',
    score: 94,
  },
];

const initialPrepChecklist = [
  { id: 1, task: 'Research company culture & recent product launches', done: true },
  { id: 2, task: 'Prepare STAR-format stories for behavioral questions', done: true },
  { id: 3, task: 'Review Design System case studies & architecture decisions', done: false },
  { id: 4, task: 'Test audio/video setup and microphone levels', done: false },
  { id: 5, task: 'Prepare 3 thoughtful questions to ask the interviewer', done: false },
];

const aiTips = [
  { icon: <Sparkles size={14} className="text-[#6c63ff]" />, tip: 'Mention your Design System impact at Meta — Netflix values systematic, scalable thinking.' },
  { icon: <TrendingUp size={14} className="text-[#00c853]" />, tip: 'Sarah Chen focuses on cross-functional collaboration. Highlight your PM partnerships.' },
  { icon: <Star size={14} className="text-[#f59e0b]" />, tip: 'Round 3 is typically the toughest. Expect deep dives on trade-offs and edge cases.' },
];

const mockInterviewQuestions = [
  {
    id: 1,
    question: "Tell me about a time you had to resolve a severe technical disagreement within your engineering team.",
    hint: "Use the STAR framework. Focus on empathetic listening, data-driven decisions, and the resulting team alignment.",
    sampleKeywords: ["STAR framework", "trade-offs", "consensus", "metrics"],
  },
  {
    id: 2,
    question: "How do you approach optimizing a complex application for high performance and responsiveness?",
    hint: "Mention profiling tools, lazy loading, code splitting, memoization, and backend payload minimization.",
    sampleKeywords: ["profiling", "caching", "lazy loading", "TTFB", "FPS"],
  },
  {
    id: 3,
    question: "Why do you want to join our engineering team, and what unique value will you bring?",
    hint: "Connect your career trajectory to our company mission, and highlight your technical leadership experience.",
    sampleKeywords: ["company mission", "scalable systems", "mentorship"],
  },
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

  const modeVal: 'video' | 'phone' | 'onsite' = 
    item.mode === 'phone' ? 'phone' : item.mode === 'onsite' ? 'onsite' : 'video';

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
    interviewer: item.recruiter?.name || item.interviewer || 'Hiring Manager',
    interviewerTitle: item.interviewerTitle || 'Senior Technical Recruiter',
    round: item.round || 'Round 1',
    roundNum: item.roundNum || 1,
    totalRounds: item.totalRounds || 3,
    mode: modeVal,
    link: item.meetingLink || 'https://meet.google.com/abc-defg-hij',
    status: status,
    location: item.location,
  };
};

const Interview: React.FC<InterviewProps> = ({ onMenuClick, onNavigate }) => {
  // Navigation & Filtering State
  const [tab, setTab] = useState<TabType>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState<'all' | 'video' | 'phone' | 'onsite'>('all');
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  // Prep Checklist & Persistence
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('ats_interview_prep_checklist');
      return saved ? JSON.parse(saved) : initialPrepChecklist;
    } catch {
      return initialPrepChecklist;
    }
  });
  const [newTaskInput, setNewTaskInput] = useState('');

  // Personal Notes per Interview Persistence
  const [customNotes, setCustomNotes] = useState<Record<string | number, string>>(() => {
    try {
      const saved = localStorage.getItem('ats_interview_custom_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [toast, setToast] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | string | null>(1);
  const [liveInterviews, setLiveInterviews] = useState<InterviewItem[]>([]);

  // Scheduling Modal State
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    type: 'Technical Round',
    interviewDate: new Date().toISOString().split('T')[0],
    interviewTime: '10:00 AM – 11:30 AM',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    mode: 'video' as 'video' | 'phone' | 'onsite',
    interviewer: '',
    interviewerTitle: 'Engineering Manager',
    totalRounds: 3,
    location: '',
  });

  // AI Prep Script Modal State
  const [showPrepScriptModal, setShowPrepScriptModal] = useState<boolean>(false);
  const [scriptTargetItem, setScriptTargetItem] = useState<InterviewItem | null>(null);

  // AI Mock Practice Simulator State
  const [showMockModal, setShowMockModal] = useState<boolean>(false);
  const [mockStep, setMockStep] = useState<number>(0);
  const [mockUserAnswers, setMockUserAnswers] = useState<string[]>(['', '', '']);
  const [mockCompleted, setMockCompleted] = useState<boolean>(false);
  const [isMockRecording, setIsMockRecording] = useState<boolean>(false);

  // Live Camera & Mic Video Room State
  const [activeInterviewRoom, setActiveInterviewRoom] = useState<InterviewItem | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [callSeconds, setCallSeconds] = useState<number>(0);
  const [layoutMode, setLayoutMode] = useState<'speaker' | 'grid' | 'screenshare'>('speaker');
  const [aiTranscript, setAiTranscript] = useState<Array<{ sender: string; text: string; time: string }>>([]);
  const [showDebriefModal, setShowDebriefModal] = useState<boolean>(false);
  const [lastDebrief, setLastDebrief] = useState<any>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);

  // Persistence Effects
  useEffect(() => {
    try {
      localStorage.setItem('ats_interview_prep_checklist', JSON.stringify(checklist));
    } catch (e) {
      console.error('Error saving checklist to localStorage:', e);
    }
  }, [checklist]);

  useEffect(() => {
    try {
      localStorage.setItem('ats_interview_custom_notes', JSON.stringify(customNotes));
    } catch (e) {
      console.error('Error saving custom notes to localStorage:', e);
    }
  }, [customNotes]);

  // Dynamic Real Week Calendar State
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

  // Video Call Controls
  const startVideoCall = async (interview: InterviewItem) => {
    setActiveInterviewRoom(interview);
    setMediaError(null);
    setIsMicOn(true);
    setIsVideoOn(true);
    setIsScreenSharing(false);
    setCallSeconds(0);
    setAiTranscript([
      { sender: 'AI Copilot', text: `Welcome! Live AI transcript & assistant active for ${interview.role} at ${interview.company}.`, time: '00:01' },
      { sender: interview.interviewer || 'Interviewer', text: "Hello! Thanks for joining today. Are you ready to begin?", time: '00:04' },
    ]);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setMediaStream(stream);
      } else {
        setMediaError('Camera / Microphone API is not supported in this browser environment.');
      }
    } catch (err: any) {
      console.error('Camera/Mic permission error:', err);
      setMediaError('Could not access camera or microphone. Please ensure permissions are allowed.');
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStream) {
        screenStream.getTracks().forEach(t => t.stop());
        setScreenStream(null);
      }
      setIsScreenSharing(false);
      setLayoutMode('speaker');
      showToast('Screen sharing stopped.');
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          setScreenStream(stream);
          setIsScreenSharing(true);
          setLayoutMode('screenshare');
          showToast('Screen sharing started.');
          stream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
            setScreenStream(null);
            setLayoutMode('speaker');
          };
        } else {
          showToast('Screen sharing is not supported in this browser.');
        }
      } catch (err) {
        console.warn('Screen share cancelled or failed:', err);
      }
    }
  };

  const stopVideoCall = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
    }
    
    // Set up debrief evaluation
    if (activeInterviewRoom) {
      setLastDebrief({
        interview: activeInterviewRoom,
        duration: formatTimer(callSeconds),
        clarityScore: Math.floor(Math.random() * 12) + 88,
        technicalScore: Math.floor(Math.random() * 10) + 90,
        starStructure: '95%',
        keyTakeaway: 'Strong communication of core trade-offs. Structured STAR responses impressed interviewer.',
      });
      setShowDebriefModal(true);
    }

    setActiveInterviewRoom(null);
    setIsScreenSharing(false);
    setMediaError(null);
  };

  useEffect(() => {
    if (activeInterviewRoom && videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [activeInterviewRoom, mediaStream]);

  useEffect(() => {
    if (isScreenSharing && screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [isScreenSharing, screenStream]);

  useEffect(() => {
    let timer: any;
    if (activeInterviewRoom) {
      timer = setInterval(() => {
        setCallSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeInterviewRoom]);

  // Periodic AI Transcript simulation in call
  useEffect(() => {
    let interval: any;
    if (activeInterviewRoom) {
      interval = setInterval(() => {
        if (callSeconds === 15) {
          setAiTranscript(prev => [
            ...prev,
            { sender: activeInterviewRoom.interviewer || 'Interviewer', text: "Could you walk me through a complex architectural trade-off you recently made?", time: formatTimer(callSeconds) },
            { sender: 'AI Copilot', text: "💡 Tip: State the initial constraints, options evaluated, and why you chose your solution.", time: formatTimer(callSeconds + 1) }
          ]);
        } else if (callSeconds === 45) {
          setAiTranscript(prev => [
            ...prev,
            { sender: 'You (Candidate)', text: "In my recent project, we evaluated client-side caching vs server-side rendering for optimal load times...", time: formatTimer(callSeconds) }
          ]);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeInterviewRoom, callSeconds]);

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

  // Schedule Submit
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
        mode: formData.mode,
        interviewer: formData.interviewer || 'Hiring Manager',
        interviewerTitle: formData.interviewerTitle,
        roundNum: 1,
        totalRounds: formData.totalRounds,
        location: formData.location,
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
        mode: 'video',
        interviewer: '',
        interviewerTitle: 'Engineering Manager',
        totalRounds: 3,
        location: '',
      });
      loadInterviews();
    } catch (err) {
      showToast('Interview saved locally');
      // Add local interview
      const dObj = new Date(formData.interviewDate);
      const newIv: InterviewItem = {
        id: Date.now(),
        role: formData.role || 'Software Engineer',
        company: formData.company || 'Tech Corp',
        companyLogo: (formData.company || 'TC').substring(0, 2).toUpperCase(),
        logoBg: 'linear-gradient(135deg,#6c63ff,#8b5cf6)',
        type: formData.type,
        typeColor: '#6c63ff',
        typeBg: '#6c63ff18',
        date: dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        day: dObj.toLocaleDateString('en-US', { weekday: 'long' }),
        time: formData.interviewTime,
        duration: '60 min',
        interviewer: formData.interviewer || 'Hiring Manager',
        interviewerTitle: formData.interviewerTitle,
        round: 'Round 1',
        roundNum: 1,
        totalRounds: formData.totalRounds,
        mode: formData.mode,
        link: formData.meetingLink,
        status: 'scheduled',
        location: formData.location,
      };
      setLiveInterviews(prev => [newIv, ...prev]);
      setShowScheduleModal(false);
    }
  };

  const handleDeleteInterview = async (id: string | number) => {
    if (typeof id === 'string') {
      try {
        await deleteInterviewApi(id);
        showToast('Interview cancelled');
        loadInterviews();
      } catch (err) {
        showToast('Interview removed');
        setLiveInterviews(prev => prev.filter(i => i.id !== id));
      }
    } else {
      showToast('Interview removed');
      setLiveInterviews(prev => prev.filter(i => i.id !== id));
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

interface ChecklistItem {
  id: number | string;
  task: string;
  done: boolean;
}

  // Prep Checklist Handlers
  const toggleCheck = (id: number | string) => {
    setChecklist((c: ChecklistItem[]) => c.map((i: ChecklistItem) => i.id === id ? { ...i, done: !i.done } : i));
  };

  const addCustomChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    const newItem: ChecklistItem = { id: Date.now(), task: newTaskInput.trim(), done: false };
    setChecklist((prev: ChecklistItem[]) => [...prev, newItem]);
    setNewTaskInput('');
    showToast('Custom prep task added!');
  };

  const removeChecklistItem = (id: number | string) => {
    setChecklist((prev: ChecklistItem[]) => prev.filter((i: ChecklistItem) => i.id !== id));
    showToast('Task removed.');
  };

  const doneCount = checklist.filter((c: ChecklistItem) => c.done).length;
  const prepPct = checklist.length > 0 ? Math.round((doneCount / checklist.length) * 100) : 0;

  const modeIcon = (mode: InterviewItem['mode']) => {
    if (mode === 'video') return <Video size={13} className="text-[#6c63ff]" />;
    if (mode === 'phone') return <Phone size={13} className="text-[#f59e0b]" />;
    return <MapPin size={13} className="text-[#00c853]" />;
  };

  // Note taking handler for expanded card
  const handleSaveNote = (id: string | number, text: string) => {
    setCustomNotes(prev => ({ ...prev, [id]: text }));
    showToast('Personal notes saved!');
  };

  const liveUpcoming = liveInterviews.filter(i => i.status === 'scheduled');
  const livePast = liveInterviews.filter(i => i.status === 'completed' || i.status === 'cancelled');

  const allUpcoming = [...liveUpcoming, ...upcomingInterviews];
  const allPast = [...livePast, ...pastInterviews];

  const baseInterviews = tab === 'upcoming' ? allUpcoming : allPast;

  // Filter logic: date, mode, search query
  const interviews = baseInterviews.filter(iv => {
    const matchesDate = selectedDateStr ? iv.date && toLocalDateStr(iv.date) === selectedDateStr : true;
    const matchesMode = modeFilter === 'all' ? true : iv.mode === modeFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || (
      iv.role.toLowerCase().includes(query) ||
      iv.company.toLowerCase().includes(query) ||
      iv.interviewer.toLowerCase().includes(query) ||
      iv.type.toLowerCase().includes(query)
    );
    return matchesDate && matchesMode && matchesSearch;
  });

  const nextInterview = allUpcoming[0];

  // Dynamic Week Days (Mon - Sun)
  const todayStr = toLocalDateStr(new Date());

  const weekDays = Array.from({ length: 7 }).map((_, idx) => {
    const dayDate = new Date(currentWeekStart);
    dayDate.setDate(currentWeekStart.getDate() + idx);
    const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = dayDate.getDate();
    const fullDateStr = toLocalDateStr(dayDate);
    const isToday = fullDateStr === todayStr;

    const matchingInterview = allUpcoming.find(iv => iv.date && toLocalDateStr(iv.date) === fullDateStr);

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

  // Mock Practice Actions
  const handleMockNext = () => {
    if (mockStep < mockInterviewQuestions.length - 1) {
      setMockStep(s => s + 1);
    } else {
      setMockCompleted(true);
    }
  };

  const handleCopyPrepScript = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Prep script copied to clipboard!');
  };

  return (
    <div className="flex flex-col min-h-screen w-full lg:w-[calc(100vw-220px)] lg:ml-[220px] bg-[#f4f6fb] overflow-x-hidden font-sans">
      <Topbar onMenuClick={onMenuClick} onNavigate={onNavigate} />

      {/* Floating Notification Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-[#1a1a2e] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#6c63ff]/30 animate-in fade-in duration-200">
          <Check size={15} className="text-[#00c853]" />
          <span className="text-xs font-medium">{toast}</span>
          <button onClick={() => setToast(null)} className="text-[#8890a4] hover:text-white ml-2 bg-transparent border-none cursor-pointer">
            <X size={12} />
          </button>
        </div>
      )}

      {/* ── SCHEDULE INTERVIEW MODAL ── */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-[#e4e8f0] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#e4e8f0] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#6c63ff]/10 flex items-center justify-center text-[#6c63ff]">
                  <Calendar size={16} />
                </div>
                <h3 className="text-base font-extrabold text-[#1a1a2e]">Schedule New Interview</h3>
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="text-[#8890a4] hover:text-[#1a1a2e] bg-transparent border-none cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="flex flex-col gap-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#4a5068] mb-1 block">Job Role *</label>
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
                  <label className="text-xs font-bold text-[#4a5068] mb-1 block">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Netflix"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#e4e8f0] focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#4a5068] mb-1 block">Interview Round / Type</label>
                  <input
                    type="text"
                    placeholder="e.g. System Design / Technical Round"
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#e4e8f0] focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#4a5068] mb-1 block">Interview Mode</label>
                  <select
                    value={formData.mode}
                    onChange={e => setFormData({ ...formData, mode: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#e4e8f0] focus:outline-none focus:border-[#6c63ff] bg-white"
                  >
                    <option value="video">Video Call (Google Meet / Zoom)</option>
                    <option value="phone">Phone Call</option>
                    <option value="onsite">On-site Office Visit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#4a5068] mb-1 block">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.interviewDate}
                    onChange={e => setFormData({ ...formData, interviewDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#e4e8f0] focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#4a5068] mb-1 block">Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:00 AM – 11:30 AM"
                    value={formData.interviewTime}
                    onChange={e => setFormData({ ...formData, interviewTime: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#e4e8f0] focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#4a5068] mb-1 block">Interviewer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Chen"
                    value={formData.interviewer}
                    onChange={e => setFormData({ ...formData, interviewer: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#e4e8f0] focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#4a5068] mb-1 block">Total Rounds</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={formData.totalRounds}
                    onChange={e => setFormData({ ...formData, totalRounds: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#e4e8f0] focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
              </div>

              {formData.mode === 'video' ? (
                <div>
                  <label className="text-xs font-bold text-[#4a5068] mb-1 block">Meeting Video URL</label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={formData.meetingLink}
                    onChange={e => setFormData({ ...formData, meetingLink: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#e4e8f0] focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-[#4a5068] mb-1 block">Location / Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco HQ, Floor 4 OR +1 555-0192"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#e4e8f0] focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-[#e4e8f0]">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#4a5068] bg-[#f4f6fb] rounded-xl border-none cursor-pointer hover:bg-[#e4e8f0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white rounded-xl border-none cursor-pointer transition-all hover:opacity-95"
                  style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── AI PREP SCRIPT BUILDER MODAL ── */}
      {showPrepScriptModal && scriptTargetItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-[#e4e8f0] max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#e4e8f0] mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: scriptTargetItem.logoBg }}>
                  {scriptTargetItem.companyLogo}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1a1a2e] flex items-center gap-2">
                    AI Prep Script · {scriptTargetItem.role}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6c63ff]/10 text-[#6c63ff] font-bold">
                      {scriptTargetItem.company}
                    </span>
                  </h3>
                  <p className="text-xs text-[#8890a4]">Tailored STAR Framework & High-Impact Responses</p>
                </div>
              </div>
              <button onClick={() => setShowPrepScriptModal(false)} className="text-[#8890a4] hover:text-[#1a1a2e] bg-transparent border-none cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              {/* STAR Framework Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#f8f9ff] to-[#eef2ff] border border-[#6c63ff]/20">
                <h4 className="font-extrabold text-[#1a1a2e] text-sm mb-2 flex items-center gap-2">
                  <Sparkles size={16} className="text-[#6c63ff]" /> 1. Elevate Your STAR Story (Situation, Task, Action, Result)
                </h4>
                <div className="space-y-2 text-[#4a5068] leading-relaxed">
                  <p><strong className="text-[#6c63ff]">Situation:</strong> "At my previous role, our team faced a bottleneck during high-traffic events where page render latency spiked by 40%."</p>
                  <p><strong className="text-[#6c63ff]">Task:</strong> "I was tasked with diagnosing the rendering path and restructuring state management to achieve sub-100ms response times."</p>
                  <p><strong className="text-[#6c63ff]">Action:</strong> "I introduced memoized selectors, lazy-loaded offscreen modules, and optimized payload delivery through cached edge APIs."</p>
                  <p><strong className="text-[#6c63ff]">Result:</strong> "This reduced TTI by 65% and improved overall conversion rate by 14%."</p>
                </div>
              </div>

              {/* Company Specific Insights */}
              <div className="p-4 rounded-2xl bg-white border border-[#e4e8f0]">
                <h4 className="font-extrabold text-[#1a1a2e] text-sm mb-2 flex items-center gap-2">
                  <Building2 size={16} className="text-[#00c853]" /> 2. {scriptTargetItem.company} Focus Areas & Principles
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-[#4a5068] leading-relaxed">
                  <li>Emphasize rapid prototyping and user feedback iteration.</li>
                  <li>Be prepared for technical trade-off discussions (e.g., speed vs maintainability).</li>
                  <li>Show strong cross-functional alignment with Product Managers and Designers.</li>
                </ul>
              </div>

              {/* Top Questions to Ask */}
              <div className="p-4 rounded-2xl bg-white border border-[#e4e8f0]">
                <h4 className="font-extrabold text-[#1a1a2e] text-sm mb-2 flex items-center gap-2">
                  <MessageSquare size={16} className="text-[#f59e0b]" /> 3. Smart Questions to Ask {scriptTargetItem.interviewer}
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-[#4a5068] leading-relaxed">
                  <li>"What does success look like for this position in the first 90 days?"</li>
                  <li>"How does the team prioritize technical debt versus new feature development?"</li>
                  <li>"What are the biggest challenges the team is currently working to solve?"</li>
                </ol>
              </div>
            </div>

            <div className="flex items-center justify-between mt-5 pt-3 border-t border-[#e4e8f0]">
              <button
                onClick={() => handleCopyPrepScript(`STAR Framework Prep Script for ${scriptTargetItem.role} at ${scriptTargetItem.company}:\n\n- Situation & Task: Bottleneck during high traffic.\n- Action: Optimized memoization & edge caching.\n- Result: 65% lower TTI.\n- Key questions to ask: 1. Success in 90 days? 2. Tech debt priority?`)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#6c63ff] bg-[#6c63ff]/10 hover:bg-[#6c63ff]/20 transition-all border-none cursor-pointer"
              >
                <Copy size={14} /> Copy Full Script
              </button>
              <button
                onClick={() => setShowPrepScriptModal(false)}
                className="px-5 py-2 text-xs font-bold text-white rounded-xl border-none cursor-pointer"
                style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}
              >
                Done & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── AI MOCK INTERVIEW PRACTICE SIMULATOR MODAL ── */}
      {showMockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl shadow-2xl border border-[#e4e8f0] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#e4e8f0] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#6c63ff]/10 flex items-center justify-center text-[#6c63ff]">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1a1a2e]">AI Mock Interview Simulator</h3>
                  <p className="text-[11px] text-[#8890a4]">Practice answering real behavioral & technical questions</p>
                </div>
              </div>
              <button onClick={() => setShowMockModal(false)} className="text-[#8890a4] hover:text-[#1a1a2e] bg-transparent border-none cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {!mockCompleted ? (
              <div>
                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs font-bold text-[#4a5068] mb-2">
                  <span>Question {mockStep + 1} of {mockInterviewQuestions.length}</span>
                  <span className="text-[#6c63ff]">{Math.round(((mockStep + 1) / mockInterviewQuestions.length) * 100)}% Complete</span>
                </div>
                <div className="h-1.5 bg-[#f0f2f8] rounded-full mb-5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${((mockStep + 1) / mockInterviewQuestions.length) * 100}%`, background: 'linear-gradient(90deg,#6c63ff,#8b5cf6)' }}
                  />
                </div>

                {/* Current Question */}
                <div className="p-4 rounded-2xl bg-[#f8f9fc] border border-[#e4e8f0] mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6c63ff] bg-[#6c63ff]/10 px-2 py-0.5 rounded-full mb-2 inline-block">
                    Interview Prompt
                  </span>
                  <p className="text-sm font-extrabold text-[#1a1a2e] leading-snug">
                    "{mockInterviewQuestions[mockStep].question}"
                  </p>
                  <p className="text-xs text-[#8890a4] mt-2 italic flex items-center gap-1.5">
                    <Sparkles size={12} className="text-[#f59e0b]" /> {mockInterviewQuestions[mockStep].hint}
                  </p>
                </div>

                {/* User Answer Input / Recording Simulation */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#4a5068]">Your Structured Answer</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMockRecording(!isMockRecording);
                        showToast(isMockRecording ? 'Voice recording paused' : 'Voice recording started...');
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border-none cursor-pointer ${
                        isMockRecording ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-[#6c63ff]/10 text-[#6c63ff]'
                      }`}
                    >
                      <Mic size={12} /> {isMockRecording ? 'Recording Live...' : 'Simulate Voice Input'}
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Type or speak your answer here. Focus on Situation, Task, Action, and Result..."
                    value={mockUserAnswers[mockStep]}
                    onChange={e => {
                      const updated = [...mockUserAnswers];
                      updated[mockStep] = e.target.value;
                      setMockUserAnswers(updated);
                    }}
                    className="w-full p-3 text-xs rounded-xl border border-[#e4e8f0] focus:outline-none focus:border-[#6c63ff] font-sans resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#e4e8f0]">
                  <button
                    disabled={mockStep === 0}
                    onClick={() => setMockStep(s => s - 1)}
                    className="px-4 py-2 text-xs font-bold text-[#4a5068] bg-[#f4f6fb] rounded-xl border-none cursor-pointer disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleMockNext}
                    className="px-5 py-2 text-xs font-bold text-white rounded-xl border-none cursor-pointer transition-all hover:opacity-95"
                    style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}
                  >
                    {mockStep < mockInterviewQuestions.length - 1 ? 'Next Question →' : 'Submit & Analyze'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-[#00c853]/15 text-[#00c853] flex items-center justify-center mx-auto mb-3">
                  <Award size={32} />
                </div>
                <h4 className="text-lg font-black text-[#1a1a2e]">Mock Interview Completed!</h4>
                <p className="text-xs text-[#8890a4] mt-1 mb-4">AI Copilot evaluated your responses and clarity.</p>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-[#f8f9fc] p-3 rounded-xl border border-[#e4e8f0]">
                    <div className="text-xl font-black text-[#6c63ff]">94%</div>
                    <div className="text-[10px] font-bold text-[#8890a4] mt-0.5">Clarity Score</div>
                  </div>
                  <div className="bg-[#f8f9fc] p-3 rounded-xl border border-[#e4e8f0]">
                    <div className="text-xl font-black text-[#00c853]">STAR 100%</div>
                    <div className="text-[10px] font-bold text-[#8890a4] mt-0.5">Structure</div>
                  </div>
                  <div className="bg-[#f8f9fc] p-3 rounded-xl border border-[#e4e8f0]">
                    <div className="text-xl font-black text-[#f59e0b]">Strong</div>
                    <div className="text-[10px] font-bold text-[#8890a4] mt-0.5">Confidence</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#6c63ff]/8 border border-[#6c63ff]/20 text-left text-xs text-[#4a5068] mb-5 space-y-1">
                  <p className="font-bold text-[#6c63ff]">AI Performance Feedback:</p>
                  <p>• Excellent use of quantitative metrics in your STAR examples.</p>
                  <p>• Clear communication of engineering trade-offs and cross-functional teamwork.</p>
                </div>

                <button
                  onClick={() => {
                    setShowMockModal(false);
                    setMockStep(0);
                    setMockCompleted(false);
                    setMockUserAnswers(['', '', '']);
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white border-none cursor-pointer"
                  style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}
                >
                  Done & Close Practice
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── POST-CALL DEBRIEF MODAL ── */}
      {showDebriefModal && lastDebrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-[#e4e8f0] text-center">
            <div className="w-14 h-14 rounded-full bg-[#00c853]/15 text-[#00c853] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={30} />
            </div>
            <h3 className="text-lg font-black text-[#1a1a2e]">Interview Session Ended</h3>
            <p className="text-xs text-[#8890a4] mt-0.5">{lastDebrief.interview.role} at {lastDebrief.interview.company}</p>

            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="bg-[#f8f9fc] p-3 rounded-xl border border-[#e4e8f0]">
                <div className="text-xs text-[#8890a4]">Call Duration</div>
                <div className="text-base font-bold text-[#1a1a2e] mt-1">{lastDebrief.duration}</div>
              </div>
              <div className="bg-[#f8f9fc] p-3 rounded-xl border border-[#e4e8f0]">
                <div className="text-xs text-[#8890a4]">Communication Rating</div>
                <div className="text-base font-bold text-[#00c853] mt-1">{lastDebrief.clarityScore}%</div>
              </div>
            </div>

            <div className="p-3 bg-[#6c63ff]/8 rounded-xl border border-[#6c63ff]/20 text-left text-xs text-[#4a5068] mb-5">
              <span className="font-bold text-[#6c63ff] block mb-1">AI Copilot Key Summary:</span>
              "{lastDebrief.keyTakeaway}"
            </div>

            <button
              onClick={() => setShowDebriefModal(false)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white border-none cursor-pointer"
              style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}
            >
              Close Debrief
            </button>
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
                <p className="text-[11px] text-[#8890a4]">{activeInterviewRoom.company} · Live Video Session</p>
              </div>
            </div>

            {/* Controls right */}
            <div className="flex items-center gap-3">
              {/* Layout Switcher */}
              <div className="hidden sm:flex items-center bg-[#1a1a36] rounded-xl p-1 border border-[#2a2a4a]">
                <button
                  onClick={() => setLayoutMode('speaker')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold border-none cursor-pointer ${layoutMode === 'speaker' ? 'bg-[#6c63ff] text-white' : 'text-[#8890a4]'}`}
                >
                  Speaker
                </button>
                <button
                  onClick={() => setLayoutMode('grid')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold border-none cursor-pointer ${layoutMode === 'grid' ? 'bg-[#6c63ff] text-white' : 'text-[#8890a4]'}`}
                >
                  Grid
                </button>
              </div>

              {/* Live Timer */}
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

          {/* Main Stage & Layout */}
          <div className="flex-1 relative p-4 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 bg-[#0a0a14] overflow-hidden">
            {/* Stage */}
            <div className="relative rounded-2xl bg-[#141424] border border-[#2a2a4a] overflow-hidden flex flex-col items-center justify-center">
              
              {/* Screen Share Mode View */}
              {isScreenSharing ? (
                <div className="w-full h-full relative bg-black flex flex-col items-center justify-center">
                  <video
                    ref={screenVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-xs font-bold flex items-center gap-2 text-white">
                    <Monitor size={14} className="text-[#00c853]" /> You are sharing your screen
                  </div>
                </div>
              ) : (
                /* Simulated Interviewer Stage */
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
                    <Sparkles size={13} /> AI Copilot & Speech Transcription Active
                  </div>
                </div>
              )}

              {/* Candidate Self View (Picture-in-Picture) */}
              <div className="absolute bottom-6 right-6 w-52 sm:w-64 aspect-video bg-[#0a0a14] rounded-2xl border-2 border-[#6c63ff]/50 shadow-2xl overflow-hidden transition-all hover:scale-105 z-20">
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
                    <VideoOff size={26} className="text-[#ff4d6d] mb-1" />
                    <span className="text-[11px] font-medium text-white/70">Camera Off</span>
                  </div>
                )}

                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isMicOn ? 'bg-[#00c853]' : 'bg-[#ff4d6d]'}`} />
                  You (Candidate)
                </div>
              </div>

              {/* Media Error Alert */}
              {mediaError && (
                <div className="absolute top-6 left-6 right-6 z-30 bg-red-950/90 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-xs flex items-center gap-2 shadow-xl backdrop-blur-md">
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                  <span>{mediaError}</span>
                </div>
              )}
            </div>

            {/* Sidebar Live Transcript & AI Copilot Notes */}
            <div className="hidden lg:flex flex-col bg-[#141424] border border-[#2a2a4a] rounded-2xl p-4 overflow-hidden">
              <div className="flex items-center gap-2 pb-3 border-b border-[#2a2a4a] mb-3">
                <Sparkles size={15} className="text-[#6c63ff]" />
                <h3 className="text-xs font-bold text-white tracking-wide uppercase">AI Interview Copilot</h3>
              </div>

              {/* Audio visualizer */}
              <div className="p-3 rounded-xl bg-[#1d1d36] border border-[#2a2a4a] mb-3">
                <div className="flex items-center justify-between text-[11px] text-[#8890a4] mb-1">
                  <span>Mic Gain Equalizer</span>
                  <span className={isMicOn ? 'text-[#00c853]' : 'text-red-400'}>{isMicOn ? 'Active' : 'Muted'}</span>
                </div>
                <div className="flex items-center gap-1 h-5">
                  {Array.from({ length: 14 }).map((_, i) => (
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

              {/* Live Transcript Box */}
              <div className="flex-1 flex flex-col min-h-0 bg-[#0d0d1a] rounded-xl border border-[#2a2a4a] p-3 overflow-y-auto space-y-2.5">
                <p className="text-[10px] font-bold text-[#8890a4] uppercase tracking-wider mb-1">Real-Time Transcription</p>
                {aiTranscript.map((t, idx) => (
                  <div key={idx} className="text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-[11px] ${t.sender.includes('Copilot') ? 'text-[#a78bfa]' : t.sender.includes('You') ? 'text-[#00c853]' : 'text-white'}`}>
                        {t.sender}
                      </span>
                      <span className="text-[9px] text-[#6c7280]">{t.time}</span>
                    </div>
                    <p className="text-[#b0b8cc] text-[11px] leading-relaxed">{t.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Call Toolbar */}
          <div className="h-20 bg-[#16162a] border-t border-[#2a2a4a] px-6 flex items-center justify-center gap-4">
            {/* Mic Toggle */}
            <button
              onClick={toggleMic}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border-none cursor-pointer ${
                isMicOn
                  ? 'bg-[#2a2a4a] text-white hover:bg-[#383860]'
                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
              }`}
              title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
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

            {/* Screen Share Toggle */}
            <button
              onClick={toggleScreenShare}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border-none cursor-pointer ${
                isScreenSharing
                  ? 'bg-[#00c853] text-white'
                  : 'bg-[#2a2a4a] text-white hover:bg-[#383860]'
              }`}
              title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
            >
              <Monitor size={20} />
            </button>

            {/* End Call */}
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

      {/* ── MAIN INTERVIEW PAGE CONTENT ── */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Page Header */}
        <div className="flex items-start justify-between mb-7 flex-wrap gap-4">
          <div>
            <h1 className="text-[26px] sm:text-[32px] font-black text-[#1a1a2e] tracking-tight">Interviews & AI Copilot</h1>
            <p className="text-sm text-[#8890a4] mt-1">
              You have <span className="font-bold text-[#6c63ff]">{allUpcoming.length} upcoming</span> interviews scheduled.
            </p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => showToast('Interview calendar reminder synchronized!')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold text-[#4a5068] bg-white border border-[#e4e8f0] hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all cursor-pointer shadow-sm"
            >
              <Bell size={14} /> Set Reminder
            </button>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95 shadow-md"
              style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}
            >
              <Calendar size={14} /> + Schedule Interview
            </button>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
          {[
            { label: 'Upcoming',  value: upcomingInterviews.length + liveUpcoming.length, icon: <Calendar size={16} className="text-[#6c63ff]" />, color: '#6c63ff', bg: '#6c63ff12' },
            { label: 'Completed', value: pastInterviews.length + livePast.length,         icon: <CheckCircle2 size={16} className="text-[#00c853]" />, color: '#00c853', bg: '#00c85312' },
            { label: 'Pass Rate', value: '100%',                    icon: <TrendingUp size={16} className="text-[#f59e0b]" />,   color: '#f59e0b', bg: '#f59e0b12' },
            { label: 'Avg Score', value: '92%',                     icon: <Star size={16} className="text-[#8b5cf6]" />,          color: '#8b5cf6', bg: '#8b5cf612' },
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

        {/* ── Search & Filter Toolbar ── */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-[#e4e8f0]/60 flex items-center justify-between flex-wrap gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8890a4]" />
            <input
              type="text"
              placeholder="Search role, company, or interviewer..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-[#e4e8f0] focus:outline-none focus:border-[#6c63ff] bg-[#f8f9fc]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8890a4] hover:text-[#1a1a2e] bg-transparent border-none cursor-pointer">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Mode Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#8890a4] hidden sm:inline flex items-center gap-1">
              <SlidersHorizontal size={13} /> Mode:
            </span>
            <select
              value={modeFilter}
              onChange={e => setModeFilter(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-xl border border-[#e4e8f0] bg-[#f8f9fc] text-[#4a5068] font-bold focus:outline-none focus:border-[#6c63ff]"
            >
              <option value="all">All Modes</option>
              <option value="video">Video Call</option>
              <option value="phone">Phone Call</option>
              <option value="onsite">On-site</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">

          {/* ── Left Column ── */}
          <div className="flex flex-col gap-5">

            {/* Dynamic Mini Calendar Strip */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-extrabold text-[#1a1a2e]">{formatMonthYear()}</h3>
                <div className="flex gap-1">
                  <button onClick={prevWeek} className="w-7 h-7 rounded-lg bg-[#f4f6fb] flex items-center justify-center border-none cursor-pointer hover:bg-[#6c63ff]/10 text-[#4a5068]" title="Previous Week">
                    <ChevronLeft size={14} />
                  </button>
                  <button onClick={nextWeek} className="w-7 h-7 rounded-lg bg-[#f4f6fb] flex items-center justify-center border-none cursor-pointer hover:bg-[#6c63ff]/10 text-[#4a5068]" title="Next Week">
                    <ChevronRight size={14} />
                  </button>
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

              {/* Active Date Filter Banner */}
              {selectedDateStr && (
                <div className="flex items-center justify-between px-5 py-3.5 bg-[#6c63ff]/8 border-b border-[#6c63ff]/20">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#6c63ff]">
                    <Calendar size={14} />
                    <span>Filter: {new Date(selectedDateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} ({interviews.length} interview(s))</span>
                  </div>
                  <button onClick={() => setSelectedDateStr(null)} className="text-[11px] font-bold text-[#6c63ff] hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1">
                    Clear Filter <X size={12} />
                  </button>
                </div>
              )}

              {/* Interview Cards List */}
              <div className="divide-y divide-[#f0f2f8]">
                {interviews.length === 0 ? (
                  <div className="p-8 text-center bg-[#f8f9fc]">
                    <Calendar size={32} className="mx-auto text-[#b0b8cc] mb-2" />
                    <p className="text-[14px] font-bold text-[#4a5068]">No Interviews Found</p>
                    <p className="text-[11px] text-[#8890a4] mt-1 mb-3">No matching interviews for your current search or date filter.</p>
                    <button
                      onClick={() => { setSelectedDateStr(null); setSearchQuery(''); setModeFilter('all'); }}
                      className="px-4 py-2 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer"
                      style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : interviews.map(iv => {
                  const isExpanded = expandedId === iv.id;
                  return (
                    <div key={iv.id} className="p-5 hover:bg-[#fcfdff] transition-all">
                      {/* Card Main Info */}
                      <div className="flex items-start gap-4">
                        {/* Logo */}
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[13px] font-black text-white flex-shrink-0 shadow-sm" style={{ background: iv.logoBg }}>
                          {iv.companyLogo}
                        </div>

                        {/* Details */}
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

                            {/* Round & Result Badge */}
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

                          {/* Date / Time / Mode */}
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

                          {/* Past Feedback */}
                          {tab === 'past' && iv.feedback && (
                            <div className="mt-3 px-3 py-2.5 bg-[#f8f9fc] rounded-xl border border-[#e4e8f0] text-[11px] text-[#4a5068] italic">
                              "{iv.feedback}"
                              {iv.score && (
                                <span className="not-italic font-bold text-[#6c63ff] ml-2">— Score: {iv.score}/100</span>
                              )}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 mt-4 flex-wrap">
                            {tab === 'upcoming' && iv.mode === 'video' && (
                              <button
                                onClick={() => startVideoCall(iv)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95 shadow-sm"
                                style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}
                              >
                                <Play size={12} /> Join Interview
                              </button>
                            )}

                            <button
                              onClick={() => setExpandedId(isExpanded ? null : iv.id)}
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold border-none cursor-pointer transition-all ${
                                isExpanded ? 'bg-[#6c63ff] text-white' : 'bg-[#f4f6fb] text-[#4a5068] hover:text-[#6c63ff]'
                              }`}
                            >
                              <BookOpen size={12} /> {isExpanded ? 'Hide Prep' : 'Prep Guide'}
                            </button>

                            <button
                              onClick={() => {
                                setScriptTargetItem(iv);
                                setShowPrepScriptModal(true);
                              }}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold text-[#6c63ff] bg-[#6c63ff]/10 hover:bg-[#6c63ff]/20 transition-all border-none cursor-pointer"
                            >
                              <Sparkles size={12} /> AI Script
                            </button>

                            <button
                              onClick={() => handleDeleteInterview(iv.id)}
                              title="Cancel Interview"
                              className="w-8 h-8 rounded-xl bg-[#f4f6fb] flex items-center justify-center border-none cursor-pointer hover:bg-red-50 hover:text-red-500 transition-colors text-[#8890a4] ml-auto"
                            >
                              <X size={15} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* ── EXPANDED PREP GUIDE DRAWER ── */}
                      {isExpanded && (
                        <div className="mt-4 ml-0 sm:ml-16 p-4 rounded-2xl bg-[#f8f9ff] border border-[#6c63ff]/20 animate-in fade-in duration-200">
                          <h4 className="text-xs font-bold text-[#1a1a2e] mb-2 flex items-center gap-1.5">
                            <Sparkles size={13} className="text-[#6c63ff]" /> Tailored Round Prep Guide
                          </h4>
                          <p className="text-[11px] text-[#4a5068] mb-3 leading-relaxed">
                            Focus points for <strong>{iv.type}</strong> at <strong>{iv.company}</strong>:
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <div className="p-3 bg-white rounded-xl border border-[#e4e8f0] text-xs">
                              <span className="font-bold text-[#6c63ff] block mb-1">Key Focus Topics:</span>
                              <ul className="list-disc list-inside text-[11px] text-[#4a5068] space-y-1">
                                <li>System scalability & state management</li>
                                <li>Cross-functional engineering communication</li>
                                <li>Live problem-solving trade-offs</li>
                              </ul>
                            </div>

                            {/* Candidate Personal Notes Box */}
                            <div className="p-3 bg-white rounded-xl border border-[#e4e8f0] text-xs">
                              <span className="font-bold text-[#1a1a2e] block mb-1">My Personal Interview Notes:</span>
                              <textarea
                                rows={2}
                                placeholder="Add custom notes or questions for this interviewer..."
                                value={customNotes[iv.id] || ''}
                                onChange={e => setCustomNotes({ ...customNotes, [iv.id]: e.target.value })}
                                className="w-full p-2 text-[11px] rounded-lg border border-[#e4e8f0] focus:outline-none focus:border-[#6c63ff] font-sans resize-none"
                              />
                              <button
                                onClick={() => handleSaveNote(iv.id, customNotes[iv.id] || '')}
                                className="mt-1 px-3 py-1 bg-[#6c63ff] text-white rounded-lg text-[10px] font-bold border-none cursor-pointer hover:bg-[#5b52e0]"
                              >
                                Save Notes
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Round progress bar */}
                      <div className="flex items-center gap-1.5 mt-4 ml-0 sm:ml-16">
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
                        <span className="text-[10px] text-[#b0b8cc] ml-1">{iv.roundNum}/{iv.totalRounds} rounds completed</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="flex flex-col gap-5">

            {/* Next Interview Countdown Card */}
            <div
              className="rounded-2xl p-5 relative overflow-hidden shadow-lg"
              style={{ background: 'linear-gradient(145deg,#1a1a2e,#16213e)' }}
            >
              <div className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-20 blur-2xl" style={{ background: '#6c63ff' }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#a78bfa] tracking-widest mb-3 uppercase">
                  <Zap size={11} /> UPCOMING SESSION
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black text-white" style={{ background: nextInterview?.logoBg || 'linear-gradient(135deg,#e50914,#831010)' }}>
                    {nextInterview?.companyLogo || 'TC'}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-white">{nextInterview?.role || 'Senior Product Designer'}</p>
                    <p className="text-[11px] text-[#b0b8cc]">{nextInterview?.company || 'Netflix'} · {nextInterview?.type || 'Technical Round'}</p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 mb-4 border border-white/10">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] text-[#b0b8cc] flex items-center gap-1"><Calendar size={10} /> {nextInterview?.date || 'Oct 24'}, {nextInterview?.day || 'Wednesday'}</span>
                    <span className="text-[10px] font-bold text-[#00c853] bg-[#00c853]/20 px-2 py-0.5 rounded-full">Confirmed</span>
                  </div>
                  <div className="text-[13px] text-white flex items-center gap-1.5 font-semibold">
                    <Clock size={12} className="text-[#b0b8cc]" /> {nextInterview?.time || '10:00 AM – 11:30 AM'}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[['02', 'Hrs'], ['45', 'Min'], ['30', 'Sec']].map(([v, l]) => (
                    <div key={l} className="bg-white/10 rounded-xl py-2 text-center">
                      <div className="text-[20px] font-black text-white leading-none">{v}</div>
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
                  <ExternalLink size={14} /> Join Call Room
                </button>
              </div>
            </div>

            {/* Interactive Prep Checklist */}
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

              <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
                {checklist.map((item: ChecklistItem) => (
                  <div key={item.id} className="flex items-center justify-between group">
                    <button
                      onClick={() => toggleCheck(item.id)}
                      className="flex items-start gap-2.5 text-left bg-transparent border-none cursor-pointer p-0 flex-1 min-w-0"
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${item.done ? 'bg-[#00c853]' : 'border-2 border-[#d1d5db] group-hover:border-[#6c63ff]'}`}>
                        {item.done && <Check size={10} strokeWidth={3} className="text-white" />}
                      </div>
                      <span className={`text-[11px] leading-relaxed transition-colors truncate ${item.done ? 'text-[#b0b8cc] line-through' : 'text-[#4a5068] group-hover:text-[#1a1a2e]'}`}>
                        {item.task}
                      </span>
                    </button>
                    <button
                      onClick={() => removeChecklistItem(item.id)}
                      className="text-[#b0b8cc] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer p-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Custom Task Form */}
              <form onSubmit={addCustomChecklistItem} className="mt-3.5 pt-3 border-t border-[#f0f2f8] flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add custom task..."
                  value={newTaskInput}
                  onChange={e => setNewTaskInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#e4e8f0] focus:outline-none focus:border-[#6c63ff] bg-[#f8f9fc]"
                />
                <button
                  type="submit"
                  className="w-8 h-8 rounded-xl bg-[#6c63ff] text-white flex items-center justify-center border-none cursor-pointer hover:bg-[#5b52e0] transition-colors"
                >
                  <Plus size={14} />
                </button>
              </form>
            </div>

            {/* AI Interview Tips */}
            <div className="bg-gradient-to-br from-[#f0efff] to-[#e8f4ff] rounded-2xl p-5 border border-[#6c63ff]/15">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-[#6c63ff]/15 flex items-center justify-center">
                  <Sparkles size={13} className="text-[#6c63ff]" />
                </div>
                <h3 className="text-[14px] font-extrabold text-[#1a1a2e]">AI Copilot Tips</h3>
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
                onClick={() => {
                  if (allUpcoming[0]) {
                    setScriptTargetItem(allUpcoming[0]);
                    setShowPrepScriptModal(true);
                  } else {
                    showToast('No upcoming interview selected.');
                  }
                }}
                className="w-full mt-4 py-2.5 rounded-xl text-[12px] font-bold text-[#6c63ff] bg-white border border-[#6c63ff]/30 cursor-pointer hover:bg-[#6c63ff] hover:text-white transition-all shadow-sm"
              >
                Generate Full Prep Script →
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60">
              <h3 className="text-[13px] font-extrabold text-[#1a1a2e] mb-3">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                {[
                  { icon: <Mic size={13} className="text-[#6c63ff]" />, label: 'Practice with AI Mock Interview', action: () => setShowMockModal(true) },
                  { icon: <BookOpen size={13} className="text-[#f59e0b]" />, label: 'Review Common Questions', action: () => showToast('Opening common question bank...') },
                  { icon: <User size={13} className="text-[#00c853]" />, label: 'Research Your Interviewer', action: () => showToast('Opening LinkedIn research integration...') },
                  { icon: <AlertCircle size={13} className="text-[#ff4d6d]" />, label: 'Request Reschedule', action: () => showToast('Reschedule request sent to recruiter.') },
                ].map((a, i) => (
                  <button
                    key={i}
                    onClick={a.action}
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
  );
};

export default Interview;
