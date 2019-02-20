import React from 'react';

const { Provider, Consumer } = React.createContext();

class UserProvider extends React.Component {
    state = {
        emails: null
    }

    fetchEmails = () => {
        this.setState({ 
            emails: [
                { from: 'A', text: 'Email from A' },
                { from: 'B', text: 'Email from B' },
                { from: 'C', text: 'Email from C' },
            ]
        })
    }

    render() {
        const emailContext = {
            ...this.state,
            fetchEmails: this.fetchEmails,
        }
        
        return (
            <Provider value={emailContext}>
                {this.props.children}
            </Provider>
        )
    }
}

export { EmailsProvider, Consumer as EmailsConsumer };