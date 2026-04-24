import { ReactNode } from "react";

export const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
}) => (
  <div className={`mb-16 ${align === "center" ? "text-center mx-auto" : ""} max-w-4xl`}>
    {eyebrow && <span className="pill-eyebrow mb-6">{eyebrow}</span>}
    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-4">{title}</h2>
    {description && (
      <p className={`mt-6 text-foreground/65 leading-relaxed text-base md:text-lg ${align === "center" ? "max-w-2xl mx-auto" : "max-w-2xl"}`}>
        {description}
      </p>
    )}
  </div>
);
