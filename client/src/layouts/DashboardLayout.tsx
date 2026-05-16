import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, LayoutDashboard, Users, Moon, Sun, Menu } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Leads', path: '/leads', icon: Users },
  ];

  return (
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-900 md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center px-6 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-bold tracking-tight text-brand-600 dark:text-brand-500">
            Smart Leads
          </h1>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 font-medium'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="mb-4 flex items-center space-x-3 px-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {user?.name}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {user?.role}
              </p>
            </div>
          </div>
          {user?.email === 'demo@servicehive.com' && (
            <div className="mb-4 mx-3 rounded-md bg-brand-50 px-2 py-1.5 text-center text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              Demo Workspace Active
            </div>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            onClick={logout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* TopBar */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80 md:px-6">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 md:hidden">
              Smart Leads
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
