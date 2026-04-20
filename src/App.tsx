import { AIChat } from './components/AIChat';
import { Bell, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function App() {
  return (
    <div className="flex h-[100dvh] bg-[#f9f9f9] text-[#1a1a1a] overflow-hidden flex-col">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-hsbc-red flex items-center justify-center">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-white rotate-180"></div>
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">HSBC Business</span>
          <span className="font-bold text-xl tracking-tight block sm:hidden">HSBC</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-hsbc-red">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs font-bold uppercase tracking-wider">AI 助手已啟動</span>
          </div>
          
          <Button variant="ghost" size="icon" className="relative group">
            <Bell className="w-5 h-5 text-gray-500 group-hover:text-hsbc-red transition-colors" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-hsbc-red rounded-full border-2 border-white"></span>
          </Button>
          
          <div className="h-8 w-[1px] bg-gray-200 mx-1"></div>
          
          <div className="flex items-center gap-2 px-2">
             <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs">
               JD
             </div>
             <span className="text-sm font-semibold hidden md:block">Joy Digital Ltd.</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        <AIChat />
      </main>
    </div>
  );
}
