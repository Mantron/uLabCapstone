import React, {Component} from 'react';
import { Row, Col } from 'react-bootstrap';

class SettingsBar extends Component {
    render() {
        // Disable the dropdown menu if the settingsLocked prop is true
        let disabled = this.props.settingsLocked ? 'disabled' : '';

        // Check the checkbox if the settingsLocked prop is true
        let checked = this.props.settingsLocked ? 'checked' : '';

        return (
            <div>
		<Row>
		<Col xs={12} md={4}>
                <form>
                    <label>Language: </label>
                    <select defaultValue={this.props.selectedLanguage} onChange={this.props.updateLanguage}
                            disabled={disabled}>
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                    </select>
                </form>
		</Col>
		<Col xs={12} md={4}>
                <form>
                    <label>Button Size</label>
                    <output>{this.props.buttonSize}</output>
                    <input type="range" value={this.props.buttonSize} onChange={this.props.resizeButton}
                           min="0" max="10" disabled={disabled} style={{margin: "auto", width: "200px"}}/>
                </form>
		</Col>
		<Col xs={12} md={4}>
                <p>
                    <input type="checkbox" id="lockCheck" onChange={this.props.lockToggle} checked={checked}/>
                    Lock Settings
                </p>
		</Col>
		</Row>
            </div>
        );
    }
}

SettingsBar.propTypes = {
    updateLanguage: React.PropTypes.func,
    lockToggle: React.PropTypes.func,
    resizeButton: React.PropTypes.func,
};

export default SettingsBar;

