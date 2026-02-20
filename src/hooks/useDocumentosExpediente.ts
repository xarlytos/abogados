import { useState, useCallback, useMemo } from 'react';
import type {
  DocumentoExpediente,
  CarpetaDocumento,
  VersionDocumento,
  FiltrosDocumento,
  OrdenamientoDocumento,
  PermisosDocumento,
  EstadisticasDocumentos,
  CategoriaDocumento,
  EstadoDocumento,
  TipoDocumento,
  TipoCarpeta,
} from '@/types/documentos';
import {
  getTipoFromNombre,
  generateDocumentId,
  generateFolderId,
  generateVersionId,
  CARPETAS_PREDEFINIDAS,
} from '@/types/documentos';
import type { UserRole } from '@/types/roles';

// ============================================
// HOOK PRINCIPAL
// ============================================

export interface UseDocumentosExpedienteReturn {
  // Estado
  documentos: DocumentoExpediente[];
  carpetas: CarpetaDocumento[];
  carpetaActual: string | null;
  filtros: FiltrosDocumento;
  ordenamiento: OrdenamientoDocumento;
  seleccionados: string[];
  modoSeleccion: boolean;
  
  // Computados
  documentosFiltrados: DocumentoExpediente[];
  documentosCarpetaActual: DocumentoExpediente[];
  subcarpetasActuales: CarpetaDocumento[];
  estadisticas: EstadisticasDocumentos;
  rutaCarpeta: CarpetaDocumento[];
  
  // Permisos
  permisos: PermisosDocumento;
  
  // Acciones - Documentos
  subirDocumento: (
    archivo: File,
    metadatos: Partial<DocumentoExpediente>
  ) => Promise<DocumentoExpediente>;
  subirDocumentos: (
    archivos: File[],
    metadatosComunes: Partial<DocumentoExpediente>
  ) => Promise<DocumentoExpediente[]>;
  actualizarDocumento: (
    id: string,
    cambios: Partial<DocumentoExpediente>
  ) => DocumentoExpediente | null;
  eliminarDocumento: (id: string, eliminarPermanentemente?: boolean) => boolean;
  restaurarDocumento: (id: string) => boolean;
  cambiarEstado: (id: string, estado: EstadoDocumento) => boolean;
  firmarDocumento: (
    id: string,
    tipoFirma: 'electronica' | 'digital' | 'manual'
  ) => boolean;
  subirNuevaVersion: (
    id: string,
    archivo: File,
    comentario?: string
  ) => Promise<VersionDocumento | null>;
  cambiarVersionActiva: (idDocumento: string, numeroVersion: number) => boolean;
  moverDocumentos: (ids: string[], idCarpetaDestino: string | null) => boolean;
  copiarDocumentos: (ids: string[], idCarpetaDestino: string | null) => boolean;
  duplicarDocumento: (id: string) => DocumentoExpediente | null;
  
  // Acciones - Carpetas
  crearCarpeta: (
    nombre: string,
    tipo: TipoCarpeta,
    idCarpetaPadre?: string | null
  ) => CarpetaDocumento;
  actualizarCarpeta: (
    id: string,
    cambios: Partial<CarpetaDocumento>
  ) => CarpetaDocumento | null;
  eliminarCarpeta: (id: string, moverDocumentosARaiz?: boolean) => boolean;
  navegarACarpeta: (id: string | null) => void;
  navegarArriba: () => void;
  
  // Acciones - Selección
  seleccionarDocumento: (id: string, seleccionado: boolean) => void;
  seleccionarTodos: (seleccionados: boolean) => void;
  limpiarSeleccion: () => void;
  toggleModoSeleccion: () => void;
  
  // Acciones - Filtros y ordenamiento
  setFiltros: (filtros: Partial<FiltrosDocumento>) => void;
  limpiarFiltros: () => void;
  setOrdenamiento: (ordenamiento: OrdenamientoDocumento) => void;
  
  // Acciones - Descarga
  descargarDocumento: (id: string, version?: number) => void;
  descargarMultiples: (ids: string[]) => void;
  comprimirDocumentos: (ids: string[], nombreZip?: string) => Promise<Blob>;
  
  // Búsqueda
  buscarDocumentos: (query: string) => DocumentoExpediente[];
  
  // Refrescar
  refrescar: () => void;
}

