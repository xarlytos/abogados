import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  FileText,
  Upload,
  Download,
  Trash2,
  Copy,
  CheckCircle,
  Search,
  Filter,
  Grid,
  List as ListIcon,
  ChevronRight,
  X,
  Archive,
  Eye,
  FileSignature,
  CheckSquare,
  Square,
  FolderPlus,
  ArrowUp,
  File,
  Image,
  Table,
  FileType,
  Scale,
  PenTool,
  Mail,
  Receipt,
  Gavel,
  ScrollText,
  ClipboardList,
  BookOpen,
  StickyNote,
  FileEdit,
  Signature,
  RefreshCw,
  Camera,
  FileCheck,
  Headphones,
  Video,
} from 'lucide-react';
import type {
  DocumentoExpediente,
  EstadoDocumento,
  CategoriaDocumento,
} from '@/types/documentos';
import {
  getIconoDocumento,
  getColorDocumento,
  getCategoriaNombre,
  getCategoriaIcono,
  getCategoriaColor,
  getEstadoConfig,
  formatTamaño,
  CATEGORIAS_DOCUMENTO,
  ESTADOS_DOCUMENTO,
} from '@/types/documentos';
import type { UseDocumentosExpedienteReturn } from '@/hooks/useDocumentosExpediente';

// ============================================
// PROPS
// ============================================

