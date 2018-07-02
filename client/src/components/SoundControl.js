import React, { Component } from 'react';
import { connect } from 'react-redux';

class SoundControl extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sounds: this.props.sounds
        };
        this.handleSoundChange = this.handleSoundChange.bind(this);
    }

    handleSoundChange(event) {
        this.setState({sounds: event.target.checked});
        this.props.dispatch({ type: 'SET_SOUNDS', payload: { sounds: event.target.checked } });
    }

    render() {
        return (
            <input
            name="sounds"
            type="checkbox"
            checked={this.state.sounds}
            onChange={this.handleSoundChange} />
        );
    }
}

const mapStateToProps = state => ({
    sounds: state.sounds
});

export default connect(mapStateToProps)(SoundControl);
