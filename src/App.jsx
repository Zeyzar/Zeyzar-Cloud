import { useState } from 'react';
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, BookOpen, Boxes,
  Check, ChevronDown, CircleHelp, Clock3, Command, ExternalLink,
  Github, Globe2, LayoutDashboard, LifeBuoy, Menu, MoreHorizontal,
  Plus, Rocket, Search, Settings2, ShieldCheck, Sparkles, Terminal,
  X, Zap
} from 'lucide-react';

const initialProjects = [
  { name: 'storefront-web', repo: 'zeyzar/storefront-web', branch: 'main', provider: 'Cloudflare Pages', status: 'Ready', domain: 'storefront.example.com', updated: '12 min ago', color: 'violet' },
  { name: 'docs-platform', repo: 'zeyzar/docs-platform', branch: 'main', provider: 'Netlify', status: 'Ready', domain: 'docs.example.com', updated: 'Yesterday', color: 'blue' },
  { name: 'api-service', repo: 'zeyzar/api-service', branch: 'production', provider: 'Render', status: 'Building', domain: 'api.example.com', updated: 'Just now', color: 'orange' },
];

const navGroups = [
  { label: 'WORKSPACE', items: [{ label: 'Overview', icon: LayoutDashboard }, { label: 'Projects', icon: Boxes, count: '3' }, { label: 'Deployments', icon: Rocket }, { label: 'Activity', icon: Activity }] },
  { label: 'CONFIGURE', items: [{ label: 'Domains', icon: Globe2 }, { label: 'Integrations', icon: Github }, { label: 'Environment', icon: Settings2 }] },
];

