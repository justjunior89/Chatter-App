import React from 'react';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'

import MessageList from './components/MessageList'
import SendMessageForm from './components/SendMessageForm'
import RoomList from './components/RoomList'
import NewRoomForm from './components/NewRoomForm'
import './App.css';
// import {tokenUrl, instanceLocator}from './config'


class App extends React.Component {

  constructor(){
    super()
    this.state = {
      messages: []
    }
    this.sendMessage = this.sendMessage.bind(this) // this allows us to enable the send message function and have access to 'this' keyword
  }

  componentDidMount() {
        const chatManager = new ChatManager({
            instanceLocator: 'v1:us1:d8d6200d-b084-4b17-afcd-e65a33d5ef60',
            userId: 'Junior',
            tokenProvider: new TokenProvider({
                url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/d8d6200d-b084-4b17-afcd-e65a33d5ef60/token'
            })
        })
        // console.log(chatManager);
        chatManager.connect().then(currentUser => {
            this.currentUser = currentUser // takes the current user and hoods it to the component itself
            this.currentUser.subscribeToRoom({
            roomId: '19378706',
            messageLimit: 10,
            hooks: {
                onMessage: message => {
                    console.log('message.text: ', message.text);
                    this.setState({
                      messages: [...this.state.messages,message]
                    })
                }
            }
        })
        console.log('Print chatManager',chatManager);
        console.log('Successful connection', currentUser)
        })
        .catch(err => {
        console.log('Error on connection', err)
        })
    }

    // By convention data flows in one direction from parent component to child. However we need to extract the data that is coming
    // from our message SendMessageForm component in order that is handled in our main App component to that it can send that data
    // off to Chatkit. This concept is called inverse data flow in react. Essentially we are reaching up from child to parent component.
    sendMessage(text){
      this.currentUser.sendMessage({
        text: text,
        roomId: '19378706'
      })
    }

  render() {
    console.log(this.state.messages);
    return (
      <div className="App">
        <RoomList />
        <MessageList messages={ this.state.messages } />
        <SendMessageForm sendMessage={ this.sendMessage} /> {/* Inverse data flow concept, we are sending this.sendMessage down as a*/}
        <NewRoomForm /> {/* prop to the SendMessageForm component. Allowing the child component to have access to the method*/}
      </div>
    );
  }
}

export default App;
