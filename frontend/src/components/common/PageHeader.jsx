function PageHeader({ title, description, eyebrow }) {
  return (
    <header className="page-header">
      <div>
        {eyebrow ? <span className="page-eyebrow">{eyebrow}</span> : null}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <span className="wire-status">Placeholder</span>
    </header>
  )
}

export default PageHeader
