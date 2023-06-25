import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import { useState } from 'react'
import { ethers } from 'ethers'





const Buy = ({ provider, price, crowdsale, setIsloading }) => {

    const [amount, setAmount] = useState('0')
    const [isWaiting, setIsWaiting] = useState(false)

    const buyHandler = async (e) => {
        e.preventDefault()
        setIsWaiting(true)

        try{
            const signer = await provider.getSigner()
            const value = ethers.utils.parseUnits((amount * price ).toString(), 'ether')
            const formatedAmount = ethers.utils.parseUnits(amount.toString(), 'ether')

            const transaction = await crowdsale.connect(signer).buyTokens(formatedAmount, {value : value})
            await transaction.wait()
        }
        catch{
            window.alert('User rejected or transaction reverted')
        }
        setIsloading(true)
    }

    return(
        <Form onSubmit={buyHandler} style={{ maxWidth: '800px', marging: '50px auto' }}>
            <Form.Group as={Row}>
                <Col>
                    <Form.Control type="number" placeholder="Enter amount" onChange={(e) => setAmount(e.target.value)} />
                </Col>
                <Col className='text-center'>
                    {
                    isWaiting ? 
                    (<Spinner animation='border'></Spinner>):
                    (<Button variant="primary" type="Submit" style={{ width: '100%'}}>Buy Tokens</Button>)
                }
                    
                </Col>
            </Form.Group>   
        </Form>
    )
}

export default Buy;