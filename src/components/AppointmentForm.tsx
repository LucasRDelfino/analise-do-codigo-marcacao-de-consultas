// Importações necessárias
import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';  // Usado para estilização com Styled Components
import { Button, Input, Text } from 'react-native-elements';  // Componentes do react-native-elements
import { Platform, View, TouchableOpacity, Alert } from 'react-native';  // Importações do React Native para manipulação de interface
import theme from '../styles/theme';  // Tema de cores e espaçamento
import { Doctor } from '../types/doctors';  // Tipagem para médicos
import { Appointment } from '../types/appointments';  // Tipagem para agendamentos
import { authApiService } from '../services/authApi';  // Serviço de API para médicos
import { specialtiesApiService, Specialty } from '../services/specialtiesApi';  // Serviço de API para especialidades
import { User } from '../types/auth';  // Tipagem para usuários (médicos)

// Tipagem para as propriedades do componente AppointmentForm
type AppointmentFormProps = {
   onSubmit: (appointment: {
      doctorId: string;
      date: Date;
      time: string;
      description: string;
   }) => void;
};

// Função para gerar horários disponíveis (de 9h às 18h)
const generateTimeSlots = () => {
   const slots = [];
   for (let hour = 9; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);  // Adiciona horário de cada hora
      slots.push(`${hour.toString().padStart(2, '0')}:30`);  // Adiciona horário de cada meia hora
   }
   return slots;
};

// Componente principal para o formulário de agendamento de consulta
const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSubmit }) => {
   // Estados locais para os dados do formulário
   const [selectedDoctor, setSelectedDoctor] = useState<string>('');  // Médico selecionado
   const [dateInput, setDateInput] = useState('');  // Data do agendamento (input)
   const [selectedTime, setSelectedTime] = useState<string>('');  // Hora do agendamento
   const [description, setDescription] = useState('');  // Descrição do agendamento
   const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');  // Especialidade selecionada
   
   // Estados para dados carregados das APIs
   const [doctors, setDoctors] = useState<User[]>([]);  // Lista de médicos
   const [specialties, setSpecialties] = useState<Specialty[]>([]);  // Lista de especialidades
   const [loading, setLoading] = useState(true);  // Estado de carregamento
   
   const timeSlots = generateTimeSlots();  // Gera os horários disponíveis

   // Carrega especialidades e médicos ao montar o componente
   useEffect(() => {
      loadInitialData();
   }, []);

   // Carrega médicos quando uma especialidade é selecionada
   useEffect(() => {
      if (selectedSpecialty) {
         loadDoctorsBySpecialty(selectedSpecialty);
      } else {
         loadAllDoctors();
      }
   }, [selectedSpecialty]);

   // Função para carregar especialidades e médicos ao iniciar o componente
   const loadInitialData = async () => {
      try {
         setLoading(true);  // Começa o carregamento
         const [specialtiesData, doctorsData] = await Promise.all([
            specialtiesApiService.getAllSpecialties(),  // Carrega todas as especialidades
            authApiService.getAllDoctors(),  // Carrega todos os médicos
         ]);
         setSpecialties(specialtiesData);  // Armazena as especialidades
         setDoctors(doctorsData);  // Armazena os médicos
      } catch (error) {
         console.error('Erro ao carregar dados:', error);
         Alert.alert('Erro', 'Não foi possível carregar os dados. Tente novamente.');  // Exibe alerta de erro
      } finally {
         setLoading(false);  // Finaliza o carregamento
      }
   };

   // Função para carregar todos os médicos
   const loadAllDoctors = async () => {
      try {
         const doctorsData = await authApiService.getAllDoctors();  // Carrega todos os médicos
         setDoctors(doctorsData);  // Armazena os médicos
      } catch (error) {
         console.error('Erro ao carregar médicos:', error);
      }
   };

   // Função para carregar médicos por especialidade
   const loadDoctorsBySpecialty = async (specialty: string) => {
      try {
         const doctorsData = await authApiService.getDoctorsBySpecialty(specialty);  // Carrega médicos pela especialidade
         setDoctors(doctorsData);  // Armazena os médicos
         setSelectedDoctor('');  // Reseta o médico selecionado quando muda a especialidade
      } catch (error) {
         console.error('Erro ao carregar médicos por especialidade:', error);
      }
   };

   // Função para validar a data no formato DD/MM/AAAA
   const validateDate = (inputDate: string) => {
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;  // Regex para validar formato
      const match = inputDate.match(dateRegex);

      if (!match) return false;

      const [, day, month, year] = match;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const today = new Date();
      const maxDate = new Date(new Date().setMonth(new Date().getMonth() + 3));  // Data máxima é 3 meses a partir de hoje

      return date >= today && date <= maxDate;  // Verifica se a data está no intervalo permitido
   };

   // Função para formatar a data enquanto digita
   const handleDateChange = (text: string) => {
      const numbers = text.replace(/\D/g, '');  // Remove caracteres não numéricos
      let formattedDate = '';
      if (numbers.length > 0) {
         if (numbers.length <= 2) {
            formattedDate = numbers;
         } else if (numbers.length <= 4) {
            formattedDate = `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
         } else {
            formattedDate = `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
         }
      }

      setDateInput(formattedDate);  // Atualiza o estado com a data formatada
   };

   // Função para submeter o formulário
   const handleSubmit = () => {
      if (!selectedDoctor || !selectedTime || !description) {
         alert('Por favor, preencha todos os campos');
         return;
      }

      if (!validateDate(dateInput)) {
         alert('Por favor, insira uma data válida (DD/MM/AAAA)');
         return;
      }

      const [day, month, year] = dateInput.split('/');  // Separa a data
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      onSubmit({
         doctorId: selectedDoctor,  // Envia os dados ao callback de submit
         date,
         time: selectedTime,
         description,
      });
   };

   // Função para verificar se o horário está disponível (pode ser personalizada)
   const isTimeSlotAvailable = (time: string) => {
      return true;  // Sempre retorna disponível, pode ser alterado para lógica real
   };

   // Exibe uma mensagem de "Carregando..." enquanto os dados são carregados
   if (loading) {
      return (
         <Container>
            <Text>Carregando...</Text>
         </Container>
      );
   }

   // JSX para o formulário de agendamento
   return (
      <Container>
         <Title>Selecione a Especialidade</Title>
         <SpecialtyContainer>
            <SpecialtyButton 
               selected={selectedSpecialty === ''} 
               onPress={() => setSelectedSpecialty('')}
            >
               <SpecialtyText selected={selectedSpecialty === ''}>Todas as Especialidades</SpecialtyText>
            </SpecialtyButton>
            {specialties.map((specialty) => (
               <SpecialtyButton 
                  key={specialty.id} 
                  selected={selectedSpecialty === specialty.name} 
                  onPress={() => setSelectedSpecialty(specialty.name)}
               >
                  <SpecialtyText selected={selectedSpecialty === specialty.name}>
                     {specialty.name}
                  </SpecialtyText>
               </SpecialtyButton>
            ))}
         </SpecialtyContainer>

         <Title>Selecione o Médico</Title>
         <DoctorList>
            {doctors.map((doctor) => (
               <DoctorCard 
                  key={doctor.id} 
                  selected={selectedDoctor === doctor.id} 
                  onPress={() => setSelectedDoctor(doctor.id)}
               >
                  <DoctorImage source={{ uri: doctor.image }} />
                  <DoctorInfo>
                     <DoctorName>{doctor.name}</DoctorName>
                     <DoctorSpecialty>{doctor.specialty}</DoctorSpecialty>
                  </DoctorInfo>
               </DoctorCard>
            ))}
         </DoctorList
