function FormField({ id, label, children, hint }) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint ? <small>{hint}</small> : null}
    </div>
  )
}

export default FormField
