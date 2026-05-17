import { useMemo } from "react";
import { useTheme } from "next-themes";
import type { CSSProperties } from "react";

/**
 * Theme-aware Recharts chrome.
 *
 * Recharts ships hardcoded defaults for tooltip backgrounds (white), tooltip
 * text (near-black), and CartesianGrid strokes (#ccc). On dark mode that
 * produces a glaring white tooltip floating over a near-black dashboard, and
 * grid lines that vanish into the background. This hook subscribes to
 * `next-themes` and returns matching `contentStyle` / `itemStyle` /
 * `labelStyle` / grid stroke / axis tick colors so every chart picks up the
 * active theme without any `.dark` overrides scattered through the JSX.
 *
 * The category and status palettes are kept theme-stable on purpose — the
 * HSL values are already high-contrast against both backgrounds, and rotating
 * them on theme change would make screenshots/exports jump.
 */
export function useChartTheme() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return useMemo(() => {
    const tooltipContentStyle: CSSProperties = {
      borderRadius: "8px",
      border: `1px solid hsl(var(--border))`,
      background: `hsl(var(--popover))`,
      color: `hsl(var(--popover-foreground))`,
      boxShadow: isDark
        ? "0 8px 24px rgba(0,0,0,0.55)"
        : "0 4px 12px rgba(0,0,0,0.1)",
      // Recharts paints contentStyle but its DefaultTooltipContent injects
      // inline color styling on each item & the label as well, so we
      // override those below — but we still set color here for browser
      // tooltips that don't go through the formatter.
      fontSize: "12px",
    };

    const tooltipItemStyle: CSSProperties = {
      color: `hsl(var(--popover-foreground))`,
    };

    const tooltipLabelStyle: CSSProperties = {
      color: `hsl(var(--popover-foreground))`,
      fontWeight: 600,
    };

    // Stroke for CartesianGrid + axis lines. Using --border keeps the
    // separator hierarchy consistent with the rest of the UI.
    const gridStroke = `hsl(var(--border))`;
    const axisTickColor = `hsl(var(--muted-foreground))`;

    // High-contrast category palette. Keep stable across themes so exports
    // and screenshots line up.
    const categoryPalette: readonly string[] = [
      "hsl(152, 57%, 42%)",
      "hsl(221, 83%, 53%)",
      "hsl(38, 92%, 50%)",
      "hsl(0, 84%, 60%)",
      "hsl(199, 89%, 48%)",
      "hsl(280, 67%, 55%)",
      "hsl(330, 65%, 50%)",
    ];

    // Status palette mirrors STATUS_CONFIG semantics. Keep keys stable.
    const statusPalette: Record<string, string> = {
      draft: "hsl(215, 16%, 47%)",
      submitted: "hsl(221, 83%, 53%)",
      manager_approved: "hsl(38, 92%, 50%)",
      approved: "hsl(152, 57%, 42%)",
      rejected: "hsl(0, 84%, 60%)",
      reimbursed: "hsl(199, 89%, 48%)",
    };

    return {
      isDark,
      tooltipContentStyle,
      tooltipItemStyle,
      tooltipLabelStyle,
      gridStroke,
      axisTickColor,
      categoryPalette,
      statusPalette,
    };
  }, [isDark]);
}

export default useChartTheme;
