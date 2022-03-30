import { Component } from "react"
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import AgencyService from "../../services/agency.service";
import jwt_decode from "jwt-decode";


class AgencyList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            agencies: [],
            isLoading: true,
            userRoles: [],
            userId: null
        };
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        this.setState({isLoading: true});

        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          const decodeUser  = jwt_decode(user.accessToken);
          this.setState({
            userRoles: decodeUser.roles,
            userId: parseFloat(decodeUser.jti)

          });
        }

        console.log(user);
        this.setState({isLoading: true});
    
        AgencyService.getAgencyList().then(
            response => {
                this.setState({agencies: response.data, isLoading: false});
            },
            error => {
                this.setState({
                    contentError:
                      (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                      error.message ||
                      error.toString()
                });
            }
        )

    }

    async remove(id) {
        AgencyService.deleteAgency(id).then(
            response => {
                let updatedAgencies = [...this.state.agencies].filter(i => i.id !== id);
                this.setState({agencies: updatedAgencies});
            },
            error => {
                this.setState({
                    contentError:
                      (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                      error.message ||
                      error.toString()
                });
            }
        )
    }

    render() {
        const {agencies, isLoading, userRoles, userId} = this.state;

        const agencyList = agencies.map(agency => {
            return <tr key={agency.id}>
                <td style={{whiteSpace: 'nowrap'}}>
                  {agency.name}
                </td>
                <td style={{whiteSpace: 'nowrap'}}>
                    {agency.location.city}
                </td>
                <td  style={{whiteSpace: 'nowrap'}}>
                    {agency.location.country.countryName}
                </td>
                { userId == agency.userId && (userRoles.includes("ROLE_MANAGER") || userRoles.includes("ROLE_ADMIN")) && (
                    <td>
                        <Button variant="contained" color="primary" tag={Link} to={"/agency/" + agency.id}
                            style={{marginRight: 10}}>
                            Edit
                        </Button>
                        <Button variant="contained" color="danger"  onClick={() => this.remove(agency.id)}
                            style={{marginRight: 10}}>
                            Delete
                        </Button>
                    </td>
                )}
            </tr>
        });
    
        if (isLoading) {
          return <p>Loading...</p>;
        }

        return <div>
            <Container fluid>
                {(userRoles.includes("ROLE_MANAGER") || userRoles.includes("ROLE_ADMIN")) && (
                     <div  className="float-right">
                     <Button color="success" tag={Link} to="/agency/new">Add new agency</Button>
                 </div>
                )}
                <h3>Agency List</h3>
                <Table className="mt-4">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Country</th>
                            { (userRoles.includes("ROLE_MANAGER") || userRoles.includes("ROLE_ADMIN")) && (
                                <th>Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {agencyList}
                    </tbody>
                </Table>
            </Container>
    </div>
       
    }
}


export default AgencyList;