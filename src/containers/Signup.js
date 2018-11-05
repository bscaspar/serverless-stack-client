import React, { Component } from 'react';
import { HelpBlock, FormGroup, FormControl, ControlLabel, Modal, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import LoaderButton from '../components/LoaderButton';
import './Signup.css';
import { Auth } from 'aws-amplify';

export default class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            email: "",
            password: "",
            confirmPassword: "",
            confirmationCode: "",
            newUser: null,
            emailExists: false
        };

        this.handleFormReset = this.handleFormReset.bind(this);
    }

    validateForm() {
        return (
            this.state.email.length > 0 &&
            this.state.password.length > 0 &&
            this.state.password === this.state.confirmPassword
        );
    }

    validateConfirmationForm() {
        return this.state.confirmationCode.length > 0;
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        this.setState({ isLoading: true });

        try {
            const newUser = await Auth.signUp({
                username: this.state.email,
                password: this.state.password
            });
            this.setState({
                newUser
            });
        } catch (e) {
            if (e.code === "UsernameExistsException") {
                this.setState({emailExists: true})
            } else {
            alert(e.message);
            }
        }

        this.setState({ isLoading: false });
    }

    handleConfirmationSubmit = async (e) => {
        e.preventDefault();

        this.setState({ isLoading: true });

        try {
            await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
            await Auth.signIn(this.state.email, this.state.password);

            this.props.userHasAuthenticated(true);
            this.props.history.push("/");
        } catch (e) {
            alert(e.message);
            this.setState({ isLoading: false })
        }
    }

    handleFormReset() {
        this.setState({
            isLoading: false,
            email: "",
            password: "",
            confirmPassword: "",
            confirmationCode: "",
            newUser: null,
            emailExists: false,
        })
    }

    handleResendConfirmation = async (e) => {
        try {
            const newUser = Auth.resendSignUp(this.state.email);
            this.setState({ 
                newUser
             })
        } catch (e) {
            alert(e.message);
        }
    }

    renderConfirmationForm() {
        return (
            <form onSubmit={this.handleConfirmationSubmit}>
                <FormGroup controlId="confirmationCode" bsSize="large">
                    <ControlLabel>Confirmation Code</ControlLabel>
                    <FormControl
                        autoFocus
                        type="tel"
                        value={this.state.confirmationCode}
                        onChange={this.handleChange}
                    />
                    <HelpBlock>Please check your email for the code.</HelpBlock>
                </FormGroup>
                <LoaderButton
                    block
                    bsSize="large"
                    disabled={!this.validateConfirmationForm()}
                    type="submit"
                    isLoading={this.state.isLoading}
                    text="Verify"
                    loadingText="Verifying..."
                />
            </form>
        );
    }

    renderForm() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="email" bsSize="large">
                        <ControlLabel>Email</ControlLabel>
                        <FormControl
                            autoFocus
                            type="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="password" bsSize="large">
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </FormGroup>
                    <FormGroup controlId="confirmPassword" bsSize="large">
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                            value={this.state.confirmPassword}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </FormGroup>
                    <LoaderButton
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Signup"
                        loadingText="Signing up..."
                    />
                </form>
                {this.state.emailExists
                    &&
                    <div className="static-modal">
                        <Modal.Dialog>
                        <Modal.Header>
                            <Modal.Title>This email already exists!</Modal.Title>
                        </Modal.Header>
                            <Modal.Body>Select one of the below options to continue.</Modal.Body>
                            <Modal.Footer>
                                <Button type="reset" onClick={this.handleFormReset}>Signup with different email</Button>
                                <Button type="button" onClick={this.handleResendConfirmation} bsStyle="primary">Resend Confirmation Code</Button>
                                <LinkContainer to="/login">
                                    <Button type="button" bsStyle="success" onClick={this.showLogin}>Go to Login page</Button>
                                </LinkContainer>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </div>
                }
            </div>
        )
    }
    
    render() {
        return (
            <div className="Signup">
                {this.state.newUser === null
                    ? this.renderForm()
                    : this.renderConfirmationForm()}
            </div>
        )
    }
}