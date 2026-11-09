import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Check, ShoppingBag, Tag, Trash2, X } from 'lucide-react';
import { formatPrice, parsePrice, useCart } from '../context/CartContext';
import Seo from '../components/Seo';
import {
    calculateShipping,
    missingForFreeShipping as missingForFreeShippingAmount,
} from '../lib/shipping';
import { calculateDiscount, findCoupon } from '../data/coupons';

const UFS = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
    'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
    'SP', 'SE', 'TO',
];

const emptyForm = {
    name: '',
    email: '',
    phone: '',
    zip: '',
    address: '',
    number: '',
    complement: '',
    city: '',
    state: '',
};

const onlyDigits = (value) => value.replace(/\D/g, '');

const maskCep = (value) =>
    onlyDigits(value).slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2');

const maskPhone = (value) => {
    const digits = onlyDigits(value).slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10)
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

// Cada campo obrigatório tem uma regra que devolve a mensagem de erro ou ''.
const validators = {
    name: (value) => {
        if (!value.trim()) return 'Informe o nome completo.';
        if (value.trim().length < 3) return 'Nome muito curto.';
        return '';
    },
    email: (value) => {
        if (!value.trim()) return 'Informe o e-mail.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())) return 'E-mail inválido.';
        return '';
    },
    phone: (value) => {
        const digits = onlyDigits(value);
        if (!digits) return 'Informe o telefone.';
        if (digits.length < 10) return 'Telefone incompleto.';
        return '';
    },
    zip: (value) => {
        const digits = onlyDigits(value);
        if (!digits) return 'Informe o CEP.';
        if (digits.length !== 8) return 'CEP deve ter 8 dígitos.';
        return '';
    },
    address: (value) => {
        if (!value.trim()) return 'Informe o endereço.';
        if (value.trim().length < 5) return 'Endereço muito curto.';
        return '';
    },
    number: (value) => (!value.trim() ? 'Informe o número.' : ''),
    city: (value) => {
        if (!value.trim()) return 'Informe a cidade.';
        if (value.trim().length < 2) return 'Cidade inválida.';
        return '';
    },
    state: (value) => (!value ? 'Selecione o estado.' : ''),
};

const fieldClass = (hasError) =>
    `w-full border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 ${
        hasError
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-200 focus:ring-gray-900'
    }`;

