import React, { Component } from 'react'
import axios from 'axios'
import './style.css'

class SearchComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login: '',
            isError: false,
            errMsg: '',
            btnText: 'Submit'
        };
    }

    onChangeLogin = (e) => {
        this.setState({
            login: e.target.value
        });
    }

    navigateToResults = () => {
        this.props.history.push('results');
    }

    onSubmit = (e) => {
        const { login } = this.state;

        this.setState({
            btnText: 'Submitting...'
        });

        axios.get(`https://api.github.com/search/users?q=${login} in:login`)
            .then(res => {
                this.props.setUsers(login, res.data.items, this.navigateToResults);
                this.setState({
                    btnText: 'Submit'
                });
            })
            .catch(err => {
                this.setState({
                    isError: true,
                    errMsg: JSON.stringify(err),
                    btnText: 'Submit'
                });
            });
    }

    render() {
        const { login, isError, errMsg, btnText } = this.state;

        return (
            <div className="search-form">
                <h4 className="mb-4">Search for Users</h4>
                <div className="form-group">
                    <input className="form-control" placeholder="Enter login ..." value={login} onChange={this.onChangeLogin} />
                </div>
                <button className="btn btn-primary submit-btn" onClick={this.onSubmit}>{btnText}</button>
                {isError == true && (
                    <div className="error-msg mt-5">
                        {errMsg}
                    </div>
                )}
            </div>
        );
    }
}

export default SearchComponent;
