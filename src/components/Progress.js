import ProgressBar from 'react-bootstrap/ProgressBar';

const Progress = ({tokenSold, maxTokens}) => {
    return(
        <div className="my-3">
            <ProgressBar now={(tokenSold / maxTokens) * 100} label = {`${(tokenSold / maxTokens) * 100} %`} />
            <p className="text-center my-3"> {tokenSold} / {maxTokens} tokens sold </p>
        </div>
    )
}

export default Progress;