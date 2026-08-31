import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, User, ShieldCheck, KeyRound, ArrowRight, RefreshCw, ArrowLeft, Briefcase } from 'lucide-react';

export default function Auth({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [step, setStep] = useState('credentials');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Developer',
    customRole: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    let interval;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Helper function to format email prefixes (e.g., "john.doe@gmail.com" -> "John Doe")
  const getFormattedName = () => {
    if (formData.name.trim()) return formData.name.trim();
    if (!formData.email) return 'Developer';
    
    const prefix = formData.email.split('@')[0];
    return prefix
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    if (isRegister) {
      if (!formData.name) return;
      if (formData.role === 'Other' && !formData.customRole.trim()) return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setTimer(30);
    }, 800);
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.join('').length < 6) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      const resolvedRole = isRegister
        ? (formData.role === 'Other' ? (formData.customRole.trim() || 'Contributor') : formData.role)
        : 'Developer';

      const userData = {
        name: getFormattedName(), // Standardized name output
        email: formData.email,
        role: resolvedRole,
        token: 'mock-jwt-2fa-token'
      };

      localStorage.setItem('traceguard_active_user', JSON.stringify(userData));
      onLoginSuccess(userData);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">TraceGuard</h1>
            <p className="text-xs text-slate-400">Error Telemetry & Diagnostics Platform</p>
          </div>
        </div>

        {step === 'credentials' ? (
          <>
            <div className="flex border-b border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                  !isRegister
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                  isRegister
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isRegister && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Select Role</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Developer">Developer</option>
                        <option value="DevOps Engineer">DevOps Engineer</option>
                        <option value="Security Analyst">Security Analyst</option>
                        <option value="System Admin">System Admin</option>
                        <option value="Other">Other...</option>
                      </select>
                    </div>
                  </div>

                  {formData.role === 'Other' && (
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Specify Your Role</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. QA Engineer, Cloud Architect"
                        value={formData.customRole}
                        onChange={(e) => setFormData({ ...formData, customRole: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="developer@traceguard.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Validating...' : isRegister ? 'Register & Get OTP' : 'Login & Continue'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1 mb-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to {isRegister ? 'Register' : 'Login'}
              </button>

              <h2 className="text-base font-semibold text-slate-100">Two-Factor Authentication</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter the 6-digit verification code sent to{' '}
                <span className="text-indigo-400 font-mono">{formData.email}</span>
              </p>

              <div className="flex gap-2 justify-between mt-5">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-center text-lg font-bold bg-slate-950 border border-slate-800 rounded-lg text-indigo-400 focus:outline-none focus:border-indigo-500"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.join('').length < 6}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Launch Dashboard'}
              <KeyRound className="w-4 h-4" />
            </button>

            <div className="text-center">
              {timer > 0 ? (
                <p className="text-xs text-slate-500">
                  Resend code in <span className="text-slate-300 font-mono">{timer}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setTimer(30)}
                  className="text-xs text-indigo-400 hover:underline inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Resend Code
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}