export function useDocumentosExpediente(
  idExpediente: string,
  userRole: UserRole,
  userId: string,
  userName: string,
  documentosIniciales?: DocumentoExpediente[],
  carpetasIniciales?: CarpetaDocumento[]
): UseDocumentosExpedienteReturn {
  // ============================================
  // ESTADO
  // ============================================
  
  const [documentos, setDocumentos] = useState<DocumentoExpediente[]>(
    documentosIniciales || []
  );
  const [carpetas, setCarpetas] = useState<CarpetaDocumento[]>(
    carpetasIniciales || []
  );
  const [carpetaActual, setCarpetaActual] = useState<string | null>(null);
  const [filtros, setFiltrosState] = useState<FiltrosDocumento>({});
  const [ordenamiento, setOrdenamiento] = useState<OrdenamientoDocumento>({
    campo: 'fecha',
    direccion: 'desc',
  });
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [modoSeleccion, setModoSeleccion] = useState(false);

  // ============================================
  // PERMISOS
  // ============================================
  
  const permisos: PermisosDocumento = useMemo(() => {
    const basePermisos: Record<UserRole, PermisosDocumento> = {
      super_admin: {
        puedeVer: true,
        puedeEditar: true,
        puedeEliminar: true,
        puedeDescargar: true,
        puedeCompartir: true,
        puedeFirmar: true,
        puedeCambiarEstado: true,
        puedeVerVersiones: true,
        puedeSubirVersion: true,
      },
      socio: {
        puedeVer: true,
        puedeEditar: true,
        puedeEliminar: true,
        puedeDescargar: true,
        puedeCompartir: true,
        puedeFirmar: true,
        puedeCambiarEstado: true,
        puedeVerVersiones: true,
        puedeSubirVersion: true,
      },
      abogado_senior: {
        puedeVer: true,
        puedeEditar: true,
        puedeEliminar: true,
        puedeDescargar: true,
        puedeCompartir: true,
        puedeFirmar: true,
        puedeCambiarEstado: true,
        puedeVerVersiones: true,
        puedeSubirVersion: true,
      },
      abogado_junior: {
        puedeVer: true,
        puedeEditar: true,
        puedeEliminar: false,
        puedeDescargar: true,
        puedeCompartir: false,
        puedeFirmar: false,
        puedeCambiarEstado: true,
        puedeVerVersiones: true,
        puedeSubirVersion: true,
      },
      paralegal: {
        puedeVer: true,
        puedeEditar: false,
        puedeEliminar: false,
        puedeDescargar: true,
        puedeCompartir: false,
        puedeFirmar: false,
        puedeCambiarEstado: false,
        puedeVerVersiones: true,
        puedeSubirVersion: false,
      },
      secretario: {
        puedeVer: true,
        puedeEditar: true,
        puedeEliminar: false,
        puedeDescargar: true,
        puedeCompartir: false,
        puedeFirmar: false,
        puedeCambiarEstado: false,
        puedeVerVersiones: true,
        puedeSubirVersion: true,
      },
      administrador: {
        puedeVer: true,
        puedeEditar: false,
        puedeEliminar: false,
        puedeDescargar: true,
        puedeCompartir: false,
        puedeFirmar: false,
        puedeCambiarEstado: false,
        puedeVerVersiones: true,
        puedeSubirVersion: false,
      },
      contador: {
        puedeVer: true,
        puedeEditar: false,
        puedeEliminar: false,
        puedeDescargar: true,
        puedeCompartir: false,
        puedeFirmar: false,
        puedeCambiarEstado: false,
        puedeVerVersiones: false,
        puedeSubirVersion: false,
      },
      recepcionista: {
        puedeVer: false,
        puedeEditar: false,
        puedeEliminar: false,
        puedeDescargar: false,
        puedeCompartir: false,
        puedeFirmar: false,
        puedeCambiarEstado: false,
        puedeVerVersiones: false,
        puedeSubirVersion: false,
      },
    };
    return basePermisos[userRole] || basePermisos.abogado_junior;
  }, [userRole]);

  // ============================================
  // COMPUTADOS
  // ============================================
  
  const documentosCarpetaActual = useMemo(() => {
    return documentos.filter(
      (d) =>
        d.idCarpeta === carpetaActual &&
        d.estado !== 'eliminado'
    );
  }, [documentos, carpetaActual]);

  const documentosFiltrados = useMemo(() => {
    let docs = [...documentosCarpetaActual];

    // Aplicar filtros
    if (filtros.categoria) {
      docs = docs.filter((d) => d.categoria === filtros.categoria);
    }
    if (filtros.estado) {
      docs = docs.filter((d) => d.estado === filtros.estado);
    }
    if (filtros.tipo) {
      docs = docs.filter((d) => d.tipo === filtros.tipo);
    }
    if (filtros.fechaDesde) {
      docs = docs.filter(
        (d) => new Date(d.fechaCreacion) >= new Date(filtros.fechaDesde!)
      );
    }
    if (filtros.fechaHasta) {
      docs = docs.filter(
        (d) => new Date(d.fechaCreacion) <= new Date(filtros.fechaHasta!)
      );
    }
    if (filtros.etiquetas?.length) {
      docs = docs.filter((d) =>
        filtros.etiquetas!.some((tag) => d.etiquetas.includes(tag))
      );
    }
    if (filtros.busqueda) {
      const query = filtros.busqueda.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.nombre.toLowerCase().includes(query) ||
          d.descripcion?.toLowerCase().includes(query) ||
          d.etiquetas.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    if (filtros.soloFirmados) {
      docs = docs.filter((d) => d.firmado);
    }
    if (filtros.soloPendientes) {
      docs = docs.filter(
        (d) => d.estado === 'borrador' || d.estado === 'revision'
      );
    }

    // Aplicar ordenamiento
    docs.sort((a, b) => {
      let comparison = 0;
      switch (ordenamiento.campo) {
        case 'nombre':
          comparison = a.nombre.localeCompare(b.nombre);
          break;
        case 'fecha':
          comparison =
            new Date(a.fechaModificacion).getTime() -
            new Date(b.fechaModificacion).getTime();
          break;
        case 'tamaño':
          comparison = a.tamaño - b.tamaño;
          break;
        case 'estado':
          comparison = a.estado.localeCompare(b.estado);
          break;
        case 'categoria':
          comparison = a.categoria.localeCompare(b.categoria);
          break;
        case 'autor':
          comparison = a.creadoPor.localeCompare(b.creadoPor);
          break;
      }
      return ordenamiento.direccion === 'asc' ? comparison : -comparison;
    });

    return docs;
  }, [documentosCarpetaActual, filtros, ordenamiento]);

  const subcarpetasActuales = useMemo(() => {
    return carpetas
      .filter((c) => c.idCarpetaPadre === carpetaActual)
      .sort((a, b) => a.orden - b.orden);
  }, [carpetas, carpetaActual]);

  const rutaCarpeta = useMemo(() => {
    const ruta: CarpetaDocumento[] = [];
    let current = carpetaActual;
    while (current) {
      const carpeta = carpetas.find((c) => c.id === current);
      if (carpeta) {
        ruta.unshift(carpeta);
        current = carpeta.idCarpetaPadre;
      } else {
        break;
      }
    }
    return ruta;
  }, [carpetas, carpetaActual]);

  const estadisticas: EstadisticasDocumentos = useMemo(() => {
    const stats: EstadisticasDocumentos = {
      totalDocumentos: documentos.filter((d) => d.estado !== 'eliminado').length,
      totalPorCategoria: {} as Record<CategoriaDocumento, number>,
      totalPorEstado: {} as Record<EstadoDocumento, number>,
      totalPorTipo: {} as Record<TipoDocumento, number>,
      totalTamaño: documentos.reduce((acc, d) => acc + d.tamaño, 0),
      pendientesFirma: documentos.filter(
        (d) => !d.firmado && d.estado === 'aprobado'
      ).length,
      ultimos30Dias: documentos.filter((d) => {
        const fecha = new Date(d.fechaCreacion);
        const hace30Dias = new Date();
        hace30Dias.setDate(hace30Dias.getDate() - 30);
        return fecha >= hace30Dias;
      }).length,
    };

    // Inicializar contadores
    const categorias: CategoriaDocumento[] = [
      'demanda', 'escritura', 'evidencia', 'prueba', 'correspondencia',
      'factura', 'contrato', 'sentencia', 'auto', 'escrito', 'informe', 'acta', 'nota', 'otro'
    ];
    const estados: EstadoDocumento[] = [
      'borrador', 'revision', 'aprobado', 'ejecutado', 'firmado', 'archivado', 'eliminado'
    ];
    const tipos: TipoDocumento[] = [
      'pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'png', 'mp3', 'mp4', 'zip', 'txt', 'otro'
    ];

    categorias.forEach((c) => (stats.totalPorCategoria[c] = 0));
    estados.forEach((e) => (stats.totalPorEstado[e] = 0));
    tipos.forEach((t) => (stats.totalPorTipo[t] = 0));

    // Contar
    documentos.forEach((d) => {
      if (d.estado !== 'eliminado') {
        stats.totalPorCategoria[d.categoria] =
          (stats.totalPorCategoria[d.categoria] || 0) + 1;
        stats.totalPorEstado[d.estado] =
          (stats.totalPorEstado[d.estado] || 0) + 1;
        stats.totalPorTipo[d.tipo] =
          (stats.totalPorTipo[d.tipo] || 0) + 1;
      }
    });

    return stats;
  }, [documentos]);

  // ============================================
  // ACCIONES - DOCUMENTOS
  // ============================================
  
  const subirDocumento = useCallback(
    async (
      archivo: File,
      metadatos: Partial<DocumentoExpediente>
    ): Promise<DocumentoExpediente> => {
      const ahora = new Date().toISOString();
      const tipo = getTipoFromNombre(archivo.name);
      
      const version: VersionDocumento = {
        id: generateVersionId(),
        numeroVersion: 1,
        nombreArchivo: archivo.name,
        tamaño: archivo.size,
        fechaSubida: ahora,
        subidoPor: userName,
        idUsuario: userId,
        comentario: 'Versión inicial',
      };

      const nuevoDocumento: DocumentoExpediente = {
        id: generateDocumentId(),
        idExpediente,
        nombre: metadatos.nombre || archivo.name,
        nombreOriginal: archivo.name,
        descripcion: metadatos.descripcion,
        tipo,
        categoria: metadatos.categoria || 'otro',
        estado: metadatos.estado || 'borrador',
        idCarpeta: carpetaActual,
        ruta: rutaCarpeta.map((c) => c.nombre).join('/') || '/',
        versionActual: 1,
        versiones: [version],
        tamaño: archivo.size,
        fechaCreacion: ahora,
        fechaModificacion: ahora,
        creadoPor: userName,
        idCreador: userId,
        modificadoPor: userName,
        idModificador: userId,
        firmado: false,
        esConfidencial: metadatos.esConfidencial || false,
        visibleParaCliente: metadatos.visibleParaCliente || false,
        etiquetas: metadatos.etiquetas || [],
        documentoRelacionadoId: metadatos.documentoRelacionadoId,
      };

      setDocumentos((prev) => [nuevoDocumento, ...prev]);
      return nuevoDocumento;
    },
    [idExpediente, userId, userName, carpetaActual, rutaCarpeta]
  );

  const subirDocumentos = useCallback(
    async (
      archivos: File[],
      metadatosComunes: Partial<DocumentoExpediente>
    ): Promise<DocumentoExpediente[]> => {
      const resultados: DocumentoExpediente[] = [];
      for (const archivo of archivos) {
        const doc = await subirDocumento(archivo, metadatosComunes);
        resultados.push(doc);
      }
      return resultados;
    },
    [subirDocumento]
  );

  const actualizarDocumento = useCallback(
    (id: string, cambios: Partial<DocumentoExpediente>): DocumentoExpediente | null => {
      if (!permisos.puedeEditar) return null;

      let documentoActualizado: DocumentoExpediente | null = null;
      
      setDocumentos((prev) =>
        prev.map((d) => {
          if (d.id === id) {
            documentoActualizado = {
              ...d,
              ...cambios,
              fechaModificacion: new Date().toISOString(),
              modificadoPor: userName,
              idModificador: userId,
            };
            return documentoActualizado;
          }
          return d;
        })
      );
      
      return documentoActualizado;
    },
    [permisos.puedeEditar, userId, userName]
  );

  const eliminarDocumento = useCallback(
    (id: string, eliminarPermanentemente = false): boolean => {
      if (!permisos.puedeEliminar) return false;

      if (eliminarPermanentemente) {
        setDocumentos((prev) => prev.filter((d) => d.id !== id));
      } else {
        setDocumentos((prev) =>
          prev.map((d) =>
            d.id === id
              ? { ...d, estado: 'eliminado', fechaModificacion: new Date().toISOString() }
              : d
          )
        );
      }
      return true;
    },
    [permisos.puedeEliminar]
  );

  const restaurarDocumento = useCallback((id: string): boolean => {
    let restaurado = false;
    setDocumentos((prev) =>
      prev.map((d) => {
        if (d.id === id && d.estado === 'eliminado') {
          restaurado = true;
          return {
            ...d,
            estado: 'borrador',
            fechaModificacion: new Date().toISOString(),
          };
        }
        return d;
      })
    );
    return restaurado;
  }, []);

  const cambiarEstado = useCallback(
    (id: string, estado: EstadoDocumento): boolean => {
      if (!permisos.puedeCambiarEstado) return false;

      setDocumentos((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                estado,
                fechaModificacion: new Date().toISOString(),
                modificadoPor: userName,
                idModificador: userId,
              }
            : d
        )
      );
      return true;
    },
    [permisos.puedeCambiarEstado, userId, userName]
  );

  const firmarDocumento = useCallback(
    (id: string, tipoFirma: 'electronica' | 'digital' | 'manual'): boolean => {
      if (!permisos.puedeFirmar) return false;

      setDocumentos((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                firmado: true,
                fechaFirma: new Date().toISOString(),
                firmadoPor: userName,
                idFirmante: userId,
                tipoFirma,
                estado: 'firmado',
                fechaModificacion: new Date().toISOString(),
              }
            : d
        )
      );
      return true;
    },
    [permisos.puedeFirmar, userId, userName]
  );

  const subirNuevaVersion = useCallback(
    async (
      id: string,
      archivo: File,
      comentario?: string
    ): Promise<VersionDocumento | null> => {
      if (!permisos.puedeSubirVersion) return null;

      let nuevaVersion: VersionDocumento | null = null;
      const ahora = new Date().toISOString();

      setDocumentos((prev) =>
        prev.map((d) => {
          if (d.id === id) {
            const numVersion = d.versiones.length + 1;
            nuevaVersion = {
              id: generateVersionId(),
              numeroVersion: numVersion,
              nombreArchivo: archivo.name,
              tamaño: archivo.size,
              fechaSubida: ahora,
              subidoPor: userName,
              idUsuario: userId,
              comentario: comentario || `Versión ${numVersion}`,
            };
            return {
              ...d,
              versiones: [...d.versiones, nuevaVersion],
              versionActual: numVersion,
              tamaño: archivo.size,
              fechaModificacion: ahora,
              modificadoPor: userName,
              idModificador: userId,
            };
          }
          return d;
        })
      );

      return nuevaVersion;
    },
    [permisos.puedeSubirVersion, userId, userName]
  );

  const cambiarVersionActiva = useCallback(
    (idDocumento: string, numeroVersion: number): boolean => {
      let cambiado = false;
      
      setDocumentos((prev) =>
        prev.map((d) => {
          if (d.id === idDocumento) {
            const versionExiste = d.versiones.some(
              (v) => v.numeroVersion === numeroVersion
            );
            if (versionExiste) {
              cambiado = true;
              return {
                ...d,
                versionActual: numeroVersion,
                fechaModificacion: new Date().toISOString(),
              };
            }
          }
          return d;
        })
      );
      
      return cambiado;
    },
    []
  );

  const moverDocumentos = useCallback(
    (ids: string[], idCarpetaDestino: string | null): boolean => {
      if (!permisos.puedeEditar) return false;

      setDocumentos((prev) =>
        prev.map((d) =>
          ids.includes(d.id)
            ? {
                ...d,
                idCarpeta: idCarpetaDestino,
                fechaModificacion: new Date().toISOString(),
              }
            : d
        )
      );
      return true;
    },
    [permisos.puedeEditar]
  );

  const copiarDocumentos = useCallback(
    (ids: string[], idCarpetaDestino: string | null): boolean => {
      if (!permisos.puedeEditar) return false;

      const docsACopiar = documentos.filter((d) => ids.includes(d.id));
      const copias: DocumentoExpediente[] = docsACopiar.map((d) => ({
        ...d,
        id: generateDocumentId(),
        idCarpeta: idCarpetaDestino,
        nombre: `${d.nombre} (copia)`,
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString(),
        creadoPor: userName,
        idCreador: userId,
      }));

      setDocumentos((prev) => [...copias, ...prev]);
      return true;
    },
    [documentos, permisos.puedeEditar, userId, userName]
  );

  const duplicarDocumento = useCallback(
    (id: string): DocumentoExpediente | null => {
      if (!permisos.puedeEditar) return null;

      const doc = documentos.find((d) => d.id === id);
      if (!doc) return null;

      const copia: DocumentoExpediente = {
        ...doc,
        id: generateDocumentId(),
        nombre: `${doc.nombre} (copia)`,
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString(),
        creadoPor: userName,
        idCreador: userId,
        modificadoPor: userName,
        idModificador: userId,
        firmado: false,
        fechaFirma: undefined,
        firmadoPor: undefined,
        idFirmante: undefined,
        tipoFirma: undefined,
      };

      setDocumentos((prev) => [copia, ...prev]);
      return copia;
    },
    [documentos, permisos.puedeEditar, userId, userName]
  );

  // ============================================
  // ACCIONES - CARPETAS
  // ============================================
  
  const crearCarpeta = useCallback(
    (nombre: string, tipo: TipoCarpeta, idCarpetaPadre: string | null = null): CarpetaDocumento => {
      const configCarpeta = CARPETAS_PREDEFINIDAS.find((c) => c.tipo === tipo);
      
      const nuevaCarpeta: CarpetaDocumento = {
        id: generateFolderId(),
        idExpediente,
        nombre,
        descripcion: configCarpeta?.descripcion,
        tipo,
        idCarpetaPadre: idCarpetaPadre ?? carpetaActual,
        ruta: rutaCarpeta.map((c) => c.nombre).join('/') || '/',
        color: configCarpeta?.color,
        icono: configCarpeta?.icono,
        orden: configCarpeta?.orden || 99,
        fechaCreacion: new Date().toISOString(),
        creadoPor: userName,
        documentosCount: 0,
        subcarpetasCount: 0,
      };

      setCarpetas((prev) => [...prev, nuevaCarpeta]);
      return nuevaCarpeta;
    },
    [idExpediente, userName, carpetaActual, rutaCarpeta]
  );

  const actualizarCarpeta = useCallback(
    (id: string, cambios: Partial<CarpetaDocumento>): CarpetaDocumento | null => {
      let carpetaActualizada: CarpetaDocumento | null = null;
      
      setCarpetas((prev) =>
        prev.map((c) => {
          if (c.id === id) {
            carpetaActualizada = { ...c, ...cambios };
            return carpetaActualizada;
          }
          return c;
        })
      );
      
      return carpetaActualizada;
    },
    []
  );

  const eliminarCarpeta = useCallback(
    (id: string, moverDocumentosARaiz = true): boolean => {
      // Mover documentos si es necesario
      if (moverDocumentosARaiz) {
        setDocumentos((prev) =>
          prev.map((d) =>
            d.idCarpeta === id ? { ...d, idCarpeta: carpetaActual } : d
          )
        );
      }

      // Eliminar subcarpetas recursivamente
      const eliminarRecursivo = (carpetaId: string) => {
        const subcarpetas = carpetas.filter((c) => c.idCarpetaPadre === carpetaId);
        subcarpetas.forEach((sub) => eliminarRecursivo(sub.id));
        setCarpetas((prev) => prev.filter((c) => c.id !== carpetaId));
      };

      eliminarRecursivo(id);
      return true;
    },
    [carpetas, carpetaActual]
  );

  const navegarACarpeta = useCallback((id: string | null) => {
    setCarpetaActual(id);
    limpiarSeleccion();
  }, []);

  const navegarArriba = useCallback(() => {
    if (carpetaActual) {
      const carpeta = carpetas.find((c) => c.id === carpetaActual);
      if (carpeta) {
        setCarpetaActual(carpeta.idCarpetaPadre);
        limpiarSeleccion();
      }
    }
  }, [carpetaActual, carpetas]);

  // ============================================
  // ACCIONES - SELECCIÓN
  // ============================================
  
  const seleccionarDocumento = useCallback((id: string, seleccionado: boolean) => {
    setSeleccionados((prev) =>
      seleccionado
        ? [...prev, id]
        : prev.filter((sid) => sid !== id)
    );
  }, []);

  const seleccionarTodos = useCallback((seleccionados: boolean) => {
    if (seleccionados) {
      setSeleccionados(documentosFiltrados.map((d) => d.id));
    } else {
      setSeleccionados([]);
    }
  }, [documentosFiltrados]);

  const limpiarSeleccion = useCallback(() => {
    setSeleccionados([]);
  }, []);

  const toggleModoSeleccion = useCallback(() => {
    setModoSeleccion((prev) => !prev);
    if (modoSeleccion) {
      limpiarSeleccion();
    }
  }, [modoSeleccion, limpiarSeleccion]);

  // ============================================
  // ACCIONES - FILTROS Y ORDENAMIENTO
  // ============================================
  
  const setFiltros = useCallback((nuevosFiltros: Partial<FiltrosDocumento>) => {
    setFiltrosState((prev) => ({ ...prev, ...nuevosFiltros }));
  }, []);

  const limpiarFiltros = useCallback(() => {
    setFiltrosState({});
  }, []);

  // ============================================
  // ACCIONES - DESCARGA
  // ============================================
  
  const descargarDocumento = useCallback((id: string, version?: number) => {
    const doc = documentos.find((d) => d.id === id);
    if (!doc) return;

    const versionADescargar = version
      ? doc.versiones.find((v) => v.numeroVersion === version)
      : doc.versiones.find((v) => v.numeroVersion === doc.versionActual);

    if (!versionADescargar) return;

    // Simular descarga
    const link = document.createElement('a');
    link.href = doc.url || '#';
    link.download = versionADescargar.nombreArchivo;
    link.click();
  }, [documentos]);

  const descargarMultiples = useCallback((ids: string[]) => {
    ids.forEach((id) => descargarDocumento(id));
  }, [descargarDocumento]);

  const comprimirDocumentos = useCallback(
    async (_ids: string[], _nombreZip = 'documentos'): Promise<Blob> => {
      // Aquí se integraría con el servicio de compresión
      // Por ahora retornamos un blob vacío como placeholder
      return new Blob([''], { type: 'application/zip' });
    },
    []
  );

  // ============================================
  // BÚSQUEDA
  // ============================================
  
  const buscarDocumentos = useCallback(
    (query: string): DocumentoExpediente[] => {
      const q = query.toLowerCase();
      return documentos.filter(
        (d) =>
          d.estado !== 'eliminado' &&
          (d.nombre.toLowerCase().includes(q) ||
            d.descripcion?.toLowerCase().includes(q) ||
            d.etiquetas.some((tag) => tag.toLowerCase().includes(q)))
      );
    },
    [documentos]
  );

  // ============================================
  // REFRESCAR
  // ============================================
  
  const refrescar = useCallback(() => {
    // Aquí se recargarían los datos del servidor
    // Por ahora es un no-op para la implementación mock
  }, []);

  // ============================================
  // RETORNO
  // ============================================
  
  return {
    // Estado
    documentos,
    carpetas,
    carpetaActual,
    filtros,
    ordenamiento,
    seleccionados,
    modoSeleccion,
    
    // Computados
    documentosFiltrados,
    documentosCarpetaActual,
    subcarpetasActuales,
    estadisticas,
    rutaCarpeta,
    
    // Permisos
    permisos,
    
    // Acciones - Documentos
    subirDocumento,
    subirDocumentos,
    actualizarDocumento,
    eliminarDocumento,
    restaurarDocumento,
    cambiarEstado,
    firmarDocumento,
    subirNuevaVersion,
    cambiarVersionActiva,
    moverDocumentos,
    copiarDocumentos,
    duplicarDocumento,
    
    // Acciones - Carpetas
    crearCarpeta,
    actualizarCarpeta,
    eliminarCarpeta,
    navegarACarpeta,
    navegarArriba,
    
    // Acciones - Selección
    seleccionarDocumento,
    seleccionarTodos,
    limpiarSeleccion,
    toggleModoSeleccion,
    
    // Acciones - Filtros y ordenamiento
    setFiltros,
    limpiarFiltros,
    setOrdenamiento,
    
    // Acciones - Descarga
    descargarDocumento,
    descargarMultiples,
    comprimirDocumentos,
    
    // Búsqueda
    buscarDocumentos,
    
    // Refrescar
    refrescar,
  };
}

export default useDocumentosExpediente;
