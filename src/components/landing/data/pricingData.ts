export const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfecto para abogados independientes',
    price: 29,
    priceYearly: 24,
    popular: false,
    features: [
      { text: 'Hasta 50 casos activos', included: true },
      { text: '2 usuarios', included: true },
      { text: '5 GB de almacenamiento', included: true },
      { text: 'Soporte por email', included: true },
      { text: 'App móvil básica', included: true },
      { text: 'Reportes básicos', included: true },
      { text: 'Casos ilimitados', included: false },
      { text: 'Integraciones avanzadas', included: false },
      { text: 'Soporte prioritario', included: false },
      { text: 'API access', included: false }
    ],
    cta: 'Comenzar gratis',
    trial: '14 días de prueba'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Ideal para bufetes en crecimiento',
    price: 79,
    priceYearly: 66,
    popular: true,
    features: [
      { text: 'Casos ilimitados', included: true },
      { text: '10 usuarios', included: true },
      { text: '50 GB de almacenamiento', included: true },
      { text: 'Soporte prioritario', included: true },
      { text: 'App móvil completa', included: true },
      { text: 'Reportes avanzados', included: true },
      { text: 'Integraciones básicas', included: true },
      { text: 'Biblioteca legal básica', included: true },
      { text: 'Firma electrónica', included: false },
      { text: 'API access', included: false }
    ],
    cta: 'Comenzar gratis',
    trial: '14 días de prueba'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Para grandes despachos',
    price: 199,
    priceYearly: 166,
    popular: false,
    features: [
      { text: 'Todo en Professional', included: true },
      { text: 'Usuarios ilimitados', included: true },
      { text: 'Almacenamiento ilimitado', included: true },
      { text: 'Soporte 24/7 dedicado', included: true },
      { text: 'Integraciones avanzadas', included: true },
      { text: 'Biblioteca legal completa', included: true },
      { text: 'Firma electrónica avanzada', included: true },
      { text: 'API access completo', included: true },
      { text: 'Onboarding personalizado', included: true },
      { text: 'SLA garantizado', included: true }
    ],
    cta: 'Contactar ventas',
    trial: 'Demo personalizada'
  }
];

export const pricingFAQ = [
  {
    question: '¿Puedo cambiar de plan en cualquier momento?',
    answer: 'Sí, puedes actualizar o cambiar tu plan en cualquier momento. Los cambios se aplican inmediatamente y el prorrateo se calcula automáticamente.'
  },
  {
    question: '¿Hay algún descuento por pago anual?',
    answer: 'Sí, ofrecemos un descuento del 20% si eliges el pago anual. Además, incluye 2 meses gratis comparado con el pago mensual.'
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos tarjetas de crédito/débito (Visa, Mastercard, American Express), transferencia bancaria para planes Enterprise y PayPal.'
  }
];
