import React from "react";

const AllWaves = ({ allWaves }) => {
	return (
		<>
			{allWaves
				.slice(0)
				.reverse()
				.map((wave, index) => {
					return (
						<div className="allWaves" key={index}>
							<div>
								<span className="waveHeadings">Address:</span> {wave.address}
							</div>
							<div>
								<span className="waveHeadings">Time:</span> {wave.timestamp.toString()}
							</div>
							<div>
								<span className="waveHeadings">Message:</span> {wave.message}
							</div>
							<div>
								<span className="waveHeadings">Eth Won:</span> {wave.prize} eth
							</div>
						</div>
					);
				})}
		</>
	);
};

export default AllWaves;