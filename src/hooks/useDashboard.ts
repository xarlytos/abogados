import { useState, useEffect } from 'react';
import { tasks as initialTasks } from '@/data/dashboardData';

export function useDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [taskList, setTaskList] = useState(initialTasks as Array<{ id: number; title: string; completed: boolean; priority: 'high' | 'medium' | 'low'; dueDate: string; case: string }>);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // En desktop (no móvil), sidebar abierta por defecto
      // En móvil, sidebar cerrada por defecto
      if (!mobile) {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Keyboard shortcut: Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
      }
      if (e.key === 'Escape') {
        setShowSearchModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTask = (id: number) => {
    setTaskList(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return {
    sidebarOpen,
    setSidebarOpen,
    isMobile,
    showSearchModal,
    setShowSearchModal,
    taskList,
    toggleTask,
  };
}