const Field = ({ label, name, error, children, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        {children ? (
            <select
                id={name}
                name={name}
                aria-invalid={Boolean(error)}
                className={fieldClass(Boolean(error))}
                {...props}>
                {children}
            </select>
        ) : (
            <input
                id={name}
                name={name}
                aria-invalid={Boolean(error)}
                className={fieldClass(Boolean(error))}
                {...props}
            />
        )}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
);

const Checkout = () => {
    const { items, removeItem, totalPrice } = useCart();
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [formError, setFormError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [couponInput, setCouponInput] = useState('');
    const [coupon, setCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');

    const handleApplyCoupon = (event) => {
        event.preventDefault();
        const found = findCoupon(couponInput);
        if (!found) {
            setCoupon(null);
            setCouponError('Cupom inválido ou expirado.');
            return;
        }
        setCoupon(found);
        setCouponError('');
        setCouponInput('');
    };

    const handleRemoveCoupon = () => {
        setCoupon(null);
        setCouponError('');
    };

    const errorFor = (name) => (touched[name] ? errors[name] : '');

    const handleChange = (event) => {
        const { name, value } = event.target;
        const masked =
            name === 'zip' ? maskCep(value) : name === 'phone' ? maskPhone(value) : value;

        setForm((prev) => ({ ...prev, [name]: masked }));
        if (formError) setFormError('');

        // Depois que o campo já foi tocado, revalida enquanto o usuário digita.
        if (touched[name]) {
            setErrors((prev) => ({ ...prev, [name]: validators[name](masked) }));
        }
    };

    const handleBlur = (event) => {
        const { name } = event.target;
        // Campos opcionais (ex.: complemento) não têm regra de validação.
        if (!validators[name]) return;
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({ ...prev, [name]: validators[name](form[name]) }));
    };

    // Estrutura apenas: a integração com o gateway de pagamento será feita no backend.
    const handleSubmit = (event) => {
        event.preventDefault();

        const nextErrors = {};
        Object.keys(validators).forEach((field) => {
            nextErrors[field] = validators[field](form[field]);
        });

        setErrors(nextErrors);
        setTouched(Object.fromEntries(Object.keys(validators).map((field) => [field, true])));

        if (Object.values(nextErrors).some(Boolean)) {
            setFormError('Corrija os campos destacados antes de continuar.');
            return;
        }

        setFormError('');
        setSubmitted(true);
    };

    if (items.length === 0 && !submitted) {
        return (
            <section className="py-20 bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 md:px-8 lg:px-16 flex flex-col items-center justify-center gap-4 text-center">
                    <ShoppingBag className="w-12 h-12 text-gray-300" />
                    <h1 className="text-2xl font-bold text-gray-900">
                        Seu carrinho está vazio
                    </h1>
                    <Link to="/shop" className="text-gray-900 underline">
                        Continuar comprando
                    </Link>
                </div>
            </section>
        );
    }

    if (submitted) {
        return (
            <section className="py-20 bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 md:px-8 lg:px-16 text-center" data-aos='zoom-in'>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        Pedido registrado!
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Esta é uma página estrutural. A finalização real será integrada ao gateway de pagamento.
                    </p>
                    <Link to="/" className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all">
                        Voltar para a Home
                    </Link>
                </div>
            </section>
        );
    }

    const shipping = calculateShipping(totalPrice);
    const discount = calculateDiscount(coupon, totalPrice);
    const total = totalPrice - discount + shipping;
    const missingForFreeShipping = missingForFreeShippingAmount(totalPrice);

    return (
        <section className="py-20 bg-gray-50 min-h-screen">
            <Seo
                title="Checkout"
                description="Finalize o seu pedido de decoração natalina na Casa do Velinho."
                noIndex
            />
            <div className="container mx-auto px-4 md:px-8 lg:px-16">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10" data-aos='fade-down'>
                    Checkout
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    <form onSubmit={handleSubmit} noValidate
                        className="lg:col-span-2 bg-white rounded-xl shadow p-6 flex flex-col gap-4"
                        data-aos='fade-up'>
                        <h2 className="text-lg font-bold text-gray-900">Dados de entrega</h2>

                        {formError && (
                            <div role="alert" className="flex items-center gap-2 bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {formError}
                            </div>
                        )}

                        <Field
                            label="Nome completo"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errorFor('name')}
                            autoComplete="name"
                            placeholder="Maria da Silva"
                        />

                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field
                                label="E-mail"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errorFor('email')}
                                autoComplete="email"
                                placeholder="maria@email.com"
                            />
                            <Field
                                label="Telefone"
                                name="phone"
                                type="tel"
                                inputMode="numeric"
                                value={form.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errorFor('phone')}
                                autoComplete="tel"
                                placeholder="(11) 99999-9999"
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field
                                label="CEP"
                                name="zip"
                                inputMode="numeric"
                                value={form.zip}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errorFor('zip')}
                                autoComplete="postal-code"
                                placeholder="00000-000"
                            />
                            <Field
                                label="Estado"
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errorFor('state')}
                                autoComplete="address-level1">
                                <option value="">Selecione</option>
                                {UFS.map((uf) => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </Field>
                        </div>

                        <Field
                            label="Endereço"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errorFor('address')}
                            autoComplete="street-address"
                            placeholder="Rua do Natal"
                        />

                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field
                                label="Número"
                                name="number"
                                value={form.number}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errorFor('number')}
                                autoComplete="address-line2"
                                placeholder="123"
                            />
                            <Field
                                label="Complemento (opcional)"
                                name="complement"
                                value={form.complement}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Apto 42"
                            />
                        </div>

                        <Field
                            label="Cidade"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errorFor('city')}
                            autoComplete="address-level2"
                            placeholder="São Paulo"
                        />

                        <button
                            type="submit"
                            className="mt-2 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all">
                            Confirmar pedido
                        </button>
                    </form>

                    <aside className="bg-white rounded-xl shadow p-6 h-fit flex flex-col gap-4"
                        data-aos='fade-up' data-aos-delay='100'>
                        <h2 className="text-lg font-bold text-gray-900">Resumo do pedido</h2>

                        <div className="flex flex-col gap-3 max-h-72 overflow-y-auto">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-3">
                                    <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {item.quantity}x {formatPrice(parsePrice(item.price))}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            aria-label={`Remover ${item.name}`}
                                            className="text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {formatPrice(parsePrice(item.price) * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
                            {coupon ? (
                                <div className="flex items-center justify-between bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2">
                                    <span className="flex items-center gap-2">
                                        <Tag className="w-4 h-4" />
                                        {coupon.code} — {coupon.label}
                                    </span>
                                    <button
                                        onClick={handleRemoveCoupon}
                                        aria-label="Remover cupom"
                                        className="text-green-700 hover:text-green-900 transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponInput}
                                        onChange={(event) => {
                                            setCouponInput(event.target.value.toUpperCase());
                                            if (couponError) setCouponError('');
                                        }}
                                        placeholder="Cupom de desconto"
                                        aria-label="Cupom de desconto"
                                        className={`flex-1 border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 ${
                                            couponError
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-200 focus:ring-gray-900'
                                        }`}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!couponInput.trim()}
                                        className="flex items-center gap-1 border border-gray-300 px-3 py-2 rounded-lg text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                        <Check className="w-4 h-4" />
                                        Aplicar
                                    </button>
                                </form>
                            )}
                            {couponError && (
                                <p role="alert" className="text-xs text-red-500">{couponError}</p>
                            )}
                        </div>

                        <div className="border-t border-gray-100 pt-4 flex flex-col gap-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatPrice(totalPrice)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Desconto</span>
                                    <span>- {formatPrice(discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-600">
                                <span>Frete</span>
                                <span>{shipping === 0 ? 'Grátis' : formatPrice(shipping)}</span>
                            </div>
                            {missingForFreeShipping > 0 && (
                                <p className="text-xs text-green-600">
                                    Faltam {formatPrice(missingForFreeShipping)} para ganhar frete grátis.
                                </p>
                            )}
                        </div>

                        <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-gray-900">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default Checkout;
