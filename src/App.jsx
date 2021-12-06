import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import { abi } from "./utils/WavePortal.json";
import { Loader } from "./Loader";


export default function App() {

    // App state
	const [currentAccount, setCurrentAccount] = useState("");
	const [isMining, setIsMining] = useState(false);
    const [allWaves, setAllWaves] = useState([])
    
    // App constants
	const contractAdress = "0xFfEA76e6a1b442Fc6883Ef8222Af22fC5619408A";
	const contractABI = abi;

    /**
     * Busca el Web3 Provider inyectado por Metamask
     * @returns Instancia de Metamask
     */
    const getMetamaskProvider = () => {
        const { ethereum } = window;

        if (!ethereum) {
            alert("Asegurate de tener Metamask instalado");
        }

        return ethereum;
    }

    /**
     * Busca un Web3 Provider en la página (Metamask lo inyecta en window.ethereum)
     * y consulta si existen cuentas disponibles
     */
	const checkIfWalletIsConnected = async () => {
		try {

            const ethereum = getMetamaskProvider()

			const accounts = await ethereum.request({ method: "eth_accounts" });

			if (accounts.length !== 0) {
				const account = accounts[0];
				console.log("Cuenta autorizada: ", account);

				setCurrentAccount(account);
			} else {
				console.log("No se encontró una cuenta autorizada");
			}

            const waves = await getAllWaves()

            setAllWaves(waves);

		} catch (error) {
			console.log(error);
		}
	};

    useEffect(() => {
		checkIfWalletIsConnected();
	}, []);

	const connectWallet = async () => {
		try {
			
            const ethereum = getMetamaskProvider()

			const accounts = await ethereum.request({ method: "eth_requestAccounts" });

			console.log("Conectado");
			setCurrentAccount(accounts[0]);
		} catch (error) {
			console.log(error);
		}
	};


    /**
     * Envía un saludo a través del método `wave()` de nuestro Smart Contract
     */
	const wave = async () => {
		try {
			
            const ethereum = getMetamaskProvider()

			const provider = new ethers.providers.Web3Provider(ethereum);
			// Signer en ethers.js ~= cuenta de Ethereum (https://docs.ethers.io/v5/api/signer/#signers)
			// En este caso el signer será nuestra cuenta de Metamask y se puede usar
			// para enviar transacciones o firmar mensajes
			const signer = provider.getSigner();

			// Instanciamos nuestro SC y llamamos una de sus funciones
			const wavePortalContract = new ethers.Contract(contractAdress, contractABI, signer);

			const waveTxn = await wavePortalContract.wave();
			console.log("Minando", waveTxn.hash);

			setIsMining(true);

			await waveTxn.wait();
			console.log("Minado", waveTxn.hash);

			setIsMining(false);

		} catch (error) {
			console.log(error);
		}
	};

    const getAllWaves = async () => {
        try {
            const ethereum = getMetamaskProvider()
            
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()

            const wavePortalContract = new ethers.Contract(contractAdress, contractABI, signer)

            const waves = await wavePortalContract.getAllWaves()

            console.log(`Se encontraron ${waves.length} saludos`);
            
            const cleanedWaves = waves.map(wave => (
                {
                    address: wave.waver,
                    timestamp: new Date(wave.timestamp * 1000),
                    message: wave.message 
                }
            ))
            
            return cleanedWaves
        } catch (error) {
            console.log(error);
        }
    }
	return (
		<div className="mainContainer">
			<div className="dataContainer">
				<div className="header">
					Hola!{" "}
					<span role="img" aria-label="Mano saludando">
						👋
					</span>
				</div>
				<div className="bio">
					Me llamo Marco, estoy aprendiendo Solidity y me gusta el Metal
					<span role="img" aria-label="Cuernos metaleros">
						🤘
					</span>
					<iframe
						className="video"
						width="560"
						height="315"
						src="https://www.youtube-nocookie.com/embed/9d4ui9q7eDM"
						title="Holy fucking Wars"
						frameBorder="0"
						allow="clipboard-write; encrypted-media; picture-in-picture"
						allowFullScreen
					></iframe>
				</div>
				{currentAccount ? (
					<button className="waveButton" onClick={wave}>
						Dejame un saludito en la Bl0cKcH@1n
					</button>
				) : (
					<button className="waveButton" onClick={connectWallet}>
						Conecta tu Wallet
					</button>
				)}

                {allWaves.map((wave, index) => {
                    return (
                        <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px"}}>
                            <div>Address: {wave.address}</div>
                            <div>Hora: {wave.timestamp.toString()}</div>
                            <div>Mensaje: {wave.message}</div>
                        </div>
                    )
                })}

				{isMining ? <Loader /> : null}

			</div>
		</div>
	);
}
