import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GUEST_ICONS } from "@/lib/icons/guest.icons";
import { DASHBOARD_ICONS } from "@/lib/icons/dashboard.icons";
const { MESSAGE: MessageSquare, SEND: Send } = GUEST_ICONS;
const { LOADER2: Loader2 } = DASHBOARD_ICONS;
import { contactSchema } from "@/schemas/contact.schema";
import { INFO_CARDS } from "@/constant";

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (data) => {
    // Simulate a short delay
    await new Promise((r) => setTimeout(r, 800));

    toast.success("Message sent successfully!", {
      description: `Thanks ${data.name}, we'll get back to you at ${data.email} soon.`,
    });
    reset();
  };

  return (
    <>
      {/* ── Header ── */}
      <section className="container mx-auto px-6 pt-20 pb-10 lg:pt-28 lg:pb-14 text-center">
        <div className="mx-auto max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
            <MessageSquare size={14} />
            Get in Touch
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            We'd love to <span className="text-primary">hear from you</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Have a question, feedback, or just want to say hello? Fill out the
            form below and our team will get back to you promptly.
          </p>
        </div>
      </section>

      {/* ── Info Cards + Form ── */}
      <section className="container mx-auto px-6 pb-20 lg:pb-28">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left — Info cards */}
          <div className="lg:col-span-2 flex flex-col gap-4 animate-in fade-in slide-in-from-left-8 duration-700 fill-mode-both">
            {INFO_CARDS.map(({ icon: Icon, title, detail, description }, i) => (
              <div
                key={title}
                className="group flex items-start gap-4 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 transition-all duration-300 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="h-11 w-11 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-colors group-hover:bg-primary/20">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-primary text-sm font-medium mt-0.5">
                    {detail}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — Contact form */}
          <div className="lg:col-span-3 animate-in fade-in slide-in-from-right-8 duration-700 delay-100 fill-mode-both">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 md:p-10 space-y-6"
            >
              <div className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    aria-invalid={!!errors.name}
                    className="h-11"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    aria-invalid={!!errors.email}
                    className="h-11"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help..."
                    rows={5}
                    aria-invalid={!!errors.message}
                    className="resize-none"
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="w-full h-12 rounded-xl text-base shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
