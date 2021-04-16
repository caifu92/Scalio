import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container } from 'react-bootstrap'

import SearchComponent from './components/SearchComponent'
import ResultsComponent from './components/ResultsComponent'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            users: []
        };
    }

    setUsers = (login, users, callback) => {
        this.setState({
            login: login,
            users: users
        }, callback);
    }

    render() {
        const { login, users } = this.state;

        return (
            <Router>
                <Container className="my-5">
                    <Switch>
                        <Route exact path={["/", "/search"]} render={(props) => <SearchComponent setUsers={this.setUsers} {...props} />} />
                        <Route exact path="/results" render={(props) => <ResultsComponent users={users} login={login} {...props} />} />
                    </Switch>
                </Container>
            </Router>
        )
    }
}

export default App;
