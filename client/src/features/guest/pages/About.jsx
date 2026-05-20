
import { TEAM, VALUES } from '@/constant';
import { GUEST_ICONS } from '@/lib/icons/guest.icons';

const About = () => {
  return (
    <>
      {/* ── Mission Section ── */}
      <section className="container mx-auto px-6 py-20 lg:py-28">
        <div className="animate-in fade-in slide-in-from-bottom-8 fill-mode-both mx-auto max-w-3xl text-center duration-1000">
          <div className="border-primary/20 bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <GUEST_ICONS.TARGET size={14} />
            Our Mission
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Making productivity <span className="text-primary">effortless</span>
          </h1>

          <p className="text-muted-foreground mt-6 text-lg leading-relaxed sm:text-xl">
            TaskFlow was born from a simple idea: managing tasks shouldn't be a
            task itself. We believe in building tools that fade into the
            background, letting you focus on the work that matters.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { stat: '2023', label: 'Founded' },
              { stat: '15+', label: 'Team Members' },
              { stat: '50K+', label: 'Happy Users' },
            ].map(({ stat, label }) => (
              <div
                key={label}
                className="border-border/50 bg-card/50 rounded-2xl border p-6 backdrop-blur-sm"
              >
                <p className="text-primary text-3xl font-bold">{stat}</p>
                <p className="text-muted-foreground mt-1 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team Section ── */}
      <section className="container mx-auto px-6 py-20 lg:py-28">
        <div className="animate-in fade-in slide-in-from-bottom-6 fill-mode-both mx-auto mb-14 max-w-2xl text-center duration-700">
          <div className="border-primary/20 bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <GUEST_ICONS.USERS size={14} />
            Our Team
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            The people behind <span className="text-primary">TaskFlow</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            A passionate crew of builders, designers, and thinkers dedicated to
            crafting the best task management experience.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map(({ name, role, initials }, i) => (
            <div
              key={name}
              className="group border-border/50 bg-card/50 hover:border-primary/40 hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-8 fill-mode-both flex flex-col items-center rounded-2xl border p-6 text-center backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Avatar placeholder */}
              <div className="from-primary/20 to-accent/20 border-primary/30 group-hover:border-primary/60 mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 bg-linear-to-br transition-colors">
                <span className="text-primary text-xl font-bold">
                  {initials}
                </span>
              </div>
              <h3 className="text-base font-semibold">{name}</h3>
              <p className="text-muted-foreground mt-1 text-sm">{role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Values Section ── */}
      <section className="container mx-auto px-6 py-20 lg:py-28">
        <div className="animate-in fade-in slide-in-from-bottom-6 fill-mode-both mx-auto mb-14 max-w-2xl text-center duration-700">
          <div className="border-primary/20 bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <GUEST_ICONS.HEART size={14} />
            Our Values
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What drives <span className="text-primary">everything</span> we do
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            These core principles guide every decision we make, from product
            design to customer support.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className="group border-border/50 bg-card/50 hover:border-primary/40 hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-8 fill-mode-both rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ animationDelay: `${i * 80}ms` }}
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
    </>
  );
};

export default About;
