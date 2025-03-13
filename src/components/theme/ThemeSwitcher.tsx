
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <span className="mr-2 h-4 w-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.5 0.75C7.91421 0.75 8.25 1.08579 8.25 1.5V2.25C8.25 2.66421 7.91421 3 7.5 3C7.08579 3 6.75 2.66421 6.75 2.25V1.5C6.75 1.08579 7.08579 0.75 7.5 0.75ZM7.5 12C7.91421 12 8.25 12.3358 8.25 12.75V13.5C8.25 13.9142 7.91421 14.25 7.5 14.25C7.08579 14.25 6.75 13.9142 6.75 13.5V12.75C6.75 12.3358 7.08579 12 7.5 12ZM14.25 7.5C14.25 7.91421 13.9142 8.25 13.5 8.25H12.75C12.3358 8.25 12 7.91421 12 7.5C12 7.08579 12.3358 6.75 12.75 6.75H13.5C13.9142 6.75 14.25 7.08579 14.25 7.5ZM3 7.5C3 7.91421 2.66421 8.25 2.25 8.25H1.5C1.08579 8.25 0.75 7.91421 0.75 7.5C0.75 7.08579 1.08579 6.75 1.5 6.75H2.25C2.66421 6.75 3 7.08579 3 7.5ZM12.4549 12.4549C12.1618 12.748 11.6881 12.748 11.3951 12.4549L10.8686 11.9284C10.5755 11.6354 10.5755 11.1617 10.8686 10.8686C11.1616 10.5756 11.6353 10.5756 11.9283 10.8686L12.4549 11.3951C12.7479 11.6882 12.7479 12.1618 12.4549 12.4549ZM4.1314 4.1314C3.83835 4.42444 3.36469 4.42444 3.07164 4.1314L2.54514 3.60489C2.2521 3.31185 2.2521 2.83819 2.54514 2.54514C2.83819 2.2521 3.31185 2.2521 3.60489 2.54514L4.1314 3.07164C4.42444 3.36469 4.42444 3.83835 4.1314 4.1314ZM12.4549 2.54514C12.748 2.83819 12.748 3.31185 12.4549 3.60489L11.9284 4.1314C11.6354 4.42444 11.1617 4.42444 10.8686 4.1314C10.5756 3.83835 10.5756 3.36469 10.8686 3.07164L11.3951 2.54514C11.6882 2.2521 12.1618 2.2521 12.4549 2.54514ZM4.1314 10.8686C4.42444 11.1617 4.42444 11.6353 4.1314 11.9283L3.60489 12.4549C3.31185 12.7479 2.83819 12.7479 2.54514 12.4549C2.2521 12.1618 2.2521 11.6882 2.54514 11.3951L3.07164 10.8686C3.36469 10.5756 3.83835 10.5756 4.1314 10.8686ZM7.5 4.5C5.84315 4.5 4.5 5.84315 4.5 7.5C4.5 9.15685 5.84315 10.5 7.5 10.5C9.15685 10.5 10.5 9.15685 10.5 7.5C10.5 5.84315 9.15685 4.5 7.5 4.5Z" fill="currentColor"></path>
            </svg>
          </span>
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
