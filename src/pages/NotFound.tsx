import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Log to the browser console for debugging; do not surface a misleading
    // "error" in production tooling since 404s are an expected user state.
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn(
        "404 — no route matched:",
        location.pathname + location.search,
      );
    }
  }, [location.pathname, location.search]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <SEO
        title="Page not found"
        description="The page you were looking for could not be found."
        path={location.pathname}
        noindex
      />
      <div className="text-center max-w-md">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          404 error
        </p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          We couldn't find{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">
            {location.pathname}
          </code>
          . It may have been moved, deleted, or you might have followed a
          broken link.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="min-h-[44px]">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" className="min-h-[44px]">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