interface GestorDocumentalProps {
  hookDocumentos: UseDocumentosExpedienteReturn;
  onVerDocumento: (doc: DocumentoExpediente) => void;
  onMostrarToast: (mensaje: string, tipo: 'success' | 'error' | 'info') => void;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export function GestorDocumental({
  hookDocumentos,
  onVerDocumento,
  onMostrarToast,
}: GestorDocumentalProps) {
  const {
    documentosFiltrados,
    subcarpetasActuales,
    carpetaActual,
    rutaCarpeta,
    estadisticas,
    filtros,
    ordenamiento,
    seleccionados,
    modoSeleccion,
    permisos,
    navegarACarpeta,
    navegarArriba,
    seleccionarDocumento,
    seleccionarTodos,
    limpiarSeleccion,
    toggleModoSeleccion,
    setFiltros,
    limpiarFiltros,
    setOrdenamiento,
    subirDocumento,
    eliminarDocumento,
    cambiarEstado,
    duplicarDocumento,
    crearCarpeta,
    comprimirDocumentos,
  } = hookDocumentos;

  // Referencias para evitar errores de variable no usada
  void limpiarSeleccion;

  // Estado local
  const [vista, setVista] = useState<'grid' | 'list'>('list');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [docSeleccionado, setDocSeleccionado] = useState<DocumentoExpediente | null>(null);
  const [menuContextual, setMenuContextual] = useState<{
    x: number;
    y: number;
    doc: DocumentoExpediente | null;
  } | null>(null);
  
  // Modales
  const [modalSubir, setModalSubir] = useState(false);
  const [modalNuevaCarpeta, setModalNuevaCarpeta] = useState(false);
  const [modalCambiarEstado, setModalCambiarEstado] = useState(false);
  
  // Formularios
  const [nuevaCarpetaNombre, setNuevaCarpetaNombre] = useState('');
  const nuevaCarpetaTipo = 'personalizada';
  const [archivosSubida, setArchivosSubida] = useState<File[]>([]);
  const [categoriaSubida, setCategoriaSubida] = useState<CategoriaDocumento>('otro');
  const [estadoSubida, setEstadoSubida] = useState<EstadoDocumento>('borrador');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================
  // HANDLERS
  // ============================================
  
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setArchivosSubida(Array.from(e.target.files));
      setModalSubir(true);
    }
  }, []);

  const handleSubirArchivos = useCallback(async () => {
    for (const archivo of archivosSubida) {
      await subirDocumento(archivo, {
        categoria: categoriaSubida,
        estado: estadoSubida,
      });
    }
    setModalSubir(false);
    setArchivosSubida([]);
    onMostrarToast(`${archivosSubida.length} archivo(s) subido(s) correctamente`, 'success');
  }, [archivosSubida, categoriaSubida, estadoSubida, subirDocumento, onMostrarToast]);

  const handleCrearCarpeta = useCallback(() => {
    if (nuevaCarpetaNombre.trim()) {
      crearCarpeta(nuevaCarpetaNombre, nuevaCarpetaTipo as any);
      setModalNuevaCarpeta(false);
      setNuevaCarpetaNombre('');
      onMostrarToast('Carpeta creada correctamente', 'success');
    }
  }, [nuevaCarpetaNombre, nuevaCarpetaTipo, crearCarpeta, onMostrarToast]);

  const handleEliminarDocumento = useCallback((id: string) => {
    if (confirm('¿Estás seguro de eliminar este documento?')) {
      eliminarDocumento(id);
      setMenuContextual(null);
      onMostrarToast('Documento eliminado', 'success');
    }
  }, [eliminarDocumento, onMostrarToast]);

  const handleDuplicar = useCallback((id: string) => {
    duplicarDocumento(id);
    setMenuContextual(null);
    onMostrarToast('Documento duplicado', 'success');
  }, [duplicarDocumento, onMostrarToast]);

  const handleMenuContextual = useCallback((e: React.MouseEvent, doc: DocumentoExpediente) => {
    e.preventDefault();
    setMenuContextual({ x: e.clientX, y: e.clientY, doc });
  }, []);

  const handleComprimirSeleccionados = useCallback(async () => {
    if (seleccionados.length === 0) return;
    onMostrarToast('Comprimiendo documentos...', 'info');
    try {
      await comprimirDocumentos(seleccionados);
      onMostrarToast('Documentos comprimidos correctamente', 'success');
    } catch {
      onMostrarToast('Error al comprimir documentos', 'error');
    }
  }, [seleccionados, comprimirDocumentos, onMostrarToast]);

  // ============================================
  // RENDER - HEADER CON NAVEGACIÓN
  // ============================================
  
  const renderHeader = () => (
    <div className="flex flex-col gap-4 mb-6">
      {/* Breadcrumb y acciones principales */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navegarACarpeta(null)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              carpetaActual === null
                ? 'bg-amber-500/20 text-amber-500'
                : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span>Expediente</span>
          </button>
          
          {rutaCarpeta.map((carpeta) => (
            <div key={carpeta.id} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-theme-tertiary" />
              <button
                onClick={() => navegarACarpeta(carpeta.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  carpetaActual === carpeta.id
                    ? 'bg-amber-500/20 text-amber-500'
                    : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary'
                }`}
              >
                <Folder className="w-4 h-4" />
                <span className="max-w-[150px] truncate">{carpeta.nombre}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          {permisos.puedeEditar && (
            <>
              <button
                onClick={() => setModalNuevaCarpeta(true)}
                className="flex items-center gap-2 px-3 py-2 bg-theme-tertiary hover:bg-theme-hover text-theme-primary rounded-lg transition-colors text-sm"
              >
                <FolderPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Nueva carpeta</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 bg-amber-500 text-slate-950 font-medium rounded-lg hover:bg-amber-400 transition-colors text-sm"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Subir</span>
              </button>
            </>
          )}
          
          {carpetaActual && (
            <button
              onClick={navegarArriba}
              className="p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary rounded-lg transition-colors"
              title="Subir nivel"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Barra de herramientas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Búsqueda y filtros */}
        <div className="flex items-center gap-2 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-tertiary" />
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={filtros.busqueda || ''}
              onChange={(e) => setFiltros({ busqueda: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-theme-tertiary border border-theme rounded-lg text-theme-primary placeholder-theme-tertiary focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className={`p-2 rounded-lg transition-colors ${
              mostrarFiltros || Object.keys(filtros).length > (filtros.busqueda ? 1 : 0)
                ? 'bg-amber-500/20 text-amber-500'
                : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary'
            }`}
            title="Filtros"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Vista y selección */}
        <div className="flex items-center gap-2">
          {modoSeleccion && seleccionados.length > 0 && (
            <>
              <span className="text-sm text-theme-secondary">
                {seleccionados.length} seleccionado(s)
              </span>
              {permisos.puedeDescargar && (
                <button
                  onClick={handleComprimirSeleccionados}
                  className="p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary rounded-lg transition-colors"
                  title="Comprimir seleccionados"
                >
                  <Archive className="w-4 h-4" />
                </button>
              )}
            </>
          )}
          
          <button
            onClick={toggleModoSeleccion}
            className={`p-2 rounded-lg transition-colors ${
              modoSeleccion
                ? 'bg-amber-500/20 text-amber-500'
                : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary'
            }`}
            title="Modo selección"
          >
            {modoSeleccion ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
          </button>
          
          <div className="flex items-center border border-theme rounded-lg overflow-hidden">
            <button
              onClick={() => setVista('list')}
              className={`p-2 transition-colors ${
                vista === 'list'
                  ? 'bg-amber-500/20 text-amber-500'
                  : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary'
              }`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setVista('grid')}
              className={`p-2 transition-colors ${
                vista === 'grid'
                  ? 'bg-amber-500/20 text-amber-500'
                  : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Panel de filtros */}
      <AnimatePresence>
        {mostrarFiltros && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-theme-tertiary/50 border border-theme rounded-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Categoría */}
                <div>
                  <label className="block text-xs text-theme-secondary mb-1">Categoría</label>
                  <select
                    value={filtros.categoria || ''}
                    onChange={(e) => setFiltros({ categoria: e.target.value as CategoriaDocumento || null })}
                    className="w-full px-3 py-2 bg-theme-primary border border-theme rounded-lg text-sm text-theme-primary"
                  >
                    <option value="">Todas</option>
                    {CATEGORIAS_DOCUMENTO.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-xs text-theme-secondary mb-1">Estado</label>
                  <select
                    value={filtros.estado || ''}
                    onChange={(e) => setFiltros({ estado: e.target.value as EstadoDocumento || null })}
                    className="w-full px-3 py-2 bg-theme-primary border border-theme rounded-lg text-sm text-theme-primary"
                  >
                    <option value="">Todos</option>
                    {ESTADOS_DOCUMENTO.map((est) => (
                      <option key={est.id} value={est.id}>{est.nombre}</option>
                    ))}
                  </select>
                </div>

                {/* Fecha desde */}
                <div>
                  <label className="block text-xs text-theme-secondary mb-1">Desde</label>
                  <input
                    type="date"
                    value={filtros.fechaDesde || ''}
                    onChange={(e) => setFiltros({ fechaDesde: e.target.value || null })}
                    className="w-full px-3 py-2 bg-theme-primary border border-theme rounded-lg text-sm text-theme-primary"
                  />
                </div>

                {/* Fecha hasta */}
                <div>
                  <label className="block text-xs text-theme-secondary mb-1">Hasta</label>
                  <input
                    type="date"
                    value={filtros.fechaHasta || ''}
                    onChange={(e) => setFiltros({ fechaHasta: e.target.value || null })}
                    className="w-full px-3 py-2 bg-theme-primary border border-theme rounded-lg text-sm text-theme-primary"
                  />
                </div>
              </div>

              {/* Checkboxes adicionales */}
              <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-theme">
                <label className="flex items-center gap-2 text-sm text-theme-secondary">
                  <input
                    type="checkbox"
                    checked={filtros.soloFirmados || false}
                    onChange={(e) => setFiltros({ soloFirmados: e.target.checked })}
                    className="rounded border-theme text-amber-500 focus:ring-amber-500"
                  />
                  Solo firmados
                </label>
                <label className="flex items-center gap-2 text-sm text-theme-secondary">
                  <input
                    type="checkbox"
                    checked={filtros.soloPendientes || false}
                    onChange={(e) => setFiltros({ soloPendientes: e.target.checked })}
                    className="rounded border-theme text-amber-500 focus:ring-amber-500"
                  />
                  Solo pendientes
                </label>
                <button
                  onClick={limpiarFiltros}
                  className="ml-auto text-sm text-amber-500 hover:text-amber-400"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3 bg-theme-tertiary/50 rounded-lg">
          <p className="text-2xl font-bold text-theme-primary">{estadisticas.totalDocumentos}</p>
          <p className="text-xs text-theme-secondary">Documentos</p>
        </div>
        <div className="p-3 bg-theme-tertiary/50 rounded-lg">
          <p className="text-2xl font-bold text-purple-400">{estadisticas.pendientesFirma}</p>
          <p className="text-xs text-theme-secondary">Pendientes firma</p>
        </div>
        <div className="p-3 bg-theme-tertiary/50 rounded-lg">
          <p className="text-2xl font-bold text-emerald-400">{estadisticas.ultimos30Dias}</p>
          <p className="text-xs text-theme-secondary">Últimos 30 días</p>
        </div>
        <div className="p-3 bg-theme-tertiary/50 rounded-lg">
          <p className="text-2xl font-bold text-blue-400">{formatTamaño(estadisticas.totalTamaño)}</p>
          <p className="text-xs text-theme-secondary">Total almacenado</p>
        </div>
      </div>
    </div>
  );

  // ============================================
  // RENDER - CARPETAS
  // ============================================
  
  const renderCarpetas = () => {
    if (subcarpetasActuales.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-theme-secondary mb-3">Carpetas</h3>
        <div className={`grid gap-3 ${vista === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {subcarpetasActuales.map((carpeta) => (
            <motion.button
              key={carpeta.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navegarACarpeta(carpeta.id)}
              className={`relative group p-4 bg-theme-tertiary/50 hover:bg-theme-tertiary border border-theme hover:border-amber-500/30 rounded-xl transition-all text-left ${
                vista === 'list' ? 'flex items-center gap-4' : ''
              }`}
            >
              <div
                className={`${vista === 'list' ? '' : 'mb-3'} p-3 rounded-lg inline-flex`}
                style={{ backgroundColor: `${carpeta.color}20` }}
              >
                <Folder className="w-6 h-6" style={{ color: carpeta.color }} />
              </div>
              <div className={vista === 'list' ? 'flex-1' : ''}>
                <p className="font-medium text-theme-primary truncate">{carpeta.nombre}</p>
                <p className="text-xs text-theme-secondary mt-1">
                  {carpeta.documentosCount} documentos
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER - DOCUMENTOS
  // ============================================
  
  const renderDocumentos = () => {
    if (documentosFiltrados.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-theme-tertiary rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-theme-tertiary" />
          </div>
          <h3 className="text-lg font-medium text-theme-primary mb-2">
            No hay documentos
          </h3>
          <p className="text-theme-secondary text-sm">
            {filtros.busqueda
              ? 'No se encontraron documentos con ese criterio'
              : 'Sube tu primer documento para empezar'}
          </p>
        </div>
      );
    }

    if (vista === 'grid') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {documentosFiltrados.map((doc) => (
            <DocumentoGridItem
              key={doc.id}
              documento={doc}
              seleccionado={seleccionados.includes(doc.id)}
              modoSeleccion={modoSeleccion}
              onSeleccionar={(sel) => seleccionarDocumento(doc.id, sel)}
              onVer={() => onVerDocumento(doc)}
              onMenuContextual={(e) => handleMenuContextual(e, doc)}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="border border-theme rounded-xl overflow-hidden">
        {/* Header de tabla */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-3 bg-theme-tertiary/50 border-b border-theme text-xs font-medium text-theme-secondary">
          <div className="col-span-5 flex items-center gap-2">
            {modoSeleccion && (
              <button
                onClick={() => seleccionarTodos(seleccionados.length !== documentosFiltrados.length)}
                className="text-theme-secondary hover:text-theme-primary"
              >
                {seleccionados.length === documentosFiltrados.length ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>
            )}
            <button
              onClick={() => setOrdenamiento({
                campo: 'nombre',
                direccion: ordenamiento.campo === 'nombre' && ordenamiento.direccion === 'asc' ? 'desc' : 'asc'
              })}
              className="flex items-center gap-1 hover:text-theme-primary"
            >
              Nombre
              {ordenamiento.campo === 'nombre' && (
                ordenamiento.direccion === 'asc' ? <ChevronRight className="w-3 h-3 rotate-90" /> : <ChevronRight className="w-3 h-3 -rotate-90" />
              )}
            </button>
          </div>
          <div className="col-span-2">
            <button
              onClick={() => setOrdenamiento({
                campo: 'categoria',
                direccion: ordenamiento.campo === 'categoria' && ordenamiento.direccion === 'asc' ? 'desc' : 'asc'
              })}
              className="flex items-center gap-1 hover:text-theme-primary"
            >
              Categoría
              {ordenamiento.campo === 'categoria' && (
                ordenamiento.direccion === 'asc' ? <ChevronRight className="w-3 h-3 rotate-90" /> : <ChevronRight className="w-3 h-3 -rotate-90" />
              )}
            </button>
          </div>
          <div className="col-span-2">
            <button
              onClick={() => setOrdenamiento({
                campo: 'estado',
                direccion: ordenamiento.campo === 'estado' && ordenamiento.direccion === 'asc' ? 'desc' : 'asc'
              })}
              className="flex items-center gap-1 hover:text-theme-primary"
            >
              Estado
              {ordenamiento.campo === 'estado' && (
                ordenamiento.direccion === 'asc' ? <ChevronRight className="w-3 h-3 rotate-90" /> : <ChevronRight className="w-3 h-3 -rotate-90" />
              )}
            </button>
          </div>
          <div className="col-span-2">
            <button
              onClick={() => setOrdenamiento({
                campo: 'fecha',
                direccion: ordenamiento.campo === 'fecha' && ordenamiento.direccion === 'asc' ? 'desc' : 'asc'
              })}
              className="flex items-center gap-1 hover:text-theme-primary"
            >
              Modificado
              {ordenamiento.campo === 'fecha' && (
                ordenamiento.direccion === 'asc' ? <ChevronRight className="w-3 h-3 rotate-90" /> : <ChevronRight className="w-3 h-3 -rotate-90" />
              )}
            </button>
          </div>
          <div className="col-span-1 text-right">Acciones</div>
        </div>

        {/* Filas de documentos */}
        <div className="divide-y divide-theme">
          {documentosFiltrados.map((doc) => (
            <DocumentoListItem
              key={doc.id}
              documento={doc}
              seleccionado={seleccionados.includes(doc.id)}
              modoSeleccion={modoSeleccion}
              onSeleccionar={(sel) => seleccionarDocumento(doc.id, sel)}
              onVer={() => onVerDocumento(doc)}
              onMenuContextual={(e) => handleMenuContextual(e, doc)}
              onEliminar={() => handleEliminarDocumento(doc.id)}
              onDuplicar={() => handleDuplicar(doc.id)}
              permisos={permisos}
            />
          ))}
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER - MENÚ CONTEXTUAL
  // ============================================
  
  const renderMenuContextual = () => {
    if (!menuContextual || !menuContextual.doc) return null;

    const doc = menuContextual.doc;
    void getEstadoConfig(doc.estado); // Referencia para evitar error

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{ left: menuContextual.x, top: menuContextual.y }}
        className="fixed z-50 w-56 bg-theme-card border border-theme rounded-xl shadow-xl py-1"
      >
        <button
          onClick={() => {
            onVerDocumento(doc);
            setMenuContextual(null);
          }}
          className="w-full px-4 py-2 text-left text-sm text-theme-secondary hover:bg-theme-tertiary flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Ver documento
        </button>
        
        {permisos.puedeDescargar && (
          <button
            onClick={() => {
              setMenuContextual(null);
              onMostrarToast('Descargando...', 'info');
            }}
            className="w-full px-4 py-2 text-left text-sm text-theme-secondary hover:bg-theme-tertiary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Descargar
          </button>
        )}
        
        <div className="border-t border-theme my-1" />
        
        {permisos.puedeCambiarEstado && (
          <button
            onClick={() => {
              setDocSeleccionado(doc);
              setModalCambiarEstado(true);
              setMenuContextual(null);
            }}
            className="w-full px-4 py-2 text-left text-sm text-theme-secondary hover:bg-theme-tertiary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Cambiar estado
          </button>
        )}
        
        {permisos.puedeFirmar && !doc.firmado && (
          <button
            onClick={() => {
              setMenuContextual(null);
              onMostrarToast('Documento firmado', 'success');
            }}
            className="w-full px-4 py-2 text-left text-sm text-theme-secondary hover:bg-theme-tertiary flex items-center gap-2"
          >
            <FileSignature className="w-4 h-4" />
            Firmar documento
          </button>
        )}
        
        {permisos.puedeEditar && (
          <button
            onClick={() => {
              handleDuplicar(doc.id);
              setMenuContextual(null);
            }}
            className="w-full px-4 py-2 text-left text-sm text-theme-secondary hover:bg-theme-tertiary flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Duplicar
          </button>
        )}
        
        <div className="border-t border-theme my-1" />
        
        {permisos.puedeEliminar && (
          <button
            onClick={() => handleEliminarDocumento(doc.id)}
            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-theme-tertiary flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        )}
      </motion.div>
    );
  };

  // ============================================
  // RENDER - MODALES
  // ============================================
  
  const renderModales = () => (
    <>
      {/* Modal Subir Archivos */}
      <AnimatePresence>
        {modalSubir && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModalSubir(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-theme-card border border-theme rounded-2xl w-full max-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-theme flex items-center justify-between">
                <h3 className="text-lg font-semibold text-theme-primary">Subir Documentos</h3>
                <button onClick={() => setModalSubir(false)} className="text-theme-secondary hover:text-theme-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-4 bg-theme-tertiary/50 rounded-lg">
                  <p className="text-sm text-theme-secondary">
                    {archivosSubida.length} archivo(s) seleccionado(s)
                  </p>
                  <ul className="mt-2 space-y-1">
                    {archivosSubida.map((file, idx) => (
                      <li key={idx} className="text-sm text-theme-primary flex items-center gap-2">
                        <File className="w-4 h-4" />
                        {file.name} ({formatTamaño(file.size)})
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-theme-secondary mb-2">Categoría</label>
                    <select
                      value={categoriaSubida}
                      onChange={(e) => setCategoriaSubida(e.target.value as CategoriaDocumento)}
                      className="w-full bg-theme-tertiary border border-theme rounded-lg p-3 text-theme-primary"
                    >
                      {CATEGORIAS_DOCUMENTO.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-theme-secondary mb-2">Estado inicial</label>
                    <select
                      value={estadoSubida}
                      onChange={(e) => setEstadoSubida(e.target.value as EstadoDocumento)}
                      className="w-full bg-theme-tertiary border border-theme rounded-lg p-3 text-theme-primary"
                    >
                      {ESTADOS_DOCUMENTO.filter(e => e.id !== 'eliminado').map((est) => (
                        <option key={est.id} value={est.id}>{est.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setModalSubir(false)}
                    className="px-4 py-2 text-theme-secondary hover:text-theme-primary"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubirArchivos}
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-medium rounded-lg hover:bg-amber-400"
                  >
                    Subir {archivosSubida.length} archivo(s)
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Nueva Carpeta */}
      <AnimatePresence>
        {modalNuevaCarpeta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModalNuevaCarpeta(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-theme-card border border-theme rounded-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-theme flex items-center justify-between">
                <h3 className="text-lg font-semibold text-theme-primary">Nueva Carpeta</h3>
                <button onClick={() => setModalNuevaCarpeta(false)} className="text-theme-secondary hover:text-theme-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-theme-secondary mb-2">Nombre</label>
                  <input
                    type="text"
                    value={nuevaCarpetaNombre}
                    onChange={(e) => setNuevaCarpetaNombre(e.target.value)}
                    placeholder="Nombre de la carpeta"
                    className="w-full bg-theme-tertiary border border-theme rounded-lg p-3 text-theme-primary placeholder-theme-tertiary"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setModalNuevaCarpeta(false)}
                    className="px-4 py-2 text-theme-secondary hover:text-theme-primary"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCrearCarpeta}
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-medium rounded-lg hover:bg-amber-400"
                  >
                    Crear carpeta
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Cambiar Estado */}
      <AnimatePresence>
        {modalCambiarEstado && docSeleccionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModalCambiarEstado(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-theme-card border border-theme rounded-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-theme flex items-center justify-between">
                <h3 className="text-lg font-semibold text-theme-primary">Cambiar Estado</h3>
                <button onClick={() => setModalCambiarEstado(false)} className="text-theme-secondary hover:text-theme-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-2">
                {ESTADOS_DOCUMENTO.filter(e => e.id !== 'eliminado').map((estado) => (
                  <button
                    key={estado.id}
                    onClick={() => {
                      cambiarEstado(docSeleccionado.id, estado.id);
                      setModalCambiarEstado(false);
                      onMostrarToast('Estado actualizado', 'success');
                    }}
                    className={`w-full p-3 rounded-lg border flex items-center gap-3 transition-colors ${
                      docSeleccionado.estado === estado.id
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-theme hover:bg-theme-tertiary'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${estado.bgColor}`}>
                      {/* Icono según tipo */}
                      <div className={`w-3 h-3 rounded-full ${estado.color.replace('text-', 'bg-')}`} />
                    </div>
                    <span className="text-theme-primary">{estado.nombre}</span>
                    {docSeleccionado.estado === estado.id && (
                      <CheckCircle className="w-4 h-4 text-amber-500 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  // ============================================
  // RENDER PRINCIPAL
  // ============================================
  
  return (
    <div className="space-y-6">
      {renderHeader()}
      {renderCarpetas()}
      {documentosFiltrados.length > 0 && (
        <h3 className="text-sm font-medium text-theme-secondary mb-3">
          Documentos ({documentosFiltrados.length})
        </h3>
      )}
      {renderDocumentos()}
      
      {/* Menú contextual */}
      <AnimatePresence>
        {menuContextual && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuContextual(null)}
          >
            {renderMenuContextual()}
          </div>
        )}
      </AnimatePresence>

      {renderModales()}

      {/* Input oculto para subir archivos */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

// ============================================
// COMPONENTES AUXILIARES
// ============================================

function DocumentoGridItem({
  documento,
  seleccionado,
  modoSeleccion,
  onSeleccionar,
  onVer,
  onMenuContextual,
}: {
  documento: DocumentoExpediente;
  seleccionado: boolean;
  modoSeleccion: boolean;
  onSeleccionar: (seleccionado: boolean) => void;
  onVer: () => void;
  onMenuContextual: (e: React.MouseEvent) => void;
}) {
  const IconoDocumento = getIconoLucide(getIconoDocumento(documento.tipo));
  const estadoCfg = getEstadoConfig(documento.estado);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => modoSeleccion ? onSeleccionar(!seleccionado) : onVer()}
      onContextMenu={onMenuContextual}
      className={`relative p-4 bg-theme-tertiary/50 hover:bg-theme-tertiary border rounded-xl transition-all cursor-pointer ${
        seleccionado
          ? 'border-amber-500 bg-amber-500/10'
          : 'border-theme hover:border-amber-500/30'
      }`}
    >
      {modoSeleccion && (
        <div className="absolute top-2 left-2">
          {seleccionado ? (
            <CheckSquare className="w-5 h-5 text-amber-500" />
          ) : (
            <Square className="w-5 h-5 text-theme-tertiary" />
          )}
        </div>
      )}

      {documento.firmado && (
        <div className="absolute top-2 right-2">
          <FileSignature className="w-4 h-4 text-purple-400" />
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        <div className={`p-4 rounded-xl mb-3 ${getColorDocumento(documento.tipo).replace('text-', 'bg-').replace('400', '500/20')}`}>
          <IconoDocumento className={`w-10 h-10 ${getColorDocumento(documento.tipo)}`} />
        </div>
        
        <p className="font-medium text-theme-primary text-sm line-clamp-2 mb-1">
          {documento.nombre}
        </p>
        
        <div className="flex items-center gap-2 text-xs text-theme-secondary">
          <span className={`px-2 py-0.5 rounded ${estadoCfg.bgColor} ${estadoCfg.color}`}>
            {estadoCfg.nombre}
          </span>
        </div>
        
        <p className="text-xs text-theme-tertiary mt-2">
          {formatTamaño(documento.tamaño)}
        </p>
      </div>
    </motion.div>
  );
}

function DocumentoListItem({
  documento,
  seleccionado,
  modoSeleccion,
  onSeleccionar,
  onVer,
  onMenuContextual,
  onEliminar,
  onDuplicar,
  permisos,
}: {
  documento: DocumentoExpediente;
  seleccionado: boolean;
  modoSeleccion: boolean;
  onSeleccionar: (seleccionado: boolean) => void;
  onVer: () => void;
  onMenuContextual: (e: React.MouseEvent) => void;
  onEliminar: () => void;
  onDuplicar: () => void;
  permisos: any;
}) {
  const IconoDocumento = getIconoLucide(getIconoDocumento(documento.tipo));
  const estadoConfig = getEstadoConfig(documento.estado);

  return (
    <div
      onClick={() => modoSeleccion ? onSeleccionar(!seleccionado) : onVer()}
      onContextMenu={onMenuContextual}
      className={`group grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-theme-tertiary/30 cursor-pointer transition-colors ${
        seleccionado ? 'bg-amber-500/10' : ''
      }`}
    >
      {/* Nombre */}
      <div className="col-span-12 sm:col-span-5 flex items-center gap-3">
        {modoSeleccion && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSeleccionar(!seleccionado);
            }}
          >
            {seleccionado ? (
              <CheckSquare className="w-4 h-4 text-amber-500" />
            ) : (
              <Square className="w-4 h-4 text-theme-tertiary" />
            )}
          </button>
        )}
        
        <div className={`p-2 rounded-lg flex-shrink-0 ${getColorDocumento(documento.tipo).replace('text-', 'bg-').replace('400', '500/20')}`}>
          <IconoDocumento className={`w-5 h-5 ${getColorDocumento(documento.tipo)}`} />
        </div>
        
        <div className="min-w-0">
          <p className="font-medium text-theme-primary text-sm truncate">
            {documento.nombre}
          </p>
          <div className="flex items-center gap-2 text-xs text-theme-tertiary">
            <span>{formatTamaño(documento.tamaño)}</span>
            {documento.versiones.length > 1 && (
              <span className="text-amber-500">v{documento.versionActual}</span>
            )}
            {documento.firmado && (
              <FileSignature className="w-3 h-3 text-purple-400" />
            )}
          </div>
        </div>
      </div>

      {/* Categoría */}
      <div className="hidden sm:col-span-2 sm:flex items-center gap-2">
        {(() => {
          const IconoCategoria = getIconoLucide(getCategoriaIcono(documento.categoria));
          return (
            <>
              <IconoCategoria className={`w-4 h-4 ${getCategoriaColor(documento.categoria)}`} />
              <span className="text-sm text-theme-secondary">
                {getCategoriaNombre(documento.categoria)}
              </span>
            </>
          );
        })()}
      </div>

      {/* Estado */}
      <div className="hidden sm:col-span-2 sm:flex items-center">
        <span className={`px-2 py-1 text-xs rounded-full ${estadoConfig.bgColor} ${estadoConfig.color}`}>
          {estadoConfig.nombre}
        </span>
      </div>

      {/* Fecha */}
      <div className="hidden sm:col-span-2 sm:block text-sm text-theme-secondary">
        {new Date(documento.fechaModificacion).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
        })}
      </div>

      {/* Acciones */}
      <div className="col-span-12 sm:col-span-1 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onVer();
          }}
          className="p-1.5 text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary rounded"
        >
          <Eye className="w-4 h-4" />
        </button>
        {permisos.puedeEditar && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicar();
              }}
              className="p-1.5 text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary rounded"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEliminar();
              }}
              className="p-1.5 text-theme-secondary hover:text-red-400 hover:bg-theme-tertiary rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================
// HELPER PARA ICONOS
// ============================================

function getIconoLucide(nombreIcono: string): React.ComponentType<{ className?: string }> {
  const iconos: Record<string, React.ComponentType<{ className?: string }>> = {
    FileText,
    FileType,
    Table,
    Image,
    File,
    Scale,
    FileSignature,
    Camera,
    FileCheck,
    Mail,
    Receipt,
    Gavel,
    ScrollText,
    PenTool,
    ClipboardList,
    BookOpen,
    StickyNote,
    FileEdit,
    Archive,
    Headphones,
    Video,
    Eye,
    CheckCircle,
    Signature,
  };
  return iconos[nombreIcono] || File;
}

// Referencias para evitar errores de import no usado
void { Camera, FileCheck, Headphones, Video };
