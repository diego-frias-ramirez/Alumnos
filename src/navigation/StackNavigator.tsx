import { createStackNavigator } from '@react-navigation/stack'
import { AgregarScreen, ConsultarScreen, EliminarScreen, HomeScreen, ModificarScreen } from '../screens'

const Stack = createStackNavigator()

export const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Agregar" component={AgregarScreen} />
      <Stack.Screen name="Consultar" component={ConsultarScreen} />
      <Stack.Screen name="Modificar" component={ModificarScreen} />
      <Stack.Screen name="Eliminar" component={EliminarScreen} />
    </Stack.Navigator>
  )
}