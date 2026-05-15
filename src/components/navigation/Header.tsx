import React from 'react';
import { Bell, MessageCircle } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
  rightAction?: React.ReactNode;
  onAIPress?: () => void;
  notificationCount?: number;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showLogo = false,
  rightAction,
  onAIPress,
  notificationCount = 2,
}) => {
  return (
    <div className="flex items-center justify-between px-5 pt-12 pb-2">
      {showLogo ? (
        <span className="text-[22px] font-black tracking-[-0.5px] text-white">PRVNT</span>
      ) : (
        <span className="text-[22px] font-bold text-white tracking-tight">{title}</span>
      )}
      <div className="flex items-center gap-2">
        {rightAction}
        <button
          onClick={onAIPress}
          className="w-9 h-9 rounded-full flex items-center justify-center relative"
          style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}
        >
          <MessageCircle size={17} color="#818CF8" />
        </button>
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center relative"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <Bell size={17} color="rgba(255,255,255,0.6)" />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose text-white text-[9px] flex items-center justify-center font-bold">
              {notificationCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Header;
