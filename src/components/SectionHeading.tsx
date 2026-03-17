type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  const classes = ["section-head", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      {description ? <p className="section-lead">{description}</p> : null}
    </div>
  );
}
