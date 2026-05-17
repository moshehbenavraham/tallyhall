import { useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { SkipLink } from '@/components/SkipLink';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // Protected app routes should never be indexed; if a crawler somehow
  // reaches one (e.g. via a leaked link), tell it to drop the page.
  useEffect(() => {
    let meta = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    const prev = meta.getAttribute('content');
    meta.setAttribute('content', 'noindex, nofollow');
    return () => {
      if (prev !== null) meta!.setAttribute('content', prev);
    };
  }, []);

  return (
    <SidebarProvider>
      <SkipLink />
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 sm:h-14 flex items-center border-b px-3 sm:px-4 bg-card">
            <SidebarTrigger className="mr-3 sm:mr-4" aria-label="Toggle sidebar" />
            <h2 className="text-base sm:text-lg font-semibold text-foreground">ExpenseDesk</h2>
          </header>
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto focus:outline-none"
          >
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
