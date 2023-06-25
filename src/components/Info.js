const Info = ({account, accountBalance}) => {
    return(
        <div className="my-3">
            <p><strong>Account: </strong>{account}</p>
            <p><strong>Token balance: </strong>{accountBalance}</p>

        </div>
    )
}

export default Info;