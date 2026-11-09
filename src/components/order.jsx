import { Clock, Dot, Gift, Tag, Truck } from "lucide-react"
import { Link } from "react-router-dom"

const Order = () => {
    const offers = [
    {
        id: 1, icon: <Gift className="w-4 h-4"/>, text: "Presente gratuito para compras acima de R$249,90."
    },
    {
        id: 2, icon: <Tag className="w-4 h-4"/>, text: "Promoção de 10% nos produtos de decoração."
    },
    {
        id: 3, icon: <Truck className="w-4 h-4"/>, text: "Frete grátis para compras acima de 249,90."
    },
    {
        id: 4, icon: <Clock className="w-4 h-4"/>, text: "Promoção Relâmpago: Acaba em 24h."
    }
    ];

    const duplicatedOffers = [...offers, ...offers, ...offers];
  return (
    <div className="bg-white py-3 overflow-hidden border-y border-gray-200"
    data-aos='fade-up'>
        <div className="relative">
            <div className="flex items-center gap-8 whitespace-nowrap animate-scroll">
                {duplicatedOffers.map((offer, idx) => (
                    <div key={`${offer.id}-${idx}`} className="flex items-center gap-2 px-4 py-1.5">
                        <div className="text-gray-600">
                        {offer.icon}
                        </div>
                        <p className="text-sm font-medium text-gray-700">{offer.text}</p>
                        <span className="text-xs text-gray-400 mx-2">
                            <Dot className="w-10 h-10"/>
                        </span>
                        <Link to="/shop" className="text-gray-900 text-sm font-semibold">
                            Compre Agora
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Order