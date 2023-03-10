import * as Location from 'expo-location';


const getLocation = async () => {
    let geolocation = null;

    let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return null;
      }

      let location = await Location.getCurrentPositionAsync({});
      let { latitude, longitude } = location.coords;

      let address = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (address.length > 0) {
        const text = address[0].city + ", "+ address[0].isoCountryCode;
        console.log("Found location!", text);
        geolocation = text;
    } else {
        console.log("ERROR: Cound not find location")
    }

    return geolocation;

}

export default getLocation
