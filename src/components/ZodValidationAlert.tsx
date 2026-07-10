"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AlertCircle, X, Check, RefreshCw, Mail, User, Lock, AtSign, Phone, MapPin, Calendar, FileText, Code } from "lucide-react";

interface ZodValidationAlertProps {
  errors?: Record<string, string[]>;
  visible?: boolean;
  className?: string;
  autoDismiss?: number;
  showIcon?: boolean;
  variant?: "error" | "warning" | "info";
  onClose?: () => void;
  onRetry?: () => void;
  retryLoading?: boolean;
  title?: string;
}

interface ValidationState {
  errors: Record<string, string[]>;
  visible: boolean;
  animation: "fade-in" | "fade-out" | "hidden";
}

const DEFAULT_AUTODISMISS = 5000;

const ERROR_MESSAGES: Record<string, string> = {
  invalid_email: "Emel tidak sah",
  invalid_password: "Kata laluan tidak sah",
  password_too_short: "Kata laluan terlalu pendek",
  password_no_uppercase: "Kata laluan mesti mengandungi huruf besar",
  password_no_lowercase: "Kata laluan mesti mengandungi huruf kecil",
  password_no_number: "Kata laluan mesti mengandungi nombor",
  password_no_special: "Kata laluan mesti mengandungi simbol khas",
  username_taken: "Nama pengguna sudah dipakai",
  username_invalid: "Nama pengguna tidak sah",
  field_required: "Kelongoran ini diperlukan",
  invalid_phone: "No. telefon tidak sah",
  invalid_url: "URL tidak sah",
  file_too_large: "Fail terlalu besar",
  file_type_invalid: "Jenis fail tidak disokong",
  invalid_date: "Tarikh tidak sah",
  invalid_number: "Nombor tidak sah",
  custom: "Sila semak semula input anda",
};

const FIELD_ICONS: Record<string, React.ReactNode> = {
  email: <Mail className="h-4 w-4" />,
  password: <Lock className="h-4 w-4" />,
  username: <User className="h-4 w-4" />,
  phone: <Phone className="h-4 w-4" />,
  location: <MapPin className="h-4 w-4" />,
  date: <Calendar className="h-4 w-4" />,
  bio: <FileText className="h-4 w-4" />,
  code: <Code className="h-4 w-4" />,
};

