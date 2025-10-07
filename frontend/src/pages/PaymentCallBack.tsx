import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { VERIFY_PAYMENT } from "../graphql/paymentMutations";
import { CircularProgress, Box, Typography } from "@mui/material";

const PaymentCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verifyPayment] = useMutation(VERIFY_PAYMENT);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const link_id = queryParams.get("link_id");

    if (!link_id) {
      navigate("/bookings");
      return;
    }

    const verify = async () => {
      try {
        const { data } = await verifyPayment({ variables: { link_id } });
        if (data?.verifyPayment) {
          navigate(`/booking-success?link_id=${link_id}`);
        } else {
          navigate(`/booking-failed?`);
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        navigate(`/booking-failed`);
      }
    };

    verify();
  }, [location, navigate, verifyPayment]);

  return (
    <Box textAlign="center" mt={10}>
      <CircularProgress />
      <Typography variant="h6" mt={2}>
        Verifying your payment, please wait...
      </Typography>
    </Box>
  );
};

export default PaymentCallback;
