import { useEffect, useState } from 'react';
import { LockKeyhole, ShieldCheck, ArrowUpRight, Eye, EyeOff, Cloud, Fingerprint } from 'lucide-react';
import App from './App.jsx';

export default function AuthGate() {
  const [status, setStatus] = useState('checking');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function checkSession() {
    try {
      const response = await fetch('/api/auth/me', { credentials:'same-origin' });
      setStatus(response.ok ? 'authenticated' : 'guest');
    } catch { setStatus('guest'); }
  }
  useEffect(() => { checkSession(); }, []);

  async function signIn(event) {
    event.preventDefault();
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method:'POST', credentials:'same-origin', headers:{ 'content-type':'application/json' },
        body:JSON.stringify({ username, password })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to sign in.');
      setStatus('authenticated'); setPassword('');
    } catch (err) { setError(err.message || 'Connection failed.'); }
    finally { setBusy(false); }
  }
  async function signOut() {
    await fetch('/api/auth/logout', { method:'POST', credentials:'same-origin' }).catch(() => {});
    setStatus('guest');
  }

  if (status === 'checking') return <div className="auth-loading"><div className="auth-spinner"/><span>SECURELY CONNECTING</span></div>;
  if (status === 'authenticated') return <><App /><button className="secure-logout" onClick={signOut} title="Sign out"><LockKeyhole size={14}/><span>Sign out</span></button></>;

  return <main className="auth-screen">
    <div className="auth-noise"/>
    <div className="auth-topline"><div className="auth-brand"><div className="auth-brand-mark"><Cloud size={19}/></div><span>ZEYZAR <b>CLOUD</b></span></div><div className="auth-private"><span/> PRIVATE CONTROL PLANE</div></div>
    <section className="auth-layout">
      <div className="auth-story">
        <div className="auth-overline"><span/> YOUR INFRASTRUCTURE. YOUR RULES.</div>
        <h1>Build beyond<br/><em>the ordinary.</em></h1>
        <p>A private command center for the systems you create. Your projects, your infrastructure, your control.</p>
        <div className="auth-proof"><div><ShieldCheck size={17}/><span>OWNER-ONLY ACCESS</span></div><div><Fingerprint size={17}/><span>SELF-HOSTED BY DESIGN</span></div></div>
        <div className="auth-orbit"><div className="auth-ring ring-a"/><div className="auth-ring ring-b"/><div className="auth-core"><Cloud size={31}/></div><i className="auth-node n1"/><i className="auth-node n2"/><i className="auth-node n3"/></div>
      </div>
      <form className="auth-card" onSubmit={signIn}>
        <div className="auth-card-icon"><LockKeyhole size={19}/></div>
        <div className="auth-card-kicker">RESTRICTED ENVIRONMENT · AUTH 01</div>
        <h2>Welcome back.</h2>
        <p>Sign in with your owner credentials to access your cloud workspace.</p>
        <label htmlFor="owner-user">OWNER USERNAME</label>
        <input id="owner-user" autoComplete="username" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Enter your username" required/>
        <label htmlFor="owner-pass">ACCESS PASSWORD</label>
        <div className="auth-password"><input id="owner-pass" type={showPassword?'text':'password'} autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" required/><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?'Hide password':'Show password'}>{showPassword?<EyeOff size={16}/>:<Eye size={16}/>}</button></div>
        {error && <div className="auth-error">{error}</div>}
        <button className="auth-submit" disabled={busy}>{busy?'VERIFYING ACCESS':'Enter ZEYZAR CLOUD'} <ArrowUpRight size={16}/></button>
        <div className="auth-card-foot"><ShieldCheck size={14}/> Encrypted session · Private workspace</div>
      </form>
    </section>
    <footer className="auth-footer"><span>© 2026 ZEYZAR CLOUD</span><span>INDEPENDENT INFRASTRUCTURE <b>✳</b></span><span>ACCESS BY INVITATION ONLY</span></footer>
  </main>;
}
