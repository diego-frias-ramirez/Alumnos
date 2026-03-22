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
    matricula: Yup.string().required('La matrícula es obligatoria').matches(/^[0-9]{10}$/i, 'Matrícula inválida'),
    aPaterno: Yup.string().required('Apellido paterno obligatorio'),
    aMaterno: Yup.string().required('Apellido materno obligatorio'),
    nombre: Yup.string().required('Nombre obligatorio'),
    sexo: Yup.string().min(1, 'Selecciona un sexo válido').required(),
    dCalle: Yup.string().required('Calle obligatoria'),
    dNumero: Yup.number().typeError('Debe ser un número').required('Número obligatorio'),
    dColonia: Yup.string().required('Colonia obligatoria'),
    dCodigoPostal: Yup.number().typeError('Debe ser numérico').required('Código postal obligatorio'),
    aTelefono: Yup.string().matches(/^(\(\d{3}\)|\d{3})\d{7}$/, 'Formato inválido. Usa (618)1232323').required(),
    aCorreo: Yup.string().email('Correo inválido').required(),
    aFacebook: Yup.string().required(),
    aInstagram: Yup.string().required(),
    tipoSangre: Yup.string().required('Tipo de sangre obligatorio'),
    nombreContacto: Yup.string().required(),
    telefonoContacto: Yup.string().matches(/^(\(\d{3}\)|\d{3})\d{7}$/, 'Formato inválido').required(),
    contrasenha: Yup.string().min(6, 'Mínimo 6 caracteres').required(),
});

const ModificarScreen = () => {

    const [alumno, setAlumno] = useState<alumnoEstructura>(initialState);
    const [buscar, setBuscar] = useState('');
    const [show, setShow] = useState(false);
    const [btnGuardar, setBtnGuardar] = useState(true);

    const { matricula, aPaterno, aMaterno, nombre, sexo, dCalle, dNumero, dColonia, dCodigoPostal,
        aTelefono, aCorreo, aFacebook, aInstagram, tipoSangre, nombreContacto, telefonoContacto } = alumno;

    const navigator = useNavigation();

    const handleChange = (name: keyof alumnoEstructura, value: string | number) => {
        setAlumno({ ...alumno, [name]: value });
    };

    const alumnoConsultar = async () => {
        if (buscar === '') {
            Alert.alert('Error', 'Ingresa una matrícula');
            return;
        }
        try {
            const response = await axios.get(`http://10.0.2.1:3000/alumnos/modificar/${buscar}`);
            if (response.data.status === 200) {
                if (response.data.result.length > 0) {
                    setAlumno(response.data.result[0]);
                    setShow(true);
                    setBtnGuardar(false);
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

    const handleSubmit = async () => {
        try {
            await validationSchema.validate(alumno, { abortEarly: false });
            const response = await axios.put('http://10.0.2.1:3000/alumnos/modificar', alumno);
            if (response.data.status === 200) {
                Alert.alert('¡Éxito!', 'Alumno modificado!');
                handleCancelar();
            } else {
                Alert.alert('Error', 'No se pudo modificar el alumno');
            }
        } catch (err: any) {
            if (err.inner) {
                const mensajes = err.inner.map((m: any) => `• ${m.message}`).join('\n');
                Alert.alert('Errores de validación', mensajes);
            } else {
                Alert.alert('Error', err.message);
            }
        }
    };

    const handleCancelar = () => {
        setAlumno(initialState);
        setBuscar('');
        setShow(false);
        setBtnGuardar(true);
        navigator.dispatch(StackActions.popToTop());
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Modificar Alumno</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Ingresa matrícula a buscar"
                    value={buscar}
                    onChangeText={(val) => setBuscar(val)}
                    maxLength={10}
                    keyboardType="numeric"
                />
                <TouchableOpacity style={styles.btnBuscar} onPress={alumnoConsultar}>
                    <Text style={styles.txtBuscar}>Buscar</Text>
                </TouchableOpacity>

                {show && (
                    <View>
                        <TextInput style={styles.input} placeholder="Matrícula" value={matricula} onChangeText={(val) => handleChange('matricula', val)} />
                        <TextInput style={styles.input} placeholder="Apellido Paterno" value={aPaterno} onChangeText={(val) => handleChange('aPaterno', val)} />
                        <TextInput style={styles.input} placeholder="Apellido Materno" value={aMaterno} onChangeText={(val) => handleChange('aMaterno', val)} />
                        <TextInput style={styles.input} placeholder="Nombre(s)" value={nombre} onChangeText={(val) => handleChange('nombre', val)} />

                        <Text style={styles.label}>Sexo:</Text>
                        <Picker selectedValue={sexo} onValueChange={(val) => handleChange('sexo', val)} style={styles.input}>
                            <Picker.Item label="Selecciona..." value="" />
                            <Picker.Item label="Femenino" value="F" />
                            <Picker.Item label="Masculino" value="M" />
                        </Picker>

                        <TextInput style={styles.input} placeholder="Calle" value={dCalle} onChangeText={(val) => handleChange('dCalle', val)} />
                        <TextInput style={styles.input} placeholder="Número" keyboardType="numeric" value={String(dNumero)} onChangeText={(val) => handleChange('dNumero', val)} />
                        <TextInput style={styles.input} placeholder="Colonia" value={dColonia} onChangeText={(val) => handleChange('dColonia', val)} />
                        <TextInput style={styles.input} placeholder="Código Postal" keyboardType="numeric" value={String(dCodigoPostal)} onChangeText={(val) => handleChange('dCodigoPostal', val)} />
                        <TextInput style={styles.input} placeholder="Teléfono" maxLength={12} keyboardType="phone-pad" value={aTelefono} onChangeText={(val) => handleChange('aTelefono', val)} />
                        <TextInput style={styles.input} placeholder="Correo Electrónico" keyboardType="email-address" value={aCorreo} onChangeText={(val) => handleChange('aCorreo', val)} />
                        <TextInput style={styles.input} placeholder="Facebook" value={aFacebook} onChangeText={(val) => handleChange('aFacebook', val)} />
                        <TextInput style={styles.input} placeholder="Instagram" value={aInstagram} onChangeText={(val) => handleChange('aInstagram', val)} />

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

                        <TextInput style={styles.input} placeholder="Nombre del contacto de emergencia" value={nombreContacto} onChangeText={(val) => handleChange('nombreContacto', val)} />
                        <TextInput style={styles.input} placeholder="Teléfono del contacto" maxLength={15} keyboardType="phone-pad" value={telefonoContacto} onChangeText={(val) => handleChange('telefonoContacto', val)} />

                        <TouchableOpacity style={[styles.button, btnGuardar && styles.buttonDisabled]} onPress={handleSubmit} disabled={btnGuardar}>
                            <Text style={styles.buttonText}>Guardar Cambios</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleCancelar} style={styles.btnCancelar}>
                            <Text style={styles.txtBoton}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity onPress={handleCancelar} style={styles.boton}>
                    <Text style={styles.txtBotonVerde}>Regresar al Home</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default ModificarScreen;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#FFF9C4',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#F57F17',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        marginTop: 10,
        fontWeight: 'bold',
        color: '#F57F17',
    },
    input: {
        borderWidth: 1,
        borderColor: '#FFE082',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#FFFFFF',
    },
    btnBuscar: {
        backgroundColor: '#F9A825',
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
    button: {
        backgroundColor: '#F9A825',
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#FFE082',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    btnCancelar: {
        backgroundColor: '#FFE082',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 8,
    },
    txtBoton: {
        color: '#F57F17',
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