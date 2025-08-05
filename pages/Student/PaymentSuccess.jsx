// src/pages/PaymentSuccess.jsx
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

const PaymentSuccess = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  console.log(courseId)
  useEffect(() => {
    const enroll = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        await fetch(`https://devkingsbackend-production-3753.up.railway.app/api/student/tutorials/${courseId}/enroll`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials:'include'
        });

        navigate(`/course/${courseId}`);
      } catch (err) {
        console.error("Enrollment after payment failed", err);
      }
    };

    enroll();
  }, []);

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>You are now being enrolled...</p>
    </div>
  );
};

export default PaymentSuccess;
