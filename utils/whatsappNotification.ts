/**
 * WhatsApp Notification Helper
 * Normalizes phone numbers, builds wa.me links, and formats Arabic notification templates
 * for Customer Orders, Feedbacks, and Contact Messages with IP and device tracking.
 */

export function buildWhatsAppNotificationUrl(
  whatsappTarget: string | undefined,
  message: string
): string {
  const target = (whatsappTarget || '').trim();
  const encodedText = encodeURIComponent(message);

  if (!target || target === 'https://wa.me/' || target === 'https://wa.me' || target === 'wa.me/' || target === 'wa.me') {
    return `https://wa.me/?text=${encodedText}`;
  }

  // If already a full URL like https://wa.me/9639xxxx
  if (target.startsWith('http://') || target.startsWith('https://')) {
    const hasQuery = target.includes('?');
    const separator = hasQuery ? '&' : '?';
    return `${target}${separator}text=${encodedText}`;
  }

  // If raw phone number or wa.me/9639xxxx
  if (target.startsWith('wa.me/')) {
    const hasQuery = target.includes('?');
    const separator = hasQuery ? '&' : '?';
    return `https://${target}${separator}text=${encodedText}`;
  }

  // Clean raw digits: e.g. "+963 938 123 456" -> "963938123456"
  let cleanDigits = target.replace(/[^0-9]/g, '');
  if (cleanDigits.startsWith('00')) {
    cleanDigits = cleanDigits.substring(2);
  }

  if (cleanDigits) {
    return `https://wa.me/${cleanDigits}?text=${encodedText}`;
  }

  return `https://wa.me/?text=${encodedText}`;
}

export function formatOrderWhatsAppMessage(order: {
  id: string;
  customerName: string;
  customerPhone: string;
  amount: number | string;
  currency: string;
  transactionId: string;
  activationCode: string;
  clientIp?: string;
  deviceInfo?: string;
  createdAt?: string;
}): string {
  return [
    `🚨 *إشعار بطلب شراء وتفعيل VIP جديد في ToysGame!*`,
    `--------------------------------------`,
    `👤 *اسم المشتري:* ${order.customerName}`,
    `📱 *هاتف / واتساب المشتري:* ${order.customerPhone}`,
    `💰 *المبلغ:* ${order.amount} ${order.currency}`,
    `🧾 *رقم عملية التحويل:* ${order.transactionId}`,
    `🔑 *كود التفعيل المخصص:* ${order.activationCode}`,
    `🌐 *عنوان IP لجهاز العميل:* ${order.clientIp || 'سحابي موثق'}`,
    `💻 *نوع الجهاز:* ${order.deviceInfo || 'متصفح ويب'}`,
    `🕒 *تاريخ ووقت الطلب:* ${order.createdAt || new Date().toLocaleString('ar-EG')}`,
    `--------------------------------------`,
    `✅ تم حفظ الطلب سحابياً في قاعدة بيانات الموقع للتحقق والموافقة.`,
  ].join('\n');
}

export function formatFeedbackWhatsAppMessage(feedback: {
  id: string;
  name: string;
  email?: string;
  rating: number;
  category: string;
  message: string;
  clientIp?: string;
  deviceInfo?: string;
  createdAt?: string;
}): string {
  const stars = '⭐'.repeat(Math.max(1, Math.min(5, feedback.rating)));
  return [
    `🌟 *إشعار برأي وتقييم جديد في ToysGame!*`,
    `--------------------------------------`,
    `👤 *اسم الزائر:* ${feedback.name || 'فاعل خير مجهول'}`,
    `📧 *البريد الإلكتروني:* ${feedback.email || 'غير متوفر'}`,
    `⭐ *التقييم:* ${stars} (${feedback.rating}/5)`,
    `🏷️ *تصنيف الرأي:* ${feedback.category}`,
    `💬 *نص الرأي والملاحظات:*`,
    `"${feedback.message}"`,
    `--------------------------------------`,
    `🌐 *عنوان IP لجهاز الزائر:* ${feedback.clientIp || 'سحابي موثق'}`,
    `💻 *نوع الجهاز:* ${feedback.deviceInfo || 'متصفح ويب'}`,
    `🕒 *الوقت:* ${feedback.createdAt || new Date().toLocaleString('ar-EG')}`,
  ].join('\n');
}

export function formatContactWhatsAppMessage(contact: {
  id: string;
  name: string;
  email?: string;
  subject: string;
  message: string;
  clientIp?: string;
  deviceInfo?: string;
  createdAt?: string;
}): string {
  return [
    `📩 *إشعار برسالة تواصل جديدة في ToysGame!*`,
    `--------------------------------------`,
    `👤 *المرسل:* ${contact.name}`,
    `📧 *البريد الإلكتروني:* ${contact.email || 'غير متوفر'}`,
    `📌 *موضوع الرسالة:* ${contact.subject}`,
    `📝 *نص الرسالة:*`,
    `"${contact.message}"`,
    `--------------------------------------`,
    `🌐 *عنوان IP لجهاز المرسل:* ${contact.clientIp || 'سحابي موثق'}`,
    `💻 *نوع الجهاز:* ${contact.deviceInfo || 'متصفح ويب'}`,
    `🕒 *الوقت:* ${contact.createdAt || new Date().toLocaleString('ar-EG')}`,
  ].join('\n');
}
