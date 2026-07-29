import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaBriefcase, FaCalendarAlt, FaSpinner, FaFilePdf,
  FaRobot, FaCheckCircle, FaTimesCircle, FaStar,
  FaDownload, FaEye, FaShare
} from 'react-icons/fa';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import axios from '../../../api/axiosConfig';
import ResumeUploader from '../../../components/ui/ResumeUploader';

const ApplicantDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [applicant, setApplicant] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    fetchApplicantDetails();
  }, [id]);

  const fetchApplicantDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/applications/${id}`);
      setApplicant(response.data.data);
      if (response.data.data.aiAnalysis) {
        setAnalysis(response.data.data.aiAnalysis);
      }
    } catch (error) {
      console.error('Error fetching applicant:', error);
      toast.error('Failed to load applicant details');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalysisComplete = (analysisData) => {
    setAnalysis(analysisData);
    toast.success('Resume analysis complete!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Applicant not found</h3>
        <Link to="/applicants" className="text-indigo-600 hover:text-indigo-700 mt-2 inline-block">
          <FaArrowLeft className="inline mr-2" />
          Back to Applicants
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/applicants"
        className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-indigo-600 transition-all"
      >
        <FaArrowLeft className="w-4 h-4" />
        Back to Applicants
      </Link>

      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xl flex-shrink-0">
              {applicant.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">{applicant.name || 'Unknown'}</h2>
              <p className="text-[var(--text-secondary)]">{applicant.position || 'No position'}</p>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                  <FaEnvelope className="w-3 h-3" />
                  {applicant.email || 'N/A'}
                </span>
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                  <FaMapMarkerAlt className="w-3 h-3" />
                  {applicant.location || 'N/A'}
                </span>
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                  <FaCalendarAlt className="w-3 h-3" />
                  Applied {format(new Date(applicant.appliedDate), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--bg-hover)] transition-all flex items-center gap-2">
              <FaDownload className="w-4 h-4" />
              Download Resume
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
              <FaShare className="w-4 h-4" />
              Share Profile
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Resume Upload */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <FaFilePdf className="text-indigo-500" />
              Resume Upload
            </h3>
            <ResumeUploader 
              onAnalysisComplete={handleAnalysisComplete}
              jobId={applicant.jobId}
            />
          </div>

          {/* Quick Stats */}
          <div className="card p-6 mt-6">
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Experience</span>
                <span className="text-sm font-medium text-[var(--text-primary)]">{applicant.experience || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Status</span>
                <span className="text-sm font-medium text-[var(--text-primary)]">{applicant.status || 'Applied'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Match Score</span>
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {applicant.matchScore || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - AI Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Analysis Section */}
          {analysis ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <FaRobot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">AI Analysis Results</h3>
                  <p className="text-xs text-[var(--text-secondary)]">AI-powered resume analysis</p>
                </div>
              </div>

              {/* Match Score */}
              {analysis.matchScore !== undefined && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[var(--text-primary)]">Match Score</span>
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      {analysis.matchScore}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[var(--bg-hover)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                      style={{ width: `${analysis.matchScore}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Skills Match */}
                {analysis.skillsMatch && analysis.skillsMatch.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-1">
                      <FaCheckCircle className="w-4 h-4" />
                      Matching Skills
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.skillsMatch.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {analysis.missingSkills && analysis.missingSkills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2 flex items-center gap-1">
                      <FaTimesCircle className="w-4 h-4" />
                      Missing Skills
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.missingSkills.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Experience */}
              {analysis.experience && (
                <div className="mt-3 p-3 bg-[var(--bg-hover)] rounded-lg">
                  <p className="text-sm font-medium text-[var(--text-primary)]">💼 Experience</p>
                  <p className="text-sm text-[var(--text-secondary)]">{analysis.experience}</p>
                </div>
              )}

              {/* Education */}
              {analysis.education && (
                <div className="mt-3 p-3 bg-[var(--bg-hover)] rounded-lg">
                  <p className="text-sm font-medium text-[var(--text-primary)]">🎓 Education</p>
                  <p className="text-sm text-[var(--text-secondary)]">{analysis.education}</p>
                </div>
              )}

              {/* Summary */}
              {analysis.summary && (
                <div className="mt-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <p className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
                    <FaStar className="text-yellow-500" />
                    AI Summary
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{analysis.summary}</p>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="card p-6 text-center">
              <div className="w-20 h-20 bg-[var(--bg-hover)] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaRobot className="w-10 h-10 text-[var(--text-muted)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">No AI Analysis Yet</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Upload a resume to get AI-powered insights
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-2">
                The AI will analyze skills, experience, and education
              </p>
            </div>
          )}

          {/* Applicant Notes */}
          <div className="card p-6">
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">📝 Notes</h3>
            <div className="space-y-3">
              {(applicant.notes || []).length > 0 ? (
                applicant.notes.map((note, index) => (
                  <div key={index} className="p-3 bg-[var(--bg-hover)] rounded-lg">
                    <p className="text-sm text-[var(--text-secondary)]">{note.content}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {format(new Date(note.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--text-secondary)]">No notes yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetails;
