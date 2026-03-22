import { StackActions, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type alumnoEstructura = {
    matricula: string,
    aPaterno: string,
    aMaterno: string,
    nombre: string,
    sexo: string,
    dCalle: string,
    dNumero: number,
    dColonia: string,
    dCodigoPostal: number,
    aTelefono: string,
    aCorreo: string,
    aFacebook: string,
    aInstagram: string,
    tipoSangre: string,
    nombreContacto: string,
    telefonoContacto: string,
    contrasenha: string,
};

const initialState: alumnoEstructura = {
    matricula: '',
    aPaterno: '',
    aMaterno: '',
    nombre: '',
    sexo: '',
    dCalle: '',
    dNumero: 0,
    dColonia: '',
    dCodigoPostal: 0,
    aTelefono: '',
    aCorreo: '',
    aFacebook: '',
    aInstagram: '',
    tipoSangre: '',
    nombreContacto: '',
    telefonoContacto: '',
    contrasenha: '',
};

const EliminarScreen = () => {
    const [alumno, setAlumno] = useState<alumnoEstructura>(initialState);
    const [buscar, setBuscar] = useState('');
    const [show, setShow] = useState(false);

    const { matricula, aPaterno, aMaterno, nombre, aTelefono, aCorreo, nombreContacto, telefonoContacto } = alumno;

    const navigator = useNavigation();

    const notify = (num: number) => {
        if (num === 200) {
            Alert.alert('Hecho!', 'Alumno eliminado!');
            handleCancelar();
        }
        if (num === 100) {
            Alert.alert('No se pudo!', 'Alumno no eliminado!');
        }
        if (num === 101) {
            Alert.alert('No se pudo!', 'No se encontro un Alumno con esa matricula!');
        }
    };

    const alumnoConsultar = async () => {
        if (buscar === '') {
            Alert.alert('Error', 'Ingresa una matrícula');
            return;
        }
        try {
            const response = await axios.get(`http://10.0.2.1:3000/alumnos/eliminar/${buscar}`);
            if (response.data.status === 200) {
                if (response.data.result.length > 0) {
                    setAlumno(response.data.result[0]);
                    setShow(true);
                } else {
                    setAlumno(initialState);
                    setShow(false);
                    Alert.alert('No encontrado', 'No se encontró un alumno con esa matrícula');
                }
            }
        } catch (err: any) {
            console.log('No fue posible traer los datos', err);
        }
    };

    const handleCancelar = () => {
        setAlumno(initialState);
        setBuscar('');
        setShow(false);
        navigator.dispatch(StackActions.popToTop());
    };

    const handleEliminar = async () => {
        try {
            // Mantenemos tu lógica de POST a la IP y puerto 5000 como pediste
            const response = await axios.post('http://10.0.2.2:5000/alumno/eliminar', alumno);
            
            if (response.data.result.length > 0) {
                notify(response.data.status);
                handleCancelar();
            } else {
                notify(response.data.status);
            }
        } catch (err: any) {
            console.log(err);
            Alert.alert('Error', 'Hubo un fallo en la conexión');
        }
    };

    const handleRegresar = () => {
        setAlumno(initialState);
        setShow(false);
        setBuscar(''); // Corregido: antes tenías setMat pero tu estado es 'buscar'
        navigator.dispatch(StackActions.popToTop());
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Eliminar Alumno</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Ingresa matrícula"
                    value={buscar}
                    onChangeText={(val) => setBuscar(val)}
                    maxLength={10}
                    keyboardType="numeric"
                />
                <TouchableOpacity style={styles.btnBuscar} onPress={alumnoConsultar}>
                    <Text style={styles.txtBuscar}>Buscar</Text>
                </TouchableOpacity>

                {show && (
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoLabel}>Matrícula:</Text>
                        <Text style={styles.infoValue}>{matricula}</Text>

                        <Text style={styles.infoLabel}>Nombre:</Text>
                        <Text style={styles.infoValue}>{nombre} {aPaterno} {aMaterno}</Text>

                        <Text style={styles.infoLabel}>Teléfono:</Text>
                        <Text style={styles.infoValue}>{aTelefono}</Text>

                        <Text style={styles.infoLabel}>Correo:</Text>
                        <Text style={styles.infoValue}>{aCorreo}</Text>

                        <Text style={styles.infoLabel}>Nombre contacto:</Text>
                        <Text style={styles.infoValue}>{nombreContacto}</Text>

                        <Text style={styles.infoLabel}>Teléfono contacto:</Text>
                        <Text style={styles.infoValue}>{telefonoContacto}</Text>

                        <TouchableOpacity style={styles.btnEliminar} onPress={handleEliminar}>
                            <Text style={styles.txtBoton}>Eliminar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnCancelar} onPress={handleCancelar}>
                            <Text style={styles.txtBoton}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity onPress={handleRegresar} style={styles.boton}>
                    <Text style={styles.txtBotonVerde}>Regresar al Home</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default EliminarScreen;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#FFEBEE',
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#B71C1C',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#EF9A9A',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#FFFFFF',
    },
    btnBuscar: {
        backgroundColor: '#E53935',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 8,
    },
    txtBuscar: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    infoContainer: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginTop: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    infoLabel: {
        fontWeight: '600',
        color: '#555',
        fontSize: 13,
        marginTop: 6,
    },
    infoValue: {
        fontSize: 15,
        color: '#222',
        marginBottom: 2,
    },
    btnEliminar: {
        backgroundColor: '#C62828',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 16,
    },
    btnCancelar: {
        backgroundColor: '#EF9A9A',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 8,
    },
    txtBoton: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 15,
    },
    boton: {
        backgroundColor: '#A8E6CF',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
        marginTop: 30,
        alignItems: 'center',
    },
    txtBotonVerde: {
        color: '#2E7D32',
        fontWeight: '600',
        fontSize: 16,
        letterSpacing: 0.5,
    },
});