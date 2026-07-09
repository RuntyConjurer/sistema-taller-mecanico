function ModuleCard({ title, description }) {
  return (
    <article className="module-card">
      <div className="wire-card-line wire-card-line-short" aria-hidden="true"></div>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="wire-card-block" aria-hidden="true"></div>
    </article>
  )
}

export default ModuleCard
