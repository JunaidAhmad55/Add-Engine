import { Button } from "@/components/ui/button";
import { Settings, LogOut, Bolt } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

interface UserData {
  name: string;
  role: string;
  avatarUrl: string | null;
}

interface HeaderProps {
  user: UserData;
  onLogout: () => void;
  onSettingsClick: () => void;
}

const Header = ({ user, onLogout, onSettingsClick }: HeaderProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="w-full bg-white border-b border-gray-200 dark:bg-gray-950 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 py-0.5 flex items-center justify-between h-[64px]">
        <div className="flex items-center space-x-2">
          <span className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg w-10 h-10 mr-2">
            <Bolt className="h-6 w-6 text-gray-900 dark:text-gray-100" />
          </span>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Engine Ads</h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg transition-all duration-200"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <div className="text-right hidden sm:block">
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>
          <Avatar>
            <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
            <AvatarFallback>
              {user.name ? user.name.split(' ').map(n => n[0]).join('') : ''}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsClick}
            className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:text-red-700 dark:hover:bg-red-900 rounded-lg transition-all duration-200"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
