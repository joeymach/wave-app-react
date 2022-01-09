import React from "react";

const ConnectWallet = ({ currentAccount, connectWallet }) => {
	return (
		<>
			{!currentAccount && (
				<button className="waveButton" onClick={connectWallet}>
					💰 Connect Wallet
				</button>
			)}
		</>
	);
};

export default ConnectWallet;