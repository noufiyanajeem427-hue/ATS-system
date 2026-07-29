import React, { useState, useEffect } from 'react';
import { CalendarClock, Video, Phone, MapPin, X, Check, PlusCircle, XCircle, Trash2 } from 'lucide-react';
import HRTopbar from '../../components/HRTopbar';
import { Page } from '../../App';
import {
  getInterviews, addInterview, updateInterviewStatus, deleteInterview,
  getApplicants, InterviewStatus
} from '../../data/hrData';

interface HRInterviewsProps {
  prefill?: { applicantId?: number; applicantName?: string; jobTitle?: string } | null;
  onMenuClick?: () => void;
  onNavigate?: (p: Page, payload?: any) => void;
}

const statusStyle: Record<InterviewStatus, string> = {
  Scheduled: 'bg-[#0ea5e9]/10 text-[#0ea5e9]',
  Completed: 'bg-[#00c853]/10 text-[#00c853]',
  Cancelled: 'bg-[#ff4d6d]/10 text-[#ff4d6d]',
};

const modeIcon: Record<string, React.ReactNode> = {
  'Video Call': <Video size={13} />,
  'Phone Call': <Phone size={13} />,
  'Onsite': <MapPin size={13} />,
};

const HRInterviews: React.FC<HRInterviewsProps> = ({ prefill, onMenuClick, onNavigate }) => {
  const [interviews, setInterviews] = useState(getInterviews());
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const applicants = getApplicants();

  const [applicantId, setApplicantId] = useState<number | ''>('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [interviewer, setInterviewer] = useState('Priya Sharma');
  const [mode, setMode] = useState<'Video Call' | 'Phone Call' | 'Onsite'>('Video Call');

  useEffect(() => {
    if (prefill?.applicantId) {
      setApplicantId(prefill.applicantId);
      setShowModal(true);
    }
  }, [prefill]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const applicant = applicants.find(a => a.id === applicantId);
    if (!applicant || !date || !time) {
      showToast('Please fill in all fields.');
      return;
    }
    addInterview({
      applicantId: applicant.id,
      applicantName: applicant.name,
      jobTitle: applicant.jobTitle,
      date, time, interviewer, mode,
      meetingLink: mode === 'Video Call' ? `https://meet.nexhire.com/rm-${Math.floor(1000 + Math.random() * 9000)}` : '',
    });
    setInterviews(getInterviews());
    setShowModal(false);
    setApplicantId(''); setDate(''); setTime('');
    showToast('Interview scheduled successfully!');
  };

  const handleStatusUpdate = (id: number, status: InterviewStatus) => {
    updateInterviewStatus(id, status);
    setInterviews(getInterviews());
  };

  const handleDelete = (id: number) => {
    deleteInterview(id);
    setInterviews(getInterviews());
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 lg:ml-[220px]">
      <HRTopbar onMenuClick={onMenuClick} onNavigate={onNavigate} />

      {toast && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2.5 bg-[#1a1a2e] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-[#6c63ff]/30 text-xs font-semibold">
          <Check size={14} className="text-[#00c853]" />
          {toast}
        </div>
      )}

      <div className="flex-1 p-4 sm:p-6 lg:p-7 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1a1a2e]">Interviews</h1>
            <p className="text-xs sm:text-sm text-[#8890a4]">Schedule and track candidate interviews.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-[13px] font-bold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95 self-start"
            style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 4px 14px rgba(108,99,255,0.4)' }}
          >
            <PlusCircle size={16} /> Schedule Interview
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {interviews.map((i) => (
            <div key={i.id} className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e4e8f0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[#f4f6fb] flex items-center justify-center text-[#6c63ff] flex-shrink-0">
                  <CalendarClock size={18} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-extrabold text-[#1a1a2e]">{i.applicantName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyle[i.status]}`}>{i.status}</span>
                  </div>
                  <span className="text-xs text-[#8890a4]">{i.jobTitle} · Interviewer: {i.interviewer}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <span className="block text-xs font-bold text-[#1a1a2e]">{i.date} · {i.time}</span>
                  <span className="flex items-center justify-end gap-1 text-[10.5px] text-[#8890a4]">{modeIcon[i.mode]} {i.mode}</span>
                </div>
                {i.status === 'Scheduled' && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleStatusUpdate(i.id, 'Completed')}
                      title="Mark as completed"
                      className="p-1.5 rounded-lg bg-[#00c853]/10 text-[#00c853] border-none cursor-pointer hover:bg-[#00c853]/20"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(i.id, 'Cancelled')}
                      title="Cancel interview"
                      className="p-1.5 rounded-lg bg-[#ff4d6d]/10 text-[#ff4d6d] border-none cursor-pointer hover:bg-[#ff4d6d]/20"
                    >
                      <XCircle size={14} />
                    </button>
                  </div>
                )}
                {i.status !== 'Scheduled' && (
                  <button
                    onClick={() => handleDelete(i.id)}
                    title="Remove from list"
                    className="p-1.5 rounded-lg bg-[#f4f6fb] text-[#8890a4] border-none cursor-pointer hover:bg-[#ff4d6d]/10 hover:text-[#ff4d6d]"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {interviews.length === 0 && (
            <div className="text-center py-16 text-sm text-[#8890a4] bg-white rounded-2xl border border-[#e4e8f0]">No interviews scheduled yet.</div>
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-extrabold text-[#1a1a2e]">Schedule Interview</h3>
              <button onClick={() => setShowModal(false)} className="text-[#8890a4] hover:text-[#1a1a2e] bg-transparent border-none cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSchedule} className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1.5">Candidate</label>
                <select
                  value={applicantId}
                  onChange={e => setApplicantId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f9fc] border border-[#e4e8f0] text-[13px] text-[#1a1a2e] outline-none focus:border-[#6c63ff]"
                  required
                >
                  <option value="">Select a candidate</option>
                  {applicants.map(a => (
                    <option key={a.id} value={a.id}>{a.name} — {a.jobTitle}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1.5">Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f9fc] border border-[#e4e8f0] text-[13px] text-[#1a1a2e] outline-none focus:border-[#6c63ff]" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1.5">Time</label>
                  <input type="time" value={time} onChange={e => setTime(e.target.value)} required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f9fc] border border-[#e4e8f0] text-[13px] text-[#1a1a2e] outline-none focus:border-[#6c63ff]" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1.5">Interviewer</label>
                <input type="text" value={interviewer} onChange={e => setInterviewer(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f9fc] border border-[#e4e8f0] text-[13px] text-[#1a1a2e] outline-none focus:border-[#6c63ff]" />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-2">Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Video Call', 'Phone Call', 'Onsite'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={`py-2 rounded-xl text-[11px] font-bold border cursor-pointer transition-all ${
                        mode === m ? 'bg-[#6c63ff] text-white border-[#6c63ff]' : 'bg-white text-[#4a5068] border-[#e4e8f0]'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-extrabold text-[13.5px] text-white border-none cursor-pointer mt-1"
                style={{ background: 'linear-gradient(135deg, #6c63ff 0%, #a855f7 100%)' }}
              >
                Confirm Schedule
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRInterviews;
