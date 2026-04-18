import React, { createContext, useContext, useState, useEffect } from 'react';

type NavigationStyle = 'sidebar' | 'bottom-nav';

interface LayoutContextType {
  navigationStyle: NavigationStyle;
  setNavigationStyle: (style: NavigationStyle) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navigationStyle, setNavigationStyle] = useState<NavigationStyle>(() => {
    const saved = localStorage.getItem('nav-style');
    if (saved === 'sidebar' || saved === 'bottom-nav') return saved;
    // Default to bottom-nav on small screens, sidebar on large
    return window.innerWidth < 1024 ? 'bottom-nav' : 'sidebar';
  });

  useEffect(() => {
    localStorage.setItem('nav-style', navigationStyle);
  }, [navigationStyle]);

  return (
    <LayoutContext.Provider value={{ navigationStyle, setNavigationStyle }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error('useLayout must be used within LayoutProvider');
  return context;
};
