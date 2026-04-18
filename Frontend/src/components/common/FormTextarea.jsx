import { forwardRef } from 'react';

const FormTextarea = forwardRef(({
    label,
    error,
    helperText,
    rows = 3,
    className = '',
    ...props
}, ref) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-dark-text-light leading-tight">
                    {label}
                    {props.required && <span className="text-danger ml-1">*</span>}
                </label>
            )}
            <textarea
                ref={ref}
                rows={rows}
                className={`
          w-full bg-dark-card border rounded-lg transition-all duration-200 resize-none
          ${error ? 'border-danger focus:ring-danger/20' : 'border-dark-border hover:border-dark-border/80 focus:ring-primary/20'}
          focus:outline-none focus:ring-2 focus:border-transparent
          text-white placeholder-dark-text/50
          px-4 py-3 text-sm leading-relaxed
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="text-xs text-danger font-medium leading-relaxed">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-xs text-dark-text leading-relaxed">{helperText}</p>
            )}
        </div>
    );
});

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
