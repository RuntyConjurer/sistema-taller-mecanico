function TechnicalValue({ value, unit, className = '' }) {
  return <span className={`technical-value ${className}`}>{value}{unit ? <span className="ml-1 text-muted-foreground">{unit}</span> : null}</span>
}

export default TechnicalValue
