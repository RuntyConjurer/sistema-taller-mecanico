function PageHeader({ title, description, eyebrow }) {
  return (
    <header className="page-header">
      {eyebrow ? <span className="page-eyebrow">{eyebrow}</span> : null}
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  )
}

export default PageHeader
