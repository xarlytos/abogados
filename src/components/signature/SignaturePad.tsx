// ============================================
// PAD DE FIRMA BIOMÉTRICA (CANVAS)
// ============================================

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Eraser, Undo, CheckCircle, AlertCircle } from 'lucide-react';
import type { SignaturePadProps } from '@/types/signature';

interface Point {
  x: number;
  y: number;
  pressure?: number;
  timestamp: number;
}

interface Stroke {
  points: Point[];
}

export function SignaturePad({
  onSignature,
  onClear,
  width = 500,
  height = 200,
  penColor = '#f59e0b', // amber-500
  backgroundColor = '#0f172a', // slate-900
  disabled = false,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [hasSignature, setHasSignature] = useState(false);
  const [stats, setStats] = useState({
    strokes: 0,
    points: 0,
    speed: 0,
  });

  // Configurar canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajustar para pantallas retina
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2;

    // Fondo
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Línea guía
    ctx.strokeStyle = '#334155'; // slate-700
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(20, height - 40);
    ctx.lineTo(width - 20, height - 40);
    ctx.stroke();
    ctx.setLineDash([]);

    // Texto guía
    ctx.fillStyle = '#475569'; // slate-600
    ctx.font = '12px sans-serif';
    ctx.fillText('Firme aquí', 20, height - 20);
  }, [width, height, penColor, backgroundColor]);

  // Dibujar strokes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiar y redibujar
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Redibujar línea guía
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(20, height - 40);
    ctx.lineTo(width - 20, height - 40);
    ctx.stroke();
    ctx.setLineDash([]);

    // Redibujar texto
    ctx.fillStyle = '#475569';
    ctx.font = '12px sans-serif';
    ctx.fillText('Firme aquí', 20, height - 20);

    // Dibujar todos los strokes
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2;

    strokes.forEach(stroke => {
      if (stroke.points.length < 2) return;
      
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      
      for (let i = 1; i < stroke.points.length; i++) {
        const point = stroke.points[i];
        const prevPoint = stroke.points[i - 1];
        
        // Curva suave
        const midX = (prevPoint.x + point.x) / 2;
        const midY = (prevPoint.y + point.y) / 2;
        ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, midX, midY);
      }
      
      ctx.lineTo(stroke.points[stroke.points.length - 1].x, stroke.points[stroke.points.length - 1].y);
      ctx.stroke();
    });

    // Dibujar stroke actual
    if (currentStroke.length > 1) {
      ctx.beginPath();
      ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
      
      for (let i = 1; i < currentStroke.length; i++) {
        const point = currentStroke[i];
        const prevPoint = currentStroke[i - 1];
        const midX = (prevPoint.x + point.x) / 2;
        const midY = (prevPoint.y + point.y) / 2;
        ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, midX, midY);
      }
      
      ctx.stroke();
    }
  }, [strokes, currentStroke, width, height, penColor, backgroundColor]);

  // Obtener coordenadas del evento
  const getCoordinates = useCallback((e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      timestamp: Date.now(),
    };
  }, []);

  // Event handlers
  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    
    const point = getCoordinates(e);
    if (point) {
      setIsDrawing(true);
      setCurrentStroke([point]);
    }
  }, [disabled, getCoordinates]);

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled) return;
    e.preventDefault();

    const point = getCoordinates(e);
    if (point) {
      setCurrentStroke(prev => [...prev, point]);
    }
  }, [isDrawing, disabled, getCoordinates]);

  const handleEnd = useCallback(() => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    if (currentStroke.length > 0) {
      setStrokes(prev => [...prev, { points: currentStroke }]);
      setCurrentStroke([]);
      setHasSignature(true);
      
      // Calcular estadísticas
      setStats(prev => ({
        strokes: prev.strokes + 1,
        points: prev.points + currentStroke.length,
        speed: calculateAverageSpeed([...strokes, { points: currentStroke }]),
      }));
    }
  }, [isDrawing, currentStroke, strokes]);

  // Calcular velocidad promedio
  const calculateAverageSpeed = (allStrokes: Stroke[]): number => {
    let totalSpeed = 0;
    let count = 0;

    allStrokes.forEach(stroke => {
      for (let i = 1; i < stroke.points.length; i++) {
        const point = stroke.points[i];
        const prevPoint = stroke.points[i - 1];
        const distance = Math.sqrt(
          Math.pow(point.x - prevPoint.x, 2) + Math.pow(point.y - prevPoint.y, 2)
        );
        const time = point.timestamp - prevPoint.timestamp;
        if (time > 0) {
          totalSpeed += distance / time;
          count++;
        }
      }
    });

    return count > 0 ? totalSpeed / count : 0;
  };

  // Limpiar canvas
  const handleClear = useCallback(() => {
    setStrokes([]);
    setCurrentStroke([]);
    setHasSignature(false);
    setStats({ strokes: 0, points: 0, speed: 0 });
    onClear();
  }, [onClear]);

  // Deshacer último stroke
  const handleUndo = useCallback(() => {
    setStrokes(prev => {
      const newStrokes = prev.slice(0, -1);
      if (newStrokes.length === 0) {
        setHasSignature(false);
      }
      return newStrokes;
    });
  }, []);

  // Confirmar firma
  const handleConfirm = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    onSignature(dataUrl);
  }, [onSignature]);

  return (
    <div className="space-y-4">
      {/* Canvas container */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          className={`border border-theme-hover rounded-xl cursor-crosshair touch-none ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{ width, height }}
        />

        {/* Indicador de firma válida */}
        {hasSignature && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full"
          >
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-emerald-400">Firma capturada</span>
          </motion.div>
        )}
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={strokes.length === 0 || disabled}
            className="px-3 py-2 text-sm text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Undo className="w-4 h-4" />
            Deshacer
          </button>
          <button
            onClick={handleClear}
            disabled={!hasSignature || disabled}
            className="px-3 py-2 text-sm text-theme-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Eraser className="w-4 h-4" />
            Limpiar
          </button>
        </div>

        {hasSignature && (
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Confirmar
          </button>
        )}
      </div>

      {/* Stats biométricas (opcional, para debug/feedback) */}
      {hasSignature && stats.strokes > 0 && (
        <div className="p-3 bg-theme-tertiary/50 border border-theme-hover rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-medium text-theme-primary">Datos biométricos capturados</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-theme-primary">{stats.strokes}</p>
              <p className="text-xs text-theme-muted">Trazos</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-theme-primary">{stats.points}</p>
              <p className="text-xs text-theme-muted">Puntos</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-theme-primary">{(stats.speed * 1000).toFixed(0)}</p>
              <p className="text-xs text-theme-muted">Velocidad px/s</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Versión compacta del pad de firma
export function SignaturePadCompact({
  onSignature,
  onClear,
  disabled = false,
}: Omit<SignaturePadProps, 'width' | 'height'>) {
  return (
    <SignaturePad
      onSignature={onSignature}
      onClear={onClear}
      width={300}
      height={120}
      disabled={disabled}
    />
  );
}

export default SignaturePad;
