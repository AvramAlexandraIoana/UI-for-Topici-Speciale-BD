
import React, {Component, useState} from 'react';
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {uploadImage} from "../../actions/uploadActions";
import { Link, withRouter } from 'react-router-dom';
import InfoService from "../../services/info.service";
import {  Form } from 'reactstrap';

import Resizer from "react-image-file-resizer";
const SERVE_URL = 'http://localhost:8080/api/info/location/getImage/';



class InfoEdit extends Component {
    emptyItem = {
        imagePreview: null,
        imageData: null,
        imageName: null,
        image: null,
        description: '',
        id: null
    }

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            contentError: null
        };

        this.handleUploadClick = this.handleUploadClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    async componentDidMount() {
        const {item} =  this.state;
        item.id = this.props.match.params.id;
        this.setState({item});
        if (this.props.match.params.id !== 'new') {
          InfoService.getInfo(this.props.match.params.id).then(
            response => {
                this.setState({item: response.data});
            },
            error => {
              this.setState({
                contentError:
                  (error.response &&
                    error.response.data &&
                    error.response.data.errors) ||
                  error.errors ||
                  error.errors.toString()
              });
            }
          )
        }
           
    }
    

    handleUploadClick(event) {
        let file = event.target.files[0];
        const imageData = new FormData();
        console.log(file);
        imageData.append('imageFile', file);
        let item = {...this.state.item};
        item.imageData = imageData;
        item.imagePreview =  URL.createObjectURL(file);
        item.imageName = file.name;
        this.setState({item});
    }

    
    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
        console.log(item);
    }

   
    async handleSubmit(event) {
        event.preventDefault();
        const {item} = this.state;
        if (!item.id) {
            item.id = this.props.match.params.id;
        }
        this.setState({item});
        console.log(item);
        InfoService.upload(item).then(
        response => {
            this.props.history.push('/location/list');
        },
        error => {
            this.setState({
            content:
                (error.response &&
                error.response.data &&
                error.response.data.message) ||
                error.message ||
                error.toString()
            });
        }
        );
    }

    render() {
        const {item, contentError} = this.state;
        return (
            <Container maxWidth="lg">
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        {
                            item.imagePreview && (
                                <Card>
                                    <CardActionArea>
                                        <CardMedia
                                            style={{height: '500px'}}
                                            component="img"
                                            image={
                                                item.imagePreview !== null ?
                                                    item.imagePreview :
                                                    "https://th.bing.com/th/id/Rc910111ff6eb2721d4aec15e8f10f0bd?rik=uEaFcYINVsKVbg&pid=ImgRaw"}
                                        />
                                    </CardActionArea>
                                </Card>
                            )
                        }

                        {
                            !item.imagePreview && (
                                <Card>
                                    <CardActionArea>
                                        <CardMedia
                                            style={{height: '500px'}}
                                            component="img"
                                            image={`${SERVE_URL}${this.props.match.params.id}`}
                                        />
                                    </CardActionArea>
                                </Card>
                            )
                        }
                       
                        <Form onSubmit={this.handleSubmit}>
                            {
                                contentError && (
                                    <input
                                        accept="image/*"
                                        id="upload-profile-image"
                                        type="file"
                                        onChange={this.handleUploadClick}
                                    />
                                )
                            }
                            {
                                !contentError && (
                                    <input
                                        style={{visibility: 'hidden' }} 
                                        accept="image/*"
                                        id="upload-profile-image"
                                        type="file"
                                        onChange={this.handleUploadClick}
                                    />
                                )
                            }
                            <label htmlFor="upload-profile-image">
                                <Button
                                    style={{marginBottom: '10px'}}
                                    variant="contained"
                                    color="primary"
                                    component="span"
                                >
                                    Change Image
                                </Button>
                            </label>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                required
                                value={item.description || ''}
                                onChange={this.handleChange} 
                                variant="outlined"
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                style={{marginTop: '10px'}}
                            >
                                { item.id ? ' Change Location Info': 'Add Location Info' }
                            </Button>
                        </Form>
                        {
                            !item.id && (
                                <Typography>{item.imageName === null ? "Select An Image To Upload" : "Image Uploaded. Saved as " + item.imageName}</Typography>
                            )   
                        }
                    </Grid>
                </Grid>
            </Container>
        );
    }
}


export default withRouter(InfoEdit);