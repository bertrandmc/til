import React from 'react'

const UserContext = React.createContext()
const { Provider, Consumer } = UserContext

class UserProvider extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            currentUser: null,
            handleLogin: this.handleLogin, // add handleLogin to state so provider only updates once state changes
                                           // if instead we create a new value object on every refresh this 
                                           // would trigger unnecessary updates
        }
    }

    handleLogin = () => {
        this.setState({ currentUser: { name: 'The Dude', avatar: 'http://...' }})
    }

    render() {
        // instead of creating a new userContext object each time component renders
        // we pass the state (which includes a reference to the handleLogin method)
        // const userContext = {
        //     currentUser: this.state.currentUser,
        //     handleLogin: this.handleLogin,
        // }

        return (
            <Provider value={this.state}>
                {this.props.children}
            </Provider>
        )
    }
}

export { 
    UserContext, 
    UserProvider, 
    Consumer as UserConsumer 
}