import React, { Component } from 'react';
import ProfilePaper from './ProfilePaper';

class Profile extends Component {
    render() {

        return this.props.show.Profile
            ?
            <ProfilePaper {...this.props} />
            :
            ''

    }
}

export default Profile;