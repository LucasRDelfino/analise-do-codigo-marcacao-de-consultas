// Importações necessárias para o componente
import React from 'react';
import styled from 'styled-components/native';  // Biblioteca para estilização com Styled Components no React Native
import { ViewStyle } from 'react-native';  // Tipo para estilos de visualização
import { Card, Text, Avatar } from 'react-native-elements';  // Componentes da biblioteca react-native-elements
import theme from '../styles/theme';  // Importando o tema de cores

// Interface para tipagem das propriedades do componente AppointmentCard
interface AppointmentCardProps {
  doctorName: string;  // Nome do médico
  date: string;  // Data da consulta
  time: string;  // Hora da consulta
  specialty: string;  // Especialidade do médico
  status: 'pending' | 'confirmed' | 'cancelled';  // Status da consulta: pendente, confirmada ou cancelada
  onPress?: () => void;  // Função opcional para ser chamada ao pressionar o card
  style?: ViewStyle;  // Estilo opcional para o componente
}

// Componente funcional que representa o cartão de uma consulta médica
const AppointmentCard: React.FC<AppointmentCardProps> = ({
  doctorName,
  date,
  time,
  specialty,
  status,
  onPress,
  style,
}) => {
  // Função que retorna a cor com base no status da consulta
  const getStatusColor = () => {
    switch (status) {
      case 'confirmed':
        return theme.colors.success;  // Se confirmado, usa a cor de sucesso
      case 'cancelled':
        return theme.colors.error;  // Se cancelado, usa a cor de erro
      default:
        return theme.colors.primary;  // Caso contrário (pendente), usa a cor primária
    }
  };

  // JSX do componente, representando o layout do cartão
  return (
    <Card containerStyle={[styles.card, style]}>  {/* Estilo do cartão com possibilidade de personalizar o estilo */}
      <CardContent>
        {/* Informações do médico */}
        <DoctorInfo>
          <Avatar
            size="medium"
            rounded
            source={{ uri: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 10)}.jpg` }}  // Foto aleatória para o avatar
            containerStyle={styles.avatar}
          />
          <TextContainer>
            <DoctorName>{doctorName}</DoctorName>  {/* Exibe o nome do médico */}
            <Specialty>{specialty}</Specialty>  {/* Exibe a especialidade do médico */}
          </TextContainer>
        </DoctorInfo>

        {/* Informações sobre a consulta */}
        <AppointmentInfo>
          <InfoRow>
            <InfoLabel>Data:</InfoLabel>  {/* Rótulo para a data */}
            <InfoValue>{date}</InfoValue>  {/* Exibe a data da consulta */}
          </InfoRow>
          <InfoRow>
            <InfoLabel>Horário:</InfoLabel>  {/* Rótulo para o horário */}
            <InfoValue>{time}</InfoValue>  {/* Exibe a hora da consulta */}
          </InfoRow>
        </AppointmentInfo>

        {/* Status da consulta */}
        <StatusContainer>
          <StatusDot color={getStatusColor()} />  {/* Um ponto colorido indicando o status */}
          <StatusText color={getStatusColor()}>
            {status === 'confirmed' ? 'Confirmada' : status === 'cancelled' ? 'Cancelada' : 'Pendente'}  {/* Texto do status */}
          </StatusText>
        </StatusContainer>
      </CardContent>
    </Card>
  );
};

// Estilos para o componente (utilizando styled-components)
const styles = {
  card: {
    borderRadius: 10,  // Bordas arredondadas para o cartão
    marginHorizontal: 0,  // Margem horizontal
    marginVertical: 8,  // Margem vertical
    padding: 15,  // Espaçamento interno
    elevation: 3,  // Sombras para o cartão
    shadowColor: '#000',  // Cor da sombra
    shadowOffset: { width: 0, height: 2 },  // Deslocamento da sombra
    shadowOpacity: 0.25,  // Opacidade da sombra
    shadowRadius: 3.84,  // Raio da sombra
  },
  avatar: {
    backgroundColor: theme.colors.primary,  // Cor de fundo para o avatar
  },
};

// Estilos utilizando styled-components para o conteúdo do cartão
const CardContent = styled.View`
  padding: 10px;  // Adiciona um pouco de espaçamento dentro do cartão
`;

const DoctorInfo = styled.View`
  flex-direction: row;  // Alinha o avatar e o nome do médico horizontalmente
  align-items: center;  // Alinha verticalmente
  margin-bottom: 15px;  // Espaço inferior
`;

const TextContainer = styled.View`
  margin-left: 15px;  // Espaço entre o avatar e o texto
`;

const DoctorName = styled.Text`
  font-size: 18px;  // Tamanho da fonte para o nome do médico
  font-weight: bold;  // Nome em negrito
  color: ${theme.colors.text};  // Cor do texto (provida pelo tema)
`;

const Specialty = styled.Text`
  font-size: 14px;  // Tamanho da fonte para a especialidade
  color: ${theme.colors.text};  // Cor do texto
  opacity: 0.7;  // Opacidade reduzida para dar ênfase ao nome do médico
`;

const AppointmentInfo = styled.View`
  margin-bottom: 15px;  // Espaço inferior
`;

const InfoRow = styled.View`
  flex-direction: row;  // Alinha rótulo e valor horizontalmente
  justify-content: space-between;  // Distribui os itens com espaço entre eles
  margin-bottom: 5px;  // Espaço inferior
`;

const InfoLabel = styled.Text`
  font-size: 14px;  // Tamanho da fonte para o rótulo
  color: ${theme.colors.text};  // Cor do texto
  opacity: 0.7;  // Opacidade reduzida para os rótulos
`;

const InfoValue = styled.Text`
  font-size: 14px;  // Tamanho da fonte para o valor
  color: ${theme.colors.text};  // Cor do texto
  font-weight: 500;  // Fonte em peso médio
`;

const StatusContainer = styled.View`
  flex-direction: row;  // Alinha o ponto e o texto do status horizontalmente
  align-items: center;  // Alinha verticalmente
  margin-top: 10px;  // Espaço superior
`;

const StatusDot = styled.View<{ color: string }>`
  width: 8px;  // Tamanho do ponto
  height: 8px;  // Tamanho do ponto
  border-radius: 4px;  // Forma circular
  background-color: ${props => props.color};  // Cor do ponto com base no status
  margin-right: 8px;  // Espaço à direita do ponto
`;

const StatusText = styled.Text<{ color: string }>`
  font-size: 14px;  // Tamanho da fonte para o texto do status
  color: ${props => props.color};  // Cor do texto com base no status
  font-weight: 500;  // Fonte em peso médio
`;

// Exporta o componente para ser utilizado em outras partes da aplicação
export default AppointmentCard;
