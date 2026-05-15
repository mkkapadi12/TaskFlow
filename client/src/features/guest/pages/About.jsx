import { GUEST_ICONS } from "@/lib/icons/guest.icons";
const {
  TARGET: Target,
  HEART: Heart,
  LIGHTBULB: Lightbulb,
  USERS: Users,
  ROCKET: Rocket,
  SHIELD_CHECK: ShieldCheck,
} = GUEST_ICONS;

const VALUES = [
  {
    icon: Target,
    title: "Focused Simplicity",
    description:
      "We strip away complexity so you can focus on what truly matters — getting things done.",
  },
  {
    icon: Heart,
    title: "User First",
    description:
      "Every feature is built with empathy. We listen, iterate, and ship what our users need.",
  },
  {
    icon: Lightbulb,
    title: "Continuous Innovation",
    description:
      "We push boundaries to deliver cutting-edge tools that redefine task management.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Security",
    description:
      "Your data integrity and privacy are non-negotiable. We encrypt and protect everything.",
  },
  {
    icon: Rocket,
    title: "Performance Driven",
    description:
      "Speed is a feature. We obsess over milliseconds so your workflow is never interrupted.",
  },
  {
    icon: Users,
    title: "Community Powered",
    description:
      "Built by the community, for the community. Your feedback shapes our roadmap.",
  },
];

const TEAM = [
  {
    name: "Alex Rivera",
    role: "Founder & CEO",
    initials: "AR",
  },
  {
    name: "Sarah Chen",
    role: "Lead Designer",
    initials: "SC",
  },
  {
    name: "Marcus Johnson",
    role: "Full-Stack Engineer",
    initials: "MJ",
  },
  {
    name: "Priya Patel",
    role: "Product Manager",
    initials: "PP",
  },
];

const About = () => {
  return (
    <>
      {/* ── Mission Section ── */}
      <section className="container mx-auto px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
            <Target size={14} />
            Our Mission
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Making productivity{" "}
            <span className="text-primary">effortless</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground leading-relaxed sm:text-xl">
            TaskFlow was born from a simple idea: managing tasks shouldn't be a
            task itself. We believe in building tools that fade into the
            background, letting you focus on the work that matters.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { stat: "2023", label: "Founded" },
              { stat: "15+", label: "Team Members" },
              { stat: "50K+", label: "Happy Users" },
            ].map(({ stat, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6"
              >
                <p className="text-3xl font-bold text-primary">{stat}</p>
                <p className="mt-1 text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team Section ── */}
      <section className="container mx-auto px-6 py-20 lg:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14 animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            <Users size={14} />
            Our Team
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            The people behind <span className="text-primary">TaskFlow</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            A passionate crew of builders, designers, and thinkers dedicated to
            crafting the best task management experience.
          </p>
        </div>

        <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map(({ name, role, initials }, i) => (
            <div
              key={name}
              className="group flex flex-col items-center rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 text-center transition-all hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-both"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Avatar placeholder */}
              <div className="h-20 w-20 rounded-full bg-linear-to-br from-primary/20 to-accent/20 border-2 border-primary/30 flex items-center justify-center mb-4 transition-colors group-hover:border-primary/60">
                <span className="text-xl font-bold text-primary">
                  {initials}
                </span>
              </div>
              <h3 className="font-semibold text-base">{name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Values Section ── */}
      <section className="container mx-auto px-6 py-20 lg:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14 animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            <Heart size={14} />
            Our Values
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What drives <span className="text-primary">everything</span> we do
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            These core principles guide every decision we make, from product
            design to customer support.
          </p>
        </div>

        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALUES.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className="group p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
              style={{ animationDelay: `${i * 80}ms` }}
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
    </>
  );
};

export default About;
