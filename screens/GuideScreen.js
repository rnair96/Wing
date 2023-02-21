import React, { Component } from 'react'
import { Text, View, SafeAreaView, ScrollView} from 'react-native'
// import guidelines from '../legal/guidelines.txt'
import Header from '../Header'

const GuideScreen = () => {
    return (
      <ScrollView>
        <View style ={{flex:1, padding:10}}>
        <Header title = "Community Guidelines"/>
        <Text style={{padding:10}}>
1. Respectful Communication
Users of our app are expected to treat each other with respect and kindness at all times. Any messages or comments that are discriminatory, abusive, or hateful will not be tolerated. Users should not harass or bully other users, and should always strive to communicate in a respectful and positive manner.

2. Authentic Profiles
Users of our app should create profiles that are truthful and accurate. Users should not use fake names or photos, or provide false information about themselves. We want our community to be built on trust and authenticity, so users should be transparent and honest in their profiles.

3. Appropriate Content
Users of our app are expected to post and share appropriate content that is respectful and non-offensive. Any posts or comments that are discriminatory, abusive, or offensive will not be tolerated. Users should also refrain from sharing inappropriate or explicit content that may offend or harm others.

4. Mission-focused Interactions
Users of our app are encouraged to engage with each other in a way that is mission-focused, and centered around the pursuit of common goals. Users should seek to collaborate with other users to pursue shared goals, and should avoid interactions that are not aligned with this mission.

5. Privacy and Safety
Users of our app should take appropriate measures to protect their own privacy and safety, and the privacy and safety of other users. Users should not share personal information such as phone numbers or addresses in public posts or comments, and should always exercise caution when engaging with new users.

6. Reporting and Enforcement
Users of our app are encouraged to report any inappropriate behavior or content to the app's moderators through our support channel in the Help section of the Main Menu. The app's moderators will review all reports and take appropriate action, including warning or suspending users who violate these guidelines.

These are just a few of the guidelines that can be included in a social networking app for matching users based on common goals. The specifics of the guidelines will depend on the app's specific goals and user base. It's important to make sure that users understand the expectations for behavior and content, and that they know the consequences of violating these guidelines.</Text>
        </View>
      </ScrollView>
    )
}

export default GuideScreen