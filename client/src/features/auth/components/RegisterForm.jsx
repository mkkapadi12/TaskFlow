import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useRegisterMutation } from "../auth.api";
import { registerSchema } from "@/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GUEST_ICONS } from "@/lib/icons/guest.icons";

const { USER: UserIcon, MAIL: Mail, SHIELD: Lock } = GUEST_ICONS;

const RegisterForm = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    try {
      await registerUser(data).unwrap();
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="register-name" className="text-sm font-medium">
          Full name
        </Label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="register-name"
            placeholder="John Doe"
            className="pl-10 h-11"
            {...register("name")}
          />
        </div>
        {errors.name && (
          <p className="text-xs text-destructive mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="register-email" className="text-sm font-medium">
          Email address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="register-email"
            type="email"
            placeholder="you@example.com"
            className="pl-10 h-11"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="register-password" className="text-sm font-medium">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="register-password"
            type="password"
            placeholder="Min. 6 characters"
            className="pl-10 h-11"
            {...register("password")}
          />
        </div>
        {errors.password && (
          <p className="text-xs text-destructive mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full h-11 text-sm font-semibold rounded-lg shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            Creating account…
          </span>
        ) : (
          "Create account"
        )}
      </Button>

      {/* Login link */}
      <p className="text-sm text-center text-muted-foreground pt-2">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;