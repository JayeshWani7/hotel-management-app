import React from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_USER_BOOKINGS,
  CANCEL_BOOKING,
} from "../../graphql/bookingQueries";
import { INITIATE_PAYMENT } from "../../graphql/paymentMutations";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Divider,
  CircularProgress,
  Chip,
  Alert,
  Grid,
  Paper,
} from "@mui/material";
import Layout from "../../layouts/Layout";
import { useAuth } from "../../context/AuthContext";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import HotelIcon from "@mui/icons-material/Hotel";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import type { Booking } from "../../types";
import { useEffect } from "react";

const MyBookings: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || "";

  // const { data, loading, error, refetch } = useQuery(GET_USER_BOOKINGS, {
  //   variables: { userId },
  //   skip: !userId,
  // });

  const { data, loading, error, refetch } = useQuery(GET_USER_BOOKINGS, {
    variables: { userId },
    skip: !userId, // don't run initially if no userId
    fetchPolicy: 'network-only', // always fetch from server
  });

  // Refetch every time the page mounts or userId changes
  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [userId, refetch]);
  


  const [cancelBooking, { loading: cancelLoading }] =
    useMutation(CANCEL_BOOKING);
  const [initiatePayment, { loading: payLoading }] =
    useMutation(INITIATE_PAYMENT);

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "success";
      case "PENDING":
        return "warning";
      case "CANCELLED":
        return "error";
      case "COMPLETED":
        return "info";
      default:
        return "default";
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    try {
      await cancelBooking({
        variables: {
          id: bookingId,
          cancelBookingInput: { cancellationReason: "Cancelled by user" },
        },
      });
      alert("Booking cancelled successfully");
      refetch();
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      alert("Unable to cancel booking");
    }
  };

  // const handlePayment = async (booking: any) => {
  //   try {
  //     const res = await initiatePayment({
  //       variables: { bookingId: booking.id },
  //     });

  //     const paymentData = res.data?;

  //     if (!paymentData) {
  //       alert("Payment initiation failed. Please try again.");
  //       return;
  //     }

  //     // If you have a redirect-based flow:
  //     const { paymentSessionId, orderToken, orderId } = paymentData;

  //     console.log("Payment Initiated:", paymentData);
  //   } catch (err) {
  //     console.error("Payment error:", err);
  //     alert("Payment failed. Please try again later.");
  //   }
  // };

  // async function handlePayment(booking: { id: string; /* ... */ }) {
  //   try {
  //     // Call your backend “initiatePayment” (GraphQL or REST)
  //     const res = await initiatePayment({
  //       variables: { bookingId: booking.id },
  //     });
  //     // Adjust according to your GraphQL schema / REST response shape
  //     const resp = res?.data?.paymentLink ?? res?.data;
  //     if (!resp) {
  //       alert("Payment initiation failed. Please try again.");
  //       return;
  //     }

  //     console.log("InitiatePayment response:", resp);

  //     // If your backend returns just a link
  //     if (resp.paymentLink) {
  //       window.location.href = resp.paymentLink;
  //       return;
  //     }

  //     // Or, if backend returns action + data object
  //     const { action, data } = resp;
  //     if (action === "link") {
  //       window.location.href = data.url;
  //     } else if (action === "post") {
  //       const form = document.createElement("form");
  //       form.method = "POST";
  //       form.action = data.url;
  //       if (data.payload) {
  //         for (const [k, v] of Object.entries(data.payload)) {
  //           const input = document.createElement("input");
  //           input.type = "hidden";
  //           input.name = k;
  //           input.value = String(v);
  //           form.appendChild(input);
  //         }
  //       }
  //       document.body.appendChild(form);
  //       form.submit();
  //     } else if (action === "form" || action === "custom") {
  //       // If Cashfree expects embedded UI or JS widget
  //       // You’d render a placeholder <div> and call Cashfree’s JS API here
  //       console.warn("Need to handle embedded/custom action:", resp);
  //     } else {
  //       console.error("Unknown action:", action);
  //       alert("Unexpected payment mode. Please try again.");
  //     }
  //   } catch (err) {
  //     console.error("Payment error:", err);
  //     alert("Payment failed. Please try again later.");
  //   }
  // }

  // async function handlePayment(booking : Booking) {
  //   try {
  //     const res = await initiatePayment({ variables: { bookingId: booking.id } });
  //     const paymentLink = res?.data?.initiatePayment?.paymentLink;

  //     if (!initiatePayment) {
  //       alert("Payment initiation failed. Please try again.");
  //       return;
  //     }

  //     window.location.href = paymentLink;
  //   } catch (err) {
  //     console.error("Payment error:", err);
  //     alert("Payment failed. Please try again later.");
  //   }
  // }

  const [payLoadingIds, setPayLoadingIds] = React.useState<string[]>([]);

  async function handlePayment(booking: Booking) {
    try {
      // Mark this booking as loading
      setPayLoadingIds((prev) => [...prev, booking.id]);

      const res = await initiatePayment({
        variables: { bookingId: booking.id },
      });
      const paymentLink = res?.data?.initiatePayment?.paymentLink;

      if (!paymentLink) {
        alert("Payment initiation failed. Please try again.");
        return;
      }

      // Redirect to payment link
      window.location.href = paymentLink;
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Please try again later.");
    } finally {
      // Remove booking from loading state
      setPayLoadingIds((prev) => prev.filter((id) => id !== booking.id));
    }
  }

  if (!userId)
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Alert severity="warning">Please log in to view your bookings.</Alert>
        </Box>
      </Layout>
    );

  if (loading)
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress size={50} thickness={4} />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Loading your bookings...
          </Typography>
        </Box>
      </Layout>
    );

  if (error)
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Retry
              </Button>
            }
          >
            Failed to load bookings. Please try again.
          </Alert>
        </Box>
      </Layout>
    );

  const bookings = data?.getBookings || [];

  return (
    <Layout>
      <Box sx={{ maxWidth: 1600, mx: "auto" }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            My Bookings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and view all your hotel reservations
          </Typography>
        </Box>

        {bookings.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: "center",
              bgcolor: "grey.50",
              border: "2px dashed",
              borderColor: "grey.300",
              borderRadius: 2,
            }}
          >
            <HotelIcon sx={{ fontSize: 80, color: "grey.400", mb: 2 }} />
            <Typography variant="h6" gutterBottom fontWeight={600}>
              No Bookings Yet
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: 400, mx: "auto" }}
            >
              Start exploring amazing hotels and create your first booking to
              see them here!
            </Typography>
            <Button variant="contained" size="large" sx={{ px: 4, py: 1.5 }}>
              Explore Hotels
            </Button>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {bookings.map((booking: Booking) => {
              const nights = calculateNights(
                booking.checkInDate,
                booking.checkOutDate
              );
              return (
                <Card
                  key={booking.id}
                  elevation={0}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3} alignItems="center">
                      {/* Hotel Info */}
                      <Grid item xs={12} md={3}>
                        <Stack spacing={0.5}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="h6" fontWeight={700}>
                              {booking.room.hotel.name}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}
                          >
                            <LocationOnIcon
                              sx={{ fontSize: 14, color: "text.secondary" }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {booking.room.hotel.city}
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            {booking.room.type} • Room {booking.room.roomNumber}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Chip
                        label={booking.status}
                        color={getStatusColor(booking.status)}
                        size="small"
                      />

                      {/* Dates */}
                      <Grid item xs={12} md={4}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Check-In
                            </Typography>
                            <Typography fontWeight={600}>
                              {formatDate(booking.checkInDate)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Check-Out
                            </Typography>
                            <Typography fontWeight={600}>
                              {formatDate(booking.checkOutDate)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Guests: {booking.numberOfGuests} | Nights:{" "}
                              {nights}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* Amount */}
                      <Grid item xs={12} md={2.5}>
                        <Typography variant="caption" color="text.secondary">
                          Total Amount
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          color="primary.main"
                        >
                          ₹{booking.totalAmount.toLocaleString()}
                        </Typography>
                      </Grid>

                      {/* Actions */}
                      <Grid item xs={12} md={2.5}>
                        <Stack spacing={1.5}>
                          {booking.status === "PENDING" && (
                            <>
                              <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ fontWeight: 600 }}
                                disabled={payLoadingIds.includes(booking.id)}
                                onClick={() => handlePayment(booking)}
                              >
                                {payLoadingIds.includes(booking.id)
                                  ? "Processing..."
                                  : "Pay Now"}
                              </Button>
                              {/* <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ fontWeight: 600 }}
                                disabled={payLoading}
                                onClick={() => handlePayment(booking)}
                              >
                                {payLoading ? "Processing..." : "Pay Now"}
                              </Button> */}
                              <Button
                                variant="outlined"
                                color="error"
                                fullWidth
                                sx={{ fontWeight: 600 }}
                                disabled={cancelLoading}
                                onClick={() => handleCancel(booking.id)}
                              >
                                {cancelLoading ? "Cancelling..." : "Cancel"}
                              </Button>
                            </>
                          )}
                          {booking.status === "CANCELLED" && (
                            <Alert severity="error" sx={{ py: 0.5 }}>
                              Cancelled
                            </Alert>
                          )}
                          {booking.status === "COMPLETED" && (
                            <Alert severity="success" sx={{ py: 0.5 }}>
                              Completed
                            </Alert>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}
      </Box>
    </Layout>
  );
};

export default MyBookings;
