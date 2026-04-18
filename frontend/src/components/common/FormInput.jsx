import { forwardRef } from 'react';

const FormInput = forwardRef(({
    label,
    error,
    size = 'md',
    helperText,
    className = '',
    ...props
}, ref) => {
    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-sm',
        lg: 'px-4 py-3.5 text-base',
    };

    return (
        <div className="p-4 m-2 space-y-2">
            {label && (
                <label className="block text-sm font-medium text-dark-text-light leading-tight">
                    {label}
                    {props.required && <span className="text-danger ml-1">*</span>}
                </label>
            )}
            <input
                ref={ref}
                className={`
          w-full bg-dark-card border rounded-lg transition-all duration-200
          ${error ? 'border-danger focus:ring-danger/20' : 'border-dark-border hover:border-dark-border/80 focus:ring-primary/20'}
          focus:outline-none focus:ring-2 focus:border-transparent
          text-white placeholder-dark-text/50
          disabled:opacity-50 disabled:cursor-not-allowed
          ${sizes[size]}
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

FormInput.displayName = 'FormInput';

export default FormInput;

