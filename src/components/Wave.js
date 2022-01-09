import React, { useState } from "react";
import { ethers } from "ethers";

const Wave = ({ getWaveCount, currentAccount, contractAddress, wavePortal }) => {
	const [waveMsg, setWaveMsg] = useState("");

	const wave = async (event) => {
		event.preventDefault();
		try {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(contractAddress, wavePortal.abi, signer);

				const waveTxn = await wavePortalContract.wave(waveMsg, {
					gasLimit: 300000,
				});
				console.log("Mining...", waveTxn.hash);

				await waveTxn.wait();
				console.log("Mined -- ", waveTxn.hash);

				await getWaveCount();
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<form onSubmit={wave}>
			<p className="waveLabel">Enter your wave message below and wave at me!</p>
			<textarea
				rows="5"
				className="waveTextbox"
				placeholder="Type your wave message..."
				onChange={(event) => {
					setWaveMsg(event.target.value);
				}}
				disabled={!currentAccount ? true : false}
			/>
			<input className="waveButton fullLengthButton" type="submit" value="👋 Wave at Me :)" />
		</form>
	);
};

export default Wave;