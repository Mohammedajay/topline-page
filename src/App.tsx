import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BadgeCheck,
  Battery,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Clock3,
  Copy,
  ExternalLink,
  Facebook,
  Filter,
  Gauge,
  Grid2X2,
  Menu,
  MessageCircle,
  Minus,
  PackageCheck,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
  Wrench,
} from 'lucide-react';

type Brand = 'Linglong' | 'LEAO';
type Product = {
  id: string;
  brand: Brand;
  model: string;
  size: string;
  price: number;
  image: string;
  description: string;
  tag?: string;
};

type DeliveryForm = { name: string; size: string; quantity: string; area: string };

const SHOP_PHONE = '260979033871';
const SHOP_DISPLAY_PHONE = '+260 979 033 871';
const products: Product[] = [
  
{ id: 'll700-175-70r14', brand: 'Linglong', model: 'LL700', size: '175/70R14', price: 700, image: '/images/linglong-ll700.webp', description: 'A dependable everyday tyre for confident city driving.', tag: 'Popular fit' },
{ id: 'leao-nova-195-65r15', brand: 'LEAO', model: 'Nova-Force GP', size: '195/65R15', price: 1200, image: '/images/leao-tyres.webp', description: 'A composed passenger-car tyre with a smooth road feel.', tag: 'Featured' },
{ id: 'linglong-crosswind-185-70r14', brand: 'Linglong', model: 'Crosswind', size: '185/70R14', price: 800, image: '/images/linglong-crosswind.webp', description: 'Practical, durable everyday performance for busy Lusaka roads.' },
{ id: 'linglong-165r13c', brand: 'Linglong', model: 'Commercial', size: '165R13C', price: 850, image: '/images/linglong-commercial-165r13c.webp', description: 'A commercial-size option for light utility vehicles.' },
{ id: 'linglong-700r16', brand: 'Linglong', model: 'Commercial', size: '700R16', price: 2250, image: '/images/linglong-commercial-700r16.webp', description: 'Heavy-duty commercial sizing, subject to stock confirmation.' },
{ id: 'linglong-195r15c', brand: 'Linglong', model: 'Commercial', size: '195R15C', price: 1200, image: '/images/linglong-commercial-195r15c.webp', description: 'A practical commercial tyre size for everyday work.' },

];
const otherSizes = ['175/70R13', '175/65R14', '185/65R15', '185/70R13', '195/70R14', '195/65R15', '195R14C', '185R14C', '205/55R16', '205R16C', '225/65R17', '265/70R16', '700R15', '750R16', '750R16C'];
const faqs = [
  ['How do I know which size I need?', 'Read the size printed on your tyre sidewall, such as 195/65R15, or send us a clear photo on WhatsApp. We can help you identify the size, but vehicle compatibility should always be confirmed before fitting.'],
  ['Are the prices fixed?', 'The catalogue shows the current reference prices supplied for this website. Every price and product must be confirmed with Topline before purchase because stock and pricing can change.'],
  ['Do you deliver outside Lusaka?', 'This website is set up for delivery across Lusaka. Send your area and we will confirm whether delivery is available and what the fee will be.'],
  ['Can I reserve tyres online?', 'Opening WhatsApp starts an enquiry only. It does not reserve stock or confirm payment. Topline will confirm availability and next steps directly.'],
];

function whatsappUrl(message: string): string {
  return `https://wa.me/${SHOP_PHONE}?text=${encodeURIComponent(message)}`;
}

function formatPrice(price: number): string {
  return `K${price.toLocaleString('en-US')}`;
}

function normalizeSize(value: string): string {
  return value.toUpperCase().replace(/\s+/g, '').replace(/R/g, '/').replace(/\/+/g, '/').replace(/(\d+)\/(\d+)\/(\d+)/, '$1/$2R$3');
}

