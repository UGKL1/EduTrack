// services/notificationService.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../config/firebase'; // Adjust this path if needed

export const sendAdminNotification = async (message, type = 'info') => {
  try {
    await addDoc(collection(firestore, 'admin_notifications'), {
      message: message,
      type: type, // 'info', 'alert', 'success'
      read: false,
      timestamp: serverTimestamp(),
    });
    console.log('🔔 Notification sent to Admin');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
