import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const GetUserLocation = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setError(null);
      },
      error => setError(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  return (
    <View>
      {error ? (
        <Text>Error: {error}</Text>
      ) : (
        <>
          <Text>Latitude: {latitude}</Text>
          <Text>Longitude: {longitude}</Text>
        </>
      )}
    </View>
  );
};

export default GetUserLocation;