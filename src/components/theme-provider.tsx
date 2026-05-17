import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps, ReactNode } from "react";

type Props = ComponentProps<typeof NextThemesProvider> & { children: ReactNode };

/**
 * Thin wrapper around next-themes that applies the `class` strategy our
 * Tailwind config expects (`darkMode: ["class"]`) and defaults to system
 * preference. Lives here so the rest of the app can stay decoupled from the
 * library import path.
 */
export function ThemeProvider({ children, ...props }: Props) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

export default ThemeProvider;
