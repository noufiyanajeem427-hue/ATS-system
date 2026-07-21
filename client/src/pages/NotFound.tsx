import React from 'react';
import { Home } from 'lucide-react';

interface NotFoundProps { pageName?: string; onBack: () => void; }

const NotFound: React.FC<NotFoundProps> = ({ pageName, onBack }) => (
  <div className="flex flex-col min-h-screen w-[calc(100vw-220px)] ml-[220px] bg-[#f4f6fb] items-center justify-center overflow-hidden relative">
    {/* Glow */}
    <div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}/>

    {/* Floating dots */}
    {[
      'w-3.5 h-3.5 bg-[#6c63ff] top-[15%] left-[15%] animate-bounce',
      'w-2.5 h-2.5 bg-[#a78bfa] top-[20%] right-[18%] animate-bounce [animation-delay:1.5s]',
      'w-4 h-4 bg-[#6c63ff]/30 bottom-[20%] left-[20%] animate-bounce [animation-delay:3s]',
      'w-2 h-2 bg-[#00c853] bottom-[25%] right-[22%] animate-bounce [animation-delay:4.5s]',
    ].map((cls, i) => <div key={i} className={`absolute rounded-full ${cls}`}/>)}

    <div className="flex flex-col items-center text-center relative z-10 px-6">
      {/* 404 */}
      <div className="flex items-center gap-2 mb-8">
        <span className="text-[120px] font-black leading-none text-gradient" style={{ background: 'linear-gradient(135deg,#1a1a2e 0%,#6c63ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>4</span>
        <div className="w-24 h-24 rounded-full flex items-center justify-center spinner" style={{ border: '4px solid transparent', background: 'linear-gradient(white,white) padding-box, linear-gradient(135deg,#6c63ff,#a78bfa) border-box', boxShadow: '0 0 40px rgba(108,99,255,0.2)' }}>
          <div className="counter-spinner flex items-center justify-center">
            <svg viewBox="0 0 60 60" fill="none" width="44" height="44">
              <circle cx="30" cy="30" r="28" stroke="#6c63ff" strokeWidth="2" strokeDasharray="6 4"/>
              <circle cx="30" cy="30" r="14" fill="rgba(108,99,255,0.15)" stroke="#6c63ff" strokeWidth="1.5"/>
              <circle cx="30" cy="30" r="5" fill="#6c63ff"/>
            </svg>
          </div>
        </div>
        <span className="text-[120px] font-black leading-none" style={{ background: 'linear-gradient(135deg,#1a1a2e 0%,#6c63ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>4</span>
      </div>

      <h1 className="text-[36px] font-extrabold text-[#1a1a2e] mb-3 tracking-tight">Page Not Found</h1>
      <p className="text-[16px] text-[#4a5068] mb-2 leading-relaxed">
        {pageName ? <>The <strong className="text-[#6c63ff]">"{pageName}"</strong> page is coming soon.</> : <>Oops! This page doesn't exist yet.</>}
      </p>
      <p className="text-[14px] text-[#b0b8cc] mb-9">This section is under construction. Head back to a working page.</p>

      <button onClick={onBack} className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-[14px] font-semibold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5"
        style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 6px 20px rgba(108,99,255,0.35)' }}>
        <Home size={16}/> Go to Dashboard
      </button>
    </div>
  </div>
);

export default NotFound;
