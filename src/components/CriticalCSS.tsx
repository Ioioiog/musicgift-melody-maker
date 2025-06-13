
/* Critical CSS for above-the-fold content */
export const criticalStyles = `
  /* Reset and base styles */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  }
  
  body {
    background: linear-gradient(135deg, #581c87 0%, #1e3a8a 50%, #312e81 100%);
    color: white;
    min-height: 100vh;
  }
  
  /* Navigation critical styles */
  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(12px);
  }
  
  /* Hero section critical styles */
  .hero-section {
    padding-top: 4rem;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .hero-background {
    position: absolute;
    inset: 0;
    background-image: url('/lovable-uploads/9d0d10ef-2340-4632-8df0-f5058547a0c9.png');
    background-size: cover;
    background-position: center;
    opacity: 0.3;
  }
  
  .hero-content {
    position: relative;
    z-index: 10;
    text-align: center;
    max-width: 72rem;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .hero-title {
    font-size: clamp(2rem, 8vw, 4rem);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 1.5rem;
  }
  
  .hero-subtitle {
    font-size: clamp(1rem, 4vw, 1.5rem);
    opacity: 0.9;
    margin-bottom: 2rem;
    max-width: 48rem;
    margin-left: auto;
    margin-right: auto;
  }
  
  .cta-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: center;
  }
  
  @media (min-width: 640px) {
    .cta-buttons {
      flex-direction: row;
    }
  }
  
  .btn-primary {
    background: #f97316;
    color: white;
    padding: 0.75rem 2rem;
    border-radius: 9999px;
    font-weight: 600;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    min-width: 180px;
    justify-content: center;
  }
  
  .btn-primary:hover {
    background: #ea580c;
    transform: translateY(-2px);
  }
  
  .btn-secondary {
    border: 2px solid rgba(255, 255, 255, 0.6);
    color: white;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.75rem 2rem;
    border-radius: 9999px;
    font-weight: 600;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(4px);
    min-width: 180px;
    justify-content: center;
  }
  
  .btn-secondary:hover {
    border-color: white;
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  /* Performance optimizations */
  .will-change-transform {
    will-change: transform;
  }
  
  .hardware-acceleration {
    transform: translate3d(0, 0, 0);
  }
`;
