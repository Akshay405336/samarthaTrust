import * as React from "react";
import {
  GraduationCap,
  HeartPulse,
  Users,
  Sprout,
  BookOpen,
  HandHeart,
  TreePine,
  Building,
  Briefcase,
  ShieldCheck,
  Award,
  Sparkles,
  type LucideProps,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  GraduationCap,
  HeartPulse,
  Users,
  Sprout,
  BookOpen,
  HandHeart,
  TreePine,
  Building,
  Briefcase,
  ShieldCheck,
  Award,
  Sparkles,
};

interface WorkIconProps extends Omit<LucideProps, "name"> {
  name?: string | null;
}

export function WorkIcon({ name, ...props }: WorkIconProps) {
  const Component = (name && ICON_MAP[name]) || GraduationCap;
  return <Component {...props} />;
}
