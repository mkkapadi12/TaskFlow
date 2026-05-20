import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { FEATURES, STATS } from '@/constant';
import { GUEST_ICONS } from '@/lib/icons/guest.icons';

const Home = () => {
  return (
    <>
      {/* ── Hero Section ── */}
      <section className="container mx-auto flex flex-col items-center justify-center px-6 py-20 text-center lg:py-32">
        <div className="animate-in fade-in slide-in-from-bottom-8 fill-mode-both max-w-4xl space-y-8 duration-1000">
          {/* Badge */}
          <div className="border-primary/20 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
              <span className="bg-primary relative inline-flex h-2 w-2 rounded-full" />
            </span>
            The smarter way to manage tasks
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Organize your work. <br className="hidden sm:block" />
            <span className="from-primary to-accent-foreground bg-linear-to-r bg-clip-text text-transparent">
              Empower your life.
            </span>
          </h1>

          {/* Sub-heading */}
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed sm:text-xl">
            TaskFlow is the ultimate workspace to track projects, manage tasks,
            and collaborate effortlessly. Stay productive and focused on what
            matters most.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="shadow-primary/25 hover:shadow-primary/30 group h-14 w-full rounded-full px-8 text-lg shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl sm:w-auto"
            >
              <Link to="/register">
                Get Started for Free
                <GUEST_ICONS.ARROW_RIGHT className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border/50 bg-background/50 hover:bg-muted h-14 w-full rounded-full px-8 text-lg backdrop-blur-sm transition-all hover:-translate-y-1 sm:w-auto"
            >
              <Link to="/login">Sign in to your account</Link>
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="animate-in fade-in slide-in-from-bottom-12 fill-mode-both mt-20 w-full max-w-3xl delay-300 duration-1000">
          <div className="border-border/50 bg-card/50 grid grid-cols-2 gap-6 rounded-2xl border p-6 backdrop-blur-sm md:grid-cols-4">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-primary text-2xl font-bold sm:text-3xl">
                  {value}
                </p>
                <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="container mx-auto px-6 py-20 lg:py-28">
        <div className="animate-in fade-in slide-in-from-bottom-6 fill-mode-both mx-auto mb-16 max-w-2xl text-center duration-700">
          <div className="border-primary/20 bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <GUEST_ICONS.SPARKLES size={14} />
            Features
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Everything you need to{' '}
            <span className="text-primary">stay productive</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Powerful tools designed to streamline your workflow and help your
            team deliver results faster.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className="group border-border/50 bg-card/50 hover:border-primary/40 hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-8 fill-mode-both relative rounded-2xl border p-6 shadow-xl shadow-black/5 backdrop-blur-sm transition-all duration-700 hover:-translate-y-1 hover:shadow-2xl"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="bg-primary/10 text-primary group-hover:bg-primary/20 mb-5 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors">
                <Icon size={24} />
              </div>
              <h3 className="mb-2 text-lg font-bold">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="container mx-auto px-6 py-20 lg:py-28">
        <div className="border-primary/20 from-primary/10 via-card/80 to-accent/10 relative mx-auto max-w-4xl overflow-hidden rounded-3xl border bg-linear-to-br p-12 text-center md:p-16">
          {/* Glow effect */}
          <div className="from-primary/5 pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br to-transparent" />

          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Ready to take control of your tasks?
            </h2>
            <p className="text-muted-foreground mx-auto max-w-xl text-lg">
              Join thousands of professionals who use TaskFlow to manage their
              work and boost productivity every day.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="shadow-primary/25 hover:shadow-primary/30 group h-13 rounded-full px-8 text-base shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <Link to="/register">
                  Start Free Trial
                  <GUEST_ICONS.ARROW_RIGHT className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border/50 hover:bg-muted h-13 rounded-full px-8 text-base transition-all hover:-translate-y-1"
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
