import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '../ui/Button';

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Preview', href: '#preview' },
    { label: 'How It Works', href: '#how-it-works' },
  ];

  const handleScrollClick = (href: string) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-[#27272A] bg-white/80 dark:bg-[#09090B]/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-8 w-8 items-center justify-center shrink-0">
            <img
              src="/icon.png?v=2"
              alt="LifeOS Logo"
              className="h-8 w-8 rounded-lg object-cover shadow-xs transition-transform duration-200 group-hover:scale-105"
            />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              LifeOS
              <span className="text-[10px] font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-1.5 py-0.2 rounded border border-orange-200/50 dark:border-orange-800/40">
                1.0
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Anchor Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={location.pathname === '/' ? item.href : `/${item.href}`}
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  handleScrollClick(item.href);
                }
              }}
              className="text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors duration-150"
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/design-system"
            className="text-xs font-medium text-zinc-500 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400 transition-colors duration-150"
          >
            Design System
          </Link>
        </nav>

        {/* Right CTA / Controls */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-xs font-medium">
              Log In
            </Button>
          </Link>
          <Link to="/signup">
            <Button
              variant="primary"
              size="sm"
              className="text-xs font-medium gap-1.5"
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2.5">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={location.pathname === '/' ? item.href : `/${item.href}`}
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    handleScrollClick(item.href);
                  }
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-zinc-100 dark:hover:bg-zinc-900"
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/design-system"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              Design System Spec
            </Link>
          </div>

          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" className="w-full text-xs">
                Log In
              </Button>
            </Link>
            <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full text-xs">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

