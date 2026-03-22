import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParams } from "../navigation/StackNavigator";

const HomeScreen = () => {

    const navigation = useNavigation<NavigationProp<RootStackParams>>()
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Home Screen</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Agregar')} style={styles.boton}>
                <Icon name="add-circle-outline" size={30} color="#500" />
                {/* <Text>Agregar</Text> */}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Eliminar')} style={{ ...styles.boton, backgroundColor: '#FFCDD2' }}>
                <Text style={{ ...styles.txtBoton, color: '#C62828' }}>Eliminar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Modificar')} style={{ ...styles.boton, backgroundColor: '#FFF9C4' }}>
              ellipsis-horizontal-circle-outline
              <Icon name="ellipsis-horizontal-circle-outline" size={30} color="#F9A825" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Consultar')} style={{ ...styles.boton, backgroundColor: '#ECEFF1' }}>
                <Icon name="reader-outline" size={30} color="#37474F" />
            </TouchableOpacity>

        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        marginTop: 30,
    },
    titulo: {
        width: '98%',
        fontSize: 28,
        fontWeight: '700',
        color: '#4A90E2', // azul más fuerte para contraste
        backgroundColor: '#D0EFFF', // azul pastel claro
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        overflow: 'hidden',
        textAlign: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        marginBottom: 30,
    },
    boton: {
        backgroundColor: '#A8E6CF', // verde pastel
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
        marginBottom: 10,
    },
    txtBoton: {
        color: '#2E7D32', // tono verde más oscuro para contraste
        fontWeight: '600',
        fontSize: 16,
        letterSpacing: 0.5,
    }
})