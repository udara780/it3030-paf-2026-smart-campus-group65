import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authService } from '../services/dataService';
import { HiOfficeBuilding, HiCalendar, HiTicket, HiShieldCheck, HiSparkles } from 'react-icons/hi';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  // Load Google Sign-In script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
        callback: handleGoogleResponse,
      });
      window.google?.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'filled_black', size: 'large', width: 320, shape: 'pill', text: 'signin_with' }
      );
    };

    return () => document.body.removeChild(script);
  }, []);

  const handleGoogleResponse = async (response) => {
    setIsLoading(true);
    try {
      const res = await authService.googleLogin(response.credential);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: HiOfficeBuilding, title: 'Facilities', desc: 'Browse rooms, labs & equipment' },
    { icon: HiCalendar, title: 'Bookings', desc: 'Book and manage reservations' },
    { icon: HiTicket, title: 'Maintenance', desc: 'Report & track incidents' },
    { icon: HiShieldCheck, title: 'Secure', desc: 'Google OAuth & role-based access' },
  ];

  return (
    <div className="min-h-screen bg-dark flex p-4 m-2">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary-dark via-primary to-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white text-2xl font-bold">C</span>
            </div>
            <h1 className="text-4xl font-bold text-white">CampsHub</h1>
          </div>
          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            Your all-in-one campus facilities management platform. Book spaces, manage assets, and handle maintenance — effortlessly.
          </p>
          <div className="grid grid-cols-2 gap-5">
            {features.map(({ icon: IconComponent, title, desc }) => (
              <div key={title} className="p-5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-all">
                <IconComponent className="text-white mb-3" size={28} />
                <h3 className="text-white font-semibold">{title}</h3>
                <p className="text-white/60 text-sm mt-1.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — login */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-primary-light to-secondary bg-clip-text text-transparent">CampsHub</h1>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-2xl p-8 xl:p-10 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-dark-text mb-8">Sign in to manage your campus facilities</p>

            <div id="google-signin-btn" className="flex justify-center mb-6" />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dark-border" /></div>
              <div className="relative flex justify-center"><span className="px-3 bg-dark-card text-dark-text text-sm">or use demo access</span></div>
            </div>

            {/* Demo login buttons for testing without Google */}
            <div className="space-y-3">
              {['USER', 'ADMIN', 'TECHNICIAN'].map((role) => (
                <button
                  key={role}
                  disabled={isLoading}
                  onClick={() => {
                    setIsLoading(true);
                    login({
                      token: `demo-${role.toLowerCase()}`,
                      id: `demo-${role.toLowerCase()}`,
                      email: `${role.toLowerCase()}@campshub.demo`,
                      name: `Demo ${role.charAt(0) + role.slice(1).toLowerCase()}`,
                      picture: null,
                      role,
                    });
                    navigate('/dashboard');
                  }}
                  className={`w-full py-2.5 px-4 rounded-lg border border-dark-border text-sm font-medium transition-all flex items-center justify-between
                    ${isLoading
                      ? 'opacity-50 cursor-not-allowed text-dark-text-light'
                      : 'text-dark-text-light hover:bg-dark-border/40 hover:text-white hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10'
                    }`}
                >
                  <span className="flex items-center gap-2">
                    {isLoading && role === 'ADMIN' ? <HiSparkles className="animate-spin" size={16} /> : null}
                    Continue as {role.charAt(0) + role.slice(1).toLowerCase()}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isLoading ? 'bg-dark-border/30' : 'bg-primary/15'} text-primary-light`}>{role}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-dark-text text-xs mt-8">
            By signing in, you agree to CampsHub's Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}

