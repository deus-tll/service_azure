const FormField = ({ label, value, error, onChange, type = 'text', disabled = false }) => {
  return (
    <div className="mb-3">
      <label className="form-label w-100">
        {label}:
        <input
          type={type}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        {error && <div className="invalid-feedback">{error}</div>}
      </label>
    </div>
  );
};

export default FormField;