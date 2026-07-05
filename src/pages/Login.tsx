import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiLayers, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';

const Login: React.FC = () => {
  const { logIn, signUp, resetPassword, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemoLogin = async () => {
    clearError();
    setLoading(true);
    const demoEmail = 'operator@coldchainwise.com';
    const demoPassword = 'password123';
    setEmail(demoEmail);
    setPassword(demoPassword);
    try {
      await logIn(demoEmail, demoPassword, rememberMe);
      navigate('/dashboard');
    } catch (err) {
      try {
        await signUp(demoEmail, demoPassword, 'Demo Operator', 'Global Logistics Inc', '+919876543210', 'Logistics Operator');
        navigate('/dashboard');
      } catch (signupErr) {
        console.error("Quick demo operator signup failed", signupErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [resetSent, setResetSent] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!email) errors.email = 'Email address is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Please enter a valid email address.';
    if (!resetMode && !password) errors.password = 'Password is required.';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await logIn(email, password, rememberMe);
      navigate('/dashboard');
    } catch (err) {
      console.error("Login submission failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setResetSent(false);
    if (!validate()) return;

    setLoading(true);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      console.error("Password reset request failed", err);
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
          <h2 className="text-[32px] font-black text-white tracking-tight leading-[1.1] mb-4">
            Intelligence for the <br/><span className="text-primary-brand">modern cold chain.</span>
          </h2>
          <p className="text-slate-300 text-[15px] leading-relaxed mb-8 max-w-md">
            Join the platform that helps logistics operators predict temperature deviations, optimize routes, and eliminate spoilage before the truck even leaves the facility.
          </p>
          <div className="flex gap-3">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex-1">
              <div className="text-2xl font-black text-white mb-0.5">30+</div>
              <div className="text-[12px] text-slate-300 font-semibold uppercase tracking-wider">Cities Covered</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex-1">
              <div className="text-2xl font-black text-white mb-0.5">42%</div>
              <div className="text-[12px] text-slate-300 font-semibold uppercase tracking-wider">Less Spoilage</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative">
        
        {/* Top Bar with Home Link inside the form half */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-[13px] font-semibold">
            ← Back to Home
          </Link>
        </div>
        <div className="w-full max-w-[380px]">
          
          {/* Logo / Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-brand text-white rounded-lg flex items-center justify-center shadow-sm">
                <FiLayers className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                Cold Chain<span className="text-primary-brand">Wise</span>
              </span>
            </Link>
            <h1 className="text-[22px] font-black tracking-tight text-slate-900">
              {resetMode ? 'Reset password' : 'Welcome back'}
            </h1>
            <p className="text-[13px] text-slate-500 mt-1">
              {resetMode 
                ? 'Enter your email to receive a reset link.' 
                : 'Enter your details to access your account.'
              }
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            
            {/* Error Notice */}
            {(authError || Object.keys(validationErrors).length > 0) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-[12px] text-red-700 mb-5">
                <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  {authError && <p className="font-semibold">{authError}</p>}
                  {Object.values(validationErrors).map((vErr, i) => (
                    <p key={i}>{vErr}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Reset Sent Notice */}
            {resetSent && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-[12px] text-emerald-700 mb-5">
                Password reset link has been sent to your email.
              </div>
            )}

            {/* Form */}
            {resetMode ? (
              <form onSubmit={handleResetSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-700">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full text-[13px] border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-brand/30 focus:border-primary-brand transition-all"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-brand hover:bg-primary-hover text-white text-[13px] font-bold py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50 mt-1"
                >
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => { setResetMode(false); clearError(); setValidationErrors({}); }} 
                  className="text-[12px] font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  ← Back to log in
                </button>
              </form>
            ) : (
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                
                {/* Demo Sign In */}
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-[12px] font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <FiLayers className="w-4 h-4 text-slate-400" /> Sign in with Demo Account
                </button>

                <div className="flex items-center gap-3">
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or</span>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-slate-700">Email</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="w-full text-[13px] border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-brand/30 focus:border-primary-brand transition-all"
                    />
                  </div>
                  
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
                </div>
                
                <div className="flex justify-between items-center mt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none group">
                    <input 
                      type="checkbox" 
                      checked={rememberMe} 
                      onChange={(e) => setRememberMe(e.target.checked)} 
                    />
                    <span className="text-[13px] text-slate-600 group-hover:text-slate-900 transition-colors">Remember for 30 days</span>
                  </label>
                  <button 
                    type="button"
                    onClick={() => { setResetMode(true); clearError(); setValidationErrors({}); }}
                    className="text-[13px] font-bold text-primary-brand hover:text-primary-hover transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-brand hover:bg-primary-hover text-white text-[14px] font-bold py-3 rounded-xl transition-all shadow-sm disabled:opacity-50 mt-2"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-[13px] text-slate-500 mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-primary-brand hover:text-primary-hover transition-colors">
              Sign up
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
