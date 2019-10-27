import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';

import io from 'socket.io-client';

import api from '../services/api';

import logo from '../assets/logo.png';

import like from '../assets/like.png';
import dislike from '../assets/dislike.png';

import itsamatch from '../assets/itsamatch.png';

export default function Main({ navigation }){
    const id = navigation.getParam('user');
    const [users, setUsers] = useState([]);
    const [matchDev, setMatchDev] = useState(false);

    useEffect(() => {
        async function loadUsers(){
            const response = await api.get('/devs',{
                headers: {
                    user: id
                }
            });
            setUsers(response.data);
        }

        loadUsers();
    },[id]);

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user: id }
        });
        
        socket.on('match', dev => {
            setMatchDev(dev);
        });

    }, [id]);

    async function handleLike() {
        const [user, ...rest] = users;
        await api.post(`devs/${user._id}/likes`, null, {
            headers: {user: id},
        });

        setUsers(rest);
    }
    async function handleDislike() {
        const [user, ...rest] = users;
        await api.post(`devs/${user._id}/dislikes`, null, {
            headers: {user: id},
        });

        setUsers(rest);
    }

    async function handleLogout(){
        await AsyncStorage.clear();

        navigation.navigate('Login');
    }

    return(
        <View style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image style={{marginTop: 30}} source={logo}/>
            </TouchableOpacity>
            <View style={styles.cardsContainer}>
                { users.length !== 0 ?  
                    users.map( (user, index) => (
                    <View key={user._id} style={[styles.card, {zIndex: users.length-index} ]}>
                        <Image style={styles.avatar} source={{ uri: `${user.avatar}`}}/>
                        <View style={styles.footer}>
                            <Text style={styles.name}>{user.name}</Text>
                            <Text numberOfLines={3} style={styles.bio}>{user.bio}</Text>
                        </View>
                    </View>
                ))
                :
                (
                    <Text style={styles.empty}>Acabou :(</Text>
                )
                
                }
            </View>

            { users.length > 0 &&
                (
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleDislike}>
                            <Image source={dislike}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleLike}>
                            <Image source={like}/>
                        </TouchableOpacity>
                    </View>
                )
            }
            <View />
            
            { matchDev && (
                <View zIndex={9999} style={styles.matchContainer}>
                    <Image source={itsamatch} />
                    <Image style={styles.matchAvatar} source={{ uri: `${matchDev.avatar}` }} />
                    <Text style={styles.matchName}>{matchDev.name}</Text>
                    <Text style={styles.matchBio}>{matchDev.bio}</Text>
                    <TouchableOpacity style={styles.fechar} onPress={() => {setMatchDev(null)}}>
                        <Text style={{fontSize: 20, color: '#FFF'}}>FECHAR</Text>
                    </TouchableOpacity>
                </View>
                ) 
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    empty: {
        alignSelf: 'center',
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold',
    },

    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
    },

    card: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    avatar: {
        flex: 1,
        height: 300,
    },
    footer: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },

    bio:{
        fontSize: 14,
        color: '#999',
        marginTop: 2,
        lineHeight: 18,

    },

    buttonsContainer: {
        flexDirection: 'row',
    },

    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2
    },

    matchContainer: {
        flex: 1,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,.8)',
    },
    matchAvatar: {
        marginTop: 20,
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 5,
        borderColor: '#FFF',
    },
    matchName: {
        fontSize: 30,
        color: '#FFF',
        fontWeight: 'bold',
        marginTop: 20,
    },
    matchBio: {
        fontSize: 20,
        color: '#EEE',
        marginTop: 20,
        textAlign: 'center',
        lineHeight: 34,
        paddingHorizontal: 30
    },
    fechar: {
        marginTop: 20,
        backgroundColor: 'rgba(0,0,0,0)',
    }
});

