import { firestore } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function notifyStudentRegistered(studentName) {
  try {
    await addDoc(collection(firestore, 'notifications'), {
      type: 'student_registered',
      message: `${studentName} has been registered.`,
      createdAt: serverTimestamp(),
    });
    console.log('Notification saved in Firestore');
  } catch (error) {
    console.error('Error saving notification:', error);
  }
  console.log("Trying to save notification for:", studentName);
}
