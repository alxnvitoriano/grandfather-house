import StaticPage, { StaticSection } from '../components/StaticPage';

const Termos = () => (
    <StaticPage
        title="Termos de Uso"
        description="Condições gerais de uso do site e de compra na Casa do Velinho."
        subtitle="Condições gerais de uso do site e de compra."
        updatedAt="09/11/2026">
        <p className="bg-amber-50 text-amber-800 text-sm rounded-lg px-4 py-3">
            Atenção: este é um texto modelo, criado para estruturar a página. Antes de publicar, ele
            deve ser revisado pelo jurídico e complementado com a razão social, o CNPJ e o endereço
            da empresa.
        </p>

        <StaticSection title="1. Aceitação dos termos">
            <p>
                Ao navegar neste site ou realizar uma compra, você declara ter lido e aceito
                integralmente estes Termos de Uso. Caso não concorde com qualquer condição, pedimos
                que não utilize o site.
            </p>
        </StaticSection>

        <StaticSection title="2. Produtos e preços">
            <p>
                As imagens dos produtos são ilustrativas e podem apresentar pequenas variações de
                cor ou acabamento. Os preços exibidos são em reais (BRL) e podem ser alterados sem
                aviso prévio; o valor válido é o apresentado no momento da finalização da compra.
            </p>
            <p>
                Em caso de erro evidente de precificação, a compra poderá ser cancelada com a
                devolução integral do valor pago.
            </p>
        </StaticSection>

        <StaticSection title="3. Pedidos e pagamento">
            <p>
                O pedido é considerado confirmado após a aprovação do pagamento. Reservamo-nos o
                direito de recusar pedidos com indícios de fraude ou dados inconsistentes, com
                comunicação ao cliente.
            </p>
        </StaticSection>

        <StaticSection title="4. Entrega">
            <p>
                O prazo de entrega é informado no momento da compra e passa a contar após a
                confirmação do pagamento. Podem ocorrer atrasos por fatores externos, como greves,
                condições climáticas ou restrições logísticas.
            </p>
            <p>
                É responsabilidade do cliente informar um endereço completo e correto. Pedidos
                devolvidos por endereço incorreto ou ausência do destinatário podem gerar novo custo
                de entrega.
            </p>
        </StaticSection>

        <StaticSection title="5. Direito de arrependimento">
            <p>
                Nos termos do artigo 49 do Código de Defesa do Consumidor, você pode desistir da
                compra em até 7 (sete) dias corridos após o recebimento do produto, sem necessidade
                de justificativa. Os detalhes estão descritos na página de Trocas e Devoluções.
            </p>
        </StaticSection>

        <StaticSection title="6. Propriedade intelectual">
            <p>
                Marca, textos, imagens e layout deste site são protegidos por direitos autorais e não
                podem ser reproduzidos sem autorização prévia e por escrito.
            </p>
        </StaticSection>

        <StaticSection title="7. Legislação aplicável">
            <p>
                Estes termos são regidos pela legislação brasileira, em especial pelo Código de
                Defesa do Consumidor (Lei nº 8.078/1990) e pelo Marco Civil da Internet (Lei nº
                12.965/2014).
            </p>
        </StaticSection>
    </StaticPage>
);

export default Termos;
