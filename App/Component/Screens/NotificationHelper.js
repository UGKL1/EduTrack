import { firestore } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function notifyStudentRegistered(studentName, grade = null, section = null) {
  try {
    await addDoc(collection(firestore, 'notifications'), {
      type: 'student_registered',
      message: `${studentName} has been registered.`,
      createdAt: serverTimestamp(),
      grade: grade,
      section: section,
    });
    console.log('Notification saved in Firestore');
  } catch (error) {
    console.error('Error saving notification:', error);
  }
  console.log("Trying to save notification for:", studentName);
}
