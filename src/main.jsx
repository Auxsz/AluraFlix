import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const categories = ['Front-end', 'Back-end', 'Mobile'];
const initialVideos = [
  { id: '1', title: 'React: comece sua jornada', category: 'Front-end', url: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM', description: 'Conheça os conceitos do React e descubra como construir interfaces com componentes.', label: 'REACT', subtitle: 'Interfaces que ganham vida', art: 'react', duration: 'PRIMEIROS PASSOS' },
  { id: '2', title: 'JavaScript: a linguagem da web', category: 'Front-end', url: 'https://www.youtube.com/watch?v=DHjqpvDnNGE', description: 'Explore a linguagem que transforma páginas em experiências interativas.', label: 'JS', subtitle: 'Uma linguagem. Possibilidades infinitas.', art: 'js', duration: 'FUNDAMENTOS' },
  { id: '3', title: 'CSS: do básico ao extraordinário', category: 'Front-end', url: 'https://www.youtube.com/watch?v=OEV8gMkCHXQ', description: 'Estilos, layouts e criatividade para suas próximas interfaces.', label: 'CSS', subtitle: 'Dê forma às suas ideias', art: 'css', duration: 'DESIGN & CÓDIGO' },
  { id: '4', title: 'Node.js: além do navegador', category: 'Back-end', url: 'https://www.youtube.com/watch?v=ENrzD9HAZK4', description: 'Entenda como usar JavaScript no servidor com Node.js.', label: 'NODE', subtitle: 'O que acontece por trás da tela', art: 'node', duration: 'PRIMEIROS PASSOS' },
  { id: '5', title: 'Python: simplicidade e poder', category: 'Back-end', url: 'https://www.youtube.com/watch?v=x7X9w_GIm1s', description: 'Uma introdução ao universo de possibilidades do Python.', label: 'PY', subtitle: 'Pequenos passos. Grandes projetos.', art: 'python', duration: 'FUNDAMENTOS' },
  { id: '6', title: 'Flutter: suas ideias em movimento', category: 'Mobile', url: 'https://www.youtube.com/watch?v=lHhRhPV--G0', description: 'Descubra o desenvolvimento de aplicativos com Flutter.', label: 'FLUTTER', subtitle: 'Uma ideia em muitas telas', art: 'mobile', duration: 'EXPLORE O MOBILE' },
];
const emptyForm = { title: '', category: 'Front-end', url: '', description: '' };
function youtubeId(url) {
  try {
    const parsed = new URL(url);
    if (!['https:', 'http:'].includes(parsed.protocol)) return null;
    const id = parsed.hostname === 'youtu.be' ? parsed.pathname.slice(1) : ['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(parsed.hostname) ? parsed.searchParams.get('v') || parsed.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] : null;
    return /^[\w-]{11}$/.test(id || '') ? id : null;
  } catch { return null; }
}
function readVideos() {
  try {
    const saved = JSON.parse(localStorage.getItem('aluraflix-videos'));
    if (Array.isArray(saved) && saved.every(v => v && typeof v.id === 'string' && typeof v.title === 'string' && typeof v.description === 'string' && categories.includes(v.category) && youtubeId(v.url))) return saved;
  } catch { /* Start with the sample catalog if storage is unavailable. */ }
  return initialVideos;
}
function Icon({ name, size = 20 }) {
  const paths = { play: <path d="m9 5 11 7-11 7Z" />, plus: <path d="M12 5v14M5 12h14" />, search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></>, close: <path d="m6 6 12 12M18 6 6 18"/>, edit: <><path d="m15 5 4 4M4 20l4-1L20 7l-4-4L4 15Z"/></>, trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v5M14 11v5"/></>, arrow: <path d="M5 12h14m-5-5 5 5-5 5"/> };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={name === 'play' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
function Artwork({ video, hero = false }) {
  return <div className={`artwork ${video.art || 'custom'} ${hero ? 'hero-art' : ''}`} aria-hidden="true"><div className="art-grid"/><span className="art-orbit orbit-one"/><span className="art-orbit orbit-two"/><span className="art-orbit orbit-three"/><div className="art-word">{video.label || '</>'}</div><span className="art-subtitle">{video.subtitle || video.category}</span><span className="art-corner">ALURAFLIX / LEARN SOMETHING NEW</span></div>;
}
function Modal({ title, children, onClose, wide = false }) {
  const ref = useRef(null);
  useEffect(() => { const previous = document.activeElement; const dialog = ref.current; dialog.showModal(); return () => { dialog.close(); previous?.focus(); }; }, []);
  return <dialog ref={ref} className={wide ? 'modal wide' : 'modal'} onCancel={onClose} onClick={e => { if (e.target === ref.current) onClose(); }} aria-labelledby="modal-title"><div className="modal-heading"><h2 id="modal-title">{title}</h2><button className="icon-button" onClick={onClose} aria-label="Fechar"><Icon name="close"/></button></div>{children}</dialog>;
}
function App() {
  const [videos, setVideos] = useState(readVideos);
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [notice, setNotice] = useState('');
  useEffect(() => { try { localStorage.setItem('aluraflix-videos', JSON.stringify(videos)); } catch { setNotice('Seu navegador não permitiu salvar os vídeos. As alterações ficam disponíveis nesta sessão.'); } }, [videos]);
  const visible = videos.filter(v => (filter === 'Todos' || v.category === filter) && `${v.title} ${v.description}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')));
  function save(e) {
    e.preventDefault();
    if (!form.title.trim() || !youtubeId(form.url)) { setError('Preencha o título e insira um link válido de vídeo do YouTube.'); return; }
    const entry = { ...form, title: form.title.trim(), url: form.url.trim(), id: form.id || crypto.randomUUID() };
    setVideos(current => form.id ? current.map(v => v.id === form.id ? entry : v) : [...current, entry]);
    setNotice(form.id ? 'Vídeo atualizado com sucesso.' : 'Vídeo adicionado à sua coleção.'); setForm(null);
  }
  function openForm(value = emptyForm) { setError(''); setForm({ ...value }); }
  return <><header className="header"><a className="logo" href="#" aria-label="AluraFlix início">alura<span>flix</span><i/></a><nav><a className="nav-active" href="#catalogo">Explorar</a><a className="nav-secondary" href="#sobre">Sobre o projeto</a></nav><button className="button primary small" onClick={() => openForm()}><Icon name="plus"/> Novo vídeo</button></header>
    <main><section className="hero"><div className="hero-copy"><div className="eyebrow"><span/> SUA DOSE DIÁRIA DE CONHECIMENTO</div><h1>Seu próximo passo<br/>começa com um <em>play.</em></h1><p>Ideias que inspiram. Conteúdos que transformam.<br className="desktop-break"/> Um universo de tecnologia para você explorar.</p><div className="hero-actions"><button className="button primary" onClick={() => setPlaying(initialVideos[0])}><Icon name="play"/> Assistir ao destaque</button><a className="text-link" href="#catalogo">Explorar vídeos <Icon name="arrow"/></a></div><div className="hero-note"><span className="mini-stack">JS</span><span className="mini-stack react-mini">⚛</span><span className="mini-stack code-mini">&lt;/&gt;</span><span>Aprenda algo novo. Todos os dias.</span></div></div><button className="featured" onClick={() => setPlaying(initialVideos[0])} aria-label="Assistir ao destaque React: comece sua jornada"><Artwork video={initialVideos[0]} hero/><div className="featured-top"><span className="feature-badge">EM DESTAQUE</span><span>01 / 06</span></div><div className="featured-bottom"><div><span className="feature-category">FRONT-END</span><h2>O primeiro play no seu futuro.</h2><p>Descubra o universo do React</p></div><span className="circle-play"><Icon name="play" size={25}/></span></div></button></section>
    <section id="catalogo" className="catalog"><div className="catalog-title"><div><div className="eyebrow muted">APRENDA NO SEU RITMO</div><h2>Explore o conhecimento<span>.</span></h2></div><span className="count">{videos.length} vídeos na coleção</span></div><div className="catalog-toolbar"><div className="filters" role="group" aria-label="Filtrar por categoria">{['Todos', ...categories].map(c => <button key={c} className={filter === c ? 'filter active' : 'filter'} onClick={() => setFilter(c)} aria-pressed={filter === c}>{c === 'Todos' && <span className="grid-icon">▦</span>}{c}</button>)}</div><label className="search"><Icon name="search"/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar um vídeo..." aria-label="Buscar um vídeo"/><span>/</span></label></div>
      {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dispensar mensagem"><Icon name="close" size={16}/></button></div>}
      {categories.map(category => { const entries = visible.filter(v => v.category === category); return entries.length > 0 && <section className={`category-section ${category.toLowerCase()}`} key={category}><div className="category-heading"><h3><span/>{category}</h3><span>{category === 'Front-end' ? 'Crie experiências que conectam.' : category === 'Back-end' ? 'Construa o que move a tecnologia.' : 'Leve suas ideias para qualquer lugar.'}</span><div className="category-line"/><small>{entries.length} vídeos</small></div><div className="video-grid">{entries.map(video => <article className="video-card" key={video.id}><button className="thumbnail" onClick={() => setPlaying(video)} aria-label={`Assistir ${video.title}`}><Artwork video={video}/><span className="thumb-tag">{video.duration || 'SUA COLEÇÃO'}</span><span className="thumb-play"><Icon name="play"/></span></button><div className="card-content"><span className="card-category">{video.category}</span><h4><button onClick={() => setPlaying(video)}>{video.title}</button></h4><p>{video.description || 'Dê o play e explore um novo conhecimento.'}</p><div className="card-footer"><button onClick={() => setPlaying(video)} className="watch-link">Assistir agora <Icon name="arrow" size={16}/></button><div><button className="icon-button" onClick={() => openForm(video)} aria-label={`Editar ${video.title}`}><Icon name="edit" size={17}/></button><button className="icon-button delete" onClick={() => setDeleting(video)} aria-label={`Excluir ${video.title}`}><Icon name="trash" size={17}/></button></div></div></div></article>)}</div></section>; })}
      {visible.length === 0 && <div className="empty"><Icon name="search" size={32}/><h3>Nenhum vídeo por aqui</h3><p>Tente outra busca ou adicione um novo vídeo à coleção.</p><button className="button primary" onClick={() => openForm()}>Adicionar vídeo</button></div>}
    </section><section id="sobre" className="about"><span className="about-icon">&lt;/&gt;</span><div><h2>Conhecimento foi feito para ser compartilhado.</h2><p>Reúna seus vídeos favoritos e construa sua própria jornada de aprendizado.</p></div><button className="button secondary" onClick={() => openForm()}><Icon name="plus"/> Adicionar à coleção</button></section></main>
    <footer><a className="logo" href="#">alura<span>flix</span><i/></a><p>Feito com React e vontade de aprender.</p><span>Projeto de estudos • {new Date().getFullYear()}</span></footer>
    {form && <Modal title={form.id ? 'Editar vídeo' : 'Novo vídeo'} onClose={() => setForm(null)}><p className="modal-intro">Um novo conhecimento merece um lugar na sua coleção.</p><form onSubmit={save}><label>Título<input autoFocus required maxLength={100} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Como se chama o vídeo?"/></label><label>Categoria<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{categories.map(c => <option key={c}>{c}</option>)}</select></label><label>Link do YouTube<input type="url" required value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..."/></label><label>Descrição<textarea rows={3} maxLength={300} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="O que vamos aprender?"/></label>{error && <p role="alert" className="error">{error}</p>}<div className="form-actions"><button type="button" className="button secondary" onClick={() => setForm(null)}>Cancelar</button><button className="button primary" type="submit">Salvar vídeo</button></div></form></Modal>}
    {playing && <Modal wide title={playing.title} onClose={() => setPlaying(null)}><iframe className="player" src={`https://www.youtube-nocookie.com/embed/${youtubeId(playing.url)}?autoplay=1`} title={playing.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen/><p className="modal-intro">{playing.description}</p><a className="text-link" href={playing.url} target="_blank" rel="noreferrer">Abrir no YouTube <Icon name="arrow" size={16}/></a></Modal>}
    {deleting && <Modal title="Excluir vídeo?" onClose={() => setDeleting(null)}><p className="modal-intro">“{deleting.title}” será removido da sua coleção.</p><div className="form-actions"><button className="button secondary" onClick={() => setDeleting(null)}>Cancelar</button><button className="button danger" onClick={() => { setVideos(current => current.filter(v => v.id !== deleting.id)); setDeleting(null); setNotice('Vídeo removido da coleção.'); }}>Excluir vídeo</button></div></Modal>}
  </>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
