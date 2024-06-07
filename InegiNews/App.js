import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, ScrollView, StyleSheet, Linking } from 'react-native';
import { Header, ListItem, Text } from 'react-native-elements';
import axios from 'axios';
import xml2js from 'xml2js';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
    const [news, setNews] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get('https://www.inegi.org.mx/rss/noticias/xmlfeeds?p=4,29');
      const parsedData = await xml2js.parseStringPromise(response.data, { mergeAttrs: true });
      const items = parsedData.rss.channel[0].row.map((item) => ({
        title: item.title[0],
        link: item.link[0],
        description: item.description[0],
        pubDate: item.pubdate[0],
      }));
      setNews(items);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView>
      <Header centerComponent={{ text: 'Noticias INEGI', style: { color: '#ffff', fontSize: 35 } }} />
      <ScrollView>
        {news.map((item, index) => (
          <ListItem key={index} bottomDivider onPress={() => navigation.navigate('Detail', { link: item.link })}>
            <ListItem.Content>
              <ListItem.Title>{item.title}</ListItem.Title>
              <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
              <Text>{new Date(item.pubDate).toLocaleString()}</Text>
            </ListItem.Content>
          </ListItem>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const DetailScreen = ({ route }) => {
  const { link } = route.params;

  useEffect(() => {
    Linking.openURL(link);
  }, [link]);

  return null;
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name='Tlaxcala, Tlax.' component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
