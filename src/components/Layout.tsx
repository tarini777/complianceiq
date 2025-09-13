/**
 * Layout Component - ComplianceIQ System
 * Professional layout with navigation and sidebar
 * Based on ALZQIMM professional standards
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSystemConfig } from '@/contexts/SystemConfigContext';
import { useSmartNavigation } from '@/lib/navigation/smartNavigation';
import { 
  Shield, 
  FileText, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  CheckCircle,
  TrendingUp,
  Zap,
  Brain,
  Users,
  Target,
  Bot,
  Network
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navigationContext, setNavigationContext] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { isCollaborationEnabled } = useSystemConfig();
  const { navigateWithContext, restoreContext, getCurrentContext } = useSmartNavigation();

  // Restore navigation context on component mount
  useEffect(() => {
    if (pathname) {
      const currentTab = getTabFromPath(pathname);
      const context = restoreContext(currentTab);
      setNavigationContext(context);
    }
  }, [pathname, restoreContext]);

  // Helper function to get tab name from path
  const getTabFromPath = (path: string): string => {
    if (path === '/') return 'dashboard';
    if (path.startsWith('/assessment')) return 'assessment';
    if (path.startsWith('/askrexi')) return 'askrexi';
    if (path.startsWith('/analytics')) return 'analytics';
    if (path.startsWith('/regulatory')) return 'regulatory';
    if (path.startsWith('/collaboration')) return 'collaboration';
    if (path.startsWith('/remediation')) return 'remediation';
    if (path.startsWith('/settings')) return 'settings';
    return 'dashboard';
  };

  // Enhanced navigation handler with context
  const handleNavigation = (href: string, fromTab: string) => {
    const toTab = getTabFromPath(href);
    
    // Create navigation context
    const context = {
      userId: 'current-user', // This would come from auth context
      assessmentId: getCurrentContext()?.assessmentId,
      currentProgress: getCurrentContext()?.currentProgress,
      sessionData: {
        currentPage: pathname || '/',
        timestamp: Date.now()
      }
    };

    // Navigate with context
    navigateWithContext(fromTab, toTab, context);
    
    // Close sidebar on mobile
    setSidebarOpen(false);
  };

  // Navigation items - always include Team Collaboration
  const navigation = [
    // 🧠 Core Brain Layer
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Regulatory Intelligence', href: '/regulatory', icon: Shield },
    { name: 'Compliance Mapping', href: '/compliance-mapping', icon: Network },
    { name: 'AskRexi Assistant', href: '/askrexi', icon: Bot },
    
    // 🎯 Assessment Layer  
    { name: 'Assessment Configuration', href: '/assessment', icon: FileText },
    { name: 'Team Collaboration', href: '/collaboration', icon: Users, disabled: !isCollaborationEnabled },
    { name: 'Complete Assessment', href: '/assessment-complete', icon: CheckCircle },
    
    // 📊 Intelligence & Action Layer
    { name: 'Analytics & Reporting', href: '/analytics', icon: TrendingUp },
    { name: 'Assessment Remediation Engine', href: '/insights', icon: Zap },
    { name: 'Remediation Command Center', href: '/remediation', icon: Target },
    
    // ⚙️ System
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href) || false;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-card shadow-xl">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-compliance-primary" />
              <span className="text-xl font-bold text-foreground">ComplianceIQ</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="mt-4 px-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isDisabled = (item as any).disabled;
              return (
                <Link
                  key={item.name}
                  href={isDisabled ? '#' : item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDisabled
                      ? 'text-muted-foreground cursor-not-allowed opacity-50'
                      : isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={(e) => {
                    if (isDisabled) {
                      e.preventDefault();
                    } else {
                      handleNavigation(item.href, getTabFromPath(pathname || '/'));
                    }
                  }}
                  title={isDisabled ? 'Team Collaboration is disabled in Settings' : undefined}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                  {isDisabled && <span className="text-xs text-muted-foreground ml-auto">(Disabled)</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-card border-r border-border">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-border">
            <Shield className="h-8 w-8 text-compliance-primary" />
            <span className="ml-2 text-xl font-bold text-foreground">ComplianceIQ</span>
            <Badge variant="outline" className="ml-2 text-xs">
              v1.0.0
            </Badge>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isDisabled = (item as any).disabled;
              return (
                <Link
                  key={item.name}
                  href={isDisabled ? '#' : item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDisabled
                      ? 'text-muted-foreground cursor-not-allowed opacity-50'
                      : isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={(e) => {
                    if (isDisabled) {
                      e.preventDefault();
                    } else {
                      handleNavigation(item.href, getTabFromPath(pathname || '/'));
                    }
                  }}
                  title={isDisabled ? 'Team Collaboration is disabled in Settings' : undefined}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                  {isDisabled && <span className="text-xs text-muted-foreground ml-auto">(Disabled)</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="text-xs text-compliance-500">
              <p>Pharmaceutical AI</p>
              <p>Readiness Assessment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 bg-background border-b border-border">
          <div className="flex items-center justify-between flex-1 px-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden lg:block">
                <h1 className="text-lg font-semibold text-foreground">
                  {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>System Healthy</span>
              </Badge>
              <Button variant="outline" size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Live Updates
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
