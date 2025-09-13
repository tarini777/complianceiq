'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SystemConfigItem {
  value: string;
  description?: string;
  category?: string;
}

interface SystemConfig {
  collaboration_enabled: SystemConfigItem;
  collaboration_require_roles: SystemConfigItem;
  assessment_mode: SystemConfigItem;
  default_organization: SystemConfigItem;
  max_team_size: SystemConfigItem;
  auto_save_interval: SystemConfigItem;
}

interface SystemConfigContextType {
  config: SystemConfig | null;
  loading: boolean;
  error: string | null;
  isCollaborationEnabled: boolean;
  refreshConfig: () => Promise<void>;
  updateConfig: (key: string, value: string) => Promise<boolean>;
}

const SystemConfigContext = createContext<SystemConfigContextType | undefined>(undefined);

interface SystemConfigProviderProps {
  children: ReactNode;
}

export const SystemConfigProvider: React.FC<SystemConfigProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading system config...');
      const response = await fetch(`/api/system-config?t=${Date.now()}`);
      const result = await response.json();
      
      console.log('System config response:', result);
      
      if (result.success) {
        setConfig(result.data);
        console.log('System config loaded:', result.data);
      } else {
        setError(result.error);
        console.error('System config error:', result.error);
      }
    } catch (err) {
      setError('Failed to load system configuration');
      console.error('Error loading system config:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshConfig = async () => {
    await loadConfig();
  };

  const updateConfig = async (key: string, value: string) => {
    try {
      console.log(`Updating config: ${key} = ${value}`);
      
      const response = await fetch('/api/system-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value }),
      });
      
      const result = await response.json();
      console.log('Update config response:', result);
      
      if (result.success) {
        console.log('Config updated successfully, refreshing...');
        // Small delay to ensure database update is processed
        await new Promise(resolve => setTimeout(resolve, 100));
        // Immediately refresh the config after successful update
        await refreshConfig();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating system config:', error);
      return false;
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const isCollaborationEnabled = config?.collaboration_enabled?.value === 'true';

  const value: SystemConfigContextType = {
    config,
    loading,
    error,
    isCollaborationEnabled,
    refreshConfig,
    updateConfig
  };

  return (
    <SystemConfigContext.Provider value={value}>
      {children}
    </SystemConfigContext.Provider>
  );
};

export const useSystemConfig = (): SystemConfigContextType => {
  const context = useContext(SystemConfigContext);
  if (context === undefined) {
    throw new Error('useSystemConfig must be used within a SystemConfigProvider');
  }
  return context;
};
