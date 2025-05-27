import { View, Image, Text } from 'react-native';
import styles from '../styles/recPosterStyle'; // Assuming you have a styles file for RecPoster

type RecPosterProps = {
    posterUrl: string;
    title: string;
    genres: string[];
};

export default function RecPoster({ posterUrl, title, genres }: RecPosterProps) {
    
    return (
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
        <Image
            source={{ uri: posterUrl }}
            style={{ width: 150, height: 225, borderRadius: 10 }}
        />
        <Text style={{ marginTop: 5, fontWeight: 'bold', fontSize: 16 }}>
            {title}
        </Text>
        <Text style={{ color: '#666', fontSize: 14 }}>{genres.slice(0,2).join(' - ')}</Text>
        </View>
    );
}