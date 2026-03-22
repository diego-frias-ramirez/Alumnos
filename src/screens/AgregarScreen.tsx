import { StackActions, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Yup from 'yup';

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

const validationSchema = Yup.object().shape({
    matricula: Yup.string()
        .required('La matrícula es obligatoria')
        .matches(/^[0-9]{10}$/i, 'Matrícula inválida'),
    aPaterno: Yup.string().required('Apellido paterno obligatorio'),
    aMaterno: Yup.string().required('Apellido materno obligatorio'),
    nombre: Yup.string().required('Nombre obligatorio'),
    sexo: Yup.string().min(1, 'Selecciona un sexo válido').required(),
    dCalle: Yup.string().required('Calle obligatoria'),
    dNumero: Yup.number().typeError('Debe ser un número').required('Número obligatorio'),
    dColonia: Yup.string().required('Colonia obligatoria'),
    dCodigoPostal: Yup.number().typeError('Debe ser numérico').required('Código postal obligatorio'),
    aTelefono: Yup.string()
        .matches(/^(\(\d{3}\)|\d{3})\d{7}$/, 'Formato inválido. Usa el formato (618)1232323')
        .required('Teléfono obligatorio'),
    aCorreo: Yup.string().email('Correo inválido').required('Correo obligatorio'),
    aFacebook: Yup.string().required('Facebook obligatorio'),
    aInstagram: Yup.string().required('Instagram obligatorio'),
    tipoSangre: Yup.string().required('Tipo de sangre obligatorio'),
    nombreContacto: Yup.string().required('Nombre de contacto obligatorio'),
    telefonoContacto: Yup.string()
        .matches(/^(\(\d{3}\)|\d{3})\d{7}$/, 'Teléfono de contacto - Formato inválido. Usa el formato (618)1232323')
        .required('Teléfono de contacto obligatorio'),
    contrasenha: Yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña obligatoria'),
});

export const AgregarScreen = () => {

    const [alumno, setAlumno] = useState<alumnoEstructura>(initialState);

    const {
        matricula,
        aPaterno,
        aMaterno, 
        nombre,
        sexo, 
        dCalle, 
        dNumero, 
        dColonia,
        dCodigoPostal, 
        aTelefono, 
        aCorreo, 
        aFacebook, 
        aInstagram, 
        tipoSangre,
        nombreContacto, 
        telefonoContacto, 
        contrasenha } = alumno;

    const navigator = useNavigation();

    const handleChange = (name: keyof alumnoEstructura, value: string | number) => {
        setAlumno({ ...alumno, [name]: value });
    };

    const handleCancelar = () => {
        setAlumno(initialState);
        navigator.dispatch(StackActions.popToTop());
    };

    const handleSubmit = async () => {
        try {
            await validationSchema.validate(alumno, { abortEarly: false });
            const response = await axios.post('http://10.0.2.1:3000/alumnos/agregar', alumno);
            notify(response.data.status);
        } catch (err: any) {
            if (err.inner) {
                const mensajes = err.inner.map((m: any) => `• ${m.message}`).join('\n');
                Alert.alert('Errores de validación', mensajes);
            } else {
                Alert.alert('Error', err.message);
            }
        }
    };

    const notify = (num: number) => {
        if (num === 200) {
            Alert.alert('¡Éxito!', 'Alumno agregado!');
            handleCancelar();
        } else {
            Alert.alert('Error', 'No se pudo agregar el alumno');
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Agregar Screen</Text>

                <TextInput style={styles.input} placeholder="Matrícula" maxLength={10} onChangeText={(val) => handleChange('matricula', val)} />
                <TextInput style={styles.input} placeholder="Apellido Paterno" onChangeText={(val) => handleChange('aPaterno', val)} />
                <TextInput style={styles.input} placeholder="Apellido Materno" onChangeText={(val) => handleChange('aMaterno', val)} />
                <TextInput style={styles.input} placeholder="Nombre(s)" onChangeText={(val) => handleChange('nombre', val)} />

                <Text style={styles.label}>Sexo:</Text>
                <Picker selectedValue={sexo} onValueChange={(val) => handleChange('sexo', val)} style={styles.input}>
                    <Picker.Item label="Selecciona..." value="" />
                    <Picker.Item label="Femenino" value="F" />
                    <Picker.Item label="Masculino" value="M" />
                </Picker>

                <TextInput style={styles.input} placeholder="Calle" onChangeText={(val) => handleChange('dCalle', val)} />
                <TextInput style={styles.input} placeholder="Número" keyboardType="numeric" onChangeText={(val) => handleChange('dNumero', val)} />
                <TextInput style={styles.input} placeholder="Colonia" onChangeText={(val) => handleChange('dColonia', val)} />
                <TextInput style={styles.input} placeholder="Código Postal" keyboardType="numeric" onChangeText={(val) => handleChange('dCodigoPostal', val)} />

                <TextInput style={styles.input} placeholder="Teléfono" maxLength={12} keyboardType="phone-pad" onChangeText={(val) => handleChange('aTelefono', val)} />
                <TextInput style={styles.input} placeholder="Correo Electrónico" keyboardType="email-address" onChangeText={(val) => handleChange('aCorreo', val)} />
                <TextInput style={styles.input} placeholder="Facebook" onChangeText={(val) => handleChange('aFacebook', val)} />
                <TextInput style={styles.input} placeholder="Instagram" onChangeText={(val) => handleChange('aInstagram', val)} />

                <Text style={styles.label}>Tipo de Sangre:</Text>
                <Picker selectedValue={tipoSangre} onValueChange={(val) => handleChange('tipoSangre', val)} style={styles.input}>
                    <Picker.Item label="Selecciona..." value="" />
                    <Picker.Item label="A+" value="A+" />
                    <Picker.Item label="A-" value="A-" />
                    <Picker.Item label="B+" value="B+" />
                    <Picker.Item label="B-" value="B-" />
                    <Picker.Item label="AB+" value="AB+" />
                    <Picker.Item label="AB-" value="AB-" />
                    <Picker.Item label="O+" value="O+" />
                    <Picker.Item label="O-" value="O-" />
                </Picker>

                <TextInput style={styles.input} placeholder="Nombre del contacto de emergencia" onChangeText={(val) => handleChange('nombreContacto', val)} />
                <TextInput style={styles.input} placeholder="Teléfono del contacto" maxLength={15} keyboardType="phone-pad" onChangeText={(val) => handleChange('telefonoContacto', val)} />
                <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry={true} onChangeText={(val) => handleChange('contrasenha', val)} />

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleCancelar} style={styles.boton}>
                    <Text style={styles.txtBoton}>Regresar al Home</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#E8F5E9',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        marginTop: 15,
        fontWeight: 'bold',
        color: '#33691E',
    },
    input: {
        borderWidth: 1,
        borderColor: '#A5D6A7',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#FFFFFF',
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
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
        marginBottom: 30,
        marginTop: 40,
        alignItems: 'center',
    },
    txtBoton: {
        color: '#2E7D32',
        fontWeight: '600',
        fontSize: 16,
        letterSpacing: 0.5,
    },
});