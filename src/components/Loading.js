import Spinner from 'react-bootstrap/Spinner';


const Loading = () => {
    return(
        <div className='text-center'>
            <Spinner animation="border" variant="warning" />
        </div>
    )
}

export default Loading