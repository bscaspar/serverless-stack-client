import React, { Component } from 'react';
import { API, Storage } from 'aws-amplify';
import { s3Upload, s3Delete } from '../libs/awsLib';
import config from '../config';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import './Notes.css'

class Notes extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      note: null,
      content: "",
      attachmentUrl: null,
      isLoading: null,
      isDeleting: null
    };
  }

  async componentDidMount() {
    try {
      let attachmentUrl;
      const note = await this.getNote();
      const { content, attachment } = note;

      if (attachment) {
        attachmentUrl = await Storage.vault.get(attachment);
      }

      this.setState({
        note,
        content,
        attachmentUrl
      });
    } catch (e) {
      alert(e);
    }
  }

  getNote() {
    return API.get("notes", `/notes/${this.props.match.params.id}`);
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  handleFileChange = e => {
    this.file = e.target.files[0];
  }

  saveNote(note) {
    return API.put("notes", `/notes/${this.props.match.params.id}`, {
      body: note
    });
  }

  handleSubmit = async e => {
    let attachment;

    e.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller then ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
      return;
    }
    this.setState({ isLoading: true });

    try {
      attachment = await s3Upload(this.file);
      if (this.state.note.attachment) {
        await s3Delete(this.state.note.attachment);
      }

      await this.saveNote({
        content: this.state.content,
        attachment: attachment || this.state.note.attachment
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  deleteNote() {
    return API.del("notes", `/notes/${this.props.match.params.id}`);
  }

  handleDelete = async e => {
    e.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      await this.deleteNote();
      if (this.file) {
        await s3Delete(this.state.note.attachment);
      }
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  render() {
    return (
      <div className="Notes">
        {this.state.note &&
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="content">
              <FormControl
                onChange={this.handleChange}
                value={this.state.content}
                componentClass="textarea"
              />
            </FormGroup>
            {this.state.note.attachment &&
              <FormGroup>
                <ControlLabel>Attachment</ControlLabel>
                <FormControl.Static>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={this.state.attachmentUrl}
                  >
                    {this.formatFilename(this.state.note.attachment)}
                  </a>
                </FormControl.Static>
              </FormGroup>}
            <FormGroup controlId="file">
              {!this.state.note.attachment &&
                <ControlLabel>Attachment</ControlLabel>}
              <FormControl onChange={this.handleFileChange} type="file" />
            </FormGroup>
            <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving..."
            />
            <LoaderButton
              block
              bsStyle="danger"
              bsSize="large"
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting..."
            />
          </form>}
      </div>
    );
  }
}

export default Notes;