import React, { Component, useEffect, useLayoutEffect, useState } from 'react'
import { Text, View, SafeAreaView, ScrollView } from 'react-native'
// import policy from '../legal/privacypolicy.txt'
import Header from '../Header'

const PolicyScreen = () => {

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={{ flex: 1, padding: 10 }}>
        <SafeAreaView>
          <Header style={{marginHorizontal:"20%"}} title="Privacy Policy" />
        </SafeAreaView>
        <Text style={{ padding: 10 }}>
          Wing is a social networking app that allows users to create a profile with their name, age, and location in order to connect with other users on the app. This Privacy Policy describes how we collect, use, and share information about our users, and applies to your use of the Wing app and any related services provided by Wing Community, LLC ("Wing", "we", "us", or "our").
        </Text>
        <Text style={{ padding: 10 }}>1. Information We Collect
          When you create a profile on Wing, we may collect the following information:
          * Your name
          * Your age
          * Your location
          * Your email
        </Text>

        <Text style={{ padding: 10 }}>In addition, we may collect other information that you choose to provide us, such as a profile picture or a bio.
          We may also collect information about how you use the app, such as your interactions with other users, in order to improve the app and provide better services to our users.
        </Text>

        <Text style={{ padding: 10 }}>2. How We Use Your Information
          We use the information we collect to provide and improve the app, to connect users with each other, and to personalize your experience on the app. Specifically, we may use your information to:
          * Connect you with other users based on your location and preferences
          * Allow you to view and interact with other users' profiles
          * Send you push notifications and other communications related to the app
          * Improve the app and our services, such as by analyzing user behavior and feedback
          * Enforce our policies and comply with legal obligations
          * Send emails regarding our app updates and community news (which you may unsubscribe from if you wish)
        </Text>

        <Text style={{ padding: 10 }}>3. Information We Share
          We do not share your information with third parties for their own marketing purposes. However, we may share your information in the following circumstances:
          * With other users on the app, as necessary to provide our services
          * With service providers who help us operate the app, such as hosting and analytics providers
          * With law enforcement or other third parties as required by law or to protect our legal rights
          * In connection with a merger, acquisition, or other business transaction involving Wing
        </Text>

        <Text style={{ padding: 10 }}>4. Your Choices
          You can choose not to provide certain information, although this may limit your ability to use certain features of the app.
          You can also control the information that other users see on your profile by adjusting your privacy settings in the app.
          Finally, you can choose to delete your account at any time by contacting us at the email address below.
        </Text>

        <Text style={{ padding: 10 }}>5. Security
          We take reasonable measures to protect your information from unauthorized access or disclosure. However, no security measures are perfect and we cannot guarantee the security of your information.
        </Text>

        <Text style={{ padding: 10 }}>6. Children's Privacy
          Wing is not intended for use by users under the age of 18. If you are a parent or guardian and believe your child has provided information to us, please contact us at the email address below.
        </Text>

        <Text style={{ padding: 10 }}>7. Changes to This Policy
          We may update this Privacy Policy from time to time by posting a revised version on our website. Your continued use of the app after the effective date of the revised Privacy Policy constitutes your acceptance of the terms.
        </Text>
        <Text style={{ padding: 10 }}>8. Contact Us
          If you have any questions or concerns about this Privacy Policy, or if you would like to exercise your rights to access, correct, or delete your information, please contact us at support@wing.community.
        </Text>
      </View>
    </ScrollView>
  )
}

export default PolicyScreen