export default function ZodValidationAlert({ 
  errors = {},
  visible: inputVisible = true,
  className,
  autoDismiss = DEFAULT_AUTODISMISS,
  showIcon = true,
  variant = "error",
  onClose,
  onRetry,
  retryLoading = false,
  title,
}: ZodValidationAlertProps) {
  const [state, setState] = useState<ValidationState>({
    errors,
    visible: inputVisible,
    animation: "hidden",
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (inputVisible && Object.keys(errors).length > 0) {
      setState({ errors, visible: true, animation: "fade-in" });
      setIsVisible(true);
    } else if (!inputVisible && isVisible) {
      setState({ errors, visible: false, animation: "fade-out" });
    }
  }, [inputVisible, errors, isVisible]);

  useEffect(() => {
    if (state.visible && state.animation === "fade-in" && autoDismiss > 0) {
      timeoutRef.current = setTimeout(() => {
        setState({ ...state, animation: "fade-out" });
      }, autoDismiss - 300);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [state.visible, state.animation, autoDismiss]);

  useEffect(() => {
    if (state.animation === "fade-out") {
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 300);
    }
  }, [state.animation, onClose]);

  const translateError = useCallback((key: string): string => {
    return ERROR_MESSAGES[key] || key;
  }, []);

  const getFieldIcon = useCallback((field: string): React.ReactNode => {
    return FIELD_ICONS[field] || <AlertCircle className="h-4 w-4" />;
  }, []);

  const renderError = (field: string, message: string) => {
    const icon = getFieldIcon(field);
    
    return (
      <div key={field} className="flex items-start gap-2">
        <div className="flex-shrink-0 mt-0.5">
          {icon}
        </div>
        <div className="flex-1">
          <span className="text-sm text-red-200 pixel-font">
            {message}
          </span>
        </div>
      </div>
    );
  };

  const handleDismiss = useCallback(() => {
    setState({ ...state, animation: "fade-out" });
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  }, [state, onClose]);

  const variantClasses = {
    error: "bg-red-500/10 border-red-500/30 text-red-200",
    warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-200",
    info: "bg-blue-500/10 border-blue-500/30 text-blue-200",
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`border rounded-xl p-4 mb-4 transition-all duration-300 ${
        variantClasses[variant]
      } ${className || ""}`}
      style={{
        animation: state.animation === "fade-in" 
          ? "fadeIn 0.3s ease-out" 
          : state.animation === "fade-out"
          ? "fadeOut 0.3s ease-out"
          : "none",
      }}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>
      
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {showIcon && (
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
          )}
          
          <div className="flex-1">
            {title && (
              <h3 className="font-semibold mb-2 pixel-font">
                {title}
              </h3>
            )}
            
            {Object.entries(state.errors).map(([field, messages]) => (
              <div key={field} className="mb-1">
                {messages.map((message, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-sm pixel-font">
                      {translateError(message)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              disabled={retryLoading}
              className="flex items-center gap-1 px-3 py-1 text-xs rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 transition-colors pixel-font disabled:opacity-50"
            >
              {retryLoading ? (
                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
              Cuba Semula
            </button>
          )}
          
          <button
            onClick={handleDismiss}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export const ValidationErrorDisplay = ({ 
  errors,
  className,
}: {
  errors?: Record<string, string[]>;
  className?: string;
}) => {
  if (!errors || Object.keys(errors).length === 0) return null;

  return (
    <div className={`space-y-2 ${className || ""}`}>
      {Object.entries(errors).map(([field, messages]) => (
        <div key={field} className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            {messages.map((message, index) => (
              <p key={index} className="text-sm text-red-200 pixel-font">
                {message}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const useValidation = () => {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isValidating, setIsValidating] = useState(false);

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), message],
    }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const hasError = useCallback((field: string) => {
    return field in errors;
  }, [errors]);

  const getError = useCallback((field: string) => {
    return errors[field]?.[0] || "";
  }, [errors]);

  return {
    errors,
    setErrors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    hasError,
    getError,
    isValidating,
    setIsValidating,
  };
};

export const ValidationSummary = ({ 
  errors,
  className,
}: {
  errors?: Record<string, string[]>;
  className?: string;
}) => {
  const errorCount = Object.values(errors || {}).reduce((sum, msgs) => sum + msgs.length, 0);

  if (errorCount === 0) return null;

  return (
    <div className={`bg-red-500/10 border border-red-500/30 rounded-lg p-3 ${className || ""}`}>
      <div className="flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-red-200 pixel-font font-semibold mb-1">
            {errorCount} ralat ditemui
          </p>
          <div className="space-y-1">
            {Object.entries(errors || {}).map(([field, messages]) => (
              <div key={field} className="text-xs text-red-300 pixel-font">
                {messages.map((msg, i) => (
                  <div key={i}>{msg}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FieldError = ({ 
  field,
  errors,
  className,
}: {
  field: string;
  errors?: Record<string, string[]>;
  className?: string;
}) => {
  const fieldErrors = errors?.[field];
  
  if (!fieldErrors || fieldErrors.length === 0) return null;

  return (
    <div className={`mt-1 ${className || ""}`}>
      {fieldErrors.map((error, index) => (
        <div key={index} className="flex items-start gap-1">
          <AlertCircle className="h-3 w-3 text-red-400 flex-shrink-0 mt-0.5" />
          <span className="text-xs text-red-300 pixel-font">{error}</span>
        </div>
      ))}
    </div>
  );
};

export const ValidationError = ({ 
  message,
  className,
}: {
  message: string;
  className?: string;
}) => (
  <div className={`flex items-start gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg ${className || ""}`}>
    <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
    <span className="text-sm text-red-200 pixel-font">{message}</span>
  </div>
);

export const ValidationWarning = ({ 
  message,
  className,
}: {
  message: string;
  className?: string;
}) => (
  <div className={`flex items-start gap-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg ${className || ""}`}>
    <AlertCircle className="h-4 w-4 text-yellow-400 flex-shrink-0" />
    <span className="text-sm text-yellow-200 pixel-font">{message}</span>
  </div>
);

export const ValidationSuccess = ({ 
  message,
  className,
}: {
  message: string;
  className?: string;
}) => (
  <div className={`flex items-start gap-2 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg ${className || ""}`}>
    <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
    <span className="text-sm text-emerald-200 pixel-font">{message}</span>
  </div>
);

export const useFormValidation = (schema: any) => {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(async (values: Record<string, any>) => {
    try {
      const result = await schema.safeParseAsync(values);
      
      if (!result.success) {
        const newErrors: Record<string, string[]> = {};
        
        Object.entries(result.error.format()).forEach(([field, errors]) => {
          if (errors && typeof errors === "object") {
            const msgs = Object.values(errors as any).flat().filter(Boolean);
            if (msgs.length > 0) {
              newErrors[field] = msgs as string[];
            }
          }
        });
        
        setErrors(newErrors);
        return false;
      }
      
      setErrors({});
      return true;
    } catch (e) {
      console.error("Validation error:", e);
      return false;
    }
  }, [schema]);

  const markTouched = useCallback((field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  return {
    errors,
    touched,
    validate,
    markTouched,
    setErrors,
  };
};