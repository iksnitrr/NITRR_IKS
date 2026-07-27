import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import "../css/ErrorState.css";

const ErrorState = ({
  title = "Unable to Connect to Server",
  message = "We couldn't retrieve the latest data right now. Please check your internet connection or verify the backend server status.",
  onRetry
}) => {
  return (
    <div className="error-state-card">
      <div className="error-icon-wrapper">
        <AlertTriangle size={32} className="error-icon" />
      </div>
      <h3 className="error-state-title">{title}</h3>
      <p className="error-state-message">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="error-retry-btn">
          <RotateCcw size={16} /> Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
