import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types/user';
import { FiLayers, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';

const Signup: React.FC = () => {
  const { signUp, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role] = useState<UserRole>('Logistics Operator');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Full name is required.';
    if (!company.trim()) errors.company = 'Company name is required.';
    if (!email) errors.email = 'Email address is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Please enter a valid email address.';
    if (!phone.trim()) errors.phone = 'Phone number is required.';
    else if (!/^\+?[1-9]\d{1,14}$/.test(phone.replace(/[\s()-]/g, ''))) errors.phone = 'Please enter a valid phone number.';
    if (!password) errors.password = 'Password is required.';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters.';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';
    if (!agreeTerms) errors.terms = 'You must agree to the Terms of Service.';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await signUp(email, password, name, company, phone, role);
      navigate('/dashboard');
    } catch (err) {
      console.error("Signup submission failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col lg:flex-row font-sans relative">
      
      {/* Left side: Image / Info */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden items-center p-12 lg:p-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/20 z-10" />
          <img src="/hero_truck.png" alt="Cold Chain Truck" className="w-full h-full object-cover object-center opacity-70" />
        </div>
        <div className="relative z-10 max-w-lg">
          <h2 className="text-[36px] font-black text-white tracking-tight leading-[1.1] mb-5">
            Start protecting your <br/><span className="text-primary-brand">cargo today.</span>
          </h2>
          <p className="text-slate-300 text-[16px] leading-relaxed mb-10 max-w-md">
            Create an enterprise account and gain immediate access to AI-powered thermal logistics telemetry, compliance checklists, and spoilage forecasts.
          </p>
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex-1">
              <div className="text-3xl font-black text-white mb-1">99%</div>
              <div className="text-[13px] text-slate-300 font-semibold uppercase tracking-wider">Uptime SLA</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex-1">
              <div className="text-3xl font-black text-white mb-1">5</div>
              <div className="text-[13px] text-slate-300 font-semibold uppercase tracking-wider">Cargo Types</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 relative">
        
        {/* Top Bar with Home Link inside the form half */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-[13px] font-semibold">
            ← Back to Home
          </Link>
        </div>
        <div className="w-full max-w-[500px]">
          
          {/* Logo / Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-brand text-white rounded-lg flex items-center justify-center shadow-sm">
                <FiLayers className="w-4 h-4" />
              </div>
              <span className="font-bold text-[16px] tracking-tight text-slate-900">
                Cold Chain<span className="text-primary-brand">Wise</span>
              </span>
            </Link>
            <h1 className="text-[22px] font-black tracking-tight text-slate-900">
              Create an account
            </h1>
            <p className="text-[13px] text-slate-500 mt-1">
              Start securing your supply chain today.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            
            {/* Error Notice */}
            {(authError || Object.keys(validationErrors).length > 0) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-[12px] text-red-700 mb-5">
                <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  {authError && <p className="font-semibold">{authError}</p>}
                  {Object.entries(validationErrors).map(([key, err]) => (
                    <p key={key}>• {err}</p>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="w-full text-[14px] border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-brand/30 focus:border-primary-brand transition-all"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-slate-700">Company</label>
                  <input
                    type="text"
                    placeholder="Enter Your Company Name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    disabled={loading}
                    className="w-full text-[14px] border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-brand/30 focus:border-primary-brand transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-slate-700">Email</label>
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full text-[14px] border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-brand/30 focus:border-primary-brand transition-all"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-slate-700">Phone</label>
                  <input
                    type="tel"
                    placeholder="Enter Your Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                    className="w-full text-[14px] border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-brand/30 focus:border-primary-brand transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="w-full text-[13px] border border-slate-300 rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-brand/30 focus:border-primary-brand transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                    >
                      {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      className="w-full text-[13px] border border-slate-300 rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-brand/30 focus:border-primary-brand transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                    >
                      {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-2.5 mt-2 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  disabled={loading}
                  className="rounded text-primary-brand focus:ring-primary-brand border-slate-300 w-4 h-4 mt-0.5 cursor-pointer"
                />
                <span className="text-[12px] text-slate-500 leading-normal group-hover:text-slate-700 transition-colors">
                  I agree to the <span className="font-bold">Terms of Service</span> and <span className="font-bold">Privacy Policy</span>.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || !agreeTerms}
                className="w-full bg-primary-brand hover:bg-primary-hover text-white text-[13px] font-bold py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50 mt-1"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          </div>

          <p className="mt-5 text-center text-[13px] text-slate-600 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary-brand hover:text-primary-hover transition-colors">
              Log in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Signup;
