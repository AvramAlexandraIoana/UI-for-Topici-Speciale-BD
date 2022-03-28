import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

class AgencyEdit extends Component {
    emptyItem = {
        name: '',
        location: {}
    };
    
    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            locationList: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            const agency = await (await fetch(`/agency/${this.props.match.params.id}`)).json();
            this.setState({item: agency});
        }
        const locationList = await (await fetch(`/location/list`)).json();
        this.setState({locationList});
        console.log(this.state);

    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const {item} = this.state;
    
        await fetch('/agency' + (item.id ? '/' + item.id : ''), {
          method: (item.id) ? 'PUT' : 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(item),
        });
        this.props.history.push('/agency/list');
    }

    setLocation(value) {
        let item = { ...this.state.item};
        item.location = value;
        this.setState({item});
    }
    

    render() {
        const {item} = this.state;
        const locationList = this.state.locationList;
        const title = <h2>{item.id ? 'Edit Agency' : 'Add Agency'}</h2>;
    
        return <div>
          <Container>
            {title}
            <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                    <TextField
                            id="outlined-full-width"
                            label="Agency Name"
                            placeholder="Agency Name"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            name="name" 
                            id="name" 
                            required
                            value={item.name || ''}
                            onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Autocomplete
                        value={item.location || '' }
                        options={locationList}
                        getOptionLabel={(option) => option.city}
                        fullWidth
                        onChange={(event, value) =>  this.setLocation(value)}
                        renderInput={(params) => <TextField {...params}  required
                                    label="Location" variant="outlined" />}
                    />
                </FormGroup>
                <FormGroup>
                    <Button color="primary" type="submit">Save</Button>{' '}
                    <Button color="secondary" tag={Link} to="/agency/list">Cancel</Button>
                </FormGroup>
            </Form>
          </Container>
        </div>
      }
}

export default withRouter(AgencyEdit);