function ProductCard({ product, onOpen }: { product: Product; onOpen: (product: Product) => void }): JSX.Element {
  const message = `Hi Topline, I would like to enquire about the ${product.brand} ${product.model} in ${product.size}. Please confirm current price and stock.`;
  return (
    <article className="product-card">
      <button className="product-image" onClick={() => onOpen(product)} aria-label={`View ${product.brand} ${product.size}`}>
        <img src={product.image} alt={`${product.brand} ${product.model} ${product.size} tyre`} loading="lazy" />
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <span className="image-arrow"><ArrowUpRight size={17} /></span>
      </button>
      <div className="product-info">
        <div className="product-brand"><span className={product.brand === 'LEAO' ? 'brand-dot leao-dot' : 'brand-dot'} />{product.brand}</div>
        <h3>{product.model}</h3>
        <div className="product-meta"><span className="size-label">{product.size}</span><span className="price">{formatPrice(product.price)}<small> / tyre</small></span></div>
        <p>{product.description}</p>
        <button className="text-link" onClick={() => window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer')}>Enquire on WhatsApp <ChevronRight size={16} /></button>
      </div>
    </article>
  );
}

function App(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);
  const [brand, setBrand] = useState<'All' | Brand>('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [finderSize, setFinderSize] = useState('');
  const [finderNotice, setFinderNotice] = useState('');
  const [delivery, setDelivery] = useState<DeliveryForm>({ name: '', size: '', quantity: '4', area: '' });
  const [deliveryNotice, setDeliveryNotice] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const update = (): void => {
      const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Lusaka', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
      const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0);
      const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0);
      const current = hour * 60 + minute;
      setIsOpen(current >= 480 && current < 1050);
      setShowTop(window.scrollY > 600);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    const timer = window.setInterval(update, 60000);
    return () => { window.removeEventListener('scroll', update); window.clearInterval(timer); };
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesBrand = brand === 'All' || product.brand === brand;
      const matchesQuery = !query || `${product.brand} ${product.model} ${product.size}`.toLowerCase().includes(query);
      return matchesBrand && matchesQuery;
    });
    return [...filtered].sort((a, b) => sort === 'price-low' ? a.price - b.price : sort === 'price-high' ? b.price - a.price : sort === 'size' ? a.size.localeCompare(b.size) : Number(Boolean(b.tag)) - Number(Boolean(a.tag)));
  }, [brand, search, sort]);

  const sendFinder = (): void => {
    const normalized = normalizeSize(finderSize);
    const isValid = /^\d{3}\/\d{2}R\d{2}$/.test(normalized) || /^\d{3}R\d{2}$/.test(normalized);
    if (!isValid) { setFinderNotice('Enter a size like 195/65R15 or 165R13C.'); return; }
    const match = products.find((product) => normalizeSize(product.size) === normalized);
    const message = match ? `Hi Topline, I am looking for ${normalized}. I saw the ${match.brand} ${match.model} reference listing. Please confirm current stock and price.` : `Hi Topline, I am looking for ${normalized}. Please let me know if you have it and the current price.`;
    setFinderNotice(match ? `We found a catalogue match: ${match.brand} ${match.model}.` : `No exact catalogue match yet — we will check that size for you.`);
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
  };

  const sendDelivery = (): void => {
    const size = delivery.size.trim();
    const area = delivery.area.trim();
    const quantity = Number(delivery.quantity);
    if (!size || !area || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) { setDeliveryNotice('Add your tyre size, quantity, and Lusaka area to continue.'); return; }
    const message = `Hi Topline, I would like a delivery enquiry.\nName: ${delivery.name.trim() || '-'}\nTyre size: ${size}\nQuantity: ${quantity}\nArea: ${area}\nPlease confirm stock, price and delivery fee.`;
    setDeliveryNotice('Your enquiry is ready in WhatsApp.');
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
  };

  const copySize = async (size: string): Promise<void> => {
    await navigator.clipboard.writeText(size);
    setToast(`${size} copied to clipboard`);
  };

  return (
    <div className="site-shell">
      <div className="announcement"><span className={isOpen ? 'status-dot live' : 'status-dot'} />{isOpen ? 'Open today until 17:30' : 'Closed now · Opens daily at 08:00'}<span className="announcement-divider" />Prices and stock confirmed on WhatsApp</div>
      <header className="site-header">
        <a href="#top" className="wordmark" aria-label="Topline Innovations home"><span className="wordmark-mark">T</span><span>TOPLINE <em>INNOVATIONS</em></span></a>
        <nav className={menuOpen ? 'main-nav open' : 'main-nav'} aria-label="Main navigation">
          <a href="#catalogue" onClick={() => setMenuOpen(false)}>Catalogue</a><a href="#brands" onClick={() => setMenuOpen(false)}>Brands</a><a href="#delivery" onClick={() => setMenuOpen(false)}>Delivery</a><a href="#contact" onClick={() => setMenuOpen(false)}>Visit us</a>
          <a className="nav-cta" href={whatsappUrl('Hi Topline, I would like to enquire about your tyres.')} target="_blank" rel="noreferrer"><MessageCircle size={16} /> WhatsApp</a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Lusaka’s tyre specialists</p>
            <h1>EVERY ROAD.<br /><span>MORE CONFIDENCE.</span></h1>
            <p className="hero-lead">Brand-new Linglong and LEAO tyres, competitive prices, and a straight line to the people who can help you choose the right fit.</p>
            <div className="hero-actions"><a className="button button-red" href="#catalogue">Find your tyres <ArrowUpRight size={18} /></a><a className="button button-quiet" href={whatsappUrl('Hi Topline, I need help finding tyres for my vehicle.')} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Chat on WhatsApp</a></div>
            <div className="hero-proof"><span><ShieldCheck size={17} /> Brand-new only</span><span><Truck size={17} /> Lusaka delivery</span><span><Clock3 size={17} /> Open daily</span></div>
          </div>
          <div className="hero-visual"><div className="hero-glow" /><div className="hero-grid" /><img src="/images/leao-tyres.webp" alt="LEAO tyres ready for the road" /><div className="hero-caption"><span>01 / 02</span><b>Road-ready by design</b><small>LEAO Nova-Force GP · 195/65R15</small></div></div>
          <div className="scroll-cue"><span>Scroll to explore</span><span className="scroll-line" /></div>
        </section>

        <section className="brand-rail" aria-label="Brands supplied"><div>SUPPLYING TRUSTED NAMES</div><img src="/images/linglong-logo.webp" alt="Linglong Tire" /><span className="rail-x">×</span><img className="leao-rail" src="/images/leao-logo.webp" alt="LEAO Tire" /><div className="rail-note">New tyres · Genuine brands · Local support</div></section>

        <section className="finder-section section-pad" id="finder"><div className="section-kicker">01 / FIND YOUR FIT</div><div className="finder-layout"><div><h2>Start with<br /><span>your size.</span></h2><p className="section-intro">Your tyre size is printed on the sidewall. Enter it below and we’ll connect you to the right conversation — with no guesswork and no false promises.</p><div className="sidewall-example"><span>Example sidewall marking</span><strong>195 / 65 R 15</strong></div></div><div className="finder-panel"><label htmlFor="size-input">What size are you looking for?</label><div className="finder-input-wrap"><Search size={19} /><input id="size-input" value={finderSize} onChange={(event) => setFinderSize(event.target.value)} placeholder="e.g. 195/65R15" onKeyDown={(event) => { if (event.key === 'Enter') sendFinder(); }} /><button onClick={sendFinder}>Check size <ArrowUpRight size={17} /></button></div><div className="suggestion-label">Common searches</div><div className="suggestions">{['175/70R14', '185/70R14', '195/65R15', '205/55R16'].map((size) => <button key={size} onClick={() => setFinderSize(size)}>{size}</button>)}</div>{finderNotice && <p className="finder-notice"><CircleCheck size={16} /> {finderNotice}</p>}<p className="helper-text">Exact fit and availability are always confirmed by Topline before purchase.</p></div></div></section>

        <section className="catalogue-section section-pad" id="catalogue"><div className="catalogue-heading"><div><div className="section-kicker">02 / THE CATALOGUE</div><h2>Find your next<br /><span>set of tyres.</span></h2></div><p className="catalogue-intro">Browse the current reference catalogue. Every price is per tyre and should be confirmed with Topline for current availability.</p></div><div className="catalogue-tools"><div className="search-box"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search size, brand or model" aria-label="Search catalogue" /></div><div className="filter-group"><Filter size={17} /><button className={brand === 'All' ? 'active' : ''} onClick={() => setBrand('All')}>All</button><button className={brand === 'Linglong' ? 'active' : ''} onClick={() => setBrand('Linglong')}>Linglong</button><button className={brand === 'LEAO' ? 'active' : ''} onClick={() => setBrand('LEAO')}>LEAO</button></div><label className="sort-select"><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured first</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="size">Size</option></select><ChevronDown size={15} /></label></div><div className="catalogue-count"><span>{visibleProducts.length} reference listings</span><span><BadgeCheck size={15} /> Price and stock confirmation required</span></div>{visibleProducts.length ? <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={setSelectedProduct} />)}</div> : <div className="empty-state"><Search size={30} /><h3>No exact match yet</h3><p>Try another size or send your request directly and Topline will check it for you.</p><button className="button button-red" onClick={() => window.open(whatsappUrl(`Hi Topline, do you have ${search || 'this tyre size'} available?`), '_blank', 'noopener,noreferrer')}>Ask on WhatsApp <ArrowUpRight size={17} /></button></div>}<div className="other-sizes"><div><span className="section-kicker">MORE SIZES</span><h3>Looking for another fit?</h3></div><div className="size-cloud">{otherSizes.map((size) => <button key={size} onClick={() => { setFinderSize(size); document.getElementById('finder')?.scrollIntoView({ behavior: 'smooth' }); }}><span>{size}</span><Copy size={13} onClick={(event) => { event.stopPropagation(); void copySize(size); }} /></button>)}</div></div></section>

        <section className="brands-section section-pad" id="brands"><div className="section-kicker">03 / THE BRANDS</div><div className="brand-intro"><h2>Built for the<br /><span>road ahead.</span></h2><p className="section-intro">Two distinctive tyre brands. One local team focused on helping you make a confident choice for your car, SUV, or pickup.</p></div><div className="brand-showcase"><article className="brand-feature linglong-feature"><div className="brand-feature-image"><img src="/images/linglong-ll700.webp" alt="Linglong LL700 tyre" loading="lazy" /><span className="vertical-label">EVERYDAY PERFORMANCE</span></div><div className="brand-feature-copy"><img src="/images/linglong-logo.webp" alt="Linglong Tire" className="brand-logo" /><p>Practical, dependable tyres for the everyday journeys that matter. Ask about available Linglong sizes for cars, SUVs and pickups.</p><a href="#catalogue" onClick={() => setBrand('Linglong')} className="text-link">Explore Linglong <ArrowUpRight size={16} /></a></div></article><article className="brand-feature leao-feature"><div className="brand-feature-image"><img src="/images/leao-tyres.webp" alt="LEAO tyres" loading="lazy" /><span className="vertical-label">SMOOTH. COMPOSED. READY.</span></div><div className="brand-feature-copy"><img src="/images/leao-logo.webp" alt="LEAO Tire" className="brand-logo leao-logo" /><p>Modern passenger-tyre styling with a composed road feel. Enquire about LEAO Nova-Force GP and other available sizes.</p><a href="#catalogue" onClick={() => setBrand('LEAO')} className="text-link">Explore LEAO <ArrowUpRight size={16} /></a></div></article></div></section>

        <section className="service-section section-pad"><div className="service-header"><div><div className="section-kicker">04 / THE TOPLINE PROMISE</div><h2>The right tyre.<br /><span>Without the runaround.</span></h2></div><p className="section-intro">From first size check to final delivery, we keep the process clear and human.</p></div><div className="service-grid"><div className="service-item"><span className="service-number">01</span><PackageCheck size={27} /><h3>Brand-new stock</h3><p>We supply new tyres from Linglong and LEAO — no used or unknown-condition stock.</p></div><div className="service-item"><span className="service-number">02</span><Gauge size={27} /><h3>Clear guidance</h3><p>Send your size or a photo. We help you understand what is available before you decide.</p></div><div className="service-item"><span className="service-number">03</span><Truck size={27} /><h3>Lusaka delivery</h3><p>Tell us your area and we’ll confirm the delivery fee before anything is arranged.</p></div><div className="service-item"><span className="service-number">04</span><Wrench size={27} /><h3>More than tyres</h3><p>Ask about batteries, oil, filters, accessories, and practical vehicle support.</p></div></div></section>

        <section className="delivery-section section-pad" id="delivery"><div className="delivery-copy"><div className="section-kicker">05 / DELIVERY, MADE SIMPLE</div><h2>From our shop<br /><span>to your drive.</span></h2><p className="section-intro">We deliver across Lusaka. There are no automatic delivery estimates here — we confirm your area and fee with you directly.</p><div className="delivery-steps"><div><b>1</b><span>Select your size</span></div><div><b>2</b><span>Confirm price & stock</span></div><div><b>3</b><span>Arrange your delivery</span></div></div></div><form className="delivery-form" onSubmit={(event) => { event.preventDefault(); sendDelivery(); }}><div className="form-heading"><Truck size={20} /><span>Start a delivery enquiry</span></div><label>Your name <em>optional</em><input value={delivery.name} onChange={(event) => setDelivery({ ...delivery, name: event.target.value })} placeholder="Your name" autoComplete="name" /></label><label>Tyre size<input required value={delivery.size} onChange={(event) => setDelivery({ ...delivery, size: event.target.value })} placeholder="e.g. 185/70R14" /></label><div className="form-row"><label>Quantity<input required type="number" min="1" max="20" value={delivery.quantity} onChange={(event) => setDelivery({ ...delivery, quantity: event.target.value })} /></label><label>Area in Lusaka<input required value={delivery.area} onChange={(event) => setDelivery({ ...delivery, area: event.target.value })} placeholder="e.g. Kabulonga" /></label></div>{deliveryNotice && <p className="form-notice"><CircleCheck size={16} /> {deliveryNotice}</p>}<button className="button button-red" type="submit">Continue on WhatsApp <MessageCircle size={17} /></button><small>Enquiry only. Stock, price, delivery fee, and payment are confirmed directly by Topline.</small></form></section>

        <section className="faq-section section-pad"><div className="faq-heading"><div className="section-kicker">06 / GOOD TO KNOW</div><h2>Questions,<br /><span>answered.</span></h2></div><div className="faq-list">{faqs.map(([question, answer], index) => <div className={openFaq === index ? 'faq-item open' : 'faq-item'} key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{question}</span>{openFaq === index ? <Minus size={18} /> : <ChevronDown size={18} />}</button>{openFaq === index && <p>{answer}</p>}</div>)}</div></section>

        <section className="contact-section section-pad" id="contact"><div className="contact-card"><div className="contact-main"><div className="section-kicker">07 / COME BY OR CALL</div><h2>Ready when<br /><span>you are.</span></h2><p>156 Bimbe Road, Chaisa, Emmasdale, Lusaka</p><div className="contact-actions"><a className="button button-red" href={`tel:+${SHOP_PHONE}`}><Phone size={17} /> {SHOP_DISPLAY_PHONE}</a><a className="button button-dark" href={whatsappUrl('Hi Topline, I would like to visit or enquire about tyres.')} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp us</a></div></div><div className="contact-details"><div><Clock3 size={18} /><span><b>Open daily</b>08:00 — 17:30</span></div><div><Facebook size={18} /><a href="https://www.facebook.com/profile.php?id=61560933303059" target="_blank" rel="noreferrer"><b>Follow on Facebook</b>Topline Innovations Limited</a></div><div><ExternalLink size={18} /><a href="https://www.google.com/maps/dir/?api=1&destination=-15.3804868,28.2811714" target="_blank" rel="noreferrer"><b>Get directions</b>Open in Google Maps</a></div></div></div></section>
      </main>

      <footer className="site-footer"><div className="footer-top"><a href="#top" className="wordmark"><span className="wordmark-mark">T</span><span>TOPLINE <em>INNOVATIONS</em></span></a><p>Quality you can trust.<br />Tyres you can rely on.</p><div className="footer-links"><a href="#catalogue">Catalogue</a><a href="#delivery">Delivery</a><a href="#contact">Contact</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Topline Innovations Limited</span><span>Lusaka, Zambia · Brand-new tyres & automotive essentials</span></div></footer>

      {showTop && <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><ChevronDown size={18} /></button>}
      {toast && <div className="toast"><CircleCheck size={17} /> {toast}</div>}
      {selectedProduct && <div className="modal-backdrop" role="presentation" onClick={() => setSelectedProduct(null)}><div className="product-modal" role="dialog" aria-modal="true" aria-label={`${selectedProduct.brand} ${selectedProduct.size} details`} onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedProduct(null)} aria-label="Close product details"><X size={19} /></button><img src={selectedProduct.image} alt={`${selectedProduct.brand} ${selectedProduct.model}`} /><div className="modal-content"><div className="product-brand"><span className={selectedProduct.brand === 'LEAO' ? 'brand-dot leao-dot' : 'brand-dot'} />{selectedProduct.brand}</div><h2>{selectedProduct.model}</h2><strong className="modal-size">{selectedProduct.size}</strong><p>{selectedProduct.description}</p><div className="modal-price">{formatPrice(selectedProduct.price)} <small>per tyre · reference price</small></div><p className="modal-disclaimer"><BadgeCheck size={16} /> Please confirm current price and stock before purchase.</p><a className="button button-red" href={whatsappUrl(`Hi Topline, I would like to enquire about the ${selectedProduct.brand} ${selectedProduct.model} in ${selectedProduct.size}. Please confirm current price and stock.`)} target="_blank" rel="noreferrer">Enquire on WhatsApp <MessageCircle size={17} /></a></div></div></div>}
    </div>
  );
}

export default App;
