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

  // Navigation items - organized for better UX
  const navigation = [
    // 🏠 Main Navigation
    { name: 'Dashboard', href: '/', icon: BarChart3, badge: 'Overview' },
    
    // 🧠 Core Features
    { name: 'Start Assessment', href: '/assessment', icon: FileText, badge: 'Primary', highlight: true },
    { name: 'Ask AskRexi', href: '/askrexi', icon: Bot, badge: 'AI Assistant' },
    
    // 📊 Intelligence & Analytics
    { name: 'Analytics', href: '/analytics', icon: TrendingUp, badge: 'Insights' },
    { name: 'Regulatory Intel', href: '/regulatory', icon: Shield, badge: 'Live Data' },
    
    // 🤝 Collaboration & Team
    { name: 'Team Collaboration', href: '/collaboration', icon: Users, disabled: !isCollaborationEnabled, badge: 'Team' },
    
    // 🔧 Advanced Features
    { name: 'Assessment Results', href: '/assessment-complete', icon: CheckCircle, badge: 'Results' },
    { name: 'Remediation Center', href: '/remediation', icon: Target, badge: 'Action Plan' },
    { name: 'Compliance Mapping', href: '/compliance-mapping', icon: Network, badge: 'Mapping' },
    
    // ⚙️ System
    { name: 'Settings', href: '/settings', icon: Settings, badge: 'Config' },
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
              const isHighlighted = (item as any).highlight;
              const badge = (item as any).badge;
              return (
                <Link
                  key={item.name}
                  href={isDisabled ? '#' : item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isDisabled
                      ? 'text-muted-foreground cursor-not-allowed opacity-50'
                      : isActive(item.href)
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : isHighlighted
                      ? 'text-primary hover:bg-primary/10 hover:shadow-sm border border-primary/20'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm'
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
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${isHighlighted ? 'text-primary' : ''}`} />
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {badge && (
                      <Badge 
                        variant={isHighlighted ? "default" : "secondary"} 
                        className={`text-xs ${
                          isHighlighted ? 'bg-primary text-primary-foreground' : ''
                        }`}
                      >
                        {badge}
                      </Badge>
                    )}
                    {isDisabled && <span className="text-xs text-muted-foreground">(Disabled)</span>}
                  </div>
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
              const isHighlighted = (item as any).highlight;
              const badge = (item as any).badge;
              return (
                <Link
                  key={item.name}
                  href={isDisabled ? '#' : item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isDisabled
                      ? 'text-muted-foreground cursor-not-allowed opacity-50'
                      : isActive(item.href)
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : isHighlighted
                      ? 'text-primary hover:bg-primary/10 hover:shadow-sm border border-primary/20'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm'
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
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${isHighlighted ? 'text-primary' : ''}`} />
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {badge && (
                      <Badge 
                        variant={isHighlighted ? "default" : "secondary"} 
                        className={`text-xs ${
                          isHighlighted ? 'bg-primary text-primary-foreground' : ''
                        }`}
                      >
                        {badge}
                      </Badge>
                    )}
                    {isDisabled && <span className="text-xs text-muted-foreground">(Disabled)</span>}
                  </div>
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
              <div className="flex items-center space-x-3">
                <div className="lg:hidden flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="font-bold text-lg">ComplianceIQ</span>
                </div>
                <div className="hidden lg:block">
                  <h1 className="text-lg font-semibold text-foreground">
                    {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
                  </h1>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <Badge variant="outline" className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="hidden sm:inline">System Healthy</span>
                </Badge>
              </div>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Zap className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Live Updates</span>
              </Button>
              <Button variant="outline" size="sm" className="sm:hidden">
                <Zap className="h-4 w-4" />
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
