import React from "react";
import "./custom_spinner.css";

interface CustomSpinner {
  size?: number; // Размер загрузчика в пикселях
  color?: string; // Цвет загрузчика
}

const CustomSpinner: React.FC<CustomSpinner> = ({ size = 60, color = "#3498db" }) => {
  const loaderStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderTopColor: color,
  };

  return (
    <div className="loader-container">
      <div className="loader" style={loaderStyle}></div>
    </div>
  );
};

export default CustomSpinner;
