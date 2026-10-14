import { ScrollView, StyleSheet, Text, useColorScheme } from 'react-native';

// Rascunho (M1). Conteúdo exigido: 04-arquitetura.md, "O que entra na política de privacidade".
const sections: { title: string; body: string }[] = [
  {
    title: 'Rascunho',
    body: 'Este texto ainda não é a versão final e vai mudar antes do lançamento.',
  },
  {
    title: 'Quem cuida dos seus dados',
    body: 'O Glowbox. Para qualquer pedido sobre seus dados, escreva para o e-mail do Glowbox (endereço a definir).',
  },
  {
    title: 'O que guardamos',
    body: 'Sua conta (nome, e-mail e foto vindos do Google ou da Apple), Minhas séries, Meus filmes, coleções, os episódios e filmes marcados como Visto com data e hora, suas opções do app e de avisos, o fuso do aparelho, o endereço de notificação e o tipo de aparelho, e a situação da assinatura. Nenhum dado de pagamento: ele fica com a loja.',
  },
  {
    title: 'Para que',
    body: 'Mostrar seu acervo e seu progresso, mandar avisos e liberar o Premium. Sem anúncios e sem venda de dados.',
  },
  {
    title: 'Com quem compartilhamos',
    body: 'Supabase (banco e login), Expo e os serviços de notificação do Google e da Apple (entregam os avisos), RevenueCat e as lojas (assinatura), Google e Apple (login). TMDB e TVmaze não recebem dados pessoais.',
  },
  {
    title: 'Onde ficam',
    body: 'Em servidores na região de São Paulo. Alguns dos serviços acima ficam fora do Brasil.',
  },
  {
    title: 'Por quanto tempo',
    body: 'Enquanto sua conta existir. Registros técnicos ficam por tempo limitado.',
  },
  {
    title: 'Como excluir',
    body: 'Em Configurações > Conta, dentro do app, ou por uma página na web (endereço a definir). Tudo o que é seu é apagado.',
  },
  {
    title: 'Seus direitos',
    body: 'Pela LGPD, você pode pedir acesso, correção e exclusão dos seus dados pelo e-mail do Glowbox.',
  },
];

export default function PrivacyScreen() {
  const isDark = useColorScheme() === 'dark';
  const color = isDark ? '#fff' : '#000';

  return (
    <ScrollView
      style={{ backgroundColor: isDark ? '#000' : '#fff' }}
      contentContainerStyle={styles.content}>
      {sections.map((section) => (
        <Text key={section.title} style={[styles.body, { color }]}>
          <Text style={styles.heading}>{section.title}{'\n'}</Text>
          {section.body}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    gap: 20,
  },
  heading: {
    fontSize: 17,
    fontWeight: '700',
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
});
