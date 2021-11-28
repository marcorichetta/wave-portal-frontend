import React from "react";
import { ethers } from "ethers";
import "./App.css";
import { abi } from "./utils/WavePortal.json";
import { Loader } from "./Loader";


export default function App() {
	const [currentAccount, setCurrentAccount] = React.useState("");
	const [isMining, setIsMining] = React.useState(false);

    
    // App variables
	const contractAdress = "0x4E4810355E41b0883f033098f2bb7482021359B2";
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
		} catch (error) {
			console.log(error);
		}
	};

    React.useEffect(() => {
		checkIfWalletIsConnected();
	}, );

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

				{isMining ? <Loader /> : null}

			</div>
		</div>
	);
}
