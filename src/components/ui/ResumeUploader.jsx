import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaUpload, FaFilePdf, FaFileWord, FaTimes, FaSpinner, FaRobot } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from '../../api/axiosConfig';

const ResumeUploader = ({ onAnalysisComplete, jobId }) => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    setFile(selectedFile);
    await uploadResume(selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const uploadResume = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('resume', file);
      if (jobId) formData.append('jobId', jobId);

      const response = await axios.post('/applications/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Resume uploaded successfully!');
      await analyzeResume(response.data.fileId);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const analyzeResume = async (fileId) => {
    try {
      setAnalyzing(true);
      const response = await axios.post('/applications/analyze-resume', { fileId, jobId });
      setAnalysis(response.data.data);
      toast.success('AI analysis complete!');
      
      if (onAnalysisComplete) {
        onAnalysisComplete(response.data.data);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setAnalysis(null);
  };

  const getFileIcon = (type) => {
    if (type === 'application/pdf') return FaFilePdf;
    return FaFileWord;
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      {!file && !uploading && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
              : 'border-[var(--border-color)] hover:border-indigo-400 hover:bg-[var(--bg-hover)]'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <FaUpload className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--text-primary)]">
                {isDragActive ? 'Drop your resume here' : 'Upload Resume'}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-2">
                Supports PDF, DOC, DOCX (Max 5MB)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Uploading */}
      {uploading && (
        <div className="card p-6 text-center">
          <FaSpinner className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-[var(--text-primary)] font-medium">Uploading your resume...</p>
          <p className="text-sm text-[var(--text-secondary)]">Please wait while we process your file</p>
        </div>
      )}

      {/* File Preview */}
      {file && !uploading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                {React.createElement(getFileIcon(file.type), {
                  className: 'w-6 h-6 text-indigo-600 dark:text-indigo-400'
                })}
              </div>
              <div>
                <p className="font-medium text-[var(--text-primary)]">{file.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Analysis Results */}
      {analyzing && (
        <div className="card p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <FaSpinner className="w-6 h-6 text-indigo-600 animate-spin" />
            <FaRobot className="w-6 h-6 text-indigo-600" />
          </div>
          <p className="text-[var(--text-primary)] font-medium">AI is analyzing your resume...</p>
          <p className="text-sm text-[var(--text-secondary)]">Extracting skills, experience, and education</p>
        </div>
      )}

      {/* AI Analysis Results */}
      {analysis && !analyzing && (
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
              <h4 className="font-semibold text-[var(--text-primary)]">AI Analysis Results</h4>
              <p className="text-xs text-[var(--text-secondary)]">Extracted from your resume</p>
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
              <div className="w-full h-2 bg-[var(--bg-hover)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                  style={{ width: `${analysis.matchScore}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Skills */}
            {analysis.skillsMatch && analysis.skillsMatch.length > 0 && (
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)] mb-2">✅ Matching Skills</p>
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
                <p className="text-sm font-medium text-[var(--text-primary)] mb-2">❌ Missing Skills</p>
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
            <div className="mt-3">
              <p className="text-sm font-medium text-[var(--text-primary)]">💼 Experience</p>
              <p className="text-sm text-[var(--text-secondary)]">{analysis.experience}</p>
            </div>
          )}

          {/* Education */}
          {analysis.education && (
            <div className="mt-3">
              <p className="text-sm font-medium text-[var(--text-primary)]">🎓 Education</p>
              <p className="text-sm text-[var(--text-secondary)]">{analysis.education}</p>
            </div>
          )}

          {/* Summary */}
          {analysis.summary && (
            <div className="mt-3 p-3 bg-[var(--bg-hover)] rounded-lg">
              <p className="text-sm font-medium text-[var(--text-primary)]">📝 Summary</p>
              <p className="text-sm text-[var(--text-secondary)]">{analysis.summary}</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ResumeUploader;
