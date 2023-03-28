import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Image,
  Dimensions,
  ImageBackground
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";

const weatherApiKey = "2315562051596862a09175d96efb1d88";
let url = `http://api.openweathermap.org/data/2.5/onecall?&units=metric&exclude=minutely&appid=${weatherApiKey}`;
const Weather = () => {
  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadForecast = async () => {
    setRefreshing(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission location denied");
    }

    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${weatherApiKey}`
    );
    const data = await response.json();

    if (!response.ok) {
      alert("Error", "Somting went wrong");
    } else {
      setForecast(data);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    loadForecast();
  }, []);

  if (!forecast) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }
  const image = {uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/35f67254827733.596dc6164fb7a.gif'};
  const current = forecast.weather[0];
  const sunsettime = new Date(forecast.sys.sunset * 1000)
    .toLocaleTimeString()
    .slice(0, 5);
  const sunrisetime = new Date(forecast.sys.sunrise * 1000)
    .toLocaleTimeString()
    .slice(0, 5);
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.bckimage}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadForecast()}
            />
          }
          style={{ marginTop: 50 }}
        >
          <Text style={styles.title}>Current weather</Text>
          <Text
            style={styles.locationtxt}
          >
            Location: {forecast.name}
          </Text>
          <View style={styles.current}>
            <Image
              style={styles.largeIcon}
              source={{
                uri: `http://openweathermap.org/img/wn/${current.icon}@4x.png`,
              }}
            />
            <Text style={styles.currentTemp}>
              {Math.round(forecast.main.temp - 273.15)}°C
            </Text>
          </View>
          <Text style={styles.currentDescription}>{current.description}</Text> 
          <View style={styles.extraInfo}>
             
            <View style={styles.info}>
              <Image
                source={require("../assets/temp.png")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 40 / 2,
                  marginLeft: 50,
                }}
              />
              <Text style={styles.textsty}>
                {Math.round(forecast.main.feels_like - 273.15) +
                  "°C\nFeels Like"}
              </Text>
            </View>
            <View style={styles.info}>
              <Image
                source={require("../assets/humidity.png")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 40 / 2,
                  marginLeft: 50,
                }}
              />
              <Text style={styles.textsty}>
                {Math.round(forecast.main.humidity) + "%\nHumidity"}
              </Text>
            </View>
            
          </View>
          <View>
            <Text style={styles.subtitle}>Sunrise Sunset</Text>
          </View>
          <View style={styles.extraInfo}>
            <View style={styles.info}>
              <Image
                source={require("../assets/sunrise.png")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 40 / 2,
                  marginLeft: 50,
                }}
              />
              <Text style={styles.textsty}>{sunrisetime + "\nSunrise"}</Text>
            </View>
            <View style={styles.info}>
              <Image
                source={require("../assets/sunset.png")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 40 / 2,
                  marginLeft: 50,
                }}
              />
              <Text style={styles.textsty}>{sunsettime + "\nSunset"}</Text>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Weather;

const styles = StyleSheet.create({
  bckimage:{
    flex:1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  title: {
    textAlign: "center",
    fontSize: 36,
    fontWeight: "bold",
    color: "#c5866d",
    textShadowColor:'black',
    textShadowOffset:{width:1,height:1},
    textShadowRadius:10
  },
  current: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
  },
  largeIcon: {
    width: 270,
    height: 225,
  },
  currentTemp: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#e59352",
    textShadowColor:'#a54352',
    textShadowOffset:{width:1,height:1},
    textShadowRadius:10
  },
  currentDescription: {
    width: "100%",
    textAlign: "center",
    fontWeight: "500",
    fontSize: 24,
    marginBottom: 16,
    textTransform: "capitalize",
    color:"white",
    textShadowColor:'black',
    textShadowOffset:{width:2,height:2},
    textShadowRadius:10
  },
  info: {
    width: Dimensions.get("screen").width / 2.5,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
  },
  extraInfo: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    padding: 10,
    marginHorizontal: 15,
  },
  textsty: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    textShadowColor:'pink',
    textShadowOffset:{width:1,height:1},
    textShadowRadius:10
  },
  subtitle: {
    fontSize: 24,
    marginTop: 10,
    marginLeft: 7,
    marginBottom:-15,
    color: "#fbd4a7",
    fontWeight: "bold",
    textShadowColor:'pink',
    textShadowOffset:{width:2,height:2},
    textShadowRadius:10
  },
  locationtxt: {
    alignItems: "center",
    textAlign: "center",
    fontSize: 18,
    fontWeight: 600,
    color: "#fbd4a7",
    textShadowColor:'darkgrey',
    textShadowOffset:{width:2,height:2},
    textShadowRadius:10
  },
});
