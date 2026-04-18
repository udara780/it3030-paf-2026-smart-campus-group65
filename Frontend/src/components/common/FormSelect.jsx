import { forwardRef } from 'react';

const FormSelect = forwardRef(({
    label,
    error,
    options = [],
    size = 'md',
    helperText,
    placeholder = 'Select an option...',
    className = '',
    ...props
}, ref) => {
    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-sm',
        lg: 'px-4 py-3.5 text-base',
    };

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-dark-text-light leading-tight">
                    {label}
                    {props.required && <span className="text-danger ml-1">*</span>}
                </label>
            )}
            <select
                ref={ref}
                className={`
          w-full bg-dark-card border rounded-lg transition-all duration-200 appearance-none cursor-pointer
          ${error ? 'border-danger focus:ring-danger/20' : 'border-dark-border hover:border-dark-border/80 focus:ring-primary/20'}
          focus:outline-none focus:ring-2 focus:border-transparent
          text-white placeholder-dark-text/50
          disabled:opacity-50 disabled:cursor-not-allowed
          ${sizes[size]}
          ${className}
        `}
                {...props}
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((opt, idx) => (
                    <option key={idx} value={opt.value || opt} className="bg-dark-card text-white">
                        {opt.label || opt}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-xs text-danger font-medium leading-relaxed">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-xs text-dark-text leading-relaxed">{helperText}</p>
            )}
        </div>
    );
});

FormSelect.displayName = 'FormSelect';

export default FormSelect;
