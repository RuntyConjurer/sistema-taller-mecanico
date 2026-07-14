function BarChart({ title, data, description }) {
  // Se usa el valor maximo como referencia para convertir cada dato en porcentaje
  // de ancho; no depende de una libreria externa de graficos.
  const max = Math.max(...data.map((item) => item.value))
  return (
    <section className="chart-surface" aria-labelledby={title.replaceAll(' ', '-')}>
      <header>
        <h2 id={title.replaceAll(' ', '-')}>{title}</h2>
        {description ? <p>{description}</p> : null}
      </header>
      <div
        className="mt-5 space-y-3"
        role="img"
        aria-label={`${title}: ${data.map((item) => `${item.label} ${item.value}`).join(', ')}`}
      >
        {data.map((item) => (
          <div
            key={item.label}
            className="grid grid-cols-[100px_1fr_32px] items-center gap-3 text-xs"
          >
            <span>{item.label}</span>
            <div className="h-2 bg-muted">
              <div
                className="h-full bg-primary"
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
            <b className="technical-value text-right">{item.value}</b>
          </div>
        ))}
      </div>
      <p className="sr-only">{data.map((item) => `${item.label}: ${item.value}`).join('. ')}</p>
    </section>
  )
}

function LineChart({
  title,
  data,
  description,
  labels = data.map((_, index) => `Día ${index + 1}`),
}) {
  // Los puntos SVG se calculan en un viewBox 0-100. Asi la grafica escala con el
  // contenedor sin recalcular pixeles reales.
  const max = Math.max(...data)
  const min = Math.min(...data)
  const points = data
    .map(
      (value, index) =>
        `${(index / (data.length - 1)) * 100},${92 - ((value - min) / Math.max(max - min, 1)) * 75}`,
    )
    .join(' ')
  return (
    <section className="chart-surface" aria-labelledby={title.replaceAll(' ', '-')}>
      <header>
        <h2 id={title.replaceAll(' ', '-')}>{title}</h2>
        {description ? <p>{description}</p> : null}
      </header>
      <svg
        className="mt-5 h-36 w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        role="img"
        aria-label={`${title}: ${data.map((value, index) => `${labels[index]} RD$ ${value.toLocaleString()}`).join(', ')}`}
      >
        <path d="M0 92H100" stroke="currentColor" opacity=".12" vectorEffect="non-scaling-stroke" />
        <polyline
          points={points}
          fill="none"
          stroke="#00D1FF"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <table className="mt-3 w-full text-xs">
        <caption className="sr-only">Valores de {title}</caption>
        <tbody>
          <tr>
            {data.map((value, index) => (
              <td key={labels[index]} className="technical-value text-center text-muted-foreground">
                {labels[index]}
                <br />
                RD$ {value.toLocaleString()}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </section>
  )
}

export { BarChart, LineChart }
