import React, { useState } from 'react';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import HRTopbar from '../../components/HRTopbar';
import { Page } from '../../App';
import { addJob, updateJob, HRJob, JobStatus } from '../../data/hrData';

interface JobFormProps {
  job?: HRJob | null;
  onMenuClick?: () => void;
  onNavigate?: (p: Page, payload?: any) => void;
}

const JobForm: React.FC<JobFormProps> = ({ job, onMenuClick, onNavigate }) => {
  const isEdit = Boolean(job);
  const [title, setTitle] = useState(job?.title || '');
  const [department, setDepartment] = useState(job?.department || 'Engineering');
  const [location, setLocation] = useState(job?.location || '');
  const [type, setType] = useState(job?.type || 'Full-time');
  const [status, setStatus] = useState<JobStatus>(job?.status || 'Active');
  const [salary, setSalary] = useState(job?.salary || '');
  const [experience, setExperience] = useState(job?.experience || '');
  const [description, setDescription] = useState(job?.description || '');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) {
      showToast('Please fill in the job title and location.');
      return;
    }
    const data = { title, department, location, type, status, salary, experience, description };
    if (isEdit && job) {
      updateJob(job.id, data);
      showToast('Job updated successfully!');
    } else {
      addJob(data);
      showToast('Job posted successfully!');
    }
    setTimeout(() => onNavigate?.('hr-jobs'), 700);
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
        <button
          onClick={() => onNavigate?.('hr-jobs')}
          className="flex items-center gap-1.5 text-xs font-bold text-[#8890a4] hover:text-[#6c63ff] bg-transparent border-none cursor-pointer mb-4"
        >
          <ArrowLeft size={14} /> Back to Job Postings
        </button>

        <div className="max-w-3xl">
          <h1 className="text-xl sm:text-2xl font-black text-[#1a1a2e] mb-1">{isEdit ? 'Edit Job Posting' : 'Post a New Job'}</h1>
          <p className="text-xs sm:text-sm text-[#8890a4] mb-6">
            {isEdit ? 'Update the role details below.' : "Fill in the role details and NexHire's AI will start matching candidates instantly."}
          </p>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#e4e8f0] shadow-sm p-5 sm:p-7 flex flex-col gap-5">
            <div>
              <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1.5">Job Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full px-4 py-3 rounded-xl bg-[#f8f9fc] border border-[#e4e8f0] text-[13.5px] text-[#1a1a2e] outline-none focus:border-[#6c63ff] transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1.5">Department</label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#f8f9fc] border border-[#e4e8f0] text-[13.5px] text-[#1a1a2e] outline-none focus:border-[#6c63ff] transition-all"
                >
                  {['Engineering', 'Design', 'Product', 'People Ops', 'Marketing', 'Sales', 'Finance'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1.5">Employment Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#f8f9fc] border border-[#e4e8f0] text-[13.5px] text-[#1a1a2e] outline-none focus:border-[#6c63ff] transition-all"
                >
                  {['Full-time', 'Part-time', 'Contract', 'Internship'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1.5">Location *</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA (Remote)"
                className="w-full px-4 py-3 rounded-xl bg-[#f8f9fc] border border-[#e4e8f0] text-[13.5px] text-[#1a1a2e] outline-none focus:border-[#6c63ff] transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1.5">Salary Range</label>
                <input
                  type="text"
                  value={salary}
                  onChange={e => setSalary(e.target.value)}
                  placeholder="e.g. $140k - $190k"
                  className="w-full px-4 py-3 rounded-xl bg-[#f8f9fc] border border-[#e4e8f0] text-[13.5px] text-[#1a1a2e] outline-none focus:border-[#6c63ff] transition-all"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1.5">Experience Required</label>
                <input
                  type="text"
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  placeholder="e.g. 3+ years"
                  className="w-full px-4 py-3 rounded-xl bg-[#f8f9fc] border border-[#e4e8f0] text-[13.5px] text-[#1a1a2e] outline-none focus:border-[#6c63ff] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1.5">Job Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={5}
                placeholder="Describe the role, responsibilities, and what makes it exciting..."
                className="w-full px-4 py-3 rounded-xl bg-[#f8f9fc] border border-[#e4e8f0] text-[13.5px] text-[#1a1a2e] outline-none focus:border-[#6c63ff] transition-all resize-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-2">Posting Status</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Active', 'Draft', 'Closed'] as JobStatus[]).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`py-2.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                      status === s ? 'bg-[#6c63ff] text-white border-[#6c63ff]' : 'bg-white text-[#4a5068] border-[#e4e8f0]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#6c63ff]/5 border border-[#6c63ff]/20 rounded-xl px-4 py-3">
              <Sparkles size={15} className="text-[#8b5cf6] flex-shrink-0" />
              <p className="text-[11.5px] text-[#4a5068]">NexHire's AI will automatically rank and match incoming applicants against this description.</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl font-extrabold text-[13.5px] text-white border-none cursor-pointer transition-all hover:opacity-90 active:scale-98"
                style={{ background: 'linear-gradient(135deg, #6c63ff 0%, #a855f7 100%)', boxShadow: '0 4px 20px rgba(108, 99, 255, 0.35)' }}
              >
                {isEdit ? 'Save Changes' : 'Publish Job'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.('hr-jobs')}
                className="px-6 py-3.5 rounded-xl font-bold text-[13.5px] text-[#4a5068] bg-[#f4f6fb] border border-[#e4e8f0] cursor-pointer hover:bg-[#e8edf5] transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobForm;
