import React, { Component } from 'react'
import axios from 'axios'
import './style.css'

class ResultsComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            curPage: 1,
            itemPerPage: 9,
            totalPages: 0,
            totalItems: 0,
            items: [],
            login: '',
            selectedItems: [],
            sortColumn: 1,
            sortType: 'asc'
        }
    }

    componentDidMount() {
        const { login, users } = this.props;

        this.setState({
            totalPages: Math.ceil(users.length / 9),
            totalItems: users.length,
            items: [...users],
            login: login
        }, async () => {
            await this.sortItems();
            this.setSelectedItems();
        });
    }

    sortItems = () => {
        let newItems = [...this.state.items];
        let propertyName = '';
        const { sortColumn, sortType } = this.state;

        switch (sortColumn) {
            case 0:
                propertyName = 'avatar_url';
                break;
            case 1:
                propertyName = 'login';
                break;
            case 2:
                propertyName = 'type';
                break;
        }

        console.log(sortColumn, sortType, propertyName, newItems[0][propertyName]);

        newItems.sort((a, b) => {
            if (a[propertyName] < b[propertyName]) {
                if (sortType == 'asc')
                    return -1;
                else
                    return 1;
            }
            else if (a[propertyName] > b[propertyName]) {
                if (sortType == 'asc')
                    return 1;
                else
                    return -1;
            }
            else
                return 0;
        });

        console.log(newItems);

        this.setState({
            items: newItems,
            curPage: 1
        }, this.setSelectedItems);
    }

    setSelectedItems = () => {
        const { curPage, items, itemPerPage } = this.state;

        this.setState({
            selectedItems: items.slice(itemPerPage * (curPage - 1), itemPerPage * curPage)
        });
    }

    onChangePage = (pageIndex) => {
        this.setState({
            curPage: pageIndex
        }, () => {
            this.setSelectedItems();
        });
    }

    navigateToSearch = () => {
        this.props.history.push('/');
    }

    onSortColumn = (columnIdx) => {
        const { sortColumn, sortType } = this.state;

        if (sortColumn == columnIdx) {
            this.setState({
                sortType: sortType == 'asc' ? 'desc' : 'asc'
            }, this.sortItems);
        } else {
            this.setState({
                sortColumn: columnIdx
            }, this.sortItems);
        }
    }

    render() {
        const { selectedItems, curPage, itemPerPage, totalPages, totalItems, login, sortColumn, sortType } = this.state;
        const { onChangePage, onSortColumn } = this;

        let pagination = [];

        if (curPage >= 4)
            pagination.push(<li className={"page-item"} key={curPage - 3}><button className="page-link" onClick={() => onChangePage(curPage - 3)}>...</button></li>);

        for (let i = 1; i <= totalPages; i ++)
        {
            if (curPage - i >= -2 && curPage - i <= 2)
                pagination.push(<li className={"page-item" + (i == curPage ? " active" : "")} key={i}><button className="page-link" onClick={() => onChangePage(i)}>{i}</button></li>);
        }

        if (totalPages - curPage >= 3)
            pagination.push(<li className={"page-item"} key={curPage + 3}><button className="page-link" onClick={() => onChangePage(curPage + 3)}>...</button></li>);

        return (
            <>
                <button className="btn btn-primary float-right" onClick={this.navigateToSearch}>Back</button>
                <h1 className="mb-5">Users list - {totalItems} found</h1>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th className={"sorting " + (sortColumn == 0 ? (sortType == 'asc' ? 'sorting_asc' : 'sorting_desc') : '')} onClick={() => onSortColumn(0)} style={{width: '50%'}}>Avatar Url</th>
                            <th className={"sorting " + (sortColumn == 1 ? (sortType == 'asc' ? 'sorting_asc' : 'sorting_desc') : '')} onClick={() => onSortColumn(1)} style={{width: '25%'}}>Login</th>
                            <th className={"sorting " + (sortColumn == 2 ? (sortType == 'asc' ? 'sorting_asc' : 'sorting_desc') : '')} onClick={() => onSortColumn(2)} style={{width: '25%'}}>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedItems.map((item, index) => (                            
                            <tr key={JSON.stringify(item)}>
                                <td>{item.avatar_url}</td>
                                <td>{item.login}</td>
                                <td>{item.type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {itemPerPage != 'all' && (
                    <nav aria-label="Page navigation example">
                        <ul className="pagination justify-content-center">
                            <li className={"page-item" + (curPage == 1 ? " disabled" : "")}>
                                <button className="page-link" tabIndex="-1" onClick={() => onChangePage(curPage - 1)}>Previous</button>
                            </li>
                            {pagination}
                            <li className={"page-item" + (curPage == totalPages ? " disabled" : "")}>
                                <button className="page-link" onClick={() => onChangePage(curPage + 1)}>Next</button>
                            </li>
                        </ul>
                    </nav>
                )}
            </>
        );
    }
}

export default ResultsComponent;
