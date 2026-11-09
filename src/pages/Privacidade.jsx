import StaticPage, { StaticSection } from '../components/StaticPage';

const Privacidade = () => (
    <StaticPage
        title="Política de Privacidade"
        description="Como a Casa do Velinho coleta, usa e protege os seus dados pessoais, conforme a LGPD."
        subtitle="Como coletamos, usamos e protegemos os seus dados pessoais."
        updatedAt="09/11/2026">
        <p className="bg-amber-50 text-amber-800 text-sm rounded-lg px-4 py-3">
            Atenção: este é um texto modelo, criado para estruturar a página. Antes de publicar, ele
            deve ser revisado pelo jurídico e complementado com a razão social, o CNPJ e o contato do
            encarregado de dados (DPO).
        </p>

        <StaticSection title="1. Quais dados coletamos">
            <p>
                Coletamos os dados informados por você no checkout (nome, e-mail, telefone e endereço
                de entrega) e dados de navegação gerados automaticamente, como endereço IP, tipo de
                dispositivo e páginas visitadas.
            </p>
            <p>
                O carrinho e a lista de desejos são associados a um identificador anônimo gerado pelo
                navegador, o que permite manter os itens salvos sem exigir cadastro.
            </p>
        </StaticSection>

        <StaticSection title="2. Como usamos os seus dados">
            <p>
                Utilizamos os dados para processar pedidos, emitir notas fiscais, organizar a
                entrega, prestar atendimento, prevenir fraudes e, quando autorizado, enviar
                comunicações de marketing.
            </p>
        </StaticSection>

        <StaticSection title="3. Compartilhamento com terceiros">
            <p>
                Os dados podem ser compartilhados com parceiros necessários à execução do pedido,
                como processadores de pagamento, transportadoras e fornecedores responsáveis pelo
                envio dos produtos. Não vendemos dados pessoais.
            </p>
        </StaticSection>

        <StaticSection title="4. Cookies e tecnologias similares">
            <p>
                Usamos cookies e armazenamento local do navegador para manter o carrinho, lembrar
                preferências e medir o desempenho do site. Você pode desativar os cookies nas
                configurações do navegador, mas algumas funcionalidades podem deixar de funcionar.
            </p>
        </StaticSection>

        <StaticSection title="5. Seus direitos (LGPD)">
            <p>
                Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode solicitar
                confirmação de tratamento, acesso, correção, anonimização, portabilidade e exclusão
                dos seus dados, além de revogar o consentimento a qualquer momento.
            </p>
        </StaticSection>

        <StaticSection title="6. Segurança e retenção">
            <p>
                Adotamos medidas técnicas e administrativas para proteger os dados contra acessos não
                autorizados. As informações são mantidas apenas pelo tempo necessário ao cumprimento
                das finalidades descritas ou de obrigações legais.
            </p>
        </StaticSection>

        <StaticSection title="7. Contato">
            <p>
                Para exercer os seus direitos ou esclarecer dúvidas, escreva para{' '}
                <a
                    href="mailto:contato@casadoVelinho.com"
                    className="text-gray-900 font-semibold underline">
                    contato@casadoVelinho.com
                </a>
                .
            </p>
        </StaticSection>
    </StaticPage>
);

export default Privacidade;
