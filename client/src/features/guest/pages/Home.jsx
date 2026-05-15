import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GUEST_ICONS } from "@/lib/icons/guest.icons";
const { ARROW_RIGHT: ArrowRight, SPARKLES: Sparkles } = GUEST_ICONS;
import { FEATURES, STATS } from "@/constant";

const Home = () => {
  return (
    <>
      {/* ── Hero Section ── */}
      <section className="container mx-auto px-6 py-20 lg:py-32 flex flex-col items-center justify-center text-center">
        <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            The smarter way to manage tasks
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Organize your work. <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-accent-foreground">
              Empower your life.
            </span>
          </h1>

          {/* Sub-heading */}
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
            TaskFlow is the ultimate workspace to track projects, manage tasks,
            and collaborate effortlessly. Stay productive and focused on what
            matters most.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/25 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30 group"
            >
              <Link to="/register">
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-lg rounded-full border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-muted hover:-translate-y-1"
            >
              <Link to="/login">Sign in to your account</Link>
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-20 w-full max-w-3xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-primary">
                  {value}
                </p>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="container mx-auto px-6 py-20 lg:py-28">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            <Sparkles size={14} />
            Features
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Everything you need to{" "}
            <span className="text-primary">stay productive</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Powerful tools designed to streamline your workflow and help your
            team deliver results faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {FEATURES.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className="group relative p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl shadow-black/5 transition-all hover:border-primary/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 text-primary transition-colors group-hover:bg-primary/20">
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">{title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="container mx-auto px-6 py-20 lg:py-28">
        <div className="relative mx-auto max-w-4xl rounded-3xl border border-primary/20 bg-linear-to-br from-primary/10 via-card/80 to-accent/10 p-12 md:p-16 text-center overflow-hidden">
          {/* Glow effect */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-primary/5 to-transparent" />

          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Ready to take control of your tasks?
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground text-lg">
              Join thousands of professionals who use TaskFlow to manage their
              work and boost productivity every day.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="h-13 px-8 text-base rounded-full shadow-xl shadow-primary/25 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30 group"
              >
                <Link to="/register">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-13 px-8 text-base rounded-full border-border/50 transition-all hover:bg-muted hover:-translate-y-1"
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
