// Avoid passing props deeply by using context

import React, { useContext } from 'react';
import { UserContext, UserProvider, UserConsumer } from './UserContext'
import { EmailProvider, EmailConsumer } from './EmailContext'


// functional component
const Avatar = () => (
    <UserConsumer>
        {({ currentUser }) => (
            <img src={currentUser.avatar} />
        )}
    </UserConsumer>
)

// avatar using React's useContext helper instead of consumer HOC
const Avatar2 = () => {
    const { currentUser } = useContext(UserContext)

    return (
        <img src={currentUser.avatar} />
    )
}

// class component
class Profile extends React.Component {
    static contextType =  UserContext // React 16.6 introduced contextType so a class component won't need to use the consumer HOC
                                      // this property needs to be the full context and not just the consumer
    render() {
        const { currentUser } = this.context

        return (
            <h1>Hello {currentUser.name}</h1>
        )
    }
}

const Root = () => (
    <Avatar />
)

ReactDOM.render(
    <UserProvider>
        <EmailProvider>
            <Root />
        </EmailProvider>
    </UserProvider>
)