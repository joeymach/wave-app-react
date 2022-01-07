import React, { useEffect, useState, useReducer } from "react";
import { ethers } from "ethers";
import "./App.css";
import wavePortal from "./utils/WavePortal.json";

const App = () => {
	const [currentAccount, setCurrentAccount] = useState("");
	const [allWaves, setAllWaves] = useState([]);
	const [waveCount, setWaveCount] = useState(null);
	const [waveMsg, setWaveMsg] = useState("");
	const contractAddress = "0xc35371D4caC6997CF6d3F875a5bb6F6F6Ea7643d";

	useEffect(() => {
		checkIfWalletIsConnected();
		getWaveCount();
		getAllWaves();

		if (window.ethereum) {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const wavePortalContract = new ethers.Contract(contractAddress, wavePortal.abi, signer);
			wavePortalContract.on("NewWave", (from, timestamp, message, prizeWon) => {
				console.log("NewWave", from, timestamp, message, prizeWon);

				setAllWaves((prevState) => [
					...prevState,
					{
						address: from,
						timestamp: new Date(timestamp * 1000),
						message: message,
						prize: ethers.utils.formatEther(prizeWon),
					},
				]);

				if (ethers.utils.formatEther(prizeWon) > 0) {
					alert(`CONGRATS on winning ${ethers.utils.formatEther(prizeWon)} eth! Wave message successful!`);
				} else {
					alert("Success! Wave message sent!");
				}
			});
		}
	}, []);

	useEffect(() => {
		checkIfWalletIsConnected();
		getWaveCount();
		getAllWaves();
	}, [currentAccount]);

	const checkIfWalletIsConnected = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				console.log("Make sure you have metamask!");
				return;
			} else {
				console.log("We have the ethereum object", ethereum);
			}

			const accounts = await ethereum.request({ method: "eth_accounts" });

			if (accounts.length !== 0) {
				const account = accounts[0];
				console.log("Found an authorized account:", account);
			} else {
				console.log("No authorized account found");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const getWaveCount = async () => {
		try {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(contractAddress, wavePortal.abi, signer);

				let count = await wavePortalContract.getTotalWaves();
				setWaveCount(count.toNumber());
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const getAllWaves = async () => {
		try {
			if (window.ethereum) {
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(contractAddress, wavePortal.abi, signer);

				const waves = await wavePortalContract.getAllWaves();

				let wavesCleaned = [];
				waves.forEach((wave) => {
					wavesCleaned.push({
						address: wave.waver,
						timestamp: new Date(wave.timestamp * 1000),
						message: wave.message,
						prize: ethers.utils.formatEther(wave.prizeWon),
					});
				});

				setAllWaves(wavesCleaned);
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const connectWallet = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				alert("Get MetaMask!");
				return;
			}

			const accounts = await ethereum.request({
				method: "eth_requestAccounts",
			});

			alert(`Account Connected: ${accounts[0]}`);
			setCurrentAccount(accounts[0]);
		} catch (error) {
			console.log(error);
		}
	};

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
		<div className="mainContainer">
			<div className="dataContainer">
				<div className="header">👋 Welcome onboard! ¯\_(ツ)_/¯</div>
				<div className="bio">
					<p>Hey there! ~ jojo here ~ don't be shy to connect your wallet and wave at me 😉.</p>
				</div>
				{!currentAccount && (
					<button className="waveButton" onClick={connectWallet}>
						💰 Connect Wallet
					</button>
				)}
				<form onSubmit={wave}>
					<p className="waveLabel">Enter your wave message below and wave at me!</p>
					<p>ps: every time you wave, you can win anywhere between 0.0001 - 0.0005 fake eth</p>
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

				{waveCount != null && (
					<div className="waveCount">
						<p>🚀 Total messages sent: {waveCount}</p>
					</div>
				)}
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
			</div>
		</div>
	);
};

export default App;
