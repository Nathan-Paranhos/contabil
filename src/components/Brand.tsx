type BrandProps = {
  subtitle?: string;
};

export function Brand({
  subtitle = "Assessoria Contábil NEI",
}: BrandProps) {
  return (
    <>
      <span className="brand-mark" aria-hidden="true">
        <span className="brand-square">A</span>
        <span className="brand-square">C</span>
        <span className="brand-square">N</span>
      </span>
      <span className="brand-text">
        <span className="brand-title">ACN Contabilidade</span>
        <span className="brand-subtitle">{subtitle}</span>
      </span>
    </>
  );
}
