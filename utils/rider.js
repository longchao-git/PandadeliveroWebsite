/**
 * 骑手申请 & 聊天系统共享常量与工具函数
 * 提取自 chat.vue、admin-chat.vue、admin.vue、rider.vue 中重复定义的常量
 */

export const VEHICLE_MAP = {
  moto: 'moto',
  bici_electrica: 'biciElectrica',
  bici: 'bici',
  coche: 'coche'
};

export const AUTONOMO_MAP = {
  1: 'autonomoYes',
  0: 'autonomoNo',
  2: 'autonomoInProcess'
};

export const AVAILABILITY_MAP = {
  comidas: 'comidas',
  cenas: 'cenas',
  fines_semana: 'finesSemana',
  lluvia: 'lluvia'
};

export const CITY_NAMES = {
  1: { es: 'Valencia', zh: '瓦伦西亚', en: 'Valencia' },
  2: { es: 'Madrid', zh: '马德里', en: 'Madrid' },
  3: { es: 'Barcelona', zh: '巴塞罗那', en: 'Barcelona' },
  4: { es: 'Otra ciudad', zh: '其他城市', en: 'Other city' }
};

/**
 * 获取车辆类型 i18n key
 */
export function getVehicleLabel(type) {
  return VEHICLE_MAP[type] || type || '';
}

/**
 * 获取自雇状态 i18n key
 */
export function getAutonomoLabel(val) {
  return AUTONOMO_MAP[val] || 'autonomoUnknown';
}

/**
 * 格式化可用时段（返回 i18n key 数组）
 */
export function formatAvailability(av) {
  if (!av) return [];
  return av.split(',').map(a => AVAILABILITY_MAP[a] || a);
}

/**
 * 归一化聊天消息字段
 * 统一不同接口返回的字段名差异
 */
export function normalizeMessage(message) {
  if (!message || typeof message !== 'object') return null;
  return {
    message_id: String(message.message_id || ''),
    sender_type: message.sender_type || 'system',
    sender_name: message.sender_name || '',
    content: message.content || '',
    content_es: message.content_es || message.client_content || message.content || '',
    content_zh: message.content_zh || '',
    created_at: message.created_at || new Date().toISOString()
  };
}
