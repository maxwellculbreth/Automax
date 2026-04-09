/**
 * MarketingShell — forces the dark Tailwind class on all public marketing pages.
 * This keeps the marketing site permanently dark regardless of the user's
 * authenticated-app theme preference. The app hub reads theme from ThemeProvider;
 * marketing pages bypass it entirely by wrapping in this shell.
 */
export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark">
      {children}
    </div>
  )
}
