import Container from 'react-bootstrap/Container';
import { ethers } from 'ethers'
import { useEffect, useState } from 'react';

// Components 
import Navigation from "./Navigation";
import Info from "./Info";
import Loading from './Loading';
import Progress from './Progress';
import Buy from './Buy';

//Config
import config from "../config.json";

//ABIs
import TOKEN_ABI from '../abis/Token.json';
import CROWDSALE_ABI from '../abis/Crowdsale.json';
import Countdown from './Countdown';

function App() {

    const [account, setAccount] = useState(null)
    const [provider, setProvider] = useState(null)

    const [crowdsale, setCrowdsale] = useState(null)
    const [accountBalance, setAccountBalance] = useState(0)

    const [price, setPrice] = useState(0)
    const [tokenSold, setTokenSold] = useState(0)
    const [maxTokens, setMaxTokens] = useState(0)
    const [whitelisted, setWhitelisted] = useState(0)
    const [crowdsaleClosingDate, setCrowdsaleClosingDate] = useState()
    const [isLoading, setIsloading] = useState(true)
    const [timeLeft, setTimeLeft] = useState(0);


    const loadBlockchainData = async () => {
        //Initiate provider
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(provider)

        const { chainId } = await provider.getNetwork()

        //Initiate contracts
        const token = new ethers.Contract(config[chainId].token.address, TOKEN_ABI, provider)        
        const crowdsale = new ethers.Contract(config[chainId].crowdsale.address, CROWDSALE_ABI, provider)
        setCrowdsale(crowdsale)

        //Fetch Accounts
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = ethers.utils.getAddress(accounts[0])        
        setAccount(account)

        //Fetch account balance, price, token sold and max tokens
        const accountBalance = ethers.utils.formatUnits(await token.balanceOf(account), 18)
        setAccountBalance(accountBalance)

        const price = ethers.utils.formatUnits(await crowdsale.price(), 18)
        setPrice(price)

        const tokenSold = ethers.utils.formatUnits(await crowdsale.tokenSold(), 18)
        setTokenSold(tokenSold)

        const maxTokens = ethers.utils.formatUnits(await crowdsale.maxTokens(), 18)
        setMaxTokens(maxTokens)

        const whitelisted = await crowdsale.whitelist(account)
        setWhitelisted(whitelisted)

        const crowdsaleClosingDate = await crowdsale.crowdsaleClosingDate()
        setCrowdsaleClosingDate(crowdsaleClosingDate.toNumber())

        const timeLeft = +crowdsaleClosingDate*1000 - +new Date();
        setTimeLeft(timeLeft)

        setIsloading(false)

    }
    useEffect(() => {
        if(isLoading){
            loadBlockchainData()
        }
    }, [isLoading]);
    return(
        <Container>
            <Navigation/>
            <>
            <h2 className='my-4 text-center'>Welcome to the CZG token crowdsale<br/></h2>
            {crowdsaleClosingDate && (
            <Countdown expireTimestamp={crowdsaleClosingDate}/>
            )}
            </>
            {isLoading ? (
                <Loading/>
            ) : (
                timeLeft > 0 ? (
                    <>
                    <p className='text-center'><strong>Current price: </strong>{price} ETH</p>
                   <Buy provider={provider} price={price} crowdsale={crowdsale} setIsloading={setIsloading} whitelisted={whitelisted}/>
                   <Progress tokenSold={tokenSold} maxTokens={maxTokens} />
                   </>
                ) : (<br/>)
            )}
            <hr/>
            {account && (
                <Info account={account} accountBalance={accountBalance} whitelisted={whitelisted}/>
            )}
        </Container>
    )
}

export default App;