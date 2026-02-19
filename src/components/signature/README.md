# Firma Electrónica - Módulo Frontend

## 📁 Estructura de Archivos

```
src/
├── components/signature/
│   ├── index.ts                    # Exportaciones principales
│   ├── SignatureModal.tsx          # Modal principal de firma (wizard)
│   ├── SignatureTypeSelector.tsx   # Selector de tipo de firma
│   ├── SignaturePad.tsx            # Canvas para firma biométrica
│   ├── SignerList.tsx              # Gestión de lista de firmantes
│   └── README.md                   # Esta documentación
├── types/
│   └── signature.ts                # Tipos TypeScript
├── hooks/
│   └── useSignature.ts             # Hook de lógica
└── data/
    └── signatureData.ts            # Datos mock
```

## 🚀 Uso Rápido

### 1. Modal de Solicitud de Firmas (modo "request")

```tsx
import { SignatureModal } from '@/components/signature';
import { useState } from 'react';

function MiComponente() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Solicitar Firmas
      </button>

      <SignatureModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        mode="request"
        documentId="EXP-2024-001"
        documentName="Contrato.pdf"
        onComplete={(result) => {
          console.log('Solicitud creada:', result);
          setShowModal(false);
        }}
      />
    </>
  );
}
```

### 2. Modal para Firmar Documento (modo "sign")

```tsx
<SignatureModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  mode="sign"
  documentId="EXP-2024-001"
  documentName="Contrato.pdf"
  requestId="sig-req-001"
  onComplete={(result) => {
    console.log('Documento firmado:', result);
  }}
/>
```

### 3. Usar el Hook useSignature

```tsx
import { useSignature } from '@/components/signature';
import { useRole } from '@/hooks/useRole';

function MiComponente() {
  const { role } = useRole();
  const signature = useSignature(role, 'usuario@bufete.com');

  // Crear solicitud
  const handleCreate = async () => {
    const request = await signature.createRequest({
      documentId: 'EXP-001',
      documentName: 'Contrato.pdf',
      signers: [
        { email: 'cliente@email.com', name: 'Juan Pérez', role: 'cliente' }
      ],
      signatureType: 'advanced',
      workflow: 'parallel',
    });
  };

  // Firmar documento
  const handleSign = async () => {
    await signature.signDocument('sig-req-001', {
      type: 'biometric',
      signatureImage: 'data:image/png;base64,...',
    });
  };

  return (
    <div>
      <p>Firmas pendientes: {signature.getPendingForCurrentUser().length}</p>
    </div>
  );
}
```

## 🧩 Componentes Individuales

### SignatureTypeSelector

```tsx
import { SignatureTypeSelector } from '@/components/signature';

<SignatureTypeSelector
  value="advanced"
  onChange={(type) => console.log(type)}
  allowedTypes={['simple', 'advanced', 'biometric']}
/>
```

### SignaturePad

```tsx
import { SignaturePad } from '@/components/signature';

<SignaturePad
  onSignature={(dataUrl) => console.log(dataUrl)}
  onClear={() => console.log('Limpiado')}
  width={500}
  height={200}
/>
```

### SignerList

```tsx
import { SignerList } from '@/components/signature';

<SignerList
  signers={signers}
  workflow="sequential"
  onAddSigner={(signer) => {}}
  onRemoveSigner={(id) => {}}
  onUpdateSigner={(id, updates) => {}}
  maxSigners={10}
/>
```

## 👥 Roles y Permisos

El sistema respeta los permisos definidos en `SIGNATURE_PERMISSIONS`:

| Rol | Firmar | Solicitar | Tipos Permitidos | Max Firmantes |
|-----|--------|-----------|------------------|---------------|
| super_admin | ✅ | ✅ | Todos | 50 |
| socio | ✅ | ✅ | Todos | 50 |
| abogado_senior | ✅ | ✅ | simple, advanced, biometric, certificate | 20 |
| abogado_junior | ✅ | ⚠️ Limitado | simple, advanced, biometric | 10 |
| secretario | ❌ | ✅ (solo enviar) | simple | 5 |
| contador | ✅ | ✅ (docs financieros) | simple, advanced, certificate | 10 |
| paralegal | ❌ | ❌ | - | 0 |
| recepcionista | ❌ | ❌ | - | 0 |

## 📋 Tipos de Firma Soportados

1. **simple** - Firma básica (nombre escrito)
2. **advanced** - Firma avanzada con trazabilidad
3. **qualified** - Firma cualificada eIDAS
4. **biometric** - Firma con datos biométricos
5. **certificate** - Firma con certificado digital

## 🔄 Flujos de Firma

### Paralelo
Todos los firmantes reciben la notificación simultáneamente y pueden firmar en cualquier orden.

### Secuencial
Los firmantes reciben la solicitud en orden. Cada firmante debe completar antes de que el siguiente reciba la notificación.

## 📦 Datos Mock Disponibles

```tsx
import {
  mockSignatureRequests,
  mockSignedDocuments,
  getSignatureRequestById,
  getPendingSignaturesForUser,
} from '@/components/signature';
```

## 🎨 Integración con el Sistema de Diseño

Los componentes utilizan:
- Paleta de colores del proyecto (slate, amber, emerald, etc.)
- Framer Motion para animaciones
- Lucide React para iconos
- Tailwind CSS para estilos

## ⚠️ Notas Importantes

1. **Modo Mock**: Actualmente los datos son mock (simulados). Para producción, reemplazar las llamadas en `useSignature.ts` con API calls reales.

2. **Canvas**: El `SignaturePad` usa HTML5 Canvas y captura datos biométricos (velocidad, presión).

3. **Validaciones**: El formulario de firmantes valida emails duplicados y campos obligatorios.

4. **Accesibilidad**: Los componentes incluyen estados `disabled` y manejo de errores.

## 📝 Próximos Pasos (Fase 2)

1. Integrar en `Expedientes.tsx`
2. Integrar en `Facturacion.tsx`
3. Integrar en `Biblioteca.tsx`
4. Integrar en `PortalCliente.tsx`
5. Integrar en `Mensajes.tsx`
