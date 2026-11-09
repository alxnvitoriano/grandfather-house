import StaticPage, { StaticSection } from '../components/StaticPage';

const Trocas = () => (
    <StaticPage
        title="Trocas e Devoluções"
        description="Como solicitar troca, devolução ou reembolso na Casa do Velinho, conforme o Código de Defesa do Consumidor."
        subtitle="Como solicitar troca, devolução ou reembolso."
        updatedAt="09/11/2026">
        <p className="bg-amber-50 text-amber-800 text-sm rounded-lg px-4 py-3">
            Atenção: este é um texto modelo, criado para estruturar a página. Antes de publicar, ele
            deve ser revisado pelo jurídico e complementado com os prazos praticados pela loja.
        </p>

        <StaticSection title="1. Desistência da compra">
            <p>
                Você pode desistir da compra em até 7 (sete) dias corridos após o recebimento do
                produto, sem precisar justificar o motivo, conforme o artigo 49 do Código de Defesa
                do Consumidor. Nesse caso, o valor pago é devolvido integralmente, incluindo o frete.
            </p>
        </StaticSection>

        <StaticSection title="2. Produto com defeito ou divergente">
            <p>
                Se o produto chegou danificado, incompleto ou diferente do anunciado, entre em
                contato em até 7 (sete) dias corridos após o recebimento. Vamos providenciar a troca
                ou o reembolso, sem custo para você.
            </p>
            <p>
                Para vícios aparentes ou de fácil constatação, aplicam-se os prazos legais de 30
                (trinta) dias para produtos não duráveis e 90 (noventa) dias para duráveis.
            </p>
        </StaticSection>

        <StaticSection title="3. Como solicitar">
            <p>
                Envie um e-mail para{' '}
                <a
                    href="mailto:contato@casadoVelinho.com"
                    className="text-gray-900 font-semibold underline">
                    contato@casadoVelinho.com
                </a>{' '}
                informando o número do pedido, o produto e o motivo da solicitação. Se houver
                defeito ou avaria, anexe fotos que comprovem o problema.
            </p>
        </StaticSection>

        <StaticSection title="4. Condições do produto">
            <p>
                O produto deve ser devolvido sem sinais de uso, com todos os acessórios e, sempre que
                possível, na embalagem original. A embalagem aberta para conferência não invalida o
                direito de desistência.
            </p>
        </StaticSection>

        <StaticSection title="5. Prazos de análise e reembolso">
            <p>
                Após recebermos o produto, a análise é feita em até 7 (sete) dias úteis, com
                comunicação do resultado por e-mail.
            </p>
            <p>
                Aprovada a devolução, o reembolso é solicitado em até 7 (sete) dias úteis. Em
                pagamentos por cartão de crédito, o prazo para o valor aparecer na fatura depende da
                operadora. Em pagamentos via Pix, a devolução é feita por transferência para a conta
                do titular do pedido.
            </p>
        </StaticSection>

        <StaticSection title="6. Custos de envio">
            <p>
                Na devolução por desistência, orientamos o envio e informamos o endereço de retorno.
                Quando o motivo for defeito, avaria ou divergência, o custo do envio de retorno é
                por nossa conta.
            </p>
        </StaticSection>
    </StaticPage>
);

export default Trocas;
