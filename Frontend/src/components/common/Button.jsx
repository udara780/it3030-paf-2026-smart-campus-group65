export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    className = '',
    ...props
}) {
    const baseStyles = 'font-semibold transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 leading-tight';

    const variants = {
        primary: 'bg-primary hover:bg-primary-dark text-white shadow-sm hover:shadow-md active:scale-95',
        secondary: 'bg-dark-border hover:bg-dark-border/80 text-white shadow-sm hover:shadow-md active:scale-95',
        danger: 'bg-danger hover:bg-red-600 text-white shadow-sm hover:shadow-md active:scale-95',
        success: 'bg-success hover:bg-green-600 text-white shadow-sm hover:shadow-md active:scale-95',
        ghost: 'bg-transparent hover:bg-dark-border/30 text-white active:bg-dark-border/50',
        outline: 'bg-transparent border border-dark-border hover:border-primary text-white hover:text-primary',
    };

    const sizes = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3.5 text-base',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <span className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />}
            {children}
        </button>
    );
}
