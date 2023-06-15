import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import 'expo-dev-client';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Header from '../component/Header';


export default function GoogleSigninScreen() {
    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    GoogleSignin.configure({
        webClientId: '369057772813-dfne8v9bh8phr01f87tjsf34dqro3pe2.apps.googleusercontent.com',
    });

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    const onGoogleButtonPress = async () => {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn();

        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        // Sign-in the user with the credential
        // return auth().signInWithCredential(googleCredential);

        const user_sign_in = auth().signInWithCredential(googleCredential);
        user_sign_in.then((user) => {
            console.log(user)
        })
            .catch((error) => {
                console.log(error)
            })
    }
    const signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await auth().signOut();
            setUser(null);
        } catch (error) {
            console.error(error)
        }
    }

    if (initializing) return null;

    if (!user) {
        return (
            <View style={styles.container}>
                <Header />
                <GoogleSigninButton style={styles.googleBtn}
                    onPress={onGoogleButtonPress}
                />
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.signIn}>
                <Text style={{ fontSize: 28, fontWeight: 'bold' }}>
                    {user.displayName}
                </Text>
                <Image source={{ uri: user.photoURL }}
                    style={styles.signImage}
                />
                <Button title='Sign Out'
                    onPress={signOut}
                />
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    googleBtn:{
        width: 300, 
        height: 70, 
        marginTop: 200
    },
    signIn:{
        marginTop: 100, 
        alignItems: 'center'
    },
    signImage:{
        width: 300, 
        height: 300, 
        margin: 50, 
        borderRadius: 150
    }
});
