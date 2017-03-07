/*******************************************************************
 * Copyright (c) 2016 Portland State University CS Capstone Team
 *
 * Authors: Siggy Hinds, Jiaqi Luo, Christopher Monk, Tristan de Nijs,
 *          Simone Talla Silatchom, Carson Volker, Anton Zipper
 *
 * This file is part of uLabCapstone, distributed under the MIT
 * open source license. For full terms see the LICENSE.md file
 * included in the root of this project.
 *******************************************************************/

import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import '../css/WordEditor.css';
import $ from 'jquery';


class WordEditor extends Component {
  constructor(props) {

    super(props);

    this.setWordText = this.setWordText.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleImageChange = this._handleImageChange.bind(this);
    this.updateLists = this.updateLists.bind(this);

    this.state = {
      file: '',
      imagePreviewURL: '',
      selectedVocabulary: 'core',
      selectedTitle: this.props.coreListTitles[0], //Defaults to core
      listTitles: this.props.coreListTitles, //Defaults to core
      wordText: '',
      imgUrl: '',
    };

  }

  _handleSubmit(e) {
    e.preventDefault();

    var fileSelected = this.state.file === '' ?
                       false
                     : true;
    // Create form data for API call
    // TODO: Change file extension based on file type selected by user
    if (fileSelected) {
      let newFileName = this.state.wordText + '.png';
      const formData = new FormData();
      formData.append('userfile', $('input[type=file]')[0].files[0], newFileName);

      // Uplood image via API call
      console.log("Uploading image...");
      this.props.handleAddNewImage(formData);
    }

    var voices = speechSynthesis.getVoices();
    var selectedVoice = this.props.selectedVoice;
    var msg = new SpeechSynthesisUtterance();
    for(var i = 0; i < voices.length; i++) {
      if(voices[i].name === selectedVoice) {
         msg.voice = voices[i];
         break;
      }
    }

    // Check for an empty string and a string with more than 25 characters
    if(this.state.wordText.length > 25){
      msg.text = "please enter less than 25 characters"
    }
    else if (this.state.wordText.length >= 1) {
      console.log('Submit New Word: ');
      this.props.handleAddNewWord(this.state.wordText, this.state.selectedTitle, this.state.selectedVocabulary, fileSelected);

      this.props.close(); //close modal
    }
    else {
      msg.text = "The text box is empty."
    }

    window.speechSynthesis.speak(msg);

    this.props.close(); //close modal
  }


  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }


  setWordText(e){
    this.setState({wordText: e.target.value});
  }

  /**
   * Updates listTitles to either Core's lists or Fringe's lists
   * Then sets the selectedTitle to the first item in the list
   * @param e : The event's name being passed in, either "core" or "fringe".
   */
  updateLists(e){
    if(e === "core") {
        this.setState({listTitles: this.props.coreListTitles});
	this.setState({selectedTitle: this.props.coreListTitles[0]});
    }
    if(e === "fringe") {
        this.setState({listTitles: this.props.fringeListTitles});
	this.setState({selectedTitle: this.props.fringeListTitles[0]});
    }
  }


  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} role="presentation"/>);
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }


    return (
      <div className="WordEditor">
        <h1>Add New Word</h1>

        <Row >
          <Col xs={12} md={6} lg={6}>
            <div className="imgPreview"> {$imagePreview} </div>
            <div className="wordPreview">{this.state.wordText} </div>
          </Col>

          <Col xs={12} md={6} lg={6}>
            <form className="AddNewWordForm" >
              <label> New Word Text: </label>
              <input type="text" name="word_text" className="WordTextInput" placeholder="Enter text" onChange={this.setWordText}/>
              <Row>
                <Col xs={12}>
                  <label>Choose an Image: </label>
                </Col>
                <Col xs={12}>
                  <input type="file" name="newfile" className="FileInputButton"
                      onChange={(e) => this._handleImageChange(e)}
                      accept="image/jpeg, image/png, image/jpg"/>
                </Col>
              </Row>

	      <Row>
	      <label>Add to Vocabulary: </label>
	      <select className="VocabTitles" defaultValue={this.state.selectedVocabulary}
                      onChange={(e) => {this.setState({selectedVocabulary: e.target.value});
                                         this.updateLists(e.target.value)}}>
		      <option key="core" value="core">Core</option>
		      <option key="fringe" value="fringe">Fringe</option>
	      </select>
	      </Row>

              <label>Add to List: </label>

              <select className="ListTitles" defaultValue={this.state.selectedTitle}
                      onChange={(e) => {
                        this.setState({selectedTitle: e.target.value})
                      }}>
                {
                  this.state.listTitles.map((title) => {
                    return <option key={title} value={title}>{title}</option>
                  })
                }
              </select>
            </form>
          </Col>
        </Row>
        <div className="modal-footer">

          <Button className="CancelNewWord" bsStyle="danger" onClick={this.props.close}>Cancel</Button>
          <Button type="submit" className="SaveNewWord" bsStyle="primary" onClick={this._handleSubmit}>Save</Button>

        </div>


      </div>
    );

  }
}

WordEditor.propTypes = {
  close: React.PropTypes.func,
  handleAddNewWord: React.PropTypes.func,
  handleAddNewImage: React.PropTypes.func
};


export default WordEditor;
