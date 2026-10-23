import React, { useState, useEffect, useRef } from 'react';
import { Flame, Sparkles, Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginPage = () => {
  const { handleLogin } = useApp();

  const [email, setEmail] = useState('admin@crackershop.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotModal, setForgotModal] = useState(false);

  const canvasRef = useRef(null);

  // Canvas Fireworks Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.random() * 2.5 + 1;
        this.velocity = {
          x: (Math.random() - 0.5) * 6,
          y: (Math.random() - 0.5) * 6
        };
        this.alpha = 1;
        this.friction = 0.96;
        this.gravity = 0.08;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }

      update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.015;
      }
    }

    const colors = ['#f97316', '#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#fbbf24'];

    const spawnFirework = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * (canvas.height * 0.6);
      const color = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < 30; i++) {
        particles.push(new Particle(x, y, color));
      }
    };

    const interval = setInterval(spawnFirework, 1200);

    const render = () => {
      ctx.fillStyle = 'rgba(11, 19, 43, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        if (particle.alpha > 0) {
          particle.update();
          particle.draw();
        } else {
          particles.splice(index, 1);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      clearInterval(interval);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await handleLogin(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('admin@crackershop.com');
    setPassword('Admin@123');
  };

  return (
    <div className="min-h-screen w-full bg-[#0b132b] flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans">
      {/* Decorative Gradient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-5xl bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 backdrop-blur-xl relative z-10">
        
        {/* Left Side: Fireworks & Brand Showcase */}
        <div className="lg:col-span-7 p-8 lg:p-12 bg-gradient-to-br from-slate-950 via-[#111936] to-[#1c2541] relative flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-0.5 shadow-xl shadow-orange-500/30">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-wider flex items-center gap-1">
                  Cracker<span className="text-orange-500">Hub</span>
                </h1>
                <p className="text-xs font-bold text-amber-400 tracking-widest uppercase">Crackers Shop Management</p>
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Complete SaaS ERP Solution
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
                Streamline Imports, Sales & Workforce in One Dashboard
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                Manage your fireworks inventory, track bundle imports & daily customer exports, compute salaries, and monitor low stock in real time.
              </p>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="relative z-10 mt-10 grid grid-cols-2 gap-3 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Real-time Bundle Tracking
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Daily Sales & Invoicing
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Worker Payroll & Attendance
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Comprehensive Audit Reports
            </div>
          </div>
        </div>

        {/* Right Side: Clean Login Form */}
        <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between bg-slate-900/60">
          <div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white tracking-tight">Admin Sign In</h3>
              <p className="text-xs text-slate-400 mt-1">Enter your manager credentials to access the shop dashboard.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@crackershop.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setForgotModal(true)}
                    className="text-xs text-orange-400 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-orange-500 rounded border-slate-700 bg-slate-950"
                  />
                  <span className="text-xs text-slate-400 font-medium">Remember this device</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
              >
                {isLoading ? (
                  <span className="inline-block animate-spin border-2 border-slate-950 border-t-transparent rounded-full w-4 h-4" />
                ) : (
                  <>
                    Sign In to Dashboard <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Demo Login Quick Tester Box */}
          <div className="mt-8 pt-5 border-t border-slate-800/80">
            <div className="bg-slate-950/70 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Demo Credentials
                </p>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  admin@crackershop.com / Admin@123
                </p>
              </div>
              <button
                onClick={fillDemo}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs rounded-xl border border-amber-500/40 transition-colors shrink-0"
              >
                Auto Fill
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center text-slate-100 shadow-2xl">
            <Lock className="w-10 h-10 text-orange-400 mx-auto mb-3" />
            <h4 className="font-bold text-lg">Reset Password</h4>
            <p className="text-xs text-slate-400 mt-2">
              For demo testing, password is set to <span className="font-mono text-amber-400 font-bold">Admin@123</span>. You can login directly!
            </p>
            <button
              onClick={() => setForgotModal(false)}
              className="mt-5 w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl"
            >
              Back to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
