import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Landing.css";

const HERO_VIDEO = "/30870-382770842.mp4";

const ASSET_LOADERS = {
  lisbon: () => import("../assets/lisbon.jpg"),
  rome: () => import("../assets/rome.jpg"),
  activities: () => import("../assets/activities.jpg"),
  restaurant: () => import("../assets/restaurant.jpg"),
  cinema: () => import("../assets/cinema.jpg"),
  tours: () => import("../assets/tours.jpg"),
};

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function useLazyAsset(key, enabled) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (!enabled) return undefined;
    let cancelled = false;
    const loader = ASSET_LOADERS[key];
    if (!loader) return undefined;

    loader().then((mod) => {
      if (!cancelled) setSrc(mod.default);
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, key]);

  return src;
}

function LazyBg({ asset, className, children, enabled }) {
  const src = useLazyAsset(asset, enabled);
  return (
    <div
      className={`${className}${src ? " has-image" : ""}`}
      style={src ? { backgroundImage: `url(${src})` } : undefined}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [navSolid, setNavSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [loadBelowFold, setLoadBelowFold] = useState(false);
  const belowFoldRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;

    const nodes = document.querySelectorAll(".lp-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = belowFoldRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setLoadBelowFold(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="lp">
      <a className="lp-skip" href="#main">
        Skip to content
      </a>

      <header className={`lp-nav ${navSolid ? "is-solid" : ""}`}>
        <div className="lp-nav-inner">
          <a
            href="#top"
            className="lp-brand"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              closeMenu();
            }}
          >
            <span className="lp-brand-mark" aria-hidden="true">
              <i className="fas fa-plane" />
            </span>
            <span className="lp-brand-text">Traveler</span>
          </a>

          <nav className={`lp-nav-links ${menuOpen ? "is-open" : ""}`} aria-label="Landing">
            <button type="button" onClick={() => { scrollToId("features"); closeMenu(); }}>
              Features
            </button>
            <button type="button" onClick={() => { scrollToId("how-it-works"); closeMenu(); }}>
              How it works
            </button>
            <button type="button" onClick={() => { scrollToId("preview"); closeMenu(); }}>
              Explore
            </button>
            <Link to="/app" className="lp-nav-cta lp-nav-cta--mobile" onClick={closeMenu}>
              Open Traveler
            </Link>
          </nav>

          <div className="lp-nav-actions">
            <Link to="/app" className="lp-nav-cta">
              Open Traveler
            </Link>
            <button
              type="button"
              className="lp-menu-btn"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        <section className="lp-hero" id="top">
          <div className="lp-hero-media" aria-hidden="true">
            <video
              className={`lp-hero-video ${videoReady ? "is-ready" : ""}`}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onLoadedData={() => setVideoReady(true)}
              onCanPlay={() => setVideoReady(true)}
            >
              <source src={HERO_VIDEO} type="video/mp4" />
            </video>
            <div className="lp-hero-overlay" />
          </div>

          <div className="lp-hero-content">
            <p className="lp-hero-brand">Traveler</p>
            <h1>Plan it. Book it. Live it.</h1>
            <p className="lp-hero-lead">Your entire journey, organized in one place.</p>
            <p className="lp-hero-sub">From the first idea to the final reservation.</p>
            <div className="lp-hero-actions">
              <Link to="/app" className="lp-btn lp-btn-primary">
                Start planning
              </Link>
              <button
                type="button"
                className="lp-btn lp-btn-ghost"
                onClick={() => scrollToId("preview")}
              >
                Explore Traveler
              </button>
            </div>
          </div>
        </section>

        <section className="lp-intro lp-reveal" id="about" ref={belowFoldRef}>
          <div className="lp-wrap lp-intro-inner">
            <h2>Your trip, without the chaos.</h2>
            <p>
              Plans, reservations, places and expenses usually end up scattered across different
              apps. Traveler brings them together into one simple travel workspace.
            </p>
          </div>
        </section>

        <section className="lp-preview lp-reveal" id="preview">
          <div className="lp-wrap">
            <div className="lp-section-head">
              <h2>Everything you need for the journey ahead.</h2>
              <p>A personal trip command center — itinerary, map, budget, and bookings in sync.</p>
            </div>

            <div className="lp-browser">
              <div className="lp-browser-chrome" aria-hidden="true">
                <span />
                <span />
                <span />
                <div className="lp-browser-url">traveler.app / overview</div>
              </div>
              <div className="lp-browser-screen">
                <div className="lp-dash-mock">
                  <aside className="lp-dash-side">
                    <div className="lp-dash-brand">Traveler</div>
                    <span>Overview</span>
                    <span>Itinerary</span>
                    <span>Map</span>
                    <span>Bookings</span>
                    <span>Budget</span>
                  </aside>
                  <div className="lp-dash-main">
                    <LazyBg
                      className="lp-dash-hero"
                      enabled={loadBelowFold}
                      asset="lisbon"
                    >
                      <div>
                        <small>Active trip</small>
                        <strong>Lisbon Escape</strong>
                        <em>12 days · countdown live</em>
                      </div>
                    </LazyBg>
                    <div className="lp-dash-grid">
                      <div className="lp-dash-card">
                        <small>Budget</small>
                        <strong>€1,240 / €2,000</strong>
                        <div className="lp-dash-bar">
                          <span style={{ width: "62%" }} />
                        </div>
                      </div>
                      <div className="lp-dash-card">
                        <small>Next up</small>
                        <strong>Alfama evening</strong>
                        <em>Today · 19:30</em>
                      </div>
                      <div className="lp-dash-card">
                        <small>Bookings</small>
                        <strong>3 confirmed</strong>
                        <em>Table · Tour · Cinema</em>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="lp-features" id="features">
          <article className="lp-exp lp-reveal">
            <div className="lp-wrap lp-exp-grid">
              <div className="lp-exp-copy">
                <p className="lp-kicker">01 — Plan</p>
                <h2>Build your journey.</h2>
                <p>
                  Shape each day with places that matter, then see them unfold on an interactive
                  trip map.
                </p>
                <ul>
                  <li>Day-by-day itinerary</li>
                  <li>Saved places</li>
                  <li>Interactive trip map</li>
                  <li>Accommodation and transport</li>
                  <li>Travel checklist</li>
                </ul>
                <Link to="/app" className="lp-text-link">
                  Open the command center <i className="fas fa-arrow-right" aria-hidden="true" />
                </Link>
              </div>
              <div className="lp-exp-visual">
                <LazyBg
                  className="lp-frame lp-frame--tall"
                  enabled={loadBelowFold}
                  asset="rome"
                >
                  <div className="lp-frame-panel">
                    <span>Day 2</span>
                    <strong>Colosseum & Forum</strong>
                    <em>09:30 · Map pinned</em>
                  </div>
                </LazyBg>
                <LazyBg
                  className="lp-frame lp-frame--offset"
                  enabled={loadBelowFold}
                  asset="activities"
                >
                  <div className="lp-frame-panel">
                    <span>Checklist</span>
                    <strong>Travel readiness</strong>
                    <em>Packing · Documents · Tickets</em>
                  </div>
                </LazyBg>
              </div>
            </div>
          </article>

          <article className="lp-exp lp-exp--alt lp-reveal">
            <div className="lp-wrap lp-exp-grid">
              <div className="lp-exp-visual">
                <div className="lp-book-stack">
                  <LazyBg
                    className="lp-book-tile"
                    enabled={loadBelowFold}
                    asset="restaurant"
                  >
                    <span>Restaurant</span>
                    <strong>Floor plan tables</strong>
                  </LazyBg>
                  <LazyBg
                    className="lp-book-tile"
                    enabled={loadBelowFold}
                    asset="cinema"
                  >
                    <span>Cinema</span>
                    <strong>Interactive seats</strong>
                  </LazyBg>
                  <LazyBg
                    className="lp-book-tile"
                    enabled={loadBelowFold}
                    asset="tours"
                  >
                    <span>Tours</span>
                    <strong>Date · time · language</strong>
                  </LazyBg>
                </div>
              </div>
              <div className="lp-exp-copy">
                <p className="lp-kicker">02 — Book</p>
                <h2>Booking, made visual.</h2>
                <p>
                  Simulate the moments that usually feel abstract — choosing a table, a seat, or a
                  tour slot — then keep them connected to your trip.
                </p>
                <ul>
                  <li>
                    <strong>Restaurant:</strong> choose a table from the floor plan
                  </li>
                  <li>
                    <strong>Cinema:</strong> pick seats from an interactive layout
                  </li>
                  <li>
                    <strong>Tours:</strong> set activity, date, time, language and participants
                  </li>
                </ul>
                <p className="lp-note">
                  Booking experiences are simulated for demonstration purposes.
                </p>
              </div>
            </div>
          </article>

          <article className="lp-exp lp-reveal">
            <div className="lp-wrap lp-exp-grid">
              <div className="lp-exp-copy">
                <p className="lp-kicker">03 — Stay in control</p>
                <h2>Know where your trip stands.</h2>
                <p>
                  See readiness, spend, and what’s next — without opening five different tabs.
                </p>
                <ul>
                  <li>Budget tracking</li>
                  <li>Travel readiness</li>
                  <li>Upcoming bookings</li>
                  <li>Itinerary progress</li>
                  <li>Trip countdown</li>
                </ul>
                <Link to="/budget" className="lp-text-link">
                  View budget tools <i className="fas fa-arrow-right" aria-hidden="true" />
                </Link>
              </div>
              <div className="lp-exp-visual">
                <div className="lp-control-card">
                  <div className="lp-control-row">
                    <span>Trip countdown</span>
                    <strong>18 days</strong>
                  </div>
                  <div className="lp-control-row">
                    <span>Budget used</span>
                    <strong>62%</strong>
                  </div>
                  <div className="lp-dash-bar">
                    <span style={{ width: "62%" }} />
                  </div>
                  <div className="lp-control-row">
                    <span>Readiness</span>
                    <strong>74%</strong>
                  </div>
                  <div className="lp-control-list">
                    <em>Confirmed · Table for 2</em>
                    <em>Planned · Belém walk</em>
                    <em>Suggested · Evening cinema</em>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>

        <ShowcaseSection enabled={loadBelowFold} />

        <section className="lp-steps lp-reveal" id="how-it-works">
          <div className="lp-wrap">
            <div className="lp-section-head">
              <h2>How it works</h2>
              <p>Three calm steps from idea to journey.</p>
            </div>
            <ol className="lp-steps-list">
              <li>
                <span>01</span>
                <strong>Create your trip</strong>
                <p>Set destination, dates, and the details that matter.</p>
              </li>
              <li>
                <span>02</span>
                <strong>Plan and book</strong>
                <p>Build the itinerary and try restaurant, cinema, and tour simulations.</p>
              </li>
              <li>
                <span>03</span>
                <strong>Travel with clarity</strong>
                <p>Keep bookings, budget, and readiness in one calm view.</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="lp-final lp-reveal">
          <div className="lp-wrap lp-final-inner">
            <h2>Ready when you are.</h2>
            <p>Open Traveler and turn scattered plans into one clear journey.</p>
            <Link to="/app" className="lp-btn lp-btn-primary">
              Open Traveler
            </Link>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-wrap lp-footer-inner">
          <span>Traveler</span>
          <span>Demo booking experiences · Built for the journey</span>
        </div>
      </footer>
    </div>
  );
}

