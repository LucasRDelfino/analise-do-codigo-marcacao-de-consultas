import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, ViewStyle } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import theme from '../styles/theme';
import Header from '../components/Header';
import DoctorList from '../components/DoctorList';
import TimeSlotList from '../components/TimeSlotList';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Tipagem da navegação para este screen.
 */
type CreateAppointmentScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateAppointment'>;
};

/**
 * Interface que define a estrutura de uma consulta (appointment).
 */
interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

/**
 * Interface para definir os dados de um médico.
 */
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

/**
 * Lista fixa de médicos disponíveis (mock para simulação).
 */
const availableDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. João Silva',
    specialty: 'Cardiologia',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'Dra. Maria Santos',
    specialty: 'Pediatria',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '3',
    name: 'Dr. Pedro Oliveira',
    specialty: 'Ortopedia',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: '4',
    name: 'Dra. Ana Costa',
    specialty: 'Dermatologia',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: '5',
    name: 'Dr. Carlos Mendes',
    specialty: 'Oftalmologia',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
];

/**
 * Componente principal para criação de agendamento.
 */
const CreateAppointmentScreen: React.FC = () => {
  // Recupera informações do usuário autenticado
  const { user } = useAuth();

  // Hook de navegação do React Navigation
  const navigation = useNavigation<CreateAppointmentScreenProps['navigation']>();

  // Estados do formulário
  const [date, setDate] = useState(''); // Data da consulta
  const [selectedTime, setSelectedTime] = useState<string>(''); // Horário escolhido
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null); // Médico selecionado
  const [loading, setLoading] = useState(false); // Indicador de carregamento
  const [error, setError] = useState(''); // Mensagem de erro

  /**
   * Função para criar uma nova consulta.
   */
  const handleCreateAppointment = async () => {
    try {
      setLoading(true);
      setError('');

      // Valida se os campos obrigatórios foram preenchidos
      if (!date || !selectedTime || !selectedDoctor) {
        setError('Por favor, preencha a data e selecione um médico e horário');
        return;
      }

      // Recupera consultas existentes no AsyncStorage
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      const appointments: Appointment[] = storedAppointments ? JSON.parse(storedAppointments) : [];

      // Cria objeto da nova consulta
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        patientId: user?.id || '',
        patientName: user?.name || '',
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date,
        time: selectedTime,
        specialty: selectedDoctor.specialty,
        status: 'pending', // Status inicial da consulta
      };

      // Adiciona a nova consulta à lista existente
      appointments.push(newAppointment);

      // Salva a lista atualizada no AsyncStorage
      await AsyncStorage.setItem('@MedicalApp:appointments', JSON.stringify(appointments));

      // Exibe mensagem de sucesso e retorna para a tela anterior
      alert('Consulta agendada com sucesso!');
      navigation.goBack();
    } catch (err) {
      // Caso ocorra algum erro no processo
      setError('Erro ao agendar consulta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header /> {/* Cabeçalho da aplicação */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Agendar Consulta</Title>

        {/* Campo para inserir a data da consulta */}
        <Input
          placeholder="Data (DD/MM/AAAA)"
          value={date}
          onChangeText={setDate}
          containerStyle={styles.input}
          keyboardType="numeric"
        />

        {/* Seção para selecionar um horário */}
        <SectionTitle>Selecione um Horário</SectionTitle>
        <TimeSlotList
          onSelectTime={setSelectedTime}
          selectedTime={selectedTime}
        />

        {/* Seção para selecionar um médico */}
        <SectionTitle>Selecione um Médico</SectionTitle>
        <DoctorList
          doctors={availableDoctors}
          onSelectDoctor={setSelectedDoctor}
          selectedDoctorId={selectedDoctor?.id}
        />

        {/* Exibe erro, se houver */}
        {error ? <ErrorText>{error}</ErrorText> : null}

        {/* Botão para confirmar agendamento */}
        <Button
          title="Agendar"
          onPress={handleCreateAppointment}
          loading={loading}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {/* Botão para cancelar e voltar */}
        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.cancelButton}
        />
      </ScrollView>
    </Container>
  );
};

/**
 * Estilos adicionais para o layout.
 */
const styles = {
  scrollContent: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  cancelButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
};

/**
 * Styled-components para layout
 */
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 10px;
  margin-top: 10px;
`;

const ErrorText = styled.Text`
  color: ${theme.colors.error};
  text-align: center;
  margin-bottom: 10px;
`;

export default CreateAppointmentScreen;
