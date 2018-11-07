import React, { Component } from "react";
import { Auth } from "aws-amplify";
import {
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./ChangeEmail.css";

class ChangeEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      email: "",
      codeSent: false,
      isConfirming: false,
      isSendingCode: false
    };
  }

  validateEmailForm() {
    return this.state.email.length > 0;
  }

  validateConfirmForm() {
    return this.state.code.length > 0;
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleUpdateClick = async e => {
    e.preventDefault();

    this.setState({
      isSendingCode: true
    });

    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(user, { email: this.state.email });

      this.setState({
        codeSent: true
      });
    } catch (e) {
      alert(e.message);
      this.setState({
        isSendingCode: false
      });
    }
  };

  handleConfirmClick = async e => {
    e.preventDefault();

    this.setState({
      isConfirming: true
    });

    try {
      await Auth.verifyCurrentUserAttributeSubmit("email", this.state.code);
      this.props.history.push("/settings");
    } catch (e) {
      alert(e.message);
      this.setState({
        isConfirming: false
      });
    }
  };

  renderUpdateForm() {
    return (
      <form onSubmit={this.handleUpdateClick}>
        <FormGroup bsSize="large" controlId="email">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          text="Update Email"
          loadingText="Updating..."
          disabled={!this.validateEmailForm()}
          isLoading={this.state.isSendingCode}
        />
      </form>
    );
  }

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmClick}>
        <FormGroup bsSize="large" controlId="code">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={this.state.code}
            onChange={this.handleChange}
          />
          <HelpBlock>
            Please check your email ({this.state.email}) for the confirmation
            code.
          </HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          text="Confirm"
          loadingText="Confirm..."
          isLoading={this.state.isConfirming}
          disabled={!this.validateConfirmForm()}
        />
      </form>
    );
  }

  render() {
    return (
      <div className="ChangeEmail">
        {!this.state.codeSent
          ? this.renderUpdateForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }
}

export default ChangeEmail;
