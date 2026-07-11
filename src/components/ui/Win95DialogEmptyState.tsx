// Start: Windows 95 Style Empty State Dialog Component
"use client";

interface Win95DialogEmptyStateProps {
  message: string;
  secondaryActionRoute?: string;
  className?: string;
}

export default function Win95DialogEmptyState({ 
  message, 
  secondaryActionRoute,
  className 
}: Win95DialogEmptyStateProps) {
  // Start: Handle Secondary Action
  const handleSecondaryAction = () => {
    if (secondaryActionRoute) {
      window.location.href = secondaryActionRoute;
    }
  };
  // End: Handle Secondary Action

  return (
    // Start: Windows 95 Dialog Container
    <div className={`
      flex items-center justify-center p-6
      ${className || ''}
    `}>
      {/* Start: Authentic Win95 Grey Alert Box */}
      <div className="
        bg-gray-300
        border-t-white border-l-white border-b-gray-700 border-r-gray-700
        border-2
        px-6 py-4
        shadow-md
        min-w-[280px]
        max-w-md
        text-center
      ">
        {/* Start: Dialog Title Bar */}
        <div className="
          bg-gradient-to-r from-blue-800 to-blue-700
          text-white
          px-2 py-1
          -mx-6 -mt-4 mb-4
          text-sm font-bold
          flex items-center justify-center
        ">
          <span className="font-pixel">Sistem Maklumat</span>
        </div>
        {/* End: Dialog Title Bar */}
        
        {/* Start: Dialog Message Content */}
        <p className="
          text-gray-800
          text-sm
          font-sans
          leading-relaxed
        ">
          {message}
        </p>
        {/* End: Dialog Message Content */}

        {/* Start: Dialog Button Row */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            className="
              bg-gray-300
              border-t-white border-l-white border-b-gray-700 border-r-gray-700
              border-2
              px-4 py-1
              text-xs font-bold
              hover:bg-gray-200
              active:border-t-gray-700 active:border-l-gray-700 active:border-b-white active:border-r-white
              transition-colors
            "
            onClick={() => {}}
          >
            OK
          </button>
          
          {secondaryActionRoute && (
            <button
              className="
                bg-gray-300
                border-t-white border-l-white border-b-gray-700 border-r-gray-700
                border-2
                px-4 py-1
                text-xs font-bold
                hover:bg-green-200
                active:border-t-gray-700 active:border-l-gray-700 active:border-b-white active:border-r-white
                transition-colors
              "
              onClick={handleSecondaryAction}
            >
              Buka Editor
            </button>
          )}
        </div>
        {/* End: Dialog Button Row */}
      </div>
      {/* End: Authentic Win95 Grey Alert Box */}
    </div>
    // End: Windows 95 Dialog Container
  );
}
// End: Windows 95 Style Empty State Dialog Component