function App() {
  const [active, setActive] = useState('Overview');
  const [projects, setProjects] = useState(initialProjects);
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [projectName, setProjectName] = useState('');

  const filtered = projects.filter(p => (p.name + p.repo + p.provider).toLowerCase().includes(query.toLowerCase()));
  const readyCount = projects.filter(p => p.status === 'Ready').length;

  function addProject(e) {
    e.preventDefault();
    if (!projectName.trim()) return;
    setProjects([{ name: projectName.trim(), repo: 'Connect a GitHub repository', branch: 'main', provider: 'Not connected', status: 'Not deployed', domain: '—', updated: 'Just now', color: 'violet' }, ...projects]);
    setProjectName('');
    setShowNew(false);
    setActive('Projects');
    setNotice('Project workspace created. Connect a repository to continue.');
  }

  const Sidebar = () => <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
    <div className="brand"><div className="brand-mark"><span>z</span></div><div><div className="brand-name">ZEYZAR<span> CLOUD</span></div><div className="brand-caption">DEPLOYMENT CONTROL PLANE</div></div><button className="mobile-close icon-button" onClick={() => setMobileOpen(false)}><X size={18}/></button></div>
    <div className="workspace-switch"><div className="workspace-avatar">Z</div><div className="workspace-copy"><strong>Zeyzar Workspace</strong><small>Free workspace</small></div><ChevronDown size={15}/></div>
    {navGroups.map(group => <div className="nav-group" key={group.label}><div className="nav-label">{group.label}</div>{group.items.map(item => <button key={item.label} onClick={() => {setActive(item.label);setMobileOpen(false);}} className={`nav-item ${active === item.label ? 'active' : ''}`}><item.icon size={17}/><span>{item.label}</span>{item.count && <small>{projects.length}</small>}</button>)}</div>)}
    <div className="sidebar-bottom"><div className="usage-card"><div className="usage-head"><span>WORKSPACE STATUS</span><span className="live-dot"/></div><strong>Ready for takeoff</strong><p>Your control plane is set up. Connect a provider to ship your first deployment.</p><div className="usage-track"><span/></div><small>Hybrid mode · Provider agnostic</small></div><button className="nav-item"><BookOpen size={17}/><span>Documentation</span><ExternalLink size={13}/></button><button className="nav-item"><LifeBuoy size={17}/><span>Help & support</span></button><div className="profile"><div className="profile-avatar">ZY</div><div className="profile-copy"><strong>Zeyzar</strong><small>Owner</small></div><MoreHorizontal size={18}/></div></div>
  </aside>;

  return <div className="app-shell">
    <Sidebar />
    {mobileOpen && <div className="scrim" onClick={() => setMobileOpen(false)}/>}
    <main className="main">
      <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)}><Menu size={19}/></button><div className="breadcrumb">Workspace <span>/</span> <strong>{active}</strong></div></div><div className="topbar-actions"><div className="system-status"><span className="live-dot"/> All systems operational</div><button className="icon-button" aria-label="Notifications" onClick={() => setNotice('You’re all caught up.')}><Bell size={18}/></button><div className="top-avatar">ZY</div></div></header>
      <div className="page-wrap">
        <section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-line"/> YOUR CLOUD, IN ONE PLACE</div><h1>{active === 'Overview' ? 'Ship something great.' : active + '.'}</h1><p className="subtitle">{active === 'Overview' ? 'A clear view of your projects, deployments, and infrastructure.' : 'Manage your ' + active.toLowerCase() + ' across connected providers.'}</p></div><button className="primary-button" onClick={() => setShowNew(true)}><Plus size={17}/> New project</button></section>
        {notice && <div className="notice"><Check size={16}/>{notice}<button onClick={() => setNotice('')}><X size={15}/></button></div>}
        <section className="hero-card"><div className="hero-glow"/><div className="hero-content"><div className="hero-tag"><Sparkles size={13}/> THE HYBRID CLOUD WORKSPACE</div><h2>One dashboard.<br/><span>Every deployment.</span></h2><p>Bring your GitHub repositories and favorite hosting providers together. Your infrastructure, without the busywork.</p><div className="hero-actions"><button className="hero-button" onClick={() => setActive('Integrations')}>Connect a provider <ArrowUpRight size={16}/></button><span><ShieldCheck size={14}/> Your projects stay yours</span></div></div><div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="core"><Command size={34}/></div><div className="orbit-node node-a"><Github size={18}/></div><div className="orbit-node node-b"><Globe2 size={18}/></div><div className="orbit-node node-c"><Zap size={18}/></div><div className="orbit-node node-d"><Terminal size={18}/></div></div><div className="hero-index">01 <span>/ CONTROL PLANE</span></div></section>
        <section className="stats-grid"><div className="stat-card"><div className="stat-top"><span>PROJECTS</span><div className="stat-icon purple"><Boxes size={17}/></div></div><div className="stat-value">{projects.length.toString().padStart(2,'0')}<span className="stat-trend"><ArrowUpRight size={13}/> Workspace</span></div><div className="stat-foot">Across all providers</div></div><div className="stat-card"><div className="stat-top"><span>READY</span><div className="stat-icon green"><Check size={17}/></div></div><div className="stat-value">{readyCount.toString().padStart(2,'0')}<span className="stat-trend positive"><ArrowUpRight size={13}/> Healthy</span></div><div className="stat-foot">Successfully deployed</div></div><div className="stat-card"><div className="stat-top"><span>DEPLOYMENTS</span><div className="stat-icon blue"><Rocket size={17}/></div></div><div className="stat-value">—<span className="stat-trend">Coming soon</span></div><div className="stat-foot">Deployment history integration</div></div><div className="stat-card"><div className="stat-top"><span>UPTIME</span><div className="stat-icon orange"><Activity size={17}/></div></div><div className="stat-value">—<span className="stat-trend">Not measured</span></div><div className="stat-foot">Connect monitoring to measure</div></div></section>
        <section className="content-grid"><div className="panel projects-panel"><div className="panel-heading"><div><div className="section-kicker">YOUR WORKSPACE</div><h3>Recent projects <span className="count-pill">{projects.length}</span></h3></div><button className="text-button" onClick={() => setActive('Projects')}>View all <ArrowUpRight size={14}/></button></div><div className="project-toolbar"><div className="search-box"><Search size={15}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search projects..."/></div><button className="filter-button"><span>All projects</span><ChevronDown size={14}/></button></div><div className="project-list">{filtered.map((p,i) => <div className="project-row" key={p.name}><div className={`project-icon ${p.color}`}>{p.name.slice(0,1).toUpperCase()}</div><div className="project-info"><strong>{p.name}</strong><span><Github size={12}/>{p.repo}</span></div><div className="project-provider">{p.provider}</div><div className="project-status"><span className={`status-dot ${p.status === 'Ready' ? 'ready' : p.status === 'Building' ? 'building' : ''}`}/>{p.status}</div><div className="project-updated"><Clock3 size={12}/>{p.updated}</div><button className="row-more" onClick={() => setNotice(p.name + ' · ' + p.domain)}><MoreHorizontal size={17}/></button></div>)}{filtered.length === 0 && <div className="empty-state">No projects match “{query}”.</div>}</div><div className="panel-footer"><span>Showing {filtered.length} of {projects.length} projects</span><button onClick={() => setShowNew(true)}>Add a project <Plus size={13}/></button></div></div>
        <div className="right-column"><div className="panel activity-panel"><div className="panel-heading"><div><div className="section-kicker">WHAT'S HAPPENING</div><h3>Recent activity</h3></div><button className="icon-button subtle"><MoreHorizontal size={17}/></button></div><div className="activity-empty"><div className="activity-empty-icon"><Activity size={20}/></div><strong>Your activity starts here</strong><p>Connect a provider to see build events, deploys, and project updates in one feed.</p><button className="text-button" onClick={() => setActive('Integrations')}>Explore integrations <ArrowUpRight size={14}/></button></div></div><div className="tip-card"><div className="tip-icon"><Sparkles size={16}/></div><div><div className="section-kicker">NEXT STEP</div><strong>Connect your GitHub</strong><p>Import a repository to create your first cloud project.</p><button onClick={() => setActive('Integrations')}>Set up integration <ArrowUpRight size={13}/></button></div></div></div></section>
        <footer className="footer"><span>© 2026 ZEYZAR CLOUD</span><span>BUILT FOR THE NEXT DEPLOY <span className="footer-star">✳</span></span><span>v0.1.0 · PREVIEW</span></footer>
      </div>
    </main>
    {showNew && <div className="modal-backdrop" onClick={() => setShowNew(false)}><form className="modal" onSubmit={addProject} onClick={e => e.stopPropagation()}><div className="modal-top"><div className="modal-icon"><Boxes size={19}/></div><button type="button" className="icon-button" onClick={() => setShowNew(false)}><X size={18}/></button></div><div className="section-kicker">NEW WORKSPACE PROJECT</div><h2>Create a project</h2><p>Start with a name. You can connect a GitHub repository and deployment provider next.</p><label htmlFor="project-name">Project name</label><input id="project-name" autoFocus value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="my-awesome-project" required/><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowNew(false)}>Cancel</button><button className="primary-button" type="submit"><Plus size={16}/> Create project</button></div></form></div>}
  </div>;
}

export default App;
