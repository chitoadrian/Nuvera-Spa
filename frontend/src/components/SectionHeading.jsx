export default function SectionHeading({ eyebrow, title, description, align = 'center' }) {
  return (
    <header className={`section-heading section-heading--${align}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </header>
  )
}

