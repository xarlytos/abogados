# Guía de Integración APIs BOE y CENDOJ

Este documento explica cómo activar la conexión real con las APIs de legislación una vez que se disponga de las credenciales.

## 📋 Requisitos Previos

### 1. Credenciales BOE API
- **URL**: https://puntodeacceso.boe.es/
- **Proceso**: Registro como desarrollador en el Portal de Datos Abiertos del BOE
- **Tiempo**: 24-48 horas para aprobación
- **Costo**: Gratuito para uso no comercial

### 2. Credenciales CENDOJ API
- **URL**: https://www.poderjudicial.es/cgpj/es/Tribunales/CENDOJ/Informacion-tecnica
- **Proceso**: Solicitud formal a través del formulario web del Poder Judicial
- **Tiempo**: 5-10 días hábiles
- **Costo**: Gratuito para bufetes de abogados colegiados

---

## 🔧 Configuración

### Paso 1: Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```bash
# API BOE
VITE_BOE_API_KEY=tu_api_key_aqui
VITE_BOE_BASE_URL=https://boe.es/datosabiertos/api

# API CENDOJ
VITE_CENDOJ_API_KEY=tu_api_key_aqui
VITE_CENDOJ_BASE_URL=https://www.poderjudicial.es/cgpj/es/Tribunales/CENDOJ/api

# Backend (necesario para ocultar API keys)
VITE_API_BASE_URL=https://tu-backend.com/api
```

> ⚠️ **IMPORTANTE**: Las API keys NUNCA deben exponerse en el frontend. Se requiere un backend.

### Paso 2: Configurar Backend (Requerido)

Las APIs oficiales tienen CORS que impiden llamadas directas desde el navegador. Opciones:

#### Opción A: Serverless Functions (Vercel/Netlify)

```typescript
// api/boe/buscar.ts (Vercel Function)
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { query, fechaDesde, fechaHasta } = req.query;
  
  const response = await fetch(
    `https://boe.es/datosabiertos/api/boe/dias?${new URLSearchParams({
      query: query as string,
      // ... otros parámetros
    })}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.BOE_API_KEY}`,
        'Accept': 'application/json',
      },
    }
  );
  
  const data = await response.json();
  res.status(200).json(data);
}
```

#### Opción B: Node.js/Express Backend

```typescript
// routes/legislacion.ts
import express from 'express';
import { buscarBoe, buscarCendoj } from '../services/legislacionService';

const router = express.Router();

router.get('/boe/buscar', async (req, res) => {
  try {
    const resultados = await buscarBoe(req.query);
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar BOE' });
  }
});

router.get('/cendoj/buscar', async (req, res) => {
  try {
    const resultados = await buscarCendoj(req.query);
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar CENDOJ' });
  }
});

export default router;
```

---

## 🔄 Actualizar Servicios Frontend

### Modificar `src/services/legislacionApiService.ts`

```typescript
// Cambiar las funciones mock por llamadas reales al backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function buscarBoe(params: BoeSearchParams): Promise<BoeSearchResponse> {
  // REEMPLAZAR ESTO:
  // await delay(CONFIG.MOCK_DELAY);
  // return MOCK_DATA;
  
  // POR ESTO:
  const response = await fetch(`${API_BASE_URL}/legislacion/boe/buscar?${
    new URLSearchParams(params as Record<string, string>)
  }`);
  
  if (!response.ok) {
    throw new Error('Error al consultar BOE');
  }
  
  const data = await response.json();
  
  // Mapear respuesta de API a nuestros tipos
  return {
    total: data.numeroTotal,
    pagina: data.pagina,
    totalPaginas: data.totalPaginas,
    resultados: data.resultados.map(mapBoeResponseToDocumento),
  };
}

