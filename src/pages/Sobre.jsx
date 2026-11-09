import StaticPage, { StaticSection } from '../components/StaticPage';

const Sobre = () => (
    <StaticPage
        title="Sobre a Casa do Velinho"
        description="Conheça a Casa do Velinho e a nossa proposta de decoração natalina para transformar a sua casa."
        subtitle="Decoração de Natal para transformar a sua casa em um verdadeiro conto natalino."
        updatedAt="09/11/2026">
        <StaticSection title="Quem somos">
            <p>
                A Casa do Velinho nasceu da vontade de deixar o Natal de cada casa mais bonito e
                acolhedor. Selecionamos árvores, pisca-piscas, guirlandas e enfeites para todos os
                estilos de decoração, do clássico ao moderno.
            </p>
        </StaticSection>

        <StaticSection title="Como trabalhamos">
            <p>
                Trabalhamos com fornecedores e parceiros logísticos selecionados, o que permite
                oferecer uma variedade maior de produtos. Parte dos itens pode ser enviada de
                centros de distribuição parceiros, por isso o prazo de entrega varia conforme o
                produto e a sua região — o prazo estimado é sempre informado na finalização da
                compra.
            </p>
        </StaticSection>

        <StaticSection title="Nosso compromisso">
            <p>
                Queremos que a sua experiência seja simples do começo ao fim: produtos bem
                descritos, preço claro, acompanhamento do pedido e atendimento humano quando você
                precisar.
            </p>
        </StaticSection>

        <StaticSection title="Fale com a gente">
            <ul className="flex flex-col gap-2">
                <li>
                    E-mail:{' '}
                    <a
                        href="mailto:contato@casadoVelinho.com"
                        className="text-gray-900 font-semibold underline">
                        contato@casadoVelinho.com
                    </a>
                </li>
                <li>
                    Telefone:{' '}
                    <a href="tel:+5511999999999" className="text-gray-900 font-semibold underline">
                        (11) 99999-9999
                    </a>
                </li>
                <li>Horário de atendimento: segunda a sexta, das 9h às 18h, e sábado, das 9h às 13h.</li>
            </ul>
        </StaticSection>
    </StaticPage>
);

export default Sobre;
