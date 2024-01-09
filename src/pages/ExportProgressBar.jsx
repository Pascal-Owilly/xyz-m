import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

const CustomProgressBar = ({ stages, progress, totalStages, onStageClick }) => {
  const getColor = (index) => {
    switch (index) {
      case 0:
        return '#ff6347'; // Tomato
      case 1:
        return '#ffa07a'; // LightSalmon
      case 2:
        return '#ffd700'; // Gold
      case 3:
        return '#00ced1'; // DarkTurquoise
      case 4:
        return '#98fb98'; // PaleGreen
      default:
        return '#ccc'; // Default color
    }
  };

  return (
    <div>
      <ProgressBar>
        {stages.map((stage, index) => (
          <ProgressBar
            key={index}
            variant={index < progress ? 'success' : 'light'}
            now={(100 / totalStages)}
            label={`${stage}`}
            onClick={() => onStageClick(index)}
            style={{
              cursor: 'pointer',
              background: `linear-gradient(to right, ${getColor(index)}, ${getColor(index + 1)})`,
            }}
          />
        ))}
      </ProgressBar>
    </div>
  );
};

export default CustomProgressBar;
