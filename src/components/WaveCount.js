import React from "react";

const WaveCount = ({ waveCount }) => {
	return (
		<>
			{waveCount != null && (
				<div className="waveCount">
					<p>🚀 Total messages sent: {waveCount}</p>
				</div>
			)}
		</>
	);
};

export default WaveCount;