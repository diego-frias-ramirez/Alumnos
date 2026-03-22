import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Modal, 
  ScrollView, 
  SafeAreaView, 
  Alert 
} from "react-native";
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';

// Estructura del Alumno
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
  tiposangre: string,
  nombreContacto: string,
  telefonoContacto: string,
  contrasenha: string,
  foto: '',
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
  tiposangre: '',
  nombreContacto: '',
  telefonoContacto: '',
  contrasenha: '',
  foto: '',
};

const ConsultarScreen = () => {
  const [alumnos, setAlumnos] = useState<alumnoEstructura[]>([]);
  const [alumno, setAlumno] = useState<alumnoEstructura>(initialState);
  const [show, setShow] = useState(false);
  const [buscar, setBuscar] = useState('');

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
    tiposangre,
    nombreContacto,
    telefonoContacto,
    contrasenha,
  } = alumno;

  const navigator = useNavigation();

  useEffect(() => {
    traerAlumnos();
  }, []);

  const traerAlumnos = async () => {
    const nombreBusqueda = (buscar === '' ? '_' : buscar);
    const response = await axios.get(`http://10.0.2.2:5000/alumnos/traer/${nombreBusqueda}`).then((response) => {
      if (response.data.status === 200) {
        setAlumnos(response.data.result);
      } else {
        console.log('no fue posible traer los datos');
        console.log(response);
      }
    });
  };

  const handleBuscar = () => {
    traerAlumnos();
  };

  const handleChange = (valor: string) => {
    setBuscar(valor);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleRegresar = () => {
    setAlumno(initialState);
    setShow(false);
    // setMat('');
    navigator.dispatch(StackActions.popToTop());
  };

  const renderField = (label: string, value: any) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  const renderItem = ({ item }: { item: alumnoEstructura }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => {
        setAlumno(item);
        setShow(true);
      }}
    >
      <Text style={styles.text}>{item.nombre} {item.aPaterno}</Text>
      <Text style={styles.label}>Matrícula: {item.matricula}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Consultar Estudiante</Text>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar por nombre del alumno"
          placeholderTextColor="#4caf50"
          value={buscar}
          onChangeText={(valor) => handleChange(valor)}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleBuscar}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={alumnos}
        keyExtractor={(item) => item.matricula}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      <Modal visible={show} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>Detalles del Alumno</Text>
              {renderField('Matrícula', alumno.matricula)}
              {renderField('Nombre', alumno.nombre + ' ' + alumno.aPaterno + ' ' + alumno.aMaterno)}
              {renderField('Sexo', (alumno.sexo === '1') ? 'Femenino' : 'Masculino')}
              {renderField('Dirección', alumno.dCalle + ' ' + alumno.dNumero + ' ' + alumno.dColonia + ' ' + alumno.dCodigoPostal)}
              {renderField('Teléfono', alumno.aTelefono)}
              {renderField('Correo electrónico', alumno.aCorreo)}
              {renderField('Facebook', alumno.aFacebook)}
              {renderField('Instagram', alumno.aInstagram)}
              {renderField('Tipo de sangre', alumno.tiposangre)}
              {renderField('Nombre contacto de emergencia', alumno.nombreContacto)}
              {renderField('Teléfono contacto', alumno.telefonoContacto)}
            </ScrollView>

            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity onPress={handleRegresar} style={styles.boton}>
        <Text style={styles.txtBoton}>Regresar al Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ConsultarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f2f1',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#004d40',
    textAlign: 'center',
    marginVertical: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#dcedc8', 
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#2e7d32',
    borderColor: '#aed581',
    borderWidth: 1,
    marginRight: 8,
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
    marginBottom: 15,
    marginTop: 5,
    width: '90%',
    alignSelf: 'center',
  },
  txtBoton: {
    color: '#2E7D32', 
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#a5d6a7',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#1b5e20',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#c8e6c9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: '#2e7d32',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#f1f8e9',
    width: '90%',
    borderRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 16,
  },
  field: {
    marginBottom: 12,
  },
  closeButton: {
    backgroundColor: '#81c784',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignSelf: 'center',
  },
  value: {
    fontSize: 16,
    color: '#2e7d32',
  },
});