// Similar para CENDOJ
export async function buscarCendoj(params: CendojSearchParams): Promise<CendojSearchResponse> {
  const response = await fetch(`${API_BASE_URL}/legislacion/cendoj/buscar?${
    new URLSearchParams(params as Record<string, string>)
  }`);
  
  const data = await response.json();
  return mapCendojResponse(data);
}
```

---

## 📊 Mapeo de Respuestas

### BOE API Response → Nuestros Tipos

```typescript
function mapBoeResponseToDocumento(apiResponse: any): BoeDocumento {
  return {
    id: apiResponse.identificador || apiResponse.id,
    tipo: 'disposicion', // o derivar de apiResponse.tipo
    titulo: apiResponse.titulo,
    resumen: apiResponse.sumario,
    materia: mapMateriaBoe(apiResponse.materias?.[0]),
    fechaPublicacion: new Date(apiResponse.fechaPublicacion),
    fechaEntradaVigor: apiResponse.fechaEntradaVigor ? new Date(apiResponse.fechaEntradaVigor) : undefined,
    vigencia: apiResponse.vigente ? 'vigente' : 'derogado',
    organismoEmisor: mapOrganismoBoe(apiResponse.departamento),
    urlPdf: apiResponse.urlPdf,
    urlHtml: apiResponse.urlHtml,
    diarioOficial: 'BOE',
    numeroDiario: apiResponse.numeroBoletin,
    paginaInicio: apiResponse.paginaInicio,
    seccion: apiResponse.seccion,
    apartado: apiResponse.apartado,
    departamento: apiResponse.departamento,
    palabrasClave: apiResponse.materias || [],
    numeroLegislacion: apiResponse.numeroLegislacion,
  };
}
```

### CENDOJ API Response → Nuestros Tipos

```typescript
function mapCendojResponse(apiResponse: any): CendojSearchResponse {
  return {
    total: apiResponse.total,
    pagina: apiResponse.pagina,
    totalPaginas: apiResponse.totalPaginas,
    resultados: apiResponse.sentencias.map((s: any) => ({
      id: s.identificador,
      cita: `${s.tipoResolucion} ${s.numero}/${new Date(s.fecha).getFullYear()}`,
      fecha: new Date(s.fecha),
      tribunal: s.tribunalNombre,
      tipo: mapTipoCendoj(s.tipoResolucion),
      materia: mapMateriaCendoj(s.materia),
      resumen: s.sumario,
      url: s.url,
    })),
  };
}
```

---

## ⏱️ Rate Limits y Caché

### Límites de las APIs

| Fuente | Límite | Período |
|--------|--------|---------|
| BOE API | 100 | requests/minuto |
| CENDOJ API | 50 | requests/minuto |

### Implementar Caché

```typescript
// src/services/legislacionCache.ts
import { LegislacionBase } from '@/types/legislacion';

const CACHE_KEY = 'legislacion_cache';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora

interface CacheEntry {
  data: LegislacionBase[];
  timestamp: number;
  query: string;
}

export const legislacionCache = {
  get(query: string): LegislacionBase[] | null {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const entry: CacheEntry = JSON.parse(cached);
    const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;
    const isSameQuery = entry.query === query;
    
    if (isExpired || !isSameQuery) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return entry.data;
  },
  
  set(query: string, data: LegislacionBase[]) {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      query,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  },
};
```

---

## 🧪 Testing

### Verificar Conexión BOE

```bash
curl -X GET "https://boe.es/datosabiertos/api/boe/dias?query=constitucion" \
  -H "Authorization: Bearer TU_API_KEY" \
  -H "Accept: application/json"
```

### Verificar Conexión CENDOJ

```bash
curl -X GET "https://www.poderjudicial.es/cgpj/es/Tribunales/CENDOJ/api/sentencias?query=responsabilidad" \
  -H "Authorization: Bearer TU_API_KEY" \
  -H "Accept: application/json"
```

---

## 🚀 Deployment Checklist

- [ ] Obtener credenciales BOE API
- [ ] Obtener credenciales CENDOJ API
- [ ] Configurar variables de entorno en servidor
- [ ] Desplegar backend con endpoints seguros
- [ ] Actualizar `legislacionApiService.ts` para usar backend real
- [ ] Probar búsquedas en producción
- [ ] Configurar sistema de logs para errores de API
- [ ] Implementar caché Redis para mejor rendimiento

---

## 📞 Soporte

### BOE
- Email: datos@boe.es
- Documentación: https://boe.es/datosabiertos/

### CENDOJ
- Email: cendoj@cgpj.es
- Documentación: https://www.poderjudicial.es/cgpj/es/Tribunales/CENDOJ/Informacion-tecnica

---

## 📝 Notas Importantes

1. **Legislación Vigente**: El BOE no proporciona histórico completo vía API. Para legislación anterior a 1960, consultar el histórico web manual.

2. **Jurisprudencia**: CENDOJ tiene un delay de 3-6 meses en publicación de sentencias por cuestiones de privacidad.

3. **Actualizaciones**: Configurar sincronización programada (recomendado: diaria a las 6:00 AM).

4. **Almacenamiento**: Las APIs permiten consulta pero no distribución masiva. No descargar toda la base de datos.