function ShowcaseSection({ enabled }) {
  const restaurantImg = useLazyAsset("restaurant", enabled);
  const cinemaImg = useLazyAsset("cinema", enabled);
  const toursImg = useLazyAsset("tours", enabled);

  return (
    <section className="lp-showcase lp-reveal" id="explore">
      <div className="lp-wrap">
        <div className="lp-section-head">
          <h2>More than a travel checklist.</h2>
          <p>Explore interactive booking experiences built directly into your trip.</p>
        </div>
        <div className="lp-showcase-grid">
          <Link to="/restaurants" className="lp-showcase-card">
            {restaurantImg ? (
              <img src={restaurantImg} alt="" loading="lazy" decoding="async" />
            ) : (
              <div className="lp-showcase-placeholder" aria-hidden="true" />
            )}
            <div>
              <span>Restaurant</span>
              <strong>Pick your table.</strong>
            </div>
          </Link>
          <Link to="/entertainment/cinemas" className="lp-showcase-card">
            {cinemaImg ? (
              <img src={cinemaImg} alt="" loading="lazy" decoding="async" />
            ) : (
              <div className="lp-showcase-placeholder" aria-hidden="true" />
            )}
            <div>
              <span>Cinema</span>
              <strong>Choose your seat.</strong>
            </div>
          </Link>
          <Link to="/activities/tours" className="lp-showcase-card">
            {toursImg ? (
              <img src={toursImg} alt="" loading="lazy" decoding="async" />
            ) : (
              <div className="lp-showcase-placeholder" aria-hidden="true" />
            )}
            <div>
              <span>Tours</span>
              <strong>Find the experience that fits you.</strong>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
