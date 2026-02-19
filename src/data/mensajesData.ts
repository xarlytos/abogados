export const conversations = [
  { id: 1, name: 'María García', avatar: 'MG', lastMessage: 'Perfecto, gracias por la información. Quedamos a la espera del próximo paso.', time: '10:30', unread: 2, online: true, type: 'client', case: 'EXP-2024-002' },
  { id: 2, name: 'Carlos López', avatar: 'CL', lastMessage: '¿Podemos reunirnos mañana para revisar los documentos?', time: '09:15', unread: 1, online: false, type: 'client', case: 'EXP-2024-003' },
  { id: 3, name: 'Ana Martínez (Abogada)', avatar: 'AM', lastMessage: 'Ya he revisado el contrato. Te envío mis observaciones.', time: 'Ayer', unread: 0, online: true, type: 'colleague', case: null },
  { id: 4, name: 'TechCorp Legal', avatar: 'TC', lastMessage: 'Adjuntamos la documentación solicitada para el caso.', time: 'Ayer', unread: 0, online: false, type: 'client', case: 'EXP-2024-004' },
  { id: 5, name: 'Laura Soto (Paralegal)', avatar: 'LS', lastMessage: 'He organizado todos los expedientes del mes.', time: 'Lun', unread: 0, online: true, type: 'colleague', case: null },
  { id: 6, name: 'Pedro Sánchez', avatar: 'PS', lastMessage: '¿Cuál es el estado de mi expediente?', time: 'Lun', unread: 0, online: false, type: 'client', case: 'EXP-2024-005' },
  { id: 7, name: 'Juzgado de lo Social', avatar: 'JS', lastMessage: 'Notificación de fecha de vista oral.', time: 'Dom', unread: 0, online: false, type: 'court', case: 'EXP-2024-003' },
];

export const messages = [
  { id: 1, sender: 'me', text: 'Hola María, ¿cómo estás?', time: '10:25', status: 'read' },
  { id: 2, sender: 'other', text: 'Hola Juan, bien gracias. ¿Hay novedades sobre mi caso?', time: '10:26', status: 'read' },
  { id: 3, sender: 'me', text: 'Sí, hemos recibido respuesta del juzgado. La vista está programada para el próximo mes.', time: '10:28', status: 'read' },
  { id: 4, sender: 'me', text: 'Te envío la documentación preparatoria para que la revises.', time: '10:28', status: 'read' },
  { id: 5, sender: 'other', text: 'Perfecto, gracias por la información. Quedamos a la espera del próximo paso.', time: '10:30', status: 'delivered' },
];
