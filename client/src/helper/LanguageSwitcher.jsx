import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getLanguage, LANGUAGES } from '@/i18n/languages';

const LanguageSwitcher = ({ compact = false }) => {
  const { i18n } = useTranslation();
  const current = getLanguage(i18n.language);

  const handleChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {compact ? (
          /* Icon-only mode for header (desktop) */
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 relative rounded-full transition-all"
            aria-label="Switch language"
          >
            <Globe className="h-[18px] w-[18px]" />
            {/* Active flag badge */}
            <span className="border-background absolute -right-0.5 -bottom-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border bg-transparent text-[8px] leading-none">
              {current.flag}
            </span>
          </Button>
        ) : (
          /* Full pill mode for mobile sheet */
          <Button
            variant="outline"
            className="border-border/50 bg-background/50 hover:bg-muted/50 h-9 gap-2 rounded-xl px-3 text-sm font-medium transition-all"
            aria-label="Switch language"
          >
            <Globe className="h-4 w-4" />
            <span className="text-base leading-none">{current.flag}</span>
            <span>{current.nativeName}</span>
          </Button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="bg-card/95 border-border/50 w-44 backdrop-blur-sm"
      >
        <DropdownMenuLabel className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Language
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/40" />
        {LANGUAGES.map((lang) => {
          const isActive = i18n.language === lang.code;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleChange(lang.code)}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                isActive
                  ? 'text-primary bg-primary/10 font-medium'
                  : 'text-foreground hover:bg-muted/50'
              }`}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              <div className="flex flex-col">
                <span>{lang.nativeName}</span>
                {lang.nativeName !== lang.name && (
                  <span className="text-muted-foreground text-[10px]">
                    {lang.name}
                  </span>
                )}
              </div>
              {isActive && (
                <span className="bg-primary ml-auto h-1.5 w-1.5 rounded-